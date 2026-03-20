import { create } from 'zustand'
import type {
  Athlete,
  CountryCode,
  DistanceGroup,
  EventDefinition,
  EventLeaderboardRow,
  Distance,
  MedalRecord,
  MedalTally,
  MedalType,
  Player,
  RetirementHighlight,
  Score,
  SeasonRecord,
  StandingsRow,
} from '../types'
import {
  AGING_THRESHOLD,
  CHAMPIONSHIP_POINTS,
  EVENT_SCHEDULE,
  EVENTS_PER_SEASON,
  RETIREMENT_PER_SEASON,
  SHAKINESS_MAX,
  SHAKINESS_REDUCTION_BRACKETS,
  STARTING_AGE,
  STARTING_SHAKINESS,
} from '../types'
import {
  ageCompetitor,
  computeRetirementHighlights,
  expandDistances,
  generateInitialRoster,
  generateRookie,
  groupScoresByDistance,
  simulateAIShot,
} from './helpers'

// ── Store-specific types ────────────────────────────────────────────

export interface CompletedEventEntry {
  countryCode: CountryCode
  name: string
  totalScore: number
  position: number
  championshipPoints: number
  medal: MedalType | null
  isPlayer: boolean
}

export interface CompletedEvent {
  eventIndex: number
  results: CompletedEventEntry[]
  playerBreakdown: DistanceGroup[]
}

// ── State shape ─────────────────────────────────────────────────────

export type GamePhase = 'country-selection' | 'playing' | 'retired'

interface GameState {
  // Overall phase
  phase: GamePhase

  // Player (null before career starts)
  player: Player | null

  // 49 AI competitors
  competitors: Athlete[]

  // Season / event tracking
  currentSeason: number
  currentEventIndex: number

  // Arrow-by-arrow tracking for the current event
  currentArrowIndex: number
  playerArrowScores: Score[]
  competitorArrowScores: Score[][]

  // Completed events this season
  completedEvents: CompletedEvent[]

  // Career-long records
  careerHistory: SeasonRecord[]
  medalHistory: MedalRecord[]

  // ── Actions ─────────────────────────────────────────────────────

  /** Initialise a new career: create player, generate 49 AI competitors */
  startCareer: (name: string, countryCode: CountryCode) => void

  /**
   * Record the player's arrow AND simultaneously simulate one arrow
   * for every competitor at the same distance.
   */
  recordShot: (score: Score) => void

  /** Finalise the current event: rank all 50, award medals & points */
  completeEvent: () => void

  /**
   * Finalise the season: compute championship standings, apply aging
   * and progression, retire bottom 5 competitors, advance to next season.
   */
  completeSeason: () => void

  /** End the career and return the 5 retirement highlight slides */
  retire: () => RetirementHighlight[]

  // ── Derived-state helpers ───────────────────────────────────────

  /** The event definition for the current event index */
  getCurrentEvent: () => EventDefinition

  /** The distance for the current arrow (based on event distance groups) */
  getCurrentArrowDistance: () => Distance

  /** Live leaderboard from arrow-by-arrow running totals */
  getEventLeaderboard: () => EventLeaderboardRow[]

  /** Championship standings from completed events this season */
  getChampionshipStandings: () => StandingsRow[]

  /** Player's per-distance breakdown for arrows shot so far */
  getPlayerEventBreakdown: () => DistanceGroup[]
}

// ── Store ───────────────────────────────────────────────────────────

