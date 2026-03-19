import Flag from '../../components/Flag'
import styles from './styles.module.scss'

// ── Helpers ───────────────────────────────────────────────────────────
function distanceColor(m: number): string {
  const t = (m - 18) / (90 - 18)
  return `hsl(${Math.round(120 * (1 - t))}, 70%, 62%)`
}

// ── Data ──────────────────────────────────────────────────────────────
const DISTANCES = [
  { distance: 18, arrows: 2 },
  { distance: 70, arrows: 4 },
  { distance: 90, arrows: 4 },
]

interface StandingsRow {
  rank: number
  code: string
  name: string
  pts: number
  isPlayer?: boolean
}

const STANDINGS: StandingsRow[] = [
  { rank: 1, code: 'NLD', name: 'J. Visser',   pts: 58 },
  { rank: 2, code: 'ITA', name: 'M. Rossi',    pts: 55 },
  { rank: 3, code: 'CHN', name: 'Chen Wei',    pts: 53 },
  { rank: 4, code: 'JPN', name: 'A. Nakamura', pts: 51 },
  { rank: 5, code: 'ZAF', name: 'YOU',         pts: 48, isPlayer: true },
]

// ── Component ─────────────────────────────────────────────────────────
export default function EventLobby() {
  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <div className={styles.vignette} />
      <div className={styles.seasonCtx}>Season 1 · Event 3 of 5</div>

      <div className={styles.eventHeader}>
        <div className={styles.eventNameBlock}>
          <h1 className={styles.eventName}>Cape Town Cup</h1>
          <div className={styles.hostLine}>
            <Flag code="ZAF" className={styles.hostFlag} />
            <span className={styles.hostCountry}>South Africa</span>
          </div>
        </div>
      </div>

      <div className={styles.distancesStrip}>
        {DISTANCES.map(({ distance, arrows }) => {
          const color = distanceColor(distance)
          return (
            <div key={distance} className={styles.distanceCard} style={{ borderColor: color }}>
              <span className={styles.distanceValue} style={{ color }}>{distance}m</span>
              <span className={styles.arrowCount}>{arrows} arrows</span>
            </div>
          )
        })}
      </div>

      <div className={styles.standings}>
        <div className={styles.standingsLabel}>Season Standings</div>
        <div className={styles.standingsTable}>
          {STANDINGS.map(row => (
            <div key={row.rank} className={`${styles.standingsRow} ${row.isPlayer ? styles.playerRow : ''}`}>
              <span className={styles.rankCol}>{row.rank}</span>
              <Flag code={row.code} className={styles.flagCol} />
              <span className={styles.nameCol}>{row.name}</span>
              <span className={styles.ptsLabel}>pts</span>
              <span className={styles.ptsCol}>{row.pts}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actionRow}>
        <a href="/career" className={styles.careerBtn}>Career</a>
        <button className={styles.startBtn}>Start Event →</button>
      </div>
    </div>
  )
}
