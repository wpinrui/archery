import { useMemo } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { computeRetirementHighlights } from '../store/helpers'
import { EVENT_BACKGROUNDS, EVENT_SCHEDULE } from '../types'
import type { MedalType, RetirementHighlight } from '../types'
import Flag from '../components/Flag'
import { posColor } from '../utils/posColor'
import styles from './RetirementScreen.module.scss'

// ── Constants ─────────────────────────────────────────────────────────

const SLIDE_SPACING = 3.0   // seconds between slide starts
const FIRST_DELAY = 0.5     // delay before the first slide
const CHAMP_DURATION = 4.0  // championship slide duration
const SLIDE_DURATION = 3.0  // regular slide duration
const EXIT_BUFFER = 0.5     // pause after last slide before overlay exits

const MEDAL_EMOJI: Record<MedalType, string> = { gold: '🥇', silver: '🥈', bronze: '🥉' }
const MEDAL_TITLE: Record<MedalType, string> = { gold: 'Gold Medal', silver: 'Silver Medal', bronze: 'Bronze Medal' }
const MEDAL_POS: Record<MedalType, number> = { gold: 1, silver: 2, bronze: 3 }

const eventNameMap = new Map(EVENT_SCHEDULE.map(e => [e.id, e.name]))

// ── Slide data ────────────────────────────────────────────────────────

interface SlideData {
  emoji: string
  title: string
  detail: string
  meta: string
  image: string
  isChamp: boolean
}

function highlightToSlide(
  h: RetirementHighlight,
  careerHistory: { season: number; wonChampionship: boolean }[],
): SlideData {
  if (h.type === 'medal') {
    return {
      emoji: MEDAL_EMOJI[h.medal],
      title: MEDAL_TITLE[h.medal],
      detail: eventNameMap.get(h.eventId) ?? h.eventId,
      meta: `Season ${h.season} · Age ${h.age}`,
      image: EVENT_BACKGROUNDS[h.eventId],
      isChamp: false,
    }
  }

  // Championship highlight
  const isChampion = h.bestPosition === 1
  let meta = `Season ${h.season} · Age ${h.age}`
  if (isChampion && h.timesWon > 1) {
    const winSeasons = careerHistory
      .filter(r => r.wonChampionship)
      .map(r => r.season)
    meta = `Seasons ${winSeasons.join(' & ')}`
  }

  return {
    emoji: '🏆',
    title: isChampion ? 'World Champion' : 'Best Championship Finish',
    detail: isChampion
      ? (h.timesWon > 1 ? `× ${h.timesWon}` : '')
      : `#${h.bestPosition}`,
    meta,
    image: '/champ.jpg',
    isChamp: true,
  }
}

// ── Component ─────────────────────────────────────────────────────────