export const useGameStore = create<GameState>((set, get) => ({
  // ── Initial state ───────────────────────────────────────────────

  phase: 'country-selection',
  player: null,
  competitors: [],
  currentSeason: 1,
  currentEventIndex: 0,
  currentArrowIndex: 0,
  playerArrowScores: [],
  competitorArrowScores: [],
  completedEvents: [],
  careerHistory: [],
  medalHistory: [],

  // ── Actions ─────────────────────────────────────────────────────

  startCareer: (name, countryCode) => {
    const competitors = generateInitialRoster(countryCode)
    set({
      phase: 'playing',
      player: {
        name,
        countryCode,
        age: STARTING_AGE,
        shakiness: STARTING_SHAKINESS,
      },
      competitors,
      currentSeason: 1,
      currentEventIndex: 0,
      currentArrowIndex: 0,
      playerArrowScores: [],
      competitorArrowScores: competitors.map(() => []),
      completedEvents: [],
      careerHistory: [],
      medalHistory: [],
    })
  },

  recordShot: (score) => {
    const state = get()
    const event = EVENT_SCHEDULE[state.currentEventIndex]
    const arrowDistances = expandDistances(event.distances)

    // Guard: ignore shots beyond the event's arrow count
    if (state.currentArrowIndex >= arrowDistances.length) return

    const distance = arrowDistances[state.currentArrowIndex]

    // Simulate one arrow for every competitor at the same distance
    const newCompScores = state.competitorArrowScores.map((prev, i) => {
      const aiScore = simulateAIShot(state.competitors[i].skill, distance)
      return [...prev, aiScore]
    })

    set({
      playerArrowScores: [...state.playerArrowScores, score],
      competitorArrowScores: newCompScores,
      currentArrowIndex: state.currentArrowIndex + 1,
    })
  },

  completeEvent: () => {
    const state = get()
    const event = EVENT_SCHEDULE[state.currentEventIndex]
    const player = state.player!

    // Build unified results for all 50 athletes
    const playerTotal = state.playerArrowScores.reduce((a, b) => a + b, 0)
    const allEntries: (CompletedEventEntry & { _sortKey: number })[] = [
      {
        countryCode: player.countryCode,
        name: player.name,
        totalScore: playerTotal,
        position: 0,
        championshipPoints: 0,
        medal: null,
        isPlayer: true,
        _sortKey: Math.random(), // tiebreaker
      },
      ...state.competitors.map((c, i) => ({
        countryCode: c.countryCode,
        name: c.name,
        totalScore: state.competitorArrowScores[i].reduce((a, b) => a + b, 0),
        position: 0,
        championshipPoints: 0,
        medal: null as MedalType | null,
        isPlayer: false,
        _sortKey: Math.random(),
      })),
    ]

    // Sort by total score descending, random tiebreak
    allEntries.sort((a, b) => b.totalScore - a.totalScore || a._sortKey - b._sortKey)

    // Assign positions, points, medals
    allEntries.forEach((entry, i) => {
      entry.position = i + 1
      entry.championshipPoints = CHAMPIONSHIP_POINTS[i]
      if (i === 0) entry.medal = 'gold'
      else if (i === 1) entry.medal = 'silver'
      else if (i === 2) entry.medal = 'bronze'
    })

    // Strip the tiebreaker key
    const results: CompletedEventEntry[] = allEntries.map(e => ({
      countryCode: e.countryCode,
      name: e.name,
      totalScore: e.totalScore,
      position: e.position,
      championshipPoints: e.championshipPoints,
      medal: e.medal,
      isPlayer: e.isPlayer,
    }))

    // Player's per-distance breakdown
    const playerBreakdown = groupScoresByDistance(
      state.playerArrowScores,
      event.distances,
    )

    // Track medal if the player earned one
    const playerResult = results.find(r => r.isPlayer)!
    const newMedalHistory = [...state.medalHistory]
    if (playerResult.medal) {
      newMedalHistory.push({
        eventId: event.id,
        medal: playerResult.medal,
        season: state.currentSeason,
        age: player.age,
      })
    }

    const completedEvent: CompletedEvent = {
      eventIndex: state.currentEventIndex,
      results,
      playerBreakdown,
    }

    set({
      completedEvents: [...state.completedEvents, completedEvent],
      currentEventIndex: state.currentEventIndex + 1,
      currentArrowIndex: 0,
      playerArrowScores: [],
      competitorArrowScores: state.competitors.map(() => []),
      medalHistory: newMedalHistory,
    })
  },

  completeSeason: () => {
    const state = get()
    const player = state.player!

    // ── 1. Championship standings ─────────────────────────────────
    const pointsMap = new Map<CountryCode, number>()
    pointsMap.set(player.countryCode, 0)
    state.competitors.forEach(c => pointsMap.set(c.countryCode, 0))

    for (const event of state.completedEvents) {
      for (const r of event.results) {
        pointsMap.set(r.countryCode, (pointsMap.get(r.countryCode) ?? 0) + r.championshipPoints)
      }
    }

    const sorted = [...pointsMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([code, pts], i) => ({ countryCode: code, totalPoints: pts, position: i + 1 }))

    const playerStanding = sorted.find(s => s.countryCode === player.countryCode)!
    const champPos = playerStanding.position

    // ── 2. Player medals this season ──────────────────────────────
    const medals: MedalTally = { gold: 0, silver: 0, bronze: 0 }
    for (const event of state.completedEvents) {
      const pr = event.results.find(r => r.isPlayer)!
      if (pr.medal === 'gold') medals.gold++
      else if (pr.medal === 'silver') medals.silver++
      else if (pr.medal === 'bronze') medals.bronze++
    }

    // ── 3. Season record ─────────────────────────────────────────
    const seasonRecord: SeasonRecord = {
      season: state.currentSeason,
      age: player.age,
      championshipPosition: champPos,
      championshipPoints: playerStanding.totalPoints,
      medals,
      wonChampionship: champPos === 1,
    }

    // ── 4. Player progression ────────────────────────────────────
    // Order: 1) aging shake, 2) championship reduction
    let newShakiness = player.shakiness
    if (player.age >= AGING_THRESHOLD) {
      newShakiness += (player.age - AGING_THRESHOLD) ** 2
    }
    const bracket = SHAKINESS_REDUCTION_BRACKETS.find(
      b => champPos >= b.minPosition && champPos <= b.maxPosition,
    )!
    newShakiness *= 1 - bracket.reductionPercent / 100
    newShakiness = Math.min(SHAKINESS_MAX, newShakiness)

    // ── 5. Competitor progression ────────────────────────────────
    let newCompetitors = state.competitors.map(ageCompetitor)

    // Retire the 5 lowest-skill competitors, replace with rookies
    const bySkill = [...newCompetitors].sort((a, b) => a.skill - b.skill)
    const retireCodes = new Set(
      bySkill.slice(0, RETIREMENT_PER_SEASON).map(c => c.countryCode),
    )
    newCompetitors = newCompetitors.map(c =>
      retireCodes.has(c.countryCode) ? generateRookie(c.countryCode) : c,
    )

    // ── 6. Advance ───────────────────────────────────────────────
    set({
      player: {
        ...player,
        age: player.age + 1,
        shakiness: newShakiness,
      },
      competitors: newCompetitors,
      currentSeason: state.currentSeason + 1,
      currentEventIndex: 0,
      currentArrowIndex: 0,
      playerArrowScores: [],
      competitorArrowScores: newCompetitors.map(() => []),
      completedEvents: [],
      careerHistory: [...state.careerHistory, seasonRecord],
    })
  },

  retire: () => {
    const state = get()
    set({ phase: 'retired' })
    return computeRetirementHighlights(state.medalHistory, state.careerHistory)
  },

  // ── Derived-state helpers ───────────────────────────────────────

  getCurrentEvent: () => {
    const idx = get().currentEventIndex
    if (idx >= EVENTS_PER_SEASON) return EVENT_SCHEDULE[EVENTS_PER_SEASON - 1]
    return EVENT_SCHEDULE[idx]
  },

  getCurrentArrowDistance: () => {
    const state = get()
    if (state.currentEventIndex >= EVENTS_PER_SEASON) return 18 as Distance
    const event = EVENT_SCHEDULE[state.currentEventIndex]
    const arrowDistances = expandDistances(event.distances)
    if (state.currentArrowIndex >= arrowDistances.length) return arrowDistances[arrowDistances.length - 1]
    return arrowDistances[state.currentArrowIndex]
  },

  getEventLeaderboard: () => {
    const state = get()
    const player = state.player!

    const playerTotal = state.playerArrowScores.reduce((a, b) => a + b, 0)

    const rows: EventLeaderboardRow[] = [
      {
        rank: 0,
        name: player.name,
        countryCode: player.countryCode,
        runningTotal: playerTotal,
        recentScores: state.playerArrowScores.slice(-3),
        isPlayer: true,
      },
      ...state.competitors.map((c, i) => {
        const scores = state.competitorArrowScores[i]
        return {
          rank: 0,
          name: c.name,
          countryCode: c.countryCode,
          runningTotal: scores.reduce((a, b) => a + b, 0),
          recentScores: scores.slice(-3),
          isPlayer: false,
        }
      }),
    ]

    rows.sort((a, b) => b.runningTotal - a.runningTotal)
    rows.forEach((r, i) => { r.rank = i + 1 })

    return rows
  },

  getChampionshipStandings: () => {
    const state = get()
    const player = state.player
    if (!player) return []

    // Initialise one entry per athlete
    const entryMap = new Map<CountryCode, {
      countryCode: CountryCode
      name: string
      isPlayer: boolean
      events: ({ position: number; points: number } | null)[]
      totalPoints: number
    }>()

    entryMap.set(player.countryCode, {
      countryCode: player.countryCode,
      name: player.name,
      isPlayer: true,
      events: Array(EVENTS_PER_SEASON).fill(null),
      totalPoints: 0,
    })

    for (const c of state.competitors) {
      entryMap.set(c.countryCode, {
        countryCode: c.countryCode,
        name: c.name,
        isPlayer: false,
        events: Array(EVENTS_PER_SEASON).fill(null),
        totalPoints: 0,
      })
    }

    // Fill in completed event results
    for (const event of state.completedEvents) {
      for (const r of event.results) {
        const entry = entryMap.get(r.countryCode)
        if (entry) {
          entry.events[event.eventIndex] = {
            position: r.position,
            points: r.championshipPoints,
          }
          entry.totalPoints += r.championshipPoints
        }
      }
    }

    // Sort and assign ranks
    const rows: StandingsRow[] = [...entryMap.values()]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((entry, i) => ({
        rank: i + 1,
        countryCode: entry.countryCode,
        name: entry.name,
        isPlayer: entry.isPlayer,
        events: entry.events,
        totalPoints: entry.totalPoints,
      }))

    return rows
  },

  getPlayerEventBreakdown: () => {
    const state = get()
    const event = EVENT_SCHEDULE[state.currentEventIndex]
    return groupScoresByDistance(state.playerArrowScores, event.distances)
  },
}))
