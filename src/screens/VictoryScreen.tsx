import { useNavigate, Navigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { EVENTS_PER_SEASON } from '../types'
import Flag from '../components/Flag'
import styles from './VictoryScreen.module.scss'

// ── Helpers ───────────────────────────────────────────────────────────

function ordinal(n: number): string {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  const mod10 = n % 10
  if (mod10 === 1) return `${n}st`
  if (mod10 === 2) return `${n}nd`
  if (mod10 === 3) return `${n}rd`
  return `${n}th`
}

// ── Component ─────────────────────────────────────────────────────────

export default function VictoryScreen() {
  const navigate = useNavigate()

  const player = useGameStore(s => s.player)
  const currentSeason = useGameStore(s => s.currentSeason)
  const careerHistory = useGameStore(s => s.careerHistory)
  const completedEvents = useGameStore(s => s.completedEvents)
  const getChampionshipStandings = useGameStore(s => s.getChampionshipStandings)
  const completeSeason = useGameStore(s => s.completeSeason)
  const retire = useGameStore(s => s.retire)

  const standings = getChampionshipStandings()
  const playerStanding = standings.find(s => s.isPlayer)

  // Guard: only show this screen if the season is complete and the player won
  if (!player || completedEvents.length < EVENTS_PER_SEASON || !playerStanding || playerStanding.rank !== 1) {
    return <Navigate to="/play" replace />
  }

  const totalPts = playerStanding.totalPoints

  // Past championship wins + current one
  const champNum = careerHistory.filter(r => r.wonChampionship).length + 1

  function handleContinue() {
    completeSeason()
    navigate('/game/event-lobby')
  }

  function handleRetire() {
    completeSeason()
    retire()
    navigate('/retired')
  }

  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <div className={styles.vignette} />
      <div className={styles.goldWash} />

      {/* ── Fireworks ───────────────────────────────────────── */}
      <div className={styles.fireworks}>
        <div className={styles.burst} style={{ top: '18%', left: '12%' }} />
        <div className={styles.burst} style={{ top: '25%', right: '15%' }} />
        <div className={styles.burst} style={{ top: '40%', left: '8%' }} />
        <div className={styles.burst} style={{ top: '10%', right: '25%' }} />
        <div className={styles.burst} style={{ top: '55%', right: '10%' }} />
        <div className={styles.burst} style={{ top: '35%', left: '22%' }} />
      </div>

      <div className={styles.content}>

        {/* ── Gold reveal line ─────────────────────────────────── */}
        <div className={styles.revealLine} />

        {/* ── Crown ───────────────────────────────────────────── */}
        <div className={styles.crown}>WORLD CHAMPION</div>

        {/* ── Season badge ────────────────────────────────────── */}
        <div className={styles.seasonBadge}>Season {currentSeason}</div>

        {/* ── Player identity ─────────────────────────────────── */}
        <div className={styles.identity}>
          <Flag code={player.countryCode} className={styles.flag} />
          <span className={styles.playerName}>{player.name}</span>
        </div>

        {/* ── Points ──────────────────────────────────────────── */}
        <div className={styles.points}>
          <span className={styles.pointsValue}>{totalPts}</span>
          <span className={styles.pointsLabel}>championship points</span>
        </div>

        {/* ── Championship count ──────────────────────────────── */}
        <div className={styles.champCount}>
          {ordinal(champNum)} World Championship · Age {player.age}
        </div>

        {/* ── Spacer ──────────────────────────────────────────── */}
        <div className={styles.spacer} />

        {/* ── Actions ─────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <button className={styles.retireBtn} onClick={handleRetire}>Retire as Champion</button>
          <button className={styles.continueBtn} onClick={handleContinue}>Continue →</button>
        </div>

      </div>
    </div>
  )
}