export default function RetirementScreen() {
  const navigate = useNavigate()

  const phase = useGameStore(s => s.phase)
  const player = useGameStore(s => s.player)
  const careerHistory = useGameStore(s => s.careerHistory)
  const medalHistory = useGameStore(s => s.medalHistory)
  const resetCareer = useGameStore(s => s.resetCareer)

  // Guard: only accessible when retired
  if (!player || phase !== 'retired') {
    return <Navigate to="/play" replace />
  }

  const highlights = useMemo(
    () => computeRetirementHighlights(medalHistory, careerHistory),
    [medalHistory, careerHistory],
  )

  const slides = useMemo(
    () => highlights.map(h => highlightToSlide(h, careerHistory)),
    [highlights, careerHistory],
  )

  // Medal-only highlights for the pill strip
  const medalHighlights = useMemo(
    () => highlights.filter(h => h.type === 'medal') as Extract<RetirementHighlight, { type: 'medal' }>[],
    [highlights],
  )

  // ── Timing ──────────────────────────────────────────────────────────
  // Total children in overlay: 1 (title card) + slides.length
  const totalSlides = 1 + slides.length
  const lastSlideIndex = totalSlides - 1
  const lastDelay = FIRST_DELAY + lastSlideIndex * SLIDE_SPACING
  const lastIsChamp = slides.length > 0 && slides[slides.length - 1].isChamp
  const lastDuration = lastIsChamp ? CHAMP_DURATION : SLIDE_DURATION
  const overlayExitDelay = lastDelay + lastDuration + EXIT_BUFFER
  const summaryDelay = overlayExitDelay

  // ── Career stats ────────────────────────────────────────────────────
  const totalG = careerHistory.reduce((s, r) => s + r.medals.gold, 0)
  const totalS = careerHistory.reduce((s, r) => s + r.medals.silver, 0)
  const totalB = careerHistory.reduce((s, r) => s + r.medals.bronze, 0)
  const totalChamps = careerHistory.filter(r => r.wonChampionship).length
  const bestPos = careerHistory.length > 0
    ? Math.min(...careerHistory.map(r => r.championshipPosition))
    : null
  const totalPts = careerHistory.reduce((s, r) => s + r.championshipPoints, 0)

  function handleNewGame() {
    resetCareer()
    navigate('/country-selection')
  }

  return (
    <div className={styles.container}>
      {/* ── Shared background ──────────────────────────────── */}
      <div className={styles.bg} />
      <div className={styles.vignette} />

      {/* ── Phase 1: Full-screen highlight slides ──────────── */}
      <div
        className={styles.overlay}
        style={{ animationDelay: `${overlayExitDelay}s` }}
      >
        {/* Title card */}
        <div
          className={`${styles.slide} ${styles.titleSlide}`}
          style={{ animationDelay: `${FIRST_DELAY}s` }}
        >
          <span className={styles.titleSlideText}>Career Highlights</span>
        </div>

        {slides.map((s, i) => {
          const delay = FIRST_DELAY + (i + 1) * SLIDE_SPACING
          const isLast = i === slides.length - 1
          return (
            <div
              key={i}
              className={`${styles.slide} ${isLast && s.isChamp ? styles.slideChamp : ''}`}
              style={{ animationDelay: `${delay}s` }}
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
                  {s.detail && <span className={styles.slideDetail}>{s.detail}</span>}
                  <span className={styles.slideMeta}>{s.meta}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Phase 2: Retirement summary ────────────────────── */}
      <div
        className={styles.summary}
        style={{ animationDelay: `${summaryDelay}s` }}
      >

        {/* ── Identity header ──────────────────────────────── */}
        <div className={styles.header}>
          <div
            className={styles.revealLine}
            style={{ animationDelay: `${summaryDelay + 0.3}s` }}
          />
          <div className={styles.identity}>
            <Flag code={player.countryCode} className={styles.flag} />
            <span className={styles.playerName}>{player.name}</span>
          </div>
          <span className={styles.retiredLabel}>
            Retired at Age {player.age} · {careerHistory.length} {careerHistory.length === 1 ? 'Season' : 'Seasons'}
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

        {/* ── Concise highlights strip ─────────────────────── */}
        {medalHighlights.length > 0 && (
          <>
            <span className={styles.sectionLabel}>Career Highlights</span>
            <div className={styles.pillStrip}>
              {medalHighlights.map((h, i) => (
                <div key={i} className={styles.pill}>
                  <div className={styles.pillTop}>
                    <span className={styles.pillEmoji}>{MEDAL_EMOJI[h.medal]}</span>
                    <span className={styles.pillLabel}>{eventNameMap.get(h.eventId) ?? h.eventId}</span>
                  </div>
                  <span className={styles.pillPos} style={{ color: posColor(MEDAL_POS[h.medal]) }}>
                    #{MEDAL_POS[h.medal]}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

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

        {/* ── Actions ──────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <button className={styles.newGameBtn} onClick={handleNewGame}>New Game</button>
        </div>

      </div>
    </div>
  )
}
