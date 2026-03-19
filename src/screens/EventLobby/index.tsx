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

interface EventResult { pos: number; pts: number }

interface Athlete {
  rank: number
  code: string
  name: string
  isPlayer?: boolean
  events: (EventResult | null)[]
}

const STANDINGS: Athlete[] = [
  { rank: 1, code: 'NLD', name: 'Joost Visser',  events: [{ pos: 1, pts: 100 }, { pos: 2, pts: 85  }, null, null, null] },
  { rank: 2, code: 'CHN', name: 'Chen Wei',       events: [{ pos: 4, pts: 61  }, { pos: 1, pts: 100 }, null, null, null] },
  { rank: 3, code: 'ITA', name: 'Marco Rossi',    events: [{ pos: 2, pts: 85  }, { pos: 3, pts: 72  }, null, null, null] },
  { rank: 4, code: 'JPN', name: 'Akira Nakamura', events: [{ pos: 3, pts: 72  }, { pos: 4, pts: 61  }, null, null, null] },
  { rank: 5, code: 'ZAF', name: 'Player One',     events: [{ pos: 7, pts: 37  }, { pos: 5, pts: 52  }, null, null, null], isPlayer: true },
]

const playerIsTop5 = STANDINGS.findIndex(a => a.isPlayer) < 5
const playerRow = STANDINGS.find(a => a.isPlayer)!

function totalPts(events: (EventResult | null)[]) {
  return events.reduce<number>((s, e) => s + (e?.pts ?? 0), 0)
}

function posColor(pos: number): string {
  if (pos === 1) return '#e8c84a'          // gold
  if (pos === 2) return '#9eb8cc'          // silver — blue-grey, distinct from white
  if (pos === 3) return '#c8824a'          // bronze
  return 'rgba(255,255,255,0.75)'          // rest
}

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
            {/* Column headers — always visible */}
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
            {/* Scrollable body */}
            <div className={styles.standingsBody}>
            {STANDINGS.map(row => (
              <div key={row.rank} className={`${styles.standingsRow} ${row.isPlayer ? styles.playerRow : ''}`}>
                <span className={styles.cRank}>{row.rank}</span>
                <Flag code={row.code} className={styles.cFlag} />
                <span className={styles.cName}>{row.name}</span>
                {row.events.map((evt, i) => (
                  <span key={i} className={`${styles.cEvent} ${i < CURRENT_EVENT_IDX ? styles.cEventDone : i === CURRENT_EVENT_IDX ? styles.cEventCurrent : styles.cEventAhead}`}>
                    {evt !== null ? (
                      <>
                        <span className={styles.cEventPos} style={{ color: posColor(evt.pos) }}>#{evt.pos}</span>
                        <span className={styles.cEventPts}>{evt.pts}</span>
                      </>
                    ) : '—'}
                  </span>
                ))}
                <span className={styles.cTotal}>{totalPts(row.events)}</span>
              </div>
            ))}
            {!playerIsTop5 && (
              <>
                <div className={styles.standingsSep}>···</div>
                <div className={`${styles.standingsRow} ${styles.playerRow}`}>
                  <span className={styles.cRank}>{playerRow.rank}</span>
                  <Flag code={playerRow.code} className={styles.cFlag} />
                  <span className={styles.cName}>{playerRow.name}</span>
                  {playerRow.events.map((evt, i) => (
                    <span key={i} className={`${styles.cEvent} ${i < CURRENT_EVENT_IDX ? styles.cEventDone : i === CURRENT_EVENT_IDX ? styles.cEventCurrent : styles.cEventAhead}`}>
                      {evt !== null ? (
                        <>
                          <span className={styles.cEventPos} style={{ color: posColor(evt.pos) }}>#{evt.pos}</span>
                          <span className={styles.cEventPts}>{evt.pts}</span>
                        </>
                      ) : '—'}
                    </span>
                  ))}
                  <span className={styles.cTotal}>{totalPts(playerRow.events)}</span>
                </div>
              </>
            )}
            </div>{/* end standingsBody */}
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <a href="/career" className={styles.careerBtn}>My Career</a>
          <button className={styles.startBtn}>Start Event →</button>
        </div>

      </div>
    </div>
  )
}
