import Flag from '../../components/Flag'
import styles from './styles.module.scss'

// ── Helpers ───────────────────────────────────────────────────────────
function scoreColor(s: number): { bg: string; fg: string } {
  if (s >= 9) return { bg: '#c8a820', fg: '#1a1200' }
  if (s >= 7) return { bg: '#b83838', fg: '#fff' }
  if (s >= 5) return { bg: '#2e7da8', fg: '#fff' }
  if (s >= 3) return { bg: '#2a2a2a', fg: '#eee' }
  if (s >= 1) return { bg: '#c8c8c8', fg: '#1a1a1a' }
  return { bg: '#444', fg: '#888' }
}

function distanceColor(m: number): string {
  const t = (m - 18) / (90 - 18)
  return `hsl(${Math.round(120 * (1 - t))}, 70%, 62%)`
}

function posColor(pos: number): string {
  if (pos === 1) return '#e8c84a'
  if (pos === 2) return '#9eb8cc'
  if (pos === 3) return '#c8824a'
  return 'rgba(255,255,255,0.85)'
}

function eventPts(pos: number): number {
  if (pos === 1)  return 100
  if (pos === 2)  return 85
  if (pos === 3)  return 72
  if (pos === 4)  return 61
  if (pos === 5)  return 52
  if (pos === 6)  return 44
  if (pos === 7)  return 37
  if (pos === 8)  return 31
  if (pos === 9)  return 26
  if (pos === 10) return 22
  if (pos <= 15)  return 15
  if (pos <= 20)  return 10
  if (pos <= 30)  return 6
  if (pos <= 40)  return 3
  return 0
}

// ── Data ──────────────────────────────────────────────────────────────
const PLAYER_FINISH = 4
const PLAYER_PTS    = eventPts(PLAYER_FINISH)

const BREAKDOWN = [
  { distance: 18, arrows: [9, 10] },
  { distance: 70, arrows: [7, 8, 6, 7] },
  { distance: 90, arrows: [5, 6, 7, 5] },
]

const PLAYER_TOTAL = BREAKDOWN.reduce(
  (sum, g) => sum + g.arrows.reduce((a, b) => a + b, 0), 0,
)

interface EventRow {
  rank: number
  code: string
  name: string
  total: number
  isPlayer?: boolean
}

const EVENT_RESULTS: EventRow[] = [
  { rank:  1, code: 'NLD', name: 'Joost Visser',       total: 84 },
  { rank:  2, code: 'ITA', name: 'Marco Rossi',        total: 81 },
  { rank:  3, code: 'CHN', name: 'Chen Wei',           total: 79 },
  { rank:  4, code: 'ZAF', name: 'Player One',         total: PLAYER_TOTAL, isPlayer: true },
  { rank:  5, code: 'JPN', name: 'Akira Nakamura',     total: 69 },
  { rank:  6, code: 'FIN', name: 'Lauri Mäkinen',      total: 67 },
  { rank:  7, code: 'NGA', name: 'Peter Okonkwo',      total: 65 },
  { rank:  8, code: 'DEU', name: 'Hans Schmidt',       total: 63 },
  { rank:  9, code: 'KOR', name: 'Soo-Jin Park',       total: 62 },
  { rank: 10, code: 'ZMB', name: 'Kabelo Mbeki',       total: 60 },
  { rank: 11, code: 'SWE', name: 'Tobias Bergström',   total: 59 },
  { rank: 12, code: 'CZE', name: 'Radek Novák',        total: 57 },
  { rank: 13, code: 'AUS', name: 'Liam Nguyen',        total: 56 },
  { rank: 14, code: 'BRA', name: 'Carlos Souza',       total: 54 },
  { rank: 15, code: 'GBR', name: 'James Fletcher',     total: 53 },
  { rank: 16, code: 'USA', name: 'Tyler Brooks',       total: 52 },
  { rank: 17, code: 'FRA', name: 'Édouard Blanc',      total: 51 },
  { rank: 18, code: 'ESP', name: 'Miguel Herrera',     total: 50 },
  { rank: 19, code: 'NOR', name: 'Erik Larsen',        total: 49 },
  { rank: 20, code: 'DNK', name: 'Søren Holm',         total: 47 },
  { rank: 21, code: 'POL', name: 'Tomasz Wójcik',      total: 46 },
  { rank: 22, code: 'TUR', name: 'Mehmet Yıldız',      total: 45 },
  { rank: 23, code: 'ARG', name: 'Alejandro Ponce',    total: 44 },
  { rank: 24, code: 'MEX', name: 'Rodrigo Fuentes',    total: 43 },
  { rank: 25, code: 'IND', name: 'Arjun Sharma',       total: 42 },
  { rank: 26, code: 'PAK', name: 'Bilal Chaudhry',     total: 41 },
  { rank: 27, code: 'IRN', name: 'Dariush Karimi',     total: 40 },
  { rank: 28, code: 'UKR', name: 'Oleksiy Bondar',     total: 39 },
  { rank: 29, code: 'BEL', name: 'Pieter Claes',       total: 38 },
  { rank: 30, code: 'NZL', name: 'Sam Cooper',         total: 37 },
  { rank: 31, code: 'CAN', name: 'Lucas Tremblay',     total: 36 },
  { rank: 32, code: 'PRT', name: 'Diogo Pereira',      total: 35 },
  { rank: 33, code: 'CHE', name: 'Lukas Meier',        total: 34 },
  { rank: 34, code: 'AUT', name: 'Stefan Huber',       total: 34 },
  { rank: 35, code: 'HUN', name: 'Gábor Vásárhelyi',   total: 33 },
  { rank: 36, code: 'HRV', name: 'Ivan Horvat',        total: 32 },
  { rank: 37, code: 'SRB', name: 'Nikola Marković',    total: 31 },
  { rank: 38, code: 'ROU', name: 'Alexandru Popa',     total: 30 },
  { rank: 39, code: 'GRC', name: 'Nikos Papadopoulos', total: 30 },
  { rank: 40, code: 'EGY', name: 'Ahmed Hassan',       total: 29 },
  { rank: 41, code: 'MAR', name: 'Youssef Berrada',    total: 28 },
  { rank: 42, code: 'KEN', name: 'James Mwangi',       total: 27 },
  { rank: 43, code: 'ETH', name: 'Dawit Girma',        total: 26 },
  { rank: 44, code: 'GHA', name: 'Kwame Asante',       total: 25 },
  { rank: 45, code: 'UGA', name: 'Moses Okello',       total: 24 },
  { rank: 46, code: 'TZA', name: 'Emmanuel Mwamba',    total: 23 },
  { rank: 47, code: 'CMR', name: 'Jean-Paul Mbida',    total: 22 },
  { rank: 48, code: 'SEN', name: 'Ousmane Diallo',     total: 21 },
  { rank: 49, code: 'TUN', name: 'Karim Ben Salem',    total: 20 },
  { rank: 50, code: 'RUS', name: 'Dmitri Voronov',     total: 18 },
]

