import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import styles from './TitleScreen.module.scss'

export default function TitleScreen() {
  const phase       = useGameStore(s => s.phase)
  const resetCareer = useGameStore(s => s.resetCareer)
  const navigate    = useNavigate()

  const hasCareer = phase !== 'country-selection'
  const [confirming, setConfirming] = useState(false)

  function handleContinue() {
    navigate('/play')
  }

  function handleNewGame() {
    if (hasCareer) {
      setConfirming(true)
    } else {
      navigate('/country-selection')
    }
  }

  function handleConfirmNewGame() {
    resetCareer()
    navigate('/country-selection')
  }

  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <div className={styles.vignette} />

      <div className={styles.content}>

        {/* ── Title ─────────────────────────────────────────────────── */}
        <div className={styles.titleBlock}>
          <span className={styles.eyebrow}>Long Draw</span>
          <h1 className={styles.title}>Archery</h1>
        </div>

        {/* ── Actions ───────────────────────────────────────────────── */}
        <div className={styles.actions}>

          {hasCareer && (
            <button className={styles.continueBtn} onClick={handleContinue}>
              Continue
            </button>
          )}

          {!confirming ? (
            <button
              className={hasCareer ? styles.newGameBtnSecondary : styles.newGameBtn}
              onClick={handleNewGame}
            >
              New Game
            </button>
          ) : (
            <div className={styles.confirmBlock}>
              <p className={styles.confirmText}>
                Starting a new game will erase your current career.
              </p>
              <div className={styles.confirmRow}>
                <button className={styles.confirmYes} onClick={handleConfirmNewGame}>
                  Confirm
                </button>
                <button className={styles.confirmCancel} onClick={() => setConfirming(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
