import Flag from '../../components/Flag'
import styles from './styles.module.scss'

// ── Types ──────────────────────────────────────────────────────────────

interface SeasonRecord {
  season: number
  age:    number
  pos:    number
  pts:    number
  medals: { g: number; s: number; b: number }
  champ:  boolean
}

// ── Career data (same arc as CareerScreen) ─────────────────────────────
// 15 seasons: early struggle → peak (2 championships) → aging decline

const CAREER: SeasonRecord[] = [
  { season:  1, age: 18, pos: 38, pts:  12, medals: { g:0, s:0, b:0 }, champ: false },
  { season:  2, age: 19, pos: 31, pts:  15, medals: { g:0, s:0, b:0 }, champ: false },
  { season:  3, age: 20, pos: 25, pts:  30, medals: { g:0, s:0, b:1 }, champ: false },
  { season:  4, age: 21, pos: 14, pts:  62, medals: { g:0, s:1, b:1 }, champ: false },
  { season:  5, age: 22, pos:  8, pts: 170, medals: { g:1, s:1, b:1 }, champ: false },
  { season:  6, age: 23, pos:  4, pts: 285, medals: { g:2, s:1, b:1 }, champ: false },
  { season:  7, age: 24, pos:  2, pts: 365, medals: { g:2, s:2, b:0 }, champ: false },
  { season:  8, age: 25, pos:  1, pts: 420, medals: { g:3, s:1, b:0 }, champ: true  },
  { season:  9, age: 26, pos:  1, pts: 445, medals: { g:2, s:2, b:1 }, champ: true  },
  { season: 10, age: 27, pos:  3, pts: 340, medals: { g:1, s:2, b:1 }, champ: false },
  { season: 11, age: 28, pos:  8, pts: 172, medals: { g:0, s:1, b:1 }, champ: false },
  { season: 12, age: 29, pos: 15, pts:  68, medals: { g:0, s:0, b:1 }, champ: false },
  { season: 13, age: 30, pos: 22, pts:  28, medals: { g:0, s:0, b:0 }, champ: false },
  { season: 14, age: 31, pos: 28, pts:  18, medals: { g:0, s:0, b:0 }, champ: false },
  { season: 15, age: 32, pos: 36, pts:   9, medals: { g:0, s:0, b:0 }, champ: false },
]

const PLAYER_NAME = 'Player One'
const PLAYER_CODE = 'ZAF'
const RETIRE_AGE  = 32

// ── Highlight slides ───────────────────────────────────────────────────
// Ascending order of greatness: bronze → silver → gold → gold → championship
// Per GDD: 4 individual event medals, then best championship finish with count

const SLIDES = [
  { emoji: '🥉', title: 'Bronze Medal',   detail: 'Cape Town Cup',     meta: 'Season 3 · Age 20', image: '/trees-capetown.jpg', eventPos: 3 },
  { emoji: '🥈', title: 'Silver Medal',   detail: 'Paris Open',        meta: 'Season 4 · Age 21', image: '/trees-paris.jpg',    eventPos: 2 },
  { emoji: '🥇', title: 'Gold Medal',     detail: 'Seoul Cup',         meta: 'Season 5 · Age 22', image: '/trees-seoul.jpg',    eventPos: 1 },
  { emoji: '🥇', title: 'Gold Medal',     detail: 'Las Vegas Classic', meta: 'Season 8 · Age 25', image: '/trees-vegas.jpg',    eventPos: 1 },
  { emoji: '🏆', title: 'World Champion', detail: '× 2',              meta: 'Seasons 8 & 9',     image: '/champ.jpg',          eventPos: 1 },
]

// ── Helpers ────────────────────────────────────────────────────────────

function posColor(pos: number): string {
  if (pos === 1) return '#e8c84a'
  if (pos === 2) return '#9eb8cc'
  if (pos === 3) return '#c8824a'
  return 'rgba(255,255,255,0.75)'
}

// ── Component ──────────────────────────────────────────────────────────

