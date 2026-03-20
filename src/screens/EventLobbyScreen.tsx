import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { COUNTRIES } from '../data/countries'
import { EVENT_SCHEDULE, EVENTS_PER_SEASON } from '../types'
import type { CountryCode, StandingsRow } from '../types'
import Flag from '../components/Flag'
import styles from './EventLobbyScreen.module.scss'

// ── Helpers ───────────────────────────────────────────────────────────

function distanceColor(m: number): string {
  const t = (m - 18) / (90 - 18)
  return `hsl(${Math.round(120 * (1 - t))}, 70%, 62%)`
}

function posColor(pos: number): string {
  if (pos === 1) return '#e8c84a'
  if (pos === 2) return '#9eb8cc'
  if (pos === 3) return '#c8824a'
  return 'rgba(255,255,255,0.75)'
}

const countryNameMap = new Map<CountryCode, string>(
  COUNTRIES.map(c => [c.code, c.name]),
)

const POINTS_TABLE: { label: string; pts: number }[] = [
  { label: 'P1',    pts: 100 }, { label: 'P2',    pts: 85 },
  { label: 'P3',    pts: 72 },  { label: 'P4',    pts: 61 },
  { label: 'P5',    pts: 52 },  { label: 'P6',    pts: 44 },
  { label: 'P7',    pts: 37 },  { label: 'P8',    pts: 31 },
  { label: 'P9',    pts: 26 },  { label: 'P10',   pts: 22 },
  { label: 'P11–15', pts: 15 }, { label: 'P16–20', pts: 10 },
  { label: 'P21–30', pts: 6 },  { label: 'P31–40', pts: 3 },
  { label: 'P41–50', pts: 0 },
]

