import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import Flag from '../components/Flag'
import styles from './CareerScreen.module.scss'

// ── Helpers ───────────────────────────────────────────────────────────

function posColor(pos: number): string {
  if (pos === 1) return '#e8c84a'
  if (pos === 2) return '#9eb8cc'
  if (pos === 3) return '#c8824a'
  return 'rgba(255,255,255,0.75)'
}

// ── Component ─────────────────────────────────────────────────────────

export default function CareerScreen() {
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)

  const phase = useGameStore(s => s.phase)
  const player = useGameStore(s => s.player)
  const currentSeason = useGameStore(s => s.currentSeason)
  const careerHistory = useGameStore(s => s.careerHistory)
  const retire = useGameStore(s => s.retire)

  // Guard: only accessible during an active career
  if (!player || phase !== 'playing') {
    return <Navigate to="/play" replace />
  }

  const totalG = careerHistory.reduce((s, r) => s + r.medals.gold, 0)
  const totalS = careerHistory.reduce((s, r) => s + r.medals.silver, 0)
  const totalB = careerHistory.reduce((s, r) => s + r.medals.bronze, 0)
  const totalChamps = careerHistory.filter(r => r.wonChampionship).length
  const bestPos = careerHistory.length > 0
    ? Math.min(...careerHistory.map(r => r.championshipPosition))
    : null
  const totalPts = careerHistory.reduce((s, r) => s + r.championshipPoints, 0)

  function handleBack() {
    navigate(-1)
  }

  function handleRetire() {
    retire()
    navigate('/retired')
  }

  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <div className={styles.vignette} />

      <div className={styles.content}>

        {/* ── Identity bar ────────────────────────────────────────── */}
        <div className={styles.identityBar}>
          <div className={styles.identity}>
            <Flag code={player.countryCode} className={styles.identityFlag} />
            <div className={styles.identityText}>
              <span className={styles.playerName}>{player.name}</span>
              <span className={styles.playerMeta}>
                {player.countryCode} · Age {player.age} · {careerHistory.length} seasons
              </span>
            </div>
          </div>
          <span className={styles.inProgressBadge}>
            SEASON {currentSeason} IN PROGRESS
          </span>
        </div>

        {/* ── Career stat strip ───────────────────────────────────── */}
        <div className={styles.statStrip}>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Championships</span>
            <div className={styles.champDisplay}>
              <span className={styles.champCount}>{totalChamps}×</span>
              <span className={styles.champTrophy}>🏆</span>
            </div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Best Finish</span>
            <span
              className={styles.statValue}
              style={bestPos !== null ? { color: posColor(bestPos) } : undefined}
            >
              {bestPos !== null ? `#${bestPos}` : '—'}
            </span>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Event Medals</span>
            <div className={styles.medalTally}>
              <span className={`${styles.medalCircle} ${styles.medalCircleG}`}>{totalG}</span>
              <span className={`${styles.medalCircle} ${styles.medalCircleS}`}>{totalS}</span>
              <span className={`${styles.medalCircle} ${styles.medalCircleB}`}>{totalB}</span>
            </div>
          </div>

          <div className={styles.statDivider} />

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Career Points</span>
            <span className={styles.statValue}>{totalPts.toLocaleString()}</span>
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
              <span className={styles.cPos}>Finish</span>
              <span className={styles.cPts}>Pts</span>
              <span className={styles.cMedals}>Medals</span>
            </div>

            {/* Body */}
            <div className={styles.tableBody}>
              {careerHistory.map(rec => {
                const hasMedals = rec.medals.gold + rec.medals.silver + rec.medals.bronze > 0
                return (
                  <div
                    key={rec.season}
                    className={`${styles.row} ${rec.wonChampionship ? styles.champRow : ''}`}
                  >
                    <span className={styles.cSeason}>{rec.season}</span>
                    <span className={styles.cAge}>{rec.age}</span>

                    <div className={styles.cPos}>
                      <span style={{ color: posColor(rec.championshipPosition) }}>
                        #{rec.championshipPosition}
                      </span>
                    </div>

                    <span className={styles.cPts}>{rec.championshipPoints}</span>

                    <div className={styles.cMedals}>
                      {hasMedals ? (
                        <>
                          {rec.medals.gold > 0 && (
                            <span className={`${styles.medalCircle} ${styles.medalCircleG}`}>
                              {rec.medals.gold}
                            </span>
                          )}
                          {rec.medals.silver > 0 && (
                            <span className={`${styles.medalCircle} ${styles.medalCircleS}`}>
                              {rec.medals.silver}
                            </span>
                          )}
                          {rec.medals.bronze > 0 && (
                            <span className={`${styles.medalCircle} ${styles.medalCircleB}`}>
                              {rec.medals.bronze}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className={styles.mNone}>—</span>
                      )}
                    </div>

                  </div>
                )
              })}
            </div>

          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <button className={styles.backBtn} onClick={handleBack}>← Back</button>
          <button className={styles.retireBtn} onClick={() => setShowConfirm(true)}>Retire</button>
        </div>

      </div>

      {/* ── Retire confirmation dialog ──────────────────────────── */}
      {showConfirm && (
        <div className={styles.dialogOverlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()}>
            <span className={styles.dialogTitle}>Retire from competition?</span>
            <p className={styles.dialogBody}>
              This will end your career permanently. There is no coming back.
            </p>
            <div className={styles.dialogActions}>
              <button className={styles.dialogCancel} onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className={styles.dialogConfirm} onClick={handleRetire}>Retire</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