// ── Component ─────────────────────────────────────────────────────────
export default function PostEventLeaderboard() {
  const posLabel = PLAYER_FINISH <= 3
    ? ['GOLD', 'SILVER', 'BRONZE'][PLAYER_FINISH - 1]
    : `P${PLAYER_FINISH}`
  const pColor = posColor(PLAYER_FINISH)

  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <div className={styles.vignette} />

      <div className={styles.content}>

        {/* ── Season bar ──────────────────────────────────────── */}
        <div className={styles.seasonBar}>
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Season</span>
            <span className={styles.seasonBarValue}>1</span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Event</span>
            <span className={styles.seasonBarValue}>3 <span className={styles.seasonBarOf}>of 5</span></span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Age</span>
            <span className={styles.seasonBarValue}>22</span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Event</span>
            <span className={styles.seasonBarValue}>Cape Town Cup</span>
          </div>
          <div className={styles.seasonBarSpacer} />
          <div className={styles.completedBadge}>COMPLETED</div>
        </div>

        {/* ── Result hero ─────────────────────────────────────── */}
        <div className={styles.resultCard} style={{ borderLeftColor: pColor }}>
          <div className={styles.resultLeft}>
            <span className={styles.resultLabel}>YOUR FINISH</span>
            <span className={styles.resultPos} style={{ color: pColor }}>{posLabel}</span>
          </div>
          <div className={styles.resultDivider} />
          <div className={styles.resultRight}>
            <div className={styles.resultStat}>
              <span className={styles.resultStatValue}>{PLAYER_TOTAL}</span>
              <span className={styles.resultStatLabel}>event total</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatValue} style={{ color: 'var(--accent)' }}>+{PLAYER_PTS}</span>
              <span className={styles.resultStatLabel}>championship pts</span>
            </div>
          </div>
        </div>

        {/* ── Score breakdown ─────────────────────────────────── */}
        <div className={styles.breakdown}>
          {BREAKDOWN.map(({ distance, arrows }) => {
            const color    = distanceColor(distance)
            const subtotal = arrows.reduce((a, b) => a + b, 0)
            return (
              <div key={distance} className={styles.breakdownGroup} style={{ borderColor: color }}>
                <span className={styles.breakdownDist} style={{ color }}>{distance}m</span>
                <div className={styles.scorePills}>
                  {arrows.map((s, i) => {
                    const sc = scoreColor(s)
                    return (
                      <span
                        key={i}
                        className={styles.scorePill}
                        style={{ background: sc.bg, color: sc.fg }}
                      >
                        {s}
                      </span>
                    )
                  })}
                </div>
                <span className={styles.subtotal}>{subtotal}</span>
              </div>
            )
          })}
        </div>

        {/* ── Event leaderboard ───────────────────────────────── */}
        <div className={styles.leaderboard}>
          <div className={styles.leaderboardTable}>
            <div className={styles.leaderboardTitle}>Event Results</div>
            <div className={`${styles.lbRow} ${styles.lbHeaderRow}`}>
              <span className={styles.cRank}>#</span>
              <span className={styles.cFlag} />
              <span className={styles.cName} />
              <span className={styles.cTotal}>Score</span>
              <span className={styles.cPts}>+pts</span>
            </div>
            <div className={styles.leaderboardBody}>
              {EVENT_RESULTS.map(row => {
                const pts   = eventPts(row.rank)
                const medal = row.rank <= 3
                return (
                  <div
                    key={row.rank}
                    className={`${styles.lbRow} ${row.isPlayer ? styles.playerRow : ''}`}
                  >
                    <span
                      className={styles.cRank}
                      style={{ color: medal ? posColor(row.rank) : undefined }}
                    >
                      {row.rank}
                    </span>
                    <Flag code={row.code} className={styles.cFlag} />
                    <span className={styles.cName}>{row.name}</span>
                    <span
                      className={styles.cTotal}
                      style={{ color: medal ? posColor(row.rank) : undefined }}
                    >
                      {row.total}
                    </span>
                    <span className={styles.cPts}>{pts > 0 ? `+${pts}` : '—'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <a href="/career" className={styles.careerBtn}>My Career</a>
          <button className={styles.continueBtn}>Continue →</button>
        </div>

      </div>
    </div>
  )
}
