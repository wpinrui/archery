import Flag from '../../components/Flag'
import styles from './styles.module.scss'

// ── Data ──────────────────────────────────────────────────────────────

const PLAYER_NAME = 'Player One'
const PLAYER_CODE = 'ZAF'
const SEASON      = 9
const PLAYER_AGE  = 26
const TOTAL_PTS   = 445
const CHAMP_NUM   = 2   // 2nd career championship (back-to-back)

function ordinal(n: number): string {
  if (n === 1) return '1st'
  if (n === 2) return '2nd'
  if (n === 3) return '3rd'
  return `${n}th`
}

// ── Component ─────────────────────────────────────────────────────────

export default function VictoryScreen() {
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
        <div className={styles.seasonBadge}>Season {SEASON}</div>

        {/* ── Player identity ─────────────────────────────────── */}
        <div className={styles.identity}>
          <Flag code={PLAYER_CODE} className={styles.flag} />
          <span className={styles.playerName}>{PLAYER_NAME}</span>
        </div>

        {/* ── Points ──────────────────────────────────────────── */}
        <div className={styles.points}>
          <span className={styles.pointsValue}>{TOTAL_PTS}</span>
          <span className={styles.pointsLabel}>championship points</span>
        </div>

        {/* ── Championship count ──────────────────────────────── */}
        <div className={styles.champCount}>
          {ordinal(CHAMP_NUM)} World Championship · Age {PLAYER_AGE}
        </div>

        {/* ── Spacer ──────────────────────────────────────────── */}
        <div className={styles.spacer} />

        {/* ── Actions ─────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <button className={styles.retireBtn}>Retire as Champion</button>
          <button className={styles.continueBtn}>Continue →</button>
        </div>

      </div>
    </div>
  )
}
