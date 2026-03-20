import type {
  Athlete,
  CountryCode,
  Distance,
  DistanceGroup,
  EventDistance,
  EventId,
  MedalRecord,
  MedalType,
  RetirementHighlight,
  Score,
} from '../types'
import {
  AGING_THRESHOLD,
  DISTANCE_BONUS,
  DISTANCE_SIGMA,
  ROOKIE_AGE_MAX,
  ROOKIE_AGE_MIN,
  SKILL_BASE,
  SKILL_COEFFICIENT,
  SKILL_MAX,
  SKILL_MIN,
} from '../types'
import { COUNTRIES } from '../data/countries'

// ── Random helpers ──────────────────────────────────────────────────

/** Box-Muller transform: returns a normally distributed random number */
export function normalRandom(mean: number, sigma: number): number {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  return mean + z * sigma
}

/** Random integer in [min, max] inclusive */
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ── AI Shot Simulation ──────────────────────────────────────────────

/** Simulate a single AI arrow at a given distance */
export function simulateAIShot(skill: number, distance: Distance): Score {
  const mean = SKILL_COEFFICIENT * skill + SKILL_BASE + DISTANCE_BONUS[distance]
  const sigma = DISTANCE_SIGMA[distance]
  const raw = Math.round(normalRandom(mean, sigma))
  return Math.max(0, Math.min(10, raw)) as Score
}

// ── Distance Helpers ────────────────────────────────────────────────

/** Expand event distance groups into a flat array of per-arrow distances */
export function expandDistances(distances: readonly EventDistance[]): Distance[] {
  const result: Distance[] = []
  for (const { distance, arrows } of distances) {
    for (let i = 0; i < arrows; i++) {
      result.push(distance)
    }
  }
  return result
}

/** Group flat arrow scores back into DistanceGroups using event distances */
export function groupScoresByDistance(
  scores: Score[],
  eventDistances: readonly EventDistance[],
): DistanceGroup[] {
  const groups: DistanceGroup[] = []
  let idx = 0
  for (const { distance, arrows } of eventDistances) {
    groups.push({
      distance,
      scores: scores.slice(idx, idx + arrows),
    })
    idx += arrows
  }
  return groups
}

// ── Roster Generation ───────────────────────────────────────────────

/** Generate the initial roster of 49 AI competitors (excluding the player's country) */
export function generateInitialRoster(playerCountryCode: CountryCode): Athlete[] {
  return COUNTRIES
    .filter(c => c.code !== playerCountryCode)
    .map(c => ({
      name: c.athleteName,
      countryCode: c.code,
      age: randInt(20, 35),
      skill: Math.max(SKILL_MIN, Math.min(SKILL_MAX, Math.round(normalRandom(75, 12)))),
    }))
}

/**
 * Pool of first names per region for rookie generation.
 * Keeps the original surname but swaps the first name for variety.
 */
const ROOKIE_FIRST_NAMES: Record<string, string[]> = {
  european: ['Jan', 'Luca', 'Emil', 'Oskar', 'Mateo', 'Nils', 'Tomas', 'Victor', 'Felix', 'Anton'],
  eastAsian: ['Hiroshi', 'Jun', 'Min-Jun', 'Wei', 'Hao', 'Ryo', 'Sung', 'Kai', 'Tao', 'Yuki'],
  southAsian: ['Raj', 'Vikram', 'Amir', 'Ravi', 'Hassan', 'Omar', 'Tariq', 'Farhan', 'Sami', 'Anil'],
  african: ['Amara', 'Chidi', 'Kofi', 'Sekou', 'Jabari', 'Tendai', 'Ayo', 'Mamadou', 'Abdi', 'Emeka'],
  americas: ['Diego', 'Rafael', 'Santiago', 'Gabriel', 'Matias', 'Andres', 'Luis', 'Jaime', 'Hugo', 'Oscar'],
  anglophone: ['Ryan', 'Jack', 'Owen', 'Ethan', 'Callum', 'Finn', 'Blake', 'Riley', 'Mason', 'Coby'],
}

const COUNTRY_REGION: Partial<Record<CountryCode, string>> = {
  ARG: 'americas', AUS: 'anglophone', AUT: 'european', BEL: 'european', BRA: 'americas',
  CAN: 'anglophone', CHE: 'european', CHN: 'eastAsian', CMR: 'african', CZE: 'european',
  DEU: 'european', DNK: 'european', EGY: 'southAsian', ESP: 'european', ETH: 'african',
  FIN: 'european', FRA: 'european', GBR: 'anglophone', GHA: 'african', GRC: 'european',
  HRV: 'european', HUN: 'european', IND: 'southAsian', IRN: 'southAsian', ITA: 'european',
  JPN: 'eastAsian', KEN: 'african', KOR: 'eastAsian', MAR: 'southAsian', MEX: 'americas',
  NGA: 'african', NLD: 'european', NOR: 'european', NZL: 'anglophone', PAK: 'southAsian',
  POL: 'european', PRT: 'european', ROU: 'european', RUS: 'european', SEN: 'african',
  SRB: 'european', SWE: 'european', TUN: 'southAsian', TUR: 'southAsian', TZA: 'african',
  UGA: 'african', UKR: 'european', USA: 'anglophone', ZAF: 'anglophone', ZMB: 'african',
}

