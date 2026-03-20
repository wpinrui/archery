/**
 * Smoke test: full 3-season career through the game engine (no UI).
 *
 * Drives startCareer → 3 seasons of (5 events × 10 arrows) → retire → resetCareer
 * and asserts invariants at every step.
 *
 * Usage: npx tsx scripts/smoke-test-career.ts
 */

// ── Polyfill localStorage BEFORE any store import ───────────────────
// Zustand's persist middleware reads localStorage synchronously on module
// initialisation, so the mock must be in place before we import the store.
const _storage: Record<string, string> = {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(globalThis as any).localStorage = {
  getItem:    (k: string): string | null => _storage[k] ?? null,
  setItem:    (k: string, v: string): void => { _storage[k] = v },
  removeItem: (k: string): void => { delete _storage[k] },
  clear:      (): void => { for (const k in _storage) delete _storage[k] },
}

// ── Static imports (no localStorage dependency) ─────────────────────
import {
  ATHLETES_PER_TOUR,
  CHAMPIONSHIP_POINTS,
  EVENT_SCHEDULE,
  STARTING_AGE,
  STARTING_SHAKINESS,
} from '../src/types/index'
import { ageCompetitor, expandDistances, simulateAIShot } from '../src/store/helpers'

// ── Dynamic import: store (must come after localStorage polyfill) ────
const { useGameStore } = await import('../src/store/gameStore')

// ═══════════════════════════════════════════════════════════════════════
// Assertion & logging helpers
// ═══════════════════════════════════════════════════════════════════════

let passed = 0
let failed = 0
const failures: string[] = []

function assert(condition: boolean, message: string): void {
  if (condition) {
    passed++
    process.stdout.write(`  ✓ ${message}\n`)
  } else {
    failed++
    failures.push(message)
    process.stdout.write(`  ✗ FAIL: ${message}\n`)
  }
}

function log(msg: string): void { console.log(msg) }
function header(text: string): void {
  log(`\n${'═'.repeat(62)}`)
  log(` ${text}`)
  log('═'.repeat(62))
}
function section(text: string): void { log(`\n  ── ${text}`) }

// ── Value-validity helpers ───────────────────────────────────────────

function isValidScore(v: unknown): boolean {
  return typeof v === 'number' && Number.isInteger(v) && v >= 0 && v <= 10
}

function hasNoNaN(obj: unknown): boolean {
  if (typeof obj === 'number') return !isNaN(obj) && isFinite(obj)
  if (Array.isArray(obj))      return obj.every(v => hasNoNaN(v))
  if (obj && typeof obj === 'object')
    return Object.values(obj as object).every(v => hasNoNaN(v))
  return true  // string, boolean, null → fine
}

// ═══════════════════════════════════════════════════════════════════════
// Main smoke test
// ═══════════════════════════════════════════════════════════════════════

const SEASONS             = 3
const PLAYER_SKILL        = 75   // used for AI-simulated player shots
const POINTS_PER_EVENT    = CHAMPIONSHIP_POINTS.reduce((a, b) => a + b, 0)

header('SMOKE TEST — 3-Season Career')

// ─────────────────────────────────────────────────────────────────────
// STEP 1: startCareer
// ─────────────────────────────────────────────────────────────────────
section('startCareer("Test Player", "SGP")')
useGameStore.getState().startCareer('Test Player', 'SGP')
let s = useGameStore.getState()

assert(s.player !== null,                             'Player object exists')
assert(s.player?.name === 'Test Player',              'Player name is "Test Player"')
assert(s.player?.countryCode === 'SGP',               'Player country is SGP')
assert(s.player?.age === STARTING_AGE,                `Player age starts at ${STARTING_AGE}`)
assert(s.player?.shakiness === STARTING_SHAKINESS,    `Player shakiness starts at ${STARTING_SHAKINESS}`)
assert(s.phase === 'playing',                         'Phase is "playing"')
assert(s.currentSeason === 1,                         'Season starts at 1')
assert(s.currentEventIndex === 0,                     'Event index starts at 0')
assert(s.currentArrowIndex === 0,                     'Arrow index starts at 0')

assert(s.competitors.length === 49,                   'Roster has 49 AI competitors')
const allCodes = new Set([s.player!.countryCode, ...s.competitors.map(c => c.countryCode)])
assert(allCodes.size === ATHLETES_PER_TOUR,           `All ${ATHLETES_PER_TOUR} country codes are unique`)
assert(!s.competitors.some(c => c.countryCode === 'SGP'), 'No competitor holds SGP')
assert(s.competitors.every(c => c.skill >= 50 && c.skill <= 100), 'All competitor skills in [50, 100]')
assert(hasNoNaN(s.competitors),                       'No NaN in initial roster')

// Save the canonical country-code set to verify it never changes
const CANONICAL_CODES = new Set([s.player!.countryCode, ...s.competitors.map(c => c.countryCode)])

// ─────────────────────────────────────────────────────────────────────
// STEP 2: 3 Seasons
// ─────────────────────────────────────────────────────────────────────
for (let season = 1; season <= SEASONS; season++) {
  header(`SEASON ${season}`)
  s = useGameStore.getState()

  const prevShakiness = s.player!.shakiness
  const prevAge       = s.player!.age

  // ── 5 events ──────────────────────────────────────────────────────
  for (let evIdx = 0; evIdx < EVENT_SCHEDULE.length; evIdx++) {
    const event          = EVENT_SCHEDULE[evIdx]
    const arrowDistances = expandDistances(event.distances)

    section(`Event ${evIdx + 1}/5: ${event.name} (${arrowDistances.length} arrows)`)

    // Shoot all arrows
    for (const dist of arrowDistances) {
      const score = simulateAIShot(PLAYER_SKILL, dist)
      useGameStore.getState().recordShot(score)
    }

    s = useGameStore.getState()

    // Arrow counts
    assert(
      s.playerArrowScores.length === arrowDistances.length,
      `Player has ${arrowDistances.length} arrow scores recorded`,
    )
    assert(
      s.competitorArrowScores.length === 49 &&
      s.competitorArrowScores.every(cs => cs.length === arrowDistances.length),
      `All 49 competitors have ${arrowDistances.length} scores each`,
    )

    // Score validity
    assert(s.playerArrowScores.every(isValidScore),        'All player scores in [0, 10]')
    assert(
      s.competitorArrowScores.every(cs => cs.every(isValidScore)),
      'All competitor scores in [0, 10]',
    )

    // completeEvent
    useGameStore.getState().completeEvent()
    s = useGameStore.getState()

    const ev = s.completedEvents[s.completedEvents.length - 1]
    assert(ev !== undefined,                               'Completed event entry exists')
    assert(ev.results.length === ATHLETES_PER_TOUR,        `Event has exactly ${ATHLETES_PER_TOUR} results`)

    // Positions: 1–50 with no gaps or duplicates
    const positions = ev.results.map(r => r.position).sort((a, b) => a - b)
    assert(
      positions.every((p, i) => p === i + 1),
      'Positions are 1–50 with no gaps or duplicates',
    )

    // Medals to top 3 only
    const medalMap = { gold: 0, silver: 0, bronze: 0 }
    for (const r of ev.results) { if (r.medal) medalMap[r.medal]++ }
    assert(medalMap.gold   === 1, 'Exactly 1 gold medal')
    assert(medalMap.silver === 1, 'Exactly 1 silver medal')
    assert(medalMap.bronze === 1, 'Exactly 1 bronze medal')
    const byPos = (pos: number) => ev.results.find(r => r.position === pos)!
    assert(byPos(1).medal === 'gold',   'Gold goes to P1')
    assert(byPos(2).medal === 'silver', 'Silver goes to P2')
    assert(byPos(3).medal === 'bronze', 'Bronze goes to P3')
    assert(
      ev.results.filter(r => r.medal !== null).length === 3,
      'No other positions have medals',
    )

    // Points per GDD table
    assert(
      ev.results.every(r => r.championshipPoints === CHAMPIONSHIP_POINTS[r.position - 1]),
      'Championship points match GDD table for every position',
    )
    const totalPts = ev.results.reduce((sum, r) => sum + r.championshipPoints, 0)
    assert(totalPts === POINTS_PER_EVENT, `Total event points = ${POINTS_PER_EVENT}`)

    // No NaN
    assert(hasNoNaN(ev.results), 'No NaN in event results')

    // Roster still exactly 50 unique countries
    const postEventCodes = new Set([
      useGameStore.getState().player!.countryCode,
      ...useGameStore.getState().competitors.map(c => c.countryCode),
    ])
    assert(postEventCodes.size === ATHLETES_PER_TOUR, 'Roster still exactly 50 unique countries')

    // Log player position for play-by-play
    const pr = ev.results.find(r => r.isPlayer)!
    const medal = pr.medal ? ` [${pr.medal.toUpperCase()}]` : ''
    log(`    → Player: P${pr.position} | Score: ${pr.totalScore} | Pts: ${pr.championshipPoints}${medal}`)
  }

  // ── completeSeason ─────────────────────────────────────────────────
  section(`completeSeason (end of season ${season})`)
  s = useGameStore.getState()

  // Replicate completeSeason's retirement logic: age all competitors first,
  // then the 5 lowest-skill of the AGED roster are the ones replaced.
  const agedSnapshot = s.competitors.map(ageCompetitor)
  const sortedAged   = [...agedSnapshot].sort((a, b) => a.skill - b.skill)
  const retiringCodes = new Set(sortedAged.slice(0, 5).map(c => c.countryCode))

  // Snapshot: pre-season standings for cross-check
  const standings     = s.getChampionshipStandings()
  const playerRow     = standings.find(r => r.isPlayer)!
  log(`    → Pre-completion standings: Player P${playerRow.rank} (${playerRow.totalPoints} pts)`)

  useGameStore.getState().completeSeason()
  s = useGameStore.getState()

  // Career history
  assert(s.careerHistory.length === season,              `Career history has ${season} row(s)`)
  const rec = s.careerHistory[season - 1]
  assert(rec.season === season,                          `Record shows season ${season}`)
  assert(rec.age === prevAge,                            `Record age = ${prevAge} (season's playing age)`)
  assert(rec.championshipPosition >= 1 && rec.championshipPosition <= 50,
    `Championship position in [1, 50]: got P${rec.championshipPosition}`)
  assert(rec.championshipPosition === playerRow.rank,
    `Recorded position matches standings (P${rec.championshipPosition})`)

  // Shakiness: player is under 30, so no aging penalty → can only stay or decrease
  const newShakiness = s.player!.shakiness
  assert(newShakiness <= prevShakiness,
    `Shakiness did not increase: ${prevShakiness.toFixed(2)} → ${newShakiness.toFixed(2)}`)
  assert(!isNaN(newShakiness) && isFinite(newShakiness), 'Shakiness is a finite number')

  // Player age incremented
  assert(s.player!.age === prevAge + 1, `Player age: ${prevAge} → ${prevAge + 1}`)

  // Season counter advanced
  assert(s.currentSeason === season + 1, `Season advanced to ${season + 1}`)

  // Event/arrow slate reset
  assert(s.currentEventIndex === 0,      'Event index reset to 0')
  assert(s.currentArrowIndex === 0,      'Arrow index reset to 0')
  assert(s.completedEvents.length === 0, 'Completed events cleared')

  // Competitor count unchanged
  assert(s.competitors.length === 49, 'Still exactly 49 competitors')

  // Country codes: same 50 nations, no leaks
  const postCodes = new Set([s.player!.countryCode, ...s.competitors.map(c => c.countryCode)])
  assert(postCodes.size === ATHLETES_PER_TOUR, 'Still exactly 50 unique countries')
  assert(
    [...CANONICAL_CODES].every(code => postCodes.has(code)),
    'All 50 original country codes still present (no nation added or removed)',
  )

  // Retired slots now hold rookies (age 18–25)
  const newRookies = s.competitors.filter(c => retiringCodes.has(c.countryCode))
  assert(newRookies.length === 5,                          'Exactly 5 slots replaced by rookies')
  assert(newRookies.every(c => c.age >= 18 && c.age <= 25), 'All rookies are aged 18–25')
  assert(newRookies.every(c => c.skill >= 50 && c.skill <= 100), 'All rookie skills in [50, 100]')

  // All competitor skills still valid
  assert(s.competitors.every(c => c.skill >= 50 && c.skill <= 100), 'All skills in [50, 100]')
  assert(hasNoNaN(s.competitors), 'No NaN in competitor data')

  log(`    → Season ${season} done: P${rec.championshipPosition} | Shakiness: ${prevShakiness.toFixed(1)} → ${newShakiness.toFixed(1)} | Age: ${prevAge} → ${s.player!.age}`)
}

// ─────────────────────────────────────────────────────────────────────
// STEP 3: retire()
// ─────────────────────────────────────────────────────────────────────
header('RETIRE')
s = useGameStore.getState()

const highlights = useGameStore.getState().retire()
s = useGameStore.getState()

assert(s.phase === 'retired',                            'Phase is "retired" after retire()')
assert(Array.isArray(highlights),                        'retire() returns an array')
assert(highlights.length >= 1,                           'At least 1 highlight returned')
assert(highlights.length <= 5,                           'At most 5 highlights returned')

const lastH = highlights[highlights.length - 1]
assert(lastH.type === 'championship',                    'Final highlight is the championship slide')
assert(hasNoNaN(highlights),                             'No NaN in highlights')

assert(s.careerHistory.length === SEASONS,               `Career history has ${SEASONS} season rows`)
for (let i = 0; i < s.careerHistory.length; i++) {
  const rec = s.careerHistory[i]
  assert(rec.season === i + 1,                           `History row ${i + 1}: season = ${i + 1}`)
  assert(rec.age >= STARTING_AGE,                        `History row ${i + 1}: age >= ${STARTING_AGE}`)
  assert(rec.championshipPosition >= 1 && rec.championshipPosition <= 50,
    `History row ${i + 1}: championship position in [1, 50]`)
}

log(`\n  Highlights (${highlights.length}):`)
for (const [i, h] of highlights.entries()) {
  if (h.type === 'medal') {
    log(`    ${i + 1}. ${h.medal.toUpperCase()} medal — ${h.eventId} (S${h.season}, age ${h.age})`)
  } else {
    const wonStr = h.timesWon > 0 ? ` — won ${h.timesWon}×` : ''
    log(`    ${i + 1}. Best championship: P${h.bestPosition} (S${h.season}, age ${h.age})${wonStr}`)
  }
}

// ─────────────────────────────────────────────────────────────────────
// STEP 4: resetCareer()
// ─────────────────────────────────────────────────────────────────────
header('RESET CAREER')
useGameStore.getState().resetCareer()
s = useGameStore.getState()

assert(s.phase === 'country-selection', 'Phase is "country-selection" after reset')
assert(s.player === null,               'Player is null after reset')
assert(s.competitors.length === 0,      'Competitors array is empty after reset')
assert(s.currentSeason === 1,           'Season reset to 1')
assert(s.currentEventIndex === 0,       'Event index reset to 0')
assert(s.currentArrowIndex === 0,       'Arrow index reset to 0')
assert(s.careerHistory.length === 0,    'Career history cleared after reset')
assert(s.medalHistory.length === 0,     'Medal history cleared after reset')
assert(s.completedEvents.length === 0,  'Completed events cleared after reset')

// ═══════════════════════════════════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════════════════════════════════
header('RESULTS')
log(`  Passed: ${passed}`)
log(`  Failed: ${failed}`)

if (failures.length > 0) {
  log('\n  Failed assertions:')
  for (const f of failures) log(`    ✗ ${f}`)
}

if (failed === 0) {
  log('\n  ✓ All assertions passed — engine is working end-to-end.\n')
  process.exit(0)
} else {
  log(`\n  ✗ ${failed} assertion(s) failed.\n`)
  process.exit(1)
}
