import Flag from '../../components/Flag'
import styles from './styles.module.scss'

// ── Types ──────────────────────────────────────────────────────────────

interface SeasonRecord {
  season: number
  age:    number
  pos:    number
  pts:    number
  medals: { g: number; s: number; b: number }
  champ:  boolean
  shake:  number
}

// ── Career data ────────────────────────────────────────────────────────
// 15 completed seasons: early struggle → peak (2 championships) → aging decline
//
// Shakiness follows the GDD formula: each season end applies
//   1. added_shake = (age − 30)²  [if age > 30]
//   2. shake × (1 − position_reduction%)
// Shake shown = value at START of that season (what the player actually shot with).

const CAREER: SeasonRecord[] = [
  { season:  1, age: 18, pos: 38, pts:  12, medals: { g:0, s:0, b:0 }, champ: false, shake: 100 },
  { season:  2, age: 19, pos: 31, pts:  15, medals: { g:0, s:0, b:0 }, champ: false, shake:  99 },
  { season:  3, age: 20, pos: 25, pts:  30, medals: { g:0, s:0, b:1 }, champ: false, shake:  98 },
  { season:  4, age: 21, pos: 14, pts:  62, medals: { g:0, s:1, b:1 }, champ: false, shake:  97 },
  { season:  5, age: 22, pos:  8, pts: 170, medals: { g:1, s:1, b:1 }, champ: false, shake:  95 },
  { season:  6, age: 23, pos:  4, pts: 285, medals: { g:2, s:1, b:1 }, champ: false, shake:  91 },
  { season:  7, age: 24, pos:  2, pts: 365, medals: { g:2, s:2, b:0 }, champ: false, shake:  87 },
  { season:  8, age: 25, pos:  1, pts: 420, medals: { g:3, s:1, b:0 }, champ: true,  shake:  82 },
  { season:  9, age: 26, pos:  1, pts: 445, medals: { g:2, s:2, b:1 }, champ: true,  shake:  75 },
  { season: 10, age: 27, pos:  3, pts: 340, medals: { g:1, s:2, b:1 }, champ: false, shake:  69 },
  { season: 11, age: 28, pos:  8, pts: 172, medals: { g:0, s:1, b:1 }, champ: false, shake:  65 },
  { season: 12, age: 29, pos: 15, pts:  68, medals: { g:0, s:0, b:1 }, champ: false, shake:  62 },
  { season: 13, age: 30, pos: 22, pts:  28, medals: { g:0, s:0, b:0 }, champ: false, shake:  61 },
  { season: 14, age: 31, pos: 28, pts:  18, medals: { g:0, s:0, b:0 }, champ: false, shake:  60 },
  { season: 15, age: 32, pos: 36, pts:   9, medals: { g:0, s:0, b:0 }, champ: false, shake:  60 },
]

const PLAYER_NAME    = 'Player One'
const PLAYER_CODE    = 'ZAF'
const CURRENT_SEASON = 16
const CURRENT_AGE    = 33
// End-of-S15 processing: 60 + (32−30)² = 64, then P36 → −1% → 63
const CURRENT_SHAKE  = 63

// ── Helpers ────────────────────────────────────────────────────────────

function posColor(pos: number): string {
  if (pos === 1) return '#e8c84a'
  if (pos === 2) return '#9eb8cc'
  if (pos === 3) return '#c8824a'
  return 'rgba(255,255,255,0.75)'
}

function shakeColor(shake: number): string {
  if (shake < 75) return '#5ae07a'
  if (shake < 90) return '#e8c84a'
  return '#e05a5a'
}

// Normalise 50–110 → 0–100% so the bar range is meaningful
function shakeBarWidth(shake: number): string {
  return `${Math.min(100, Math.max(0, (shake - 50) / 60 * 100))}%`
}

// ── Component ──────────────────────────────────────────────────────────

