import Flag from '../../components/Flag'
import styles from './styles.module.scss'

// ── Helpers ───────────────────────────────────────────────────────────
function distanceColor(m: number): string {
  const t = (m - 18) / (90 - 18)
  return `hsl(${Math.round(120 * (1 - t))}, 70%, 62%)`
}

// ── Data ──────────────────────────────────────────────────────────────
const CURRENT_EVENT_IDX = 2

const EVENTS = [
  { name: 'Seoul Cup',            shortName: 'Seoul',     code: 'KOR' },
  { name: 'Paris Open',           shortName: 'Paris',     code: 'FRA' },
  { name: 'Cape Town Cup',        shortName: 'Cape Town', code: 'ZAF', country: 'South Africa' },
  { name: 'Las Vegas Classic',    shortName: 'Las Vegas', code: 'USA' },
  { name: 'Sydney International', shortName: 'Sydney',    code: 'AUS' },
]

// Player's finish position per completed event (null = not yet played)
const PLAYER_RESULTS: Array<{ pos: number; pts: number } | null> = [
  { pos: 7, pts: 37 },
  { pos: 5, pts: 52 },
  null, null, null,
]

const CURRENT_DISTANCES = [
  { distance: 18, arrows: 2 },
  { distance: 70, arrows: 4 },
  { distance: 90, arrows: 4 },
]

interface Athlete {
  rank: number
  code: string
  name: string
  isPlayer?: boolean
  eventPts: (number | null)[]
}

const STANDINGS: Athlete[] = [
  { rank: 1, code: 'NLD', name: 'Joost Visser',    eventPts: [100, 85,  null, null, null] },
  { rank: 2, code: 'CHN', name: 'Chen Wei',         eventPts: [61,  100, null, null, null] },
  { rank: 3, code: 'ITA', name: 'Marco Rossi',      eventPts: [85,  72,  null, null, null] },
  { rank: 4, code: 'JPN', name: 'Akira Nakamura',   eventPts: [72,  61,  null, null, null] },
  { rank: 5, code: 'ZAF', name: 'YOU',              eventPts: [37,  52,  null, null, null], isPlayer: true },
]

const playerIsTop5 = STANDINGS.findIndex(a => a.isPlayer) < 5
const playerRow = STANDINGS.find(a => a.isPlayer)!

