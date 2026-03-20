// ═══════════════════════════════════════════════════════════════════════
// Long Draw Archery — Game Type System
// ═══════════════════════════════════════════════════════════════════════

// ── Distances ────────────────────────────────────────────────────────

export type Distance = 18 | 30 | 50 | 70 | 90

export const DISTANCES = [18, 30, 50, 70, 90] as const

// ── Scores ───────────────────────────────────────────────────────────

/** Arrow score: 0 (miss) through 10 (bullseye) */
export type Score = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export const ARROWS_PER_EVENT = 10

// ── Medal ────────────────────────────────────────────────────────────

export type MedalType = 'gold' | 'silver' | 'bronze'

export interface MedalTally {
  gold: number
  silver: number
  bronze: number
}

// ── Countries ────────────────────────────────────────────────────────

export type CountryCode =
  | 'ARG' | 'AUS' | 'AUT' | 'BEL' | 'BRA' | 'CAN' | 'CHE' | 'CHN'
  | 'CMR' | 'CZE' | 'DEU' | 'DNK' | 'EGY' | 'ESP' | 'ETH' | 'FIN'
  | 'FRA' | 'GBR' | 'GHA' | 'GRC' | 'HRV' | 'HUN' | 'IND' | 'IRN'
  | 'ITA' | 'JPN' | 'KEN' | 'KOR' | 'MAR' | 'MEX' | 'NGA' | 'NLD'
  | 'NOR' | 'NZL' | 'PAK' | 'POL' | 'PRT' | 'ROU' | 'RUS' | 'SEN'
  | 'SRB' | 'SWE' | 'TUN' | 'TUR' | 'TZA' | 'UGA' | 'UKR' | 'USA'
  | 'ZAF' | 'ZMB'

export interface Country {
  code: CountryCode
  name: string
}

export const ATHLETES_PER_TOUR = 50

// ── Events ───────────────────────────────────────────────────────────

export type EventId =
  | 'seoul-cup'
  | 'paris-open'
  | 'las-vegas-classic'
  | 'sydney-international'
  | 'cape-town-cup'

export interface EventDistance {
  distance: Distance
  arrows: number
}

export interface EventDefinition {
  id: EventId
  name: string
  shortName: string
  hostCountryCode: CountryCode
  distances: readonly EventDistance[]
}

export const EVENTS_PER_SEASON = 5

/**
 * The 5 world-tour events in fixed season order.
 * Each event has 10 arrows across 3 distances, shot shortest to longest.
 */
export const EVENT_SCHEDULE: readonly EventDefinition[] = [
  {
    id: 'seoul-cup',
    name: 'Seoul Cup',
    shortName: 'Seoul',
    hostCountryCode: 'KOR',
    distances: [
      { distance: 18, arrows: 4 },
      { distance: 30, arrows: 3 },
      { distance: 50, arrows: 3 },
    ],
  },
  {
    id: 'paris-open',
    name: 'Paris Open',
    shortName: 'Paris',
    hostCountryCode: 'FRA',
    distances: [
      { distance: 18, arrows: 4 },
      { distance: 30, arrows: 4 },
      { distance: 70, arrows: 2 },
    ],
  },
  {
    id: 'las-vegas-classic',
    name: 'Las Vegas Classic',
    shortName: 'Las Vegas',
    hostCountryCode: 'USA',
    distances: [
      { distance: 30, arrows: 3 },
      { distance: 50, arrows: 4 },
      { distance: 70, arrows: 3 },
    ],
  },
  {
    id: 'sydney-international',
    name: 'Sydney International',
    shortName: 'Sydney',
    hostCountryCode: 'AUS',
    distances: [
      { distance: 50, arrows: 3 },
      { distance: 70, arrows: 3 },
      { distance: 90, arrows: 4 },
    ],
  },
  {
    id: 'cape-town-cup',
    name: 'Cape Town Cup',
    shortName: 'Cape Town',
    hostCountryCode: 'ZAF',
    distances: [
      { distance: 18, arrows: 2 },
      { distance: 70, arrows: 4 },
      { distance: 90, arrows: 4 },
    ],
  },
]

// ── Championship Points ──────────────────────────────────────────────

/**
 * Points awarded by finish position (index 0 = P1, index 49 = P50).
 *
 * P1: 100 | P2: 85 | P3: 72 | P4: 61 | P5: 52 | P6: 44 | P7: 37
 * P8: 31  | P9: 26 | P10: 22
 * P11–15: 15 | P16–20: 10 | P21–30: 6 | P31–40: 3 | P41–50: 0
 */
export const CHAMPIONSHIP_POINTS = [
  100, 85, 72, 61, 52, 44, 37, 31, 26, 22,   // P1–P10
  15, 15, 15, 15, 15,                          // P11–P15
  10, 10, 10, 10, 10,                          // P16–P20
   6,  6,  6,  6,  6,  6,  6,  6,  6,  6,     // P21–P30
   3,  3,  3,  3,  3,  3,  3,  3,  3,  3,     // P31–P40
   0,  0,  0,  0,  0,  0,  0,  0,  0,  0,     // P41–P50
] as const

// ── Athletes ─────────────────────────────────────────────────────────

/** A roster entry: one country slot on the world tour */
export interface RosterEntry {
  countryCode: CountryCode
  countryName: string
  athleteName: string
}

/** AI competitor (skill-based shot simulation) */
export interface Athlete {
  name: string
  countryCode: CountryCode
  age: number
  /** 50–100, governs AI shot mean. Not shown in UI. */
  skill: number
}

