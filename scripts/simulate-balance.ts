/**
 * Balancing simulation for competitor skill growth & decay.
 *
 * Simulates N seasons of the full roster lifecycle:
 *   - Skill growth for ages 18–29
 *   - Skill decay for ages 30+
 *   - Bottom-5 retirement + rookie replacement each season
 *
 * Outputs per-season stats (mean, stddev, min, max, quartiles)
 * so we can verify skill stays normally distributed and doesn't
 * trend toward extremes.
 *
 * Usage: npx tsx scripts/simulate-balance.ts [seasons=100] [growth_rate=2.0] [creep_rate=0]
 */

// ── Inline constants (mirrors src/types/index.ts) ──────────────────
// Duplicated here so the script runs standalone without bundler resolution.

const SKILL_MIN = 50
const SKILL_MAX = 100
const AGING_THRESHOLD = 30
const ROOKIE_AGE_MIN = 18
const ROOKIE_AGE_MAX = 25
const GROWTH_AGE_MIN = 18
const GROWTH_AGE_MAX = 29
const GROWTH_SPAN = GROWTH_AGE_MAX - GROWTH_AGE_MIN + 1 // 12
const RETIREMENT_PER_SEASON = 5
const ROSTER_SIZE = 49 // AI competitors only

// ── Helpers ────────────────────────────────────────────────────────