export default function RetirementScreen() {
  const totalG      = CAREER.reduce((s, r) => s + r.medals.g, 0)
  const totalS      = CAREER.reduce((s, r) => s + r.medals.s, 0)
  const totalB      = CAREER.reduce((s, r) => s + r.medals.b, 0)
  const totalChamps = CAREER.filter(r => r.champ).length
  const bestPos     = Math.min(...CAREER.map(r => r.pos))
  const totalPts    = CAREER.reduce((s, r) => s + r.pts, 0)

  return (
    <div className={styles.container}>
      {/* ── Shared background ──────────────────────────────── */}
      <div className={styles.bg} />
      <div className={styles.vignette} />

      {/* ── Phase 1: Full-screen highlight slides ──────────── */}
      <div className={styles.overlay}>
        {/* Title card — context before the highlights begin */}
        <div className={`${styles.slide} ${styles.titleSlide}`}>
          <span className={styles.titleSlideText}>Career Highlights</span>
        </div>

        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`${styles.slide} ${i === 4 ? styles.slideChamp : ''}`}
          >
            <div className={styles.slideCard}>
              {/* Event photo with gradient fade */}
              <div
                className={styles.slidePhoto}
                style={{ backgroundImage: `url(${s.image})` }}
              >
                <div className={styles.slidePhotoFade} />
              </div>

              {/* Accomplishment */}
              <div className={styles.slideContent}>
                <span className={styles.slideEmoji}>{s.emoji}</span>
                <span className={styles.slideTitle}>{s.title}</span>
                <span className={styles.slideDetail}>{s.detail}</span>
                <span className={styles.slideMeta}>{s.meta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Phase 2: Retirement summary ────────────────────── */}
      <div className={styles.summary}>

        {/* ── Identity header ──────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.revealLine} />
          <div className={styles.identity}>
            <Flag code={PLAYER_CODE} className={styles.flag} />
            <span className={styles.playerName}>{PLAYER_NAME}</span>
          </div>
          <span className={styles.retiredLabel}>
            Retired at Age {RETIRE_AGE} · {CAREER.length} Seasons
          </span>
        </div>

        {/* ── Career stat strip ────────────────────────────── */}
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
            <span className={styles.statValue} style={{ color: posColor(bestPos) }}>
              #{bestPos}
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

        {/* ── Concise highlights strip ─────────────────────── */}
        <span className={styles.sectionLabel}>Career Highlights</span>
        <div className={styles.pillStrip}>
          {SLIDES.slice(0, 4).map((s, i) => (
            <div key={i} className={styles.pill}>
              <div className={styles.pillTop}>
                <span className={styles.pillEmoji}>{s.emoji}</span>
                <span className={styles.pillLabel}>{s.detail}</span>
              </div>
              <span className={styles.pillPos} style={{ color: posColor(s.eventPos) }}>
                #{s.eventPos}
              </span>
            </div>
          ))}
        </div>

        {/* ── Full career record ───────────────────────────── */}
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
              {CAREER.map(rec => {
                const hasMedals = rec.medals.g + rec.medals.s + rec.medals.b > 0
                return (
                  <div
                    key={rec.season}
                    className={`${styles.row} ${rec.champ ? styles.champRow : ''}`}
                  >
                    <span className={styles.cSeason}>{rec.season}</span>
                    <span className={styles.cAge}>{rec.age}</span>

                    <div className={styles.cPos}>
                      <span style={{ color: posColor(rec.pos) }}>#{rec.pos}</span>
                    </div>

                    <span className={styles.cPts}>{rec.pts}</span>

                    <div className={styles.cMedals}>
                      {hasMedals ? (
                        <>
                          {rec.medals.g > 0 && (
                            <span className={`${styles.medalCircle} ${styles.medalCircleG}`}>
                              {rec.medals.g}
                            </span>
                          )}
                          {rec.medals.s > 0 && (
                            <span className={`${styles.medalCircle} ${styles.medalCircleS}`}>
                              {rec.medals.s}
                            </span>
                          )}
                          {rec.medals.b > 0 && (
                            <span className={`${styles.medalCircle} ${styles.medalCircleB}`}>
                              {rec.medals.b}
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

      </div>
    </div>
  )
}