/** The human player (shakiness-based aiming) */
export interface Player {
  name: string
  countryCode: CountryCode
  age: number
  /** 0 (steady) to 500 (uncontrollable). Starting value: 100. */
  shakiness: number
}

// ── AI Shot Simulation ───────────────────────────────────────────────

/**
 * base_mean(skill) = 0.085 × skill + 0.25
 * mean(skill, distance) = base_mean + distance_bonus
 */
export const DISTANCE_BONUS: Readonly<Record<Distance, number>> = {
  18: 1.5, 30: 0.8, 50: 0.0, 70: -0.8, 90: -1.675,
}

/** Standard deviation per distance (same for all skill levels) */
export const DISTANCE_SIGMA: Readonly<Record<Distance, number>> = {
  18: 0.8, 30: 1.2, 50: 1.6, 70: 2.0, 90: 2.5,
}

export const SKILL_MIN = 50
export const SKILL_MAX = 100

// ── Shooting Mechanic ────────────────────────────────────────────────

export type WindDirection = 'left' | 'right'

export interface Wind {
  direction: WindDirection
  speedKmh: number
}

export interface ArrowImpact {
  x: number
  y: number
  score: Score
}

export const SHOT_TIMER_SECONDS = 20

// ── Event Results ────────────────────────────────────────────────────

/** A single distance group within a player's event scorecard */
export interface DistanceGroup {
  distance: Distance
  scores: Score[]
}

/** One athlete's result for one event */
export interface EventResult {
  position: number
  totalScore: number
  championshipPoints: number
  medal: MedalType | null
}

/** Player-specific event result with per-arrow breakdown */
export interface PlayerEventResult extends EventResult {
  breakdown: DistanceGroup[]
}

// ── In-Event Leaderboard ─────────────────────────────────────────────

/** Live leaderboard row shown during shooting (ShootingHUD) */
export interface EventLeaderboardRow {
  rank: number
  name: string
  countryCode: CountryCode
  runningTotal: number
  recentScores: Score[]
  isPlayer: boolean
}

// ── Post-Event Leaderboard ───────────────────────────────────────────

/** Row in the full event results table (PostEventLeaderboard) */
export interface EventResultRow {
  rank: number
  countryCode: CountryCode
  name: string
  totalScore: number
  isPlayer: boolean
}

// ── Championship Standings ───────────────────────────────────────────

/** Per-event result within the standings table */
export interface StandingsEventResult {
  position: number
  points: number
}

/** One row in the championship standings table */
export interface StandingsRow {
  rank: number
  countryCode: CountryCode
  name: string
  isPlayer: boolean
  /** One entry per event (null = not yet played) */
  events: (StandingsEventResult | null)[]
  totalPoints: number
}

// ── Season ───────────────────────────────────────────────────────────

export interface Season {
  number: number
  standings: StandingsRow[]
  championCountryCode: CountryCode | null
}

// ── Season Record ────────────────────────────────────────────────────

/** One row in the career record table (per completed season) */
export interface SeasonRecord {
  season: number
  age: number
  championshipPosition: number
  championshipPoints: number
  medals: MedalTally
  wonChampionship: boolean
}

// ── Career ───────────────────────────────────────────────────────────

export interface Career {
  playerName: string
  playerCountryCode: CountryCode
  currentSeason: number
  currentAge: number
  seasons: SeasonRecord[]
}

// ── Retirement Highlights ────────────────────────────────────────────

/**
 * 5 highlight slides shown at retirement, ascending greatness:
 * - Slides 1–4: individual event medal finishes
 * - Slide 5: best championship finish (with count if multiple wins)
 */
export interface MedalHighlight {
  type: 'medal'
  medal: MedalType
  eventId: EventId
  season: number
  age: number
}

export interface ChampionshipHighlight {
  type: 'championship'
  season: number
  age: number
  timesWon: number
}

export type RetirementHighlight = MedalHighlight | ChampionshipHighlight

// ── Progression & Aging ──────────────────────────────────────────────

export const STARTING_AGE = 18
export const STARTING_SHAKINESS = 100
export const SHAKINESS_MAX = 500
export const AGING_THRESHOLD = 30
export const RETIREMENT_PER_SEASON = 5
export const ROOKIE_AGE_MIN = 18
export const ROOKIE_AGE_MAX = 25

/**
 * Shakiness reduction brackets by championship finish position.
 * Applied after aging each season: shakiness *= (1 - reductionPercent/100)
 */
export const SHAKINESS_REDUCTION_BRACKETS = [
  { minPosition: 1,  maxPosition: 1,  reductionPercent: 8 },
  { minPosition: 2,  maxPosition: 3,  reductionPercent: 6 },
  { minPosition: 4,  maxPosition: 10, reductionPercent: 4 },
  { minPosition: 11, maxPosition: 20, reductionPercent: 2 },
  { minPosition: 21, maxPosition: 40, reductionPercent: 1 },
  { minPosition: 41, maxPosition: 50, reductionPercent: 0 },
] as const

/**
 * Aging formula (applied from age 31 onward, i.e. when age > AGING_THRESHOLD):
 *   added_shake = (age - 30)²
 *
 * Season order of operations:
 *   1. Add aging shake (if age > 30)
 *   2. Apply finish-position reduction percentage
 */

// ── Season Context (status bar data) ─────────────────────────────────

/** Shared context displayed in the season bar across multiple screens */
export interface SeasonContext {
  season: number
  eventIndex: number
  age: number
  standingRank: number | null
  standingPoints: number | null
}