function normalRandom(mean: number, sigma: number): number {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  return mean + z * sigma
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function clampSkill(s: number): number {
  return Math.max(SKILL_MIN, Math.min(SKILL_MAX, s))
}

// ── Competitor type ────────────────────────────────────────────────

interface Sim {
  age: number
  skill: number
}

function generateRookie(season: number = 0, creepRate: number = 0): Sim {
  const rookieMean = 70 + season * creepRate
  return {
    age: randInt(ROOKIE_AGE_MIN, ROOKIE_AGE_MAX),
    skill: clampSkill(Math.round(normalRandom(rookieMean, 10))),
  }
}

function ageSim(c: Sim, growthRate: number): Sim {
  let { skill } = c
  if (c.age >= GROWTH_AGE_MIN && c.age <= GROWTH_AGE_MAX) {
    const gain = growthRate * (1 - (c.age - GROWTH_AGE_MIN) / GROWTH_SPAN)
    skill = Math.min(SKILL_MAX, skill + gain)
  } else if (c.age >= AGING_THRESHOLD) {
    const loss = 0.1 * (c.age - AGING_THRESHOLD) ** 2
    skill = Math.max(SKILL_MIN, skill - loss)
  }
  return { age: c.age + 1, skill }
}

// ── Stats ──────────────────────────────────────────────────────────

function stats(roster: Sim[]) {
  const skills = roster.map(c => c.skill).sort((a, b) => a - b)
  const n = skills.length
  const mean = skills.reduce((s, v) => s + v, 0) / n
  const variance = skills.reduce((s, v) => s + (v - mean) ** 2, 0) / n
  const stddev = Math.sqrt(variance)
  const median = skills[Math.floor(n / 2)]
  const q1 = skills[Math.floor(n * 0.25)]
  const q3 = skills[Math.floor(n * 0.75)]
  const min = skills[0]
  const max = skills[n - 1]
  const ages = roster.map(c => c.age)
  const meanAge = ages.reduce((s, v) => s + v, 0) / n
  return { mean, stddev, median, q1, q3, min, max, meanAge, n }
}

// ── Simulation ─────────────────────────────────────────────────────

function simulate(totalSeasons: number, growthRate: number, creepRate: number) {
  // Initialize roster: same distribution as generateInitialRoster
  let roster: Sim[] = Array.from({ length: ROSTER_SIZE }, () => ({
    age: randInt(20, 35),
    skill: clampSkill(Math.round(normalRandom(75, 12))),
  }))

  console.log(`\nSimulating ${totalSeasons} seasons with growth_rate = ${growthRate}, creep_rate = ${creepRate}`)
  console.log(`Roster size: ${ROSTER_SIZE} competitors\n`)
  console.log(
    'Season'.padStart(7) +
    'Mean'.padStart(8) +
    'StdDev'.padStart(8) +
    'Median'.padStart(8) +
    'Q1'.padStart(8) +
    'Q3'.padStart(8) +
    'Min'.padStart(8) +
    'Max'.padStart(8) +
    'AvgAge'.padStart(8)
  )
  console.log('-'.repeat(71))

  const snapshots: { season: number; mean: number; stddev: number }[] = []

  for (let season = 1; season <= totalSeasons; season++) {
    // 1. Age all competitors (apply growth/decay)
    roster = roster.map(c => ageSim(c, growthRate))

    // 2. Retire bottom 5 by skill, replace with rookies
    roster.sort((a, b) => a.skill - b.skill)
    roster = roster.slice(RETIREMENT_PER_SEASON)
    for (let i = 0; i < RETIREMENT_PER_SEASON; i++) {
      roster.push(generateRookie(season, creepRate))
    }

    const s = stats(roster)
    snapshots.push({ season, mean: s.mean, stddev: s.stddev })

    // Print every 5 seasons, plus first and last
    if (season <= 3 || season % 5 === 0 || season === totalSeasons) {
      console.log(
        String(season).padStart(7) +
        s.mean.toFixed(1).padStart(8) +
        s.stddev.toFixed(1).padStart(8) +
        s.median.toFixed(1).padStart(8) +
        s.q1.toFixed(1).padStart(8) +
        s.q3.toFixed(1).padStart(8) +
        s.min.toFixed(1).padStart(8) +
        s.max.toFixed(1).padStart(8) +
        s.meanAge.toFixed(1).padStart(8)
      )
    }
  }

  // Summary
  const last20 = snapshots.slice(-20)
  const avgMean = last20.reduce((s, v) => s + v.mean, 0) / last20.length
  const avgStddev = last20.reduce((s, v) => s + v.stddev, 0) / last20.length

  console.log('\n── Equilibrium analysis (last 20 seasons) ──')
  console.log(`  Average mean skill:   ${avgMean.toFixed(2)}`)
  console.log(`  Average std dev:      ${avgStddev.toFixed(2)}`)

  // Trend check: compare first-half mean to second-half mean
  const half = Math.floor(snapshots.length / 2)
  const firstHalf = snapshots.slice(0, half)
  const secondHalf = snapshots.slice(half)
  const firstMean = firstHalf.reduce((s, v) => s + v.mean, 0) / firstHalf.length
  const secondMean = secondHalf.reduce((s, v) => s + v.mean, 0) / secondHalf.length
  const drift = secondMean - firstMean

  console.log(`  First-half avg mean:  ${firstMean.toFixed(2)}`)
  console.log(`  Second-half avg mean: ${secondMean.toFixed(2)}`)
  console.log(`  Drift:                ${drift >= 0 ? '+' : ''}${drift.toFixed(2)}`)

  if (Math.abs(drift) < 1.0) {
    console.log('  ✓ Stable — no significant drift detected')
  } else if (drift > 0) {
    console.log('  ⚠ Skills trending UPWARD — consider lowering growth_rate')
  } else {
    console.log('  ⚠ Skills trending DOWNWARD — consider raising growth_rate')
  }

  // Skill distribution histogram for the final roster
  console.log('\n── Final roster skill distribution ──')
  const buckets: Record<string, number> = {}
  for (const c of roster) {
    const bucket = `${Math.floor(c.skill / 5) * 5}-${Math.floor(c.skill / 5) * 5 + 4}`
    buckets[bucket] = (buckets[bucket] || 0) + 1
  }
  const sortedBuckets = Object.entries(buckets).sort(
    (a, b) => parseInt(a[0]) - parseInt(b[0])
  )
  for (const [range, count] of sortedBuckets) {
    console.log(`  ${range.padStart(7)}: ${'█'.repeat(count)} (${count})`)
  }

  // Individual career arc: track a rookie from 18 to retirement
  console.log('\n── Sample career arc (rookie entering at age 18, skill 65) ──')
  let sample: Sim = { age: 18, skill: 65 }
  console.log('  Age'.padStart(6) + 'Skill'.padStart(8) + '  Change')
  console.log('  ' + '-'.repeat(25))
  for (let year = 0; year < 25; year++) {
    const prev = sample.skill
    sample = ageSim(sample, growthRate)
    const delta = sample.skill - prev
    console.log(
      String(sample.age).padStart(5) +
      sample.skill.toFixed(1).padStart(9) +
      `  ${delta >= 0 ? '+' : ''}${delta.toFixed(2)}`
    )
  }
}

// ── CLI ────────────────────────────────────────────────────────────

const seasons = parseInt(process.argv[2] || '100', 10)
const growthRate = parseFloat(process.argv[3] || '2.0')
const creepRate = parseFloat(process.argv[4] || '0')
simulate(seasons, growthRate, creepRate)