export default function CareerScreen() {
  const totalG      = CAREER.reduce((s, r) => s + r.medals.g, 0)
  const totalS      = CAREER.reduce((s, r) => s + r.medals.s, 0)
  const totalB      = CAREER.reduce((s, r) => s + r.medals.b, 0)
  const totalChamps = CAREER.filter(r => r.champ).length
  const bestPos     = Math.min(...CAREER.map(r => r.pos))
  const totalPts    = CAREER.reduce((s, r) => s + r.pts, 0)

  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <div className={styles.vignette} />

      <div className={styles.content}>

        {/* ── Identity bar ────────────────────────────────────────── */}
        <div className={styles.identityBar}>
          <div className={styles.identity}>
            <Flag code={PLAYER_CODE} className={styles.identityFlag} />
            <div className={styles.identityText}>
              <span className={styles.playerName}>{PLAYER_NAME}</span>
              <span className={styles.playerMeta}>
                {PLAYER_CODE} · Age {CURRENT_AGE} · {CAREER.length} seasons
              </span>
            </div>
          </div>
          <span className={styles.inProgressBadge}>
            SEASON {CURRENT_SEASON} IN PROGRESS
          </span>
        </div>

        {/* ── Career stat strip ───────────────────────────────────── */}
        <div className={styles.statStrip}>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Championships</span>
            <div className={styles.champDisplay}>
              {Array.from({ length: totalChamps }).map((_, i) => (
                <span key={i} className={styles.champStar}>★</span>
              ))}
              <span className={styles.champCount}>{totalChamps}</span>
            </div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Best Finish</span>
            <span className={styles.statValue} style={{ color: posColor(bestPos) }}>
              P{bestPos}
            </span>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Event Medals</span>
            <div className={styles.medalTally}>
              <span className={styles.medalG}>{totalG}G</span>
              <span className={styles.medalS}>{totalS}S</span>
              <span className={styles.medalB}>{totalB}B</span>
            </div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Career Points</span>
            <span className={styles.statValue}>{totalPts.toLocaleString()}</span>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Shakiness</span>
            <div className={styles.currentShake}>
              <span
                className={styles.shakeValue}
                style={{ color: shakeColor(CURRENT_SHAKE) }}
              >
                {CURRENT_SHAKE}
              </span>
              <span className={styles.shakeTrend}>↑ aging</span>
            </div>
          </div>

        </div>

        {/* ── Career record table ──────────────────────────────────── */}
        <div className={styles.tableSection}>
          <span className={styles.sectionLabel}>Career Record</span>

          <div className={styles.tableWrap}>

            {/* Header */}
            <div className={`${styles.row} ${styles.headerRow}`}>
              <span className={styles.cSeason}>#</span>
              <span className={styles.cAge}>Age</span>
              <span className={styles.cPos}>Championship</span>
              <span className={styles.cPts}>Points</span>
              <span className={styles.cMedals}>Medals</span>
              <span className={styles.cShake}>Shakiness</span>
            </div>

            {/* Body */}
            <div className={styles.tableBody}>
              {CAREER.map(rec => {
                const hasMedals = rec.medals.g + rec.medals.s + rec.medals.b > 0
                return (
                  <div
                    key={rec.season}
                    className={`${styles.row} ${rec.champ ? styles.champRow : ''}`}
                  >
                    <span className={styles.cSeason}>{rec.season}</span>
                    <span className={styles.cAge}>{rec.age}</span>

                    <div className={styles.cPos}>
                      {rec.champ && <span className={styles.cupStar}>★</span>}
                      <span style={{ color: posColor(rec.pos) }}>P{rec.pos}</span>
                    </div>

                    <span className={styles.cPts}>{rec.pts}</span>

                    <div className={styles.cMedals}>
                      {hasMedals ? (
                        <>
                          {rec.medals.g > 0 && <span className={styles.mG}>{rec.medals.g}G</span>}
                          {rec.medals.s > 0 && <span className={styles.mS}>{rec.medals.s}S</span>}
                          {rec.medals.b > 0 && <span className={styles.mB}>{rec.medals.b}B</span>}
                        </>
                      ) : (
                        <span className={styles.mNone}>—</span>
                      )}
                    </div>

                    <div className={styles.cShake}>
                      <span
                        className={styles.shakeNum}
                        style={{ color: shakeColor(rec.shake) }}
                      >
                        {rec.shake}
                      </span>
                      <div className={styles.shakeBar}>
                        <div
                          className={styles.shakeFill}
                          style={{
                            width: shakeBarWidth(rec.shake),
                            background: shakeColor(rec.shake),
                          }}
                        />
                      </div>
                    </div>

                  </div>
                )
              })}
            </div>

          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <button className={styles.backBtn}>← Back</button>
          <button className={styles.retireBtn}>Retire</button>
        </div>

      </div>
    </div>
  )
}
