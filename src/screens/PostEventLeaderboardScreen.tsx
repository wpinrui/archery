import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { EVENT_BACKGROUNDS, EVENT_SCHEDULE, EVENTS_PER_SEASON } from '../types'
import Flag from '../components/Flag'
import { posColor } from '../utils/posColor'
import styles from './PostEventLeaderboardScreen.module.scss'

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

// ── Component ─────────────────────────────────────────────────────────

export default function PostEventLeaderboardScreen() {
  const navigate = useNavigate()

  const currentSeason = useGameStore(s => s.currentSeason)
  const currentEventIndex = useGameStore(s => s.currentEventIndex)
  const player = useGameStore(s => s.player)!
  const completedEvents = useGameStore(s => s.completedEvents)

  const lastCompleted = completedEvents[completedEvents.length - 1]
  const eventDef = EVENT_SCHEDULE[lastCompleted.eventIndex]
  const results = lastCompleted.results
  const breakdown = lastCompleted.playerBreakdown
  const playerResult = results.find(r => r.isPlayer)!

  const playerFinish = playerResult.position
  const playerTotal = playerResult.totalScore
  const playerPts = playerResult.championshipPoints

  const posLabel = playerFinish <= 3
    ? ['GOLD', 'SILVER', 'BRONZE'][playerFinish - 1]
    : `P${playerFinish}`
  const pColor = posColor(playerFinish)

  const eventNumber = lastCompleted.eventIndex + 1
  const isFinalEvent = currentEventIndex >= EVENTS_PER_SEASON
  const bgImage = EVENT_BACKGROUNDS[eventDef.id]

  function handleContinue() {
    if (isFinalEvent) {
      navigate('/game/season-summary')
    } else {
      navigate('/game/event-lobby')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.bg} style={{ backgroundImage: `url('${bgImage}')` }} />
      <div className={styles.vignette} />

      <div className={styles.content}>

        {/* ── Season bar ──────────────────────────────────────── */}
        <div className={styles.seasonBar}>
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Season</span>
            <span className={styles.seasonBarValue}>{currentSeason}</span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Round</span>
            <span className={styles.seasonBarValue}>{eventNumber} <span className={styles.seasonBarOf}>of {EVENTS_PER_SEASON}</span></span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Age</span>
            <span className={styles.seasonBarValue}>{player.age}</span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Event</span>
            <span className={styles.seasonBarValue}>{eventDef.name}</span>
          </div>
          <div className={styles.seasonBarSpacer} />
          <div className={styles.completedBadge}>COMPLETED</div>
        </div>

        {/* ── Result hero ─────────────────────────────────────── */}
        <div className={styles.resultCard}>
          <div className={styles.resultLeft}>
            <span className={styles.resultLabel}>YOUR FINISH</span>
            <span className={styles.resultPos} style={{ color: pColor }}>{posLabel}</span>
          </div>
          <div className={styles.resultDivider} />
          <div className={styles.resultRight}>
            <div className={styles.resultStat}>
              <span className={styles.resultStatValue}>{playerTotal}</span>
              <span className={styles.resultStatLabel}>event total</span>
            </div>
            <div className={styles.resultStat}>
              <span className={styles.resultStatValue} style={{ color: 'var(--accent)' }}>+{playerPts}</span>
              <span className={styles.resultStatLabel}>championship pts</span>
            </div>
          </div>
        </div>

        {/* ── Score breakdown ─────────────────────────────────── */}
        <div className={styles.breakdown}>
          {breakdown.map(({ distance, scores }) => {
            const color = distanceColor(distance)
            const subtotal = scores.reduce<number>((a, b) => a + b, 0)
            return (
              <div key={distance} className={styles.breakdownGroup} style={{ borderColor: color }}>
                <span className={styles.breakdownDist} style={{ color }}>{distance}m</span>
                <div className={styles.scorePills}>
                  {scores.map((s, i) => {
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
              {results.map(row => {
                const medal = row.position <= 3
                return (
                  <div
                    key={row.countryCode}
                    className={`${styles.lbRow} ${row.isPlayer ? styles.playerRow : ''}`}
                  >
                    <span
                      className={styles.cRank}
                      style={{ color: medal ? posColor(row.position) : undefined }}
                    >
                      {row.position}
                    </span>
                    <Flag code={row.countryCode} className={styles.cFlag} />
                    <span className={styles.cName}>{row.name}</span>
                    <span
                      className={styles.cTotal}
                      style={{ color: medal ? posColor(row.position) : undefined }}
                    >
                      {row.totalScore}
                    </span>
                    <span className={styles.cPts}>
                      {row.championshipPoints > 0 ? `+${row.championshipPoints}` : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <button className={styles.careerBtn} onClick={() => navigate('/game/career')}>My Career</button>
          <button className={styles.continueBtn} onClick={handleContinue}>Continue →</button>
        </div>

      </div>
    </div>
  )
}
