import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import {
  AGING_THRESHOLD,
  EVENT_SCHEDULE,
  SHAKINESS_REDUCTION_BRACKETS,
} from '../types'
import Flag from '../components/Flag'
import styles from './SeasonSummaryScreen.module.scss'

// ── Helpers ───────────────────────────────────────────────────────────

function posColor(pos: number): string {
  if (pos === 1) return '#e8c84a'
  if (pos === 2) return '#9eb8cc'
  if (pos === 3) return '#c8824a'
  return 'rgba(255,255,255,0.75)'
}

// ── Component ─────────────────────────────────────────────────────────

export default function SeasonSummaryScreen() {
  const navigate = useNavigate()

  const currentSeason = useGameStore(s => s.currentSeason)
  const player = useGameStore(s => s.player)!
  const getChampionshipStandings = useGameStore(s => s.getChampionshipStandings)
  const completeSeason = useGameStore(s => s.completeSeason)

  const standings = getChampionshipStandings()
  const champion = standings[0]
  const playerStanding = standings.find(s => s.isPlayer)!

  const bracket = SHAKINESS_REDUCTION_BRACKETS.find(
    b => playerStanding.rank >= b.minPosition && playerStanding.rank <= b.maxPosition,
  )!
  const skillGain = bracket.reductionPercent
  const isDeclining = player.age > AGING_THRESHOLD

  function handleNextSeason() {
    const isChampion = playerStanding.rank === 1
    completeSeason()
    navigate(isChampion ? '/game/victory' : '/game/event-lobby')
  }

  return (
    <div className={styles.container}>
      <div className={styles.bg} />
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
            <span className={styles.seasonBarLabel}>Age</span>
            <span className={styles.seasonBarValue}>{player.age}</span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Final Standing</span>
            <span className={styles.seasonBarValue}>
              #{playerStanding.rank} <span className={styles.seasonBarOf}>· {playerStanding.totalPoints} pts</span>
            </span>
          </div>
          <div className={styles.seasonBarSpacer} />
          <div className={styles.completedBadge}>SEASON COMPLETE</div>
        </div>

        {/* ── Champion + player hero ───────────────────────────── */}
        <div className={styles.heroCard}>

          <div className={styles.champSide}>
            <div className={styles.champCrown}>WORLD CHAMPION</div>
            <div className={styles.champIdentity}>
              <Flag code={champion.countryCode} className={styles.champFlag} />
              <span className={styles.champName}>{champion.name}</span>
            </div>
            <div className={styles.champTotal}>{champion.totalPoints} <span className={styles.champPtsLabel}>pts</span></div>
          </div>

          <div className={styles.heroDivider} />

          <div className={styles.playerSide}>
            <span className={styles.playerSideLabel}>YOUR SEASON</span>
            <div className={styles.playerResult}>
              <span className={styles.playerPos}>#{playerStanding.rank}</span>
              <span className={styles.playerPts}>{playerStanding.totalPoints} pts</span>
            </div>
            {skillGain > 0 && (
              <div className={styles.playerNote}>Skills improved +{skillGain}%</div>
            )}
            {isDeclining && (
              <div className={styles.playerNoteDecline}>Age is starting to affect your aim</div>
            )}
          </div>

        </div>

        {/* ── Season arc recap ────────────────────────────────── */}
        <div className={styles.eventRecap}>
          {EVENT_SCHEDULE.map((evt, i) => {
            const result = playerStanding.events[i]
            if (!result) return null
            const medal = result.position <= 3
            return (
              <div key={evt.id} className={styles.recapStep}>
                <div className={styles.recapFlagWrap}>
                  <Flag code={evt.hostCountryCode} className={styles.recapFlag} />
                </div>
                <span className={styles.recapName}>{evt.shortName}</span>
                <span
                  className={styles.recapResult}
                  style={{ color: medal ? posColor(result.position) : undefined }}
                >
                  #{result.position} · {result.points}pts
                </span>
              </div>
            )
          })}
        </div>

        {/* ── Championship standings ──────────────────────────── */}
        <div className={styles.standings}>
          <div className={styles.standingsLabel}>Championship Standings</div>
          <div className={styles.standingsTable}>

            {/* Header row */}
            <div className={`${styles.standingsRow} ${styles.standingsHeaderRow}`}>
              <span className={styles.cRank}>#</span>
              <span className={styles.cFlag} />
              <span className={styles.cName} />
              {EVENT_SCHEDULE.map(evt => (
                <span key={evt.id} className={styles.cEvent}>
                  <Flag code={evt.hostCountryCode} className={styles.headerFlag} />
                </span>
              ))}
              <span className={styles.cTotal}>Total</span>
            </div>

            {/* Scrollable body */}
            <div className={styles.standingsBody}>
              {standings.map(row => {
                const medal = row.rank <= 3
                return (
                  <div
                    key={row.countryCode}
                    className={`${styles.standingsRow} ${row.isPlayer ? styles.playerRow : ''} ${medal ? styles.medalRow : ''}`}
                  >
                    <span
                      className={styles.cRank}
                      style={{ color: medal ? posColor(row.rank) : undefined }}
                    >
                      {row.rank}
                    </span>
                    <Flag code={row.countryCode} className={styles.cFlag} />
                    <span className={styles.cName}>{row.name}</span>
                    {row.events.map((evt, i) => (
                      <span key={i} className={styles.cEvent}>
                        {evt ? (
                          <>
                            <span
                              className={styles.cEventPos}
                              style={{ color: evt.position <= 3 ? posColor(evt.position) : undefined }}
                            >
                              #{evt.position}
                            </span>
                            <span className={styles.cEventPts}>{evt.points > 0 ? evt.points : '—'}</span>
                          </>
                        ) : (
                          <span className={styles.cEventPts}>—</span>
                        )}
                      </span>
                    ))}
                    <span className={styles.cTotal}>{row.totalPoints > 0 ? row.totalPoints : '—'}</span>
                  </div>
                )
              })}
            </div>

          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <button className={styles.careerBtn} onClick={() => navigate('/game/career')}>My Career</button>
          <button className={styles.nextBtn} onClick={handleNextSeason}>Next Season →</button>
        </div>

      </div>
    </div>
  )
}