function renderStandingsRow(
  row: StandingsRow,
  currentEventIndex: number,
) {
  return (
    <div key={row.rank} className={`${styles.standingsRow} ${row.isPlayer ? styles.playerRow : ''}`}>
      <span className={styles.cRank}>{row.rank}</span>
      <Flag code={row.countryCode} className={styles.cFlag} />
      <span className={styles.cName}>{row.name}</span>
      {row.events.map((evt, i) => (
        <span key={i} className={`${styles.cEvent} ${i < currentEventIndex ? styles.cEventDone : i === currentEventIndex ? styles.cEventCurrent : styles.cEventAhead}`}>
          {evt !== null ? (
            <>
              <span className={styles.cEventPos} style={{ color: posColor(evt.position) }}>#{evt.position}</span>
              <span className={styles.cEventPts}>{evt.points}</span>
            </>
          ) : '—'}
        </span>
      ))}
      <span className={styles.cTotal}>{row.totalPoints}</span>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────

export default function EventLobbyScreen() {
  const navigate = useNavigate()
  const [showPoints, setShowPoints] = useState(false)

  const currentSeason = useGameStore(s => s.currentSeason)
  const currentEventIndex = useGameStore(s => s.currentEventIndex)
  const player = useGameStore(s => s.player)!
  const getCurrentEvent = useGameStore(s => s.getCurrentEvent)
  const getChampionshipStandings = useGameStore(s => s.getChampionshipStandings)

  const currentEvent = getCurrentEvent()
  const standings = getChampionshipStandings()
  const hostCountryName = countryNameMap.get(currentEvent.hostCountryCode) ?? currentEvent.hostCountryCode

  const playerStanding = standings.find(s => s.isPlayer)
  const playerRank = playerStanding?.rank ?? null
  const playerPoints = playerStanding?.totalPoints ?? 0

  // Timeline: player results per event from standings data
  const playerEventResults = playerStanding?.events ?? Array(EVENTS_PER_SEASON).fill(null)

  // Standings: show all rows; pin the player below a separator if outside top 5
  const playerInTop5 = standings.slice(0, 5).some(r => r.isPlayer)
  const pinnedPlayerRow = !playerInTop5 ? playerStanding : null

  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <div className={styles.vignette} />

      <div className={styles.content}>

        {/* ── Season / position header ────────────────────────────── */}
        <div className={styles.seasonBar}>
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Season</span>
            <span className={styles.seasonBarValue}>{currentSeason}</span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Event</span>
            <span className={styles.seasonBarValue}>{currentEventIndex + 1} <span className={styles.seasonBarOf}>of 5</span></span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Age</span>
            <span className={styles.seasonBarValue}>{player.age}</span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Standing</span>
            <span className={styles.seasonBarValue}>
              {playerRank !== null ? `#${playerRank}` : '—'}{' '}
              <span className={styles.seasonBarOf}>· {playerPoints} pts</span>
            </span>
          </div>
        </div>

        {/* ── Season timeline ─────────────────────────────────────── */}
        <div className={styles.timeline}>
          {EVENT_SCHEDULE.map((evt, i) => {
            const done = i < currentEventIndex
            const current = i === currentEventIndex
            const result = playerEventResults[i]
            return (
              <div key={evt.id} className={`${styles.timelineStep} ${done ? styles.stepDone : current ? styles.stepCurrent : styles.stepAhead}`}>
                <div className={styles.timelineFlagWrap}>
                  <Flag code={evt.hostCountryCode} className={styles.timelineFlag} />
                  {current && <div className={styles.timelinePulse} />}
                </div>
                <span className={styles.timelineName}>{evt.shortName}</span>
                {done && result && (
                  <span className={styles.timelineResult}>#{result.position} · {result.points}pts</span>
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
              <Flag code={currentEvent.hostCountryCode} className={styles.eventHostFlag} />
              <span className={styles.eventHostName}>{hostCountryName}</span>
            </div>
            <h1 className={styles.eventName}>{currentEvent.name}</h1>
          </div>
          <div className={styles.distancesStrip}>
            {currentEvent.distances.map(({ distance, arrows }) => {
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
          <div className={styles.standingsLabelRow}>
            <span className={styles.standingsLabel}>Championship Standings</span>
            <button className={styles.infoBtn} onClick={() => setShowPoints(true)} aria-label="Points system">i</button>
          </div>
          <div className={styles.standingsTable}>
            {/* Column headers */}
            <div className={`${styles.standingsRow} ${styles.standingsHeaderRow}`}>
              <span className={styles.cRank}>#</span>
              <span className={styles.cFlag} />
              <span className={styles.cName} />
              {EVENT_SCHEDULE.map((evt, i) => (
                <span key={evt.id} className={`${styles.cEvent} ${i < currentEventIndex ? styles.cEventDone : i === currentEventIndex ? styles.cEventCurrent : styles.cEventAhead}`}>
                  <Flag code={evt.hostCountryCode} className={styles.headerFlag} />
                </span>
              ))}
              <span className={styles.cTotal}>Total</span>
            </div>
            {/* Body */}
            <div className={styles.standingsBody}>
              {standings.map(row => renderStandingsRow(row, currentEventIndex))}
              {pinnedPlayerRow && (
                <>
                  <div className={styles.standingsSep}>···</div>
                  {renderStandingsRow(pinnedPlayerRow, currentEventIndex)}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <button className={styles.careerBtn} onClick={() => navigate('/game/career')}>My Career</button>
          <button className={styles.startBtn} onClick={() => navigate('/game/shooting')}>Start Event →</button>
        </div>

      </div>

      {/* ── Points system dialog ──────────────────────────────── */}
      {showPoints && (
        <div className={styles.dialogOverlay} onClick={() => setShowPoints(false)}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()}>
            <div className={styles.dialogHeader}>
              <span className={styles.dialogTitle}>Points System</span>
              <button className={styles.dialogClose} onClick={() => setShowPoints(false)}>×</button>
            </div>
            <div className={styles.pointsGrid}>
              {POINTS_TABLE.map(({ label, pts }) => (
                <div key={label} className={styles.pointsRow}>
                  <span className={styles.pointsPos}>{label}</span>
                  <span className={styles.pointsVal}>{pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