// ── Component ─────────────────────────────────────────────────────────
export default function EventLobby() {
  const currentEvent = EVENTS[CURRENT_EVENT_IDX]

  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <div className={styles.vignette} />

      <div className={styles.content}>

        {/* ── Season / position header ────────────────────────────── */}
        <div className={styles.seasonBar}>
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Season</span>
            <span className={styles.seasonBarValue}>1</span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Event</span>
            <span className={styles.seasonBarValue}>{CURRENT_EVENT_IDX + 1} <span className={styles.seasonBarOf}>of 5</span></span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Age</span>
            <span className={styles.seasonBarValue}>22</span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Standing</span>
            <span className={styles.seasonBarValue}>P5 <span className={styles.seasonBarOf}>· 89 pts</span></span>
          </div>
        </div>

        {/* ── Season timeline ─────────────────────────────────────── */}
        <div className={styles.timeline}>
          {EVENTS.map((evt, i) => {
            const done    = i < CURRENT_EVENT_IDX
            const current = i === CURRENT_EVENT_IDX
            const result  = PLAYER_RESULTS[i]
            return (
              <div key={evt.code} className={`${styles.timelineStep} ${done ? styles.stepDone : current ? styles.stepCurrent : styles.stepAhead}`}>
                <div className={styles.timelineFlagWrap}>
                  <Flag code={evt.code} className={styles.timelineFlag} />
                  {current && <div className={styles.timelinePulse} />}
                </div>
                <span className={styles.timelineName}>{evt.shortName}</span>
                {done && result && (
                  <span className={styles.timelineResult}>P{result.pos} · {result.pts}pts</span>
                )}
                {current && <span className={styles.timelineCurrent}>NOW</span>}
                {!done && !current && <span className={styles.timelineAhead}>—</span>}
              </div>
            )
          })}
        </div>

        {/* ── Current event block ─────────────────────────────────── */}
        <div className={styles.eventBlock}>
          <div className={styles.eventLeft}>
            <div className={styles.eventMeta}>
              <Flag code={currentEvent.code} className={styles.eventHostFlag} />
              <span className={styles.eventHostName}>{currentEvent.country}</span>
            </div>
            <h1 className={styles.eventName}>{currentEvent.name}</h1>
          </div>
          <div className={styles.distancesStrip}>
            {CURRENT_DISTANCES.map(({ distance, arrows }) => {
              const color = distanceColor(distance)
              return (
                <div key={distance} className={styles.distanceCard} style={{ borderColor: color }}>
                  <span className={styles.distanceValue} style={{ color }}>{distance}m</span>
                  <span className={styles.arrowCount}>{arrows} arrows</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Championship standings ──────────────────────────────── */}
        <div className={styles.standings}>
          <div className={styles.standingsLabel}>Championship Standings</div>
          <div className={styles.standingsTable}>
            {/* Column headers */}
            <div className={`${styles.standingsRow} ${styles.standingsHeaderRow}`}>
              <span className={styles.cRank}>#</span>
              <span className={styles.cFlag} />
              <span className={styles.cName} />
              {EVENTS.map((evt, i) => (
                <span key={evt.code} className={`${styles.cEvent} ${i < CURRENT_EVENT_IDX ? styles.cEventDone : i === CURRENT_EVENT_IDX ? styles.cEventCurrent : styles.cEventAhead}`}>
                  <Flag code={evt.code} className={styles.headerFlag} />
                </span>
              ))}
              <span className={styles.cTotal}>Total</span>
            </div>
            {/* Athlete rows */}
            {STANDINGS.map(row => {
              const total = row.eventPts.reduce<number>((s, v) => s + (v ?? 0), 0)
              return (
                <div key={row.rank} className={`${styles.standingsRow} ${row.isPlayer ? styles.playerRow : ''}`}>
                  <span className={styles.cRank}>{row.rank}</span>
                  <Flag code={row.code} className={styles.cFlag} />
                  <span className={styles.cName}>{row.name}</span>
                  {row.eventPts.map((pts, i) => (
                    <span key={i} className={`${styles.cEvent} ${i < CURRENT_EVENT_IDX ? styles.cEventDone : i === CURRENT_EVENT_IDX ? styles.cEventCurrent : styles.cEventAhead}`}>
                      {pts !== null ? pts : '—'}
                    </span>
                  ))}
                  <span className={styles.cTotal}>{total}</span>
                </div>
              )
            })}
            {/* Player row pinned outside top 5 */}
            {!playerIsTop5 && (
              <>
                <div className={styles.standingsSep}>···</div>
                <div className={`${styles.standingsRow} ${styles.playerRow}`}>
                  <span className={styles.cRank}>{playerRow.rank}</span>
                  <Flag code={playerRow.code} className={styles.cFlag} />
                  <span className={styles.cName}>{playerRow.name}</span>
                  {playerRow.eventPts.map((pts, i) => (
                    <span key={i} className={`${styles.cEvent} ${i < CURRENT_EVENT_IDX ? styles.cEventDone : i === CURRENT_EVENT_IDX ? styles.cEventCurrent : styles.cEventAhead}`}>
                      {pts !== null ? pts : '—'}
                    </span>
                  ))}
                  <span className={styles.cTotal}>{playerRow.eventPts.reduce<number>((s, v) => s + (v ?? 0), 0)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <a href="/career" className={styles.careerBtn}>Career</a>
          <button className={styles.startBtn}>Start Event →</button>
        </div>

      </div>
    </div>
  )
}