function generateRookieName(countryCode: CountryCode): string {
  const country = COUNTRIES.find(c => c.code === countryCode)
  if (!country) return 'Unknown'

  // Take the surname (last word) from the default athlete name
  const parts = country.athleteName.split(' ')
  const surname = parts[parts.length - 1]

  const region = COUNTRY_REGION[countryCode] ?? 'european'
  const firstNames = ROOKIE_FIRST_NAMES[region]
  const firstName = firstNames[randInt(0, firstNames.length - 1)]

  return `${firstName} ${surname}`
}

/** Generate a rookie to replace a retiring competitor */
export function generateRookie(countryCode: CountryCode): Athlete {
  return {
    name: generateRookieName(countryCode),
    countryCode,
    age: randInt(ROOKIE_AGE_MIN, ROOKIE_AGE_MAX),
    skill: Math.max(SKILL_MIN, Math.min(SKILL_MAX, Math.round(normalRandom(70, 10)))),
  }
}

// ── Progression ─────────────────────────────────────────────────────

/**
 * Apply competitor aging for one season.
 * Skill degrades proportionally to the player's shakiness curve:
 *   skill_loss = 0.1 × (age − 30)²  (for age >= 30)
 * Then age increments by 1.
 */
export function ageCompetitor(competitor: Athlete): Athlete {
  let { skill } = competitor
  if (competitor.age >= AGING_THRESHOLD) {
    const loss = 0.1 * (competitor.age - AGING_THRESHOLD) ** 2
    skill = Math.max(SKILL_MIN, skill - loss)
  }
  return { ...competitor, age: competitor.age + 1, skill }
}

// ── Retirement Highlights ───────────────────────────────────────────

const MEDAL_RANK: Record<MedalType, number> = { gold: 3, silver: 2, bronze: 1 }

/**
 * Compute the 5 retirement highlight slides from career medal history.
 *
 * Slides 1–4: individual event medals, ascending by medal rank.
 *   Selection priority: gold > silver > bronze.
 *   Among same rank, prefer medals from different events for variety.
 *
 * Slide 5: best championship finish (with win count if applicable).
 */
export function computeRetirementHighlights(
  medalHistory: MedalRecord[],
  careerHistory: { season: number; age: number; championshipPosition: number }[],
): RetirementHighlight[] {
  const highlights: RetirementHighlight[] = []

  // Pick up to 4 medal highlights, weakest first (ascending greatness)
  // Sort all medals: bronze < silver < gold
  const sortedMedals = [...medalHistory].sort(
    (a, b) => MEDAL_RANK[a.medal] - MEDAL_RANK[b.medal],
  )

  // Prefer variety of events: pick from different events when possible
  const picked: MedalRecord[] = []
  const usedEvents = new Set<EventId>()

  // First pass: pick medals from unique events (highest rank first for each pass)
  const byRankDesc = [...sortedMedals].reverse()
  for (const m of byRankDesc) {
    if (picked.length >= 4) break
    if (!usedEvents.has(m.eventId)) {
      picked.push(m)
      usedEvents.add(m.eventId)
    }
  }

  // Second pass: fill remaining slots from any event
  if (picked.length < 4) {
    for (const m of byRankDesc) {
      if (picked.length >= 4) break
      if (!picked.includes(m)) {
        picked.push(m)
      }
    }
  }

  // Sort picked medals ascending (weakest first for display order)
  picked.sort((a, b) => MEDAL_RANK[a.medal] - MEDAL_RANK[b.medal])

  for (const m of picked) {
    highlights.push({
      type: 'medal',
      medal: m.medal,
      eventId: m.eventId,
      season: m.season,
      age: m.age,
    })
  }

  // Slide 5: best championship finish
  if (careerHistory.length > 0) {
    const best = careerHistory.reduce((prev, curr) =>
      curr.championshipPosition < prev.championshipPosition ? curr : prev,
    )
    const timesWon = careerHistory.filter(s => s.championshipPosition === 1).length
    highlights.push({
      type: 'championship',
      bestPosition: best.championshipPosition,
      season: best.season,
      age: best.age,
      timesWon,
    })
  }

  return highlights
}
