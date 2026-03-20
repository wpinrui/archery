import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useGameStore } from '../store/gameStore'
import { expandDistances } from '../store/helpers'
import { EVENT_BACKGROUNDS } from '../types'
import type { Distance, Score } from '../types'
import type { EventLeaderboardRow } from '../types'
import Flag from '../components/Flag'
import styles from './ShootingHUDScreen.module.scss'

// ── Debug flag ──────────────────────────────────────────────────────
const DEBUG_TUNING = false

// ── Visual constants (presentation only — not tunable) ──────────────
const DISTANCE_TARGET_SIZE: Record<Distance, number> = {
  18: 450, 30: 412, 50: 375, 70: 337, 90: 300,
}
const DISTANCE_ZOOM_IN_MS: Record<Distance, number> = {
  18: 1200, 30: 1440, 50: 1728, 70: 2074, 90: 2488,
}
const BG_SCALE: Record<Distance, number> = {
  18: 1.5, 30: 1.35, 50: 1.2, 70: 1.1, 90: 1.05,
}
const ZOOM_SCALE = 5
const ZOOM_HOLD_MS = 1500
const ZOOM_OUT_MS = 700
const TIMER_MAX = 20

// ── Default tuning values ───────────────────────────────────────────
const DEFAULT_AMPLITUDE_FACTOR = 0.33
const DEFAULT_GRAVITY_FACTOR = 87
const DEFAULT_WIND_FACTOR = 5

// ── Helpers ─────────────────────────────────────────────────────────

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function windArrowsLabel(kmh: number, dir: 'left' | 'right') {
  const s = dir === 'left' ? '←' : '→'
  if (kmh <= 6) return s
  if (kmh <= 9) return `${s} ${s}`
  return `${s} ${s} ${s}`
}

function scoreColor(s: number): { bg: string; fg: string; display: string } {
  if (s >= 9) return { bg: '#c8a820', fg: '#1a1200', display: '#e8c84a' }
  if (s >= 7) return { bg: '#b83838', fg: '#fff', display: '#e06060' }
  if (s >= 5) return { bg: '#2e7da8', fg: '#fff', display: '#5ab4e0' }
  if (s >= 3) return { bg: '#2a2a2a', fg: '#eee', display: '#aaaaaa' }
  if (s >= 1) return { bg: '#c8c8c8', fg: '#1a1a1a', display: '#d8d8d8' }
  return { bg: '#444', fg: '#888', display: '#888' }
}

function windColor(kmh: number): string {
  if (kmh <= 3) return 'rgba(255,255,255,0.75)'
  if (kmh <= 6) return '#e8c84a'
  return '#e05a5a'
}

function distanceColor(m: number): string {
  const t = (m - 18) / (90 - 18)
  return `hsl(${Math.round(120 * (1 - t))}, 70%, 62%)`
}

function impactToScore(dx: number, dy: number, radius: number): number {
  const d = Math.sqrt(dx * dx + dy * dy) / radius
  if (d > 1.00) return 0
  if (d > 0.90) return 1
  if (d > 0.80) return 2
  if (d > 0.70) return 3
  if (d > 0.60) return 4
  if (d > 0.50) return 5
  if (d > 0.40) return 6
  if (d > 0.30) return 7
  if (d > 0.20) return 8
  if (d > 0.10) return 9
  return 10
}

function computeShake(t: number, amp: number) {
  const x = amp * (
    Math.sin(t * 1.1 + 0.5) * 0.40 + Math.sin(t * 2.3 + 1.2) * 0.25 +
    Math.sin(t * 0.4 + 2.1) * 0.25 + Math.sin(t * 3.7 + 0.8) * 0.10
  )
  const y = amp * (
    Math.sin(t * 0.9 + 1.8) * 0.40 + Math.sin(t * 1.7 + 0.3) * 0.25 +
    Math.sin(t * 0.5 + 1.5) * 0.25 + Math.sin(t * 2.9 + 2.4) * 0.10
  )
  return { x, y }
}

function makeTransform(cx: number, cy: number, scale: number) {
  return `translate(calc(-50% + ${-cx * scale}px), calc(-50% + ${-cy * scale}px)) scale(${scale})`
}

/** Linear ramp: 0 at 18 m, 1 at 90 m */
function distanceNorm(distance: Distance): number {
  return (distance - 18) / (90 - 18)
}

/** Gravity is distance-dependent: negligible at 18 m, significant at 90 m */
function gravityForDistance(distance: Distance, factor: number): number {
  return factor * distanceNorm(distance)
}

/** Wind scales with distance: 30% effect at 18 m, 100% at 90 m */
function windForDistance(distance: Distance, kmh: number, dir: 'left' | 'right', factor: number): number {
  return (dir === 'left' ? -1 : 1) * kmh * factor * (0.3 + 0.7 * distanceNorm(distance))
}

/** 5 rows centred on the player */
function getCompactLeaderboard(rows: EventLeaderboardRow[]): EventLeaderboardRow[] {
  const idx = rows.findIndex(r => r.isPlayer)
  if (idx === -1) return rows.slice(0, 5)
  const start = Math.max(0, Math.min(idx - 2, rows.length - 5))
  return rows.slice(start, start + 5)
}

// ── Types ───────────────────────────────────────────────────────────

interface ArrowHit { x: number; y: number; score: number; radius: number }

// ── Component ───────────────────────────────────────────────────────

export default function ShootingHUDScreen() {
  const navigate = useNavigate()

  // ── Store ─────────────────────────────────────────────────────────
  const player = useGameStore(s => s.player)
  const storeArrowIndex = useGameStore(s => s.currentArrowIndex)
  const getCurrentEvent = useGameStore(s => s.getCurrentEvent)
  const getEventLeaderboard = useGameStore(s => s.getEventLeaderboard)
  const recordShot = useGameStore(s => s.recordShot)
  const completeEvent = useGameStore(s => s.completeEvent)

  const currentEvent = getCurrentEvent()
  const arrowDistances = expandDistances(currentEvent.distances)
  const totalArrows = arrowDistances.length

  // ── Debug tuning state ────────────────────────────────────────────
  const [dbgShakiness, setDbgShakiness] = useState(player?.shakiness ?? 100)
  const [amplitudeFactor, setAmplitudeFactor] = useState(DEFAULT_AMPLITUDE_FACTOR)
  const [gravityFactor, setGravityFactor] = useState(DEFAULT_GRAVITY_FACTOR)
  const [windFactor, setWindFactor] = useState(DEFAULT_WIND_FACTOR)
  const [dbgDistanceOverride, setDbgDistanceOverride] = useState<Distance | null>(null)
  const [dbgWindDirOverride, setDbgWindDirOverride] = useState<'left' | 'right' | null>(null)
  const [dbgWindAmtOverride, setDbgWindAmtOverride] = useState<number | null>(null)
  const [exportJson, setExportJson] = useState<string | null>(null)
  const [showDbgCrosshair, setShowDbgCrosshair] = useState(true)

  // ── Core state ────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null)
  const shakeRafRef = useRef<number>(0)
  const zoomRafRef = useRef<number>(0)
  const t0Ref = useRef(performance.now())
  const timeoutResetRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const localArrowIdxRef = useRef(storeArrowIndex)
  const targetSizeRef = useRef(DISTANCE_TARGET_SIZE[arrowDistances[storeArrowIndex] ?? 18])

  const zoomStateRef = useRef<{
    startTime: number
    aimX: number; aimY: number
    impX: number; impY: number
    phase: 'in' | 'out'
    duration: number
  } | null>(null)

  const mouseRef = useRef({ x: 0, y: 0 })
  const shakeRef = useRef({ x: 0, y: 0 })
  const crosshairRef = useRef<HTMLDivElement>(null)
  const [timeLeft, setTimeLeft] = useState(TIMER_MAX)
  const [phase, setPhase] = useState<'distance' | 'idle' | 'ready' | 'result'>('distance')
  const [lastHit, setLastHit] = useState<ArrowHit | null>(null)
  const [showHole, setShowHole] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [localArrowIdx, setLocalArrowIdx] = useState(storeArrowIndex)
  const [expanded, setExpanded] = useState(false)
  const [targetXform, setTargetXform] = useState(makeTransform(0, 0, 1))
  const [timedOut, setTimedOut] = useState(false)
  const [wind, setWind] = useState<{ dir: 'left' | 'right'; kmh: number }>({ dir: 'left', kmh: 5 })

  // ── Derived values ────────────────────────────────────────────────
  const effectiveShakiness = DEBUG_TUNING ? dbgShakiness : (player?.shakiness ?? 100)
  const shakeAmplitude = effectiveShakiness * amplitudeFactor

  const currentDistance: Distance = (DEBUG_TUNING && dbgDistanceOverride)
    ? dbgDistanceOverride
    : (arrowDistances[localArrowIdx] ?? arrowDistances[arrowDistances.length - 1])

  const effectiveWindDir = (DEBUG_TUNING && dbgWindDirOverride) ? dbgWindDirOverride : wind.dir
  const effectiveWindKmh = (DEBUG_TUNING && dbgWindAmtOverride !== null) ? dbgWindAmtOverride : wind.kmh

  const currentTargetSize = DISTANCE_TARGET_SIZE[currentDistance]
  const bgScale = BG_SCALE[currentDistance]
  const urgent = timeLeft <= 5 && phase === 'ready'
  const timerPct = (timeLeft / TIMER_MAX) * 100
  const wColor = windColor(effectiveWindKmh)
  const dColor = distanceColor(currentDistance)
  const arrowNum = localArrowIdx + 1

  const leaderboard = getEventLeaderboard()
  const compactLb = getCompactLeaderboard(leaderboard)

  // ── Ref sync ──────────────────────────────────────────────────────
  useEffect(() => {
    localArrowIdxRef.current = localArrowIdx
    targetSizeRef.current = DISTANCE_TARGET_SIZE[currentDistance]
  }, [localArrowIdx, currentDistance])

  // ── Shake loop (writes directly to DOM — no React re-renders) ────
  useEffect(() => {
    const loop = () => {
      const t = (performance.now() - t0Ref.current) / 1000
      shakeRef.current = computeShake(t, shakeAmplitude)
      const el = crosshairRef.current
      if (el) {
        const m = mouseRef.current
        const s = shakeRef.current
        el.style.transform = `translate(calc(-50% + ${m.x + s.x}px), calc(-50% + ${m.y + s.y}px))`
      }
      shakeRafRef.current = requestAnimationFrame(loop)
    }
    shakeRafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(shakeRafRef.current)
  }, [shakeAmplitude])

  // ── Wind drift ────────────────────────────────────────────────────
  useEffect(() => {
    if (DEBUG_TUNING && (dbgWindDirOverride !== null || dbgWindAmtOverride !== null)) return
    const start = performance.now()
    const id = setInterval(() => {
      const t = (performance.now() - start) / 1000
      const vel = 4 * Math.sin(t * 0.1 + 1.0) + 1.5 * Math.sin(t * 0.23 + 0.5) + 0.8 * Math.sin(t * 0.07 + 2.1)
      const dir: 'left' | 'right' = vel <= 0 ? 'left' : 'right'
      const kmh = Math.abs(vel)
      setWind({ dir, kmh })
    }, 250)
    return () => clearInterval(id)
  }, [dbgWindDirOverride, dbgWindAmtOverride])

  // ── Distance transition ───────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'distance') return
    const id = setTimeout(() => setPhase('idle'), 2000)
    return () => clearTimeout(id)
  }, [phase])

  // ── Timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'ready' || DEBUG_TUNING) return
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [phase])

  // ── Advance to next arrow or complete event ───────────────────────
  const advanceArrow = useCallback(() => {
    // Debug mode: stay on arrow 1, just reset to idle
    if (DEBUG_TUNING) {
      setTimedOut(false)
      setShowScore(false)
      setShowHole(false)
      setLastHit(null)
      setTimeLeft(TIMER_MAX)
      setPhase('idle')
      return
    }

    const curIdx = localArrowIdxRef.current
    const nextIdx = curIdx + 1

    if (nextIdx >= totalArrows) {
      completeEvent()
      navigate('/game/post-event')
      return
    }

    const prevDist = arrowDistances[curIdx]
    const nextDist = arrowDistances[nextIdx]
    localArrowIdxRef.current = nextIdx
    setLocalArrowIdx(nextIdx)
    setTimedOut(false)
    setShowScore(false)
    setShowHole(false)
    setLastHit(null)
    setTimeLeft(TIMER_MAX)
    setPhase(nextDist !== prevDist ? 'distance' : 'idle')
  }, [totalArrows, arrowDistances, completeEvent, navigate])

  // ── Timeout ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'ready' || timeLeft > 0) return
    setTimedOut(true)
    setShowScore(true)
    setPhase('result')
    recordShot(0 as Score)
    timeoutResetRef.current = setTimeout(advanceArrow, 2000)
  }, [phase, timeLeft, recordShot, advanceArrow])

  useEffect(() => () => { if (timeoutResetRef.current) clearTimeout(timeoutResetRef.current) }, [])

  // ── Mouse tracking (writes to ref + updates crosshair DOM) ───────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const ctr = containerRef.current
      if (!ctr) return
      const r = ctr.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 }
      const el = crosshairRef.current
      if (el) {
        const m = mouseRef.current
        const s = shakeRef.current
        el.style.transform = `translate(calc(-50% + ${m.x + s.x}px), calc(-50% + ${m.y + s.y}px))`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── Zoom animation ────────────────────────────────────────────────
  const runZoom = useCallback(() => {
    const z = zoomStateRef.current
    if (!z) return

    const t = Math.min((performance.now() - z.startTime) / z.duration, 1)

    if (z.phase === 'in') {
      const scale = 1 + (ZOOM_SCALE - 1) * easeInOut(t)
      const drift = t * t
      const cx = z.impX * drift
      const cy = z.impY * drift
      setTargetXform(makeTransform(cx, cy, scale))

      if (t < 1) {
        zoomRafRef.current = requestAnimationFrame(runZoom)
      } else {
        setShowHole(true)
        setTimeout(() => setShowScore(true), 400)
        setTimeout(() => {
          zoomStateRef.current = { ...z, phase: 'out', startTime: performance.now(), duration: ZOOM_OUT_MS }
          zoomRafRef.current = requestAnimationFrame(runZoom)
        }, ZOOM_HOLD_MS)
      }
    } else {
      const scale = ZOOM_SCALE + (1 - ZOOM_SCALE) * easeInOut(t)
      const cx = z.impX * (1 - t)
      const cy = z.impY * (1 - t)
      setTargetXform(makeTransform(cx, cy, scale))

      if (t < 1) {
        zoomRafRef.current = requestAnimationFrame(runZoom)
      } else {
        setTargetXform(makeTransform(0, 0, 1))
        zoomStateRef.current = null
        advanceArrow()
      }
    }
  }, [advanceArrow])

  // ── Fire ──────────────────────────────────────────────────────────
  const fire = useCallback(() => {
    if (phase !== 'ready') return

    const radius = targetSizeRef.current / 2
    const gravPx = gravityForDistance(currentDistance, gravityFactor)
    const windOff = windForDistance(currentDistance, effectiveWindKmh, effectiveWindDir, windFactor)
    const m = mouseRef.current
    const s = shakeRef.current
    const aimX = m.x + s.x
    const aimY = m.y + s.y
    const impX = aimX + windOff
    const impY = aimY + gravPx
    const score = impactToScore(impX, impY, radius) as Score

    setLastHit({ x: impX, y: impY, score, radius })
    setShowHole(false)
    setShowScore(false)
    setPhase('result')
    if (!DEBUG_TUNING) recordShot(score)

    const zoomInMs = DISTANCE_ZOOM_IN_MS[currentDistance]
    cancelAnimationFrame(zoomRafRef.current)
    zoomStateRef.current = {
      startTime: performance.now(),
      aimX, aimY, impX, impY,
      phase: 'in',
      duration: zoomInMs,
    }
    zoomRafRef.current = requestAnimationFrame(runZoom)
  }, [phase, effectiveWindDir, effectiveWindKmh, currentDistance, gravityFactor, windFactor, recordShot, runZoom])

  useEffect(() => {
    window.addEventListener('click', fire)
    return () => window.removeEventListener('click', fire)
  }, [fire])

  useEffect(() => () => cancelAnimationFrame(zoomRafRef.current), [])

  // ── Export tuning values ──────────────────────────────────────────
  const handleExport = () => {
    setExportJson(JSON.stringify({
      amplitudeFactor,
      gravityFactor,
      windFactor,
      testShakiness: dbgShakiness,
      notes: {
        shakeAmplitude: `shakiness * ${amplitudeFactor} = amplitude_px`,
        gravity: `gravity_px = ${gravityFactor} * (distance - 18) / 72`,
        wind: `wind_offset_px = kmh * ${windFactor} * (0.3 + 0.7 * (distance - 18) / 72)`,
      },
    }, null, 2))
  }

  // ── Guard: redirect if no active career ────────────────────────────
  if (!player) return <Navigate to="/" replace />

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${phase === 'ready' ? styles.aiming : ''}`}
    >
      <div className={styles.bg} style={{ transform: `scale(${bgScale})`, backgroundImage: `url('${EVENT_BACKGROUNDS[currentEvent.id]}')` }} />
      <div className={styles.vignette} />

      {/* Top-left: event + arrow count */}
      <div className={styles.topLeft}>
        <div className={styles.eventLabel}>{currentEvent.name}</div>
        <div className={styles.arrowCount}>Arrow {arrowNum} / {totalArrows}</div>
      </div>

      {/* Centre top: wind + distance */}
      <div className={styles.centerTop}>
        <div className={styles.windCard} style={{ borderColor: wColor, color: wColor }}>
          <span className={styles.windArrows}>{windArrowsLabel(effectiveWindKmh, effectiveWindDir)}</span>
          <span className={styles.windVal}>{effectiveWindKmh.toFixed(1)} km/h</span>
        </div>
        <div className={styles.distanceCard} style={{ borderColor: dColor, color: dColor }}>
          {currentDistance}m
        </div>
      </div>

      {/* Timer */}
      <div className={`${styles.timerWrap} ${urgent ? styles.urgent : ''}`}>
        <span className={styles.timerNum}>{String(timeLeft).padStart(2, '0')}</span>
        <div className={styles.timerTrack}>
          <div className={styles.timerFill} style={{ width: `${timerPct}%` }} />
        </div>
      </div>

      {/* Target */}
      <div className={styles.targetWrap} style={{ transform: targetXform }}>
        <div className={styles.target} style={{ width: currentTargetSize, height: currentTargetSize }}>
          <img src="/target.svg" width={currentTargetSize} height={currentTargetSize} draggable={false} alt="target" />
          {showHole && lastHit && (() => {
            const r = lastHit.radius
            const hx = r + Math.max(-r + 3, Math.min(r - 3, lastHit.x))
            const hy = r + Math.max(-r + 3, Math.min(r - 3, lastHit.y))
            return <div className={styles.hole} style={{ left: hx - 3, top: hy - 3 }} />
          })()}
        </div>
      </div>

      {/* Crosshair */}
      {phase === 'ready' && (
        <div
          ref={crosshairRef}
          className={styles.crosshair}
          aria-hidden
        >
          <div className={`${styles.arm} ${styles.armTop}`} />
          <div className={`${styles.arm} ${styles.armBottom}`} />
          <div className={`${styles.arm} ${styles.armLeft}`} />
          <div className={`${styles.arm} ${styles.armRight}`} />
        </div>
      )}

      {/* Debug: bullseye compensation crosshair */}
      {DEBUG_TUNING && showDbgCrosshair && phase === 'ready' && (() => {
        const gravPx = gravityForDistance(currentDistance, gravityFactor)
        const windOff = windForDistance(currentDistance, effectiveWindKmh, effectiveWindDir, windFactor)
        const compX = -windOff
        const compY = -gravPx
        return (
          <div
            className={styles.dbgCrosshair}
            style={{ transform: `translate(calc(-50% + ${compX}px), calc(-50% + ${compY}px))` }}
            aria-hidden
          >
            <div className={`${styles.dbgArm} ${styles.dbgArmTop}`} />
            <div className={`${styles.dbgArm} ${styles.dbgArmBottom}`} />
            <div className={`${styles.dbgArm} ${styles.dbgArmLeft}`} />
            <div className={`${styles.dbgArm} ${styles.dbgArmRight}`} />
          </div>
        )
      })()}

      {/* Ready button */}
      {phase === 'idle' && (
        <button className={styles.readyBtn} onClick={e => { e.stopPropagation(); setPhase('ready') }}>
          Ready
        </button>
      )}

      {/* Timeout result */}
      {showScore && timedOut && (
        <div className={styles.resultOverlay} key={`timeout-${arrowNum}`}>
          <span className={styles.resultMessage} style={{ color: 'var(--danger)' }}>TIME&apos;S UP</span>
        </div>
      )}

      {/* Score result */}
      {showScore && lastHit && !timedOut && (() => {
        const sc = scoreColor(lastHit.score)
        return (
          <div className={styles.resultOverlay} key={arrowNum}>
            <span className={styles.resultScore} style={{ color: sc.display }}>{lastHit.score}</span>
            {lastHit.score === 10 && <span className={styles.resultTag}>GOLD</span>}
            {lastHit.score === 0 && <span className={styles.resultTag}>MISS</span>}
          </div>
        )
      })()}

      {/* Leaderboard */}
      <div className={styles.lb} onClick={e => e.stopPropagation()}>
        <button className={styles.lbHeader} onClick={() => setExpanded(e => !e)}>
          <span>Standings</span>
          <span className={styles.lbToggle}>{expanded ? '▾' : '▴'}</span>
        </button>
        <div className={`${styles.lbBody} ${expanded ? styles.lbExpanded : ''}`}>
          {(expanded ? leaderboard : compactLb).map(r => (
            <div key={r.rank} className={`${styles.lbRow} ${r.isPlayer ? styles.lbPlayer : ''}`}>
              <span className={styles.lbRank}>{r.rank}</span>
              <Flag code={r.countryCode} className={styles.lbFlag} />
              <span className={styles.lbName}>{r.name}</span>
              <span className={styles.lbRecent}>
                {r.recentScores.map((s, i) => {
                  const sc = scoreColor(s)
                  return <span key={i} className={styles.lbRecentScore} style={{ background: sc.bg, color: sc.fg }}>{s}</span>
                })}
              </span>
              <span className={styles.lbPts}>{r.runningTotal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Distance transition overlay */}
      {phase === 'distance' && (
        <div className={styles.distanceOverlay} key={currentDistance}>
          <div className={styles.distancePanel} style={{ borderColor: dColor }}>
            <span className={styles.distanceLabel}>Distance</span>
            <span className={styles.distancePanelValue} style={{ color: dColor }}>{currentDistance}m</span>
          </div>
        </div>
      )}

      {/* Debug tuning panel */}
      {DEBUG_TUNING && (
        <div className={styles.debugPanel} onClick={e => e.stopPropagation()}>
          <div className={styles.debugTitle}>Tuning Panel</div>

          <label className={styles.debugLabel}>
            Shakiness: {dbgShakiness}
            <input type="range" min={0} max={500} step={1} value={dbgShakiness}
              onChange={e => setDbgShakiness(Number(e.target.value))} />
          </label>

          <label className={styles.debugLabel}>
            Amplitude factor: {amplitudeFactor.toFixed(2)}
            <input type="range" min={0} max={1} step={0.01} value={amplitudeFactor}
              onChange={e => setAmplitudeFactor(Number(e.target.value))} />
          </label>

          <label className={styles.debugLabel}>
            Gravity factor: {gravityFactor}
            <input type="range" min={0} max={100} step={1} value={gravityFactor}
              onChange={e => setGravityFactor(Number(e.target.value))} />
          </label>

          <label className={styles.debugLabel}>
            Wind factor: {windFactor.toFixed(2)}
            <input type="range" min={0} max={5} step={0.05} value={windFactor}
              onChange={e => setWindFactor(Number(e.target.value))} />
          </label>

          <div className={styles.debugDivider} />

          <label className={styles.debugLabel}>
            Distance override:
            <select
              value={dbgDistanceOverride ?? 'auto'}
              onChange={e => setDbgDistanceOverride(
                e.target.value === 'auto' ? null : Number(e.target.value) as Distance,
              )}
            >
              <option value="auto">Auto</option>
              {([18, 30, 50, 70, 90] as Distance[]).map(d => (
                <option key={d} value={d}>{d}m</option>
              ))}
            </select>
          </label>

          <label className={styles.debugLabel}>
            Wind direction override:
            <select
              value={dbgWindDirOverride ?? 'auto'}
              onChange={e => setDbgWindDirOverride(
                e.target.value === 'auto' ? null : e.target.value as 'left' | 'right',
              )}
            >
              <option value="auto">Auto</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </label>

          <label className={styles.debugLabel}>
            Wind amount: {dbgWindAmtOverride !== null ? `${dbgWindAmtOverride.toFixed(1)} km/h` : 'Auto'}
            <input type="range" min={0} max={15} step={0.5}
              value={dbgWindAmtOverride ?? 5}
              onChange={e => setDbgWindAmtOverride(Number(e.target.value))} />
            {dbgWindAmtOverride !== null && (
              <button className={styles.debugAutoBtn} onClick={() => setDbgWindAmtOverride(null)}>
                Reset to Auto
              </button>
            )}
          </label>

          <div className={styles.debugDivider} />

          <div className={styles.debugInfo}>
            <div>Eff. amplitude: {shakeAmplitude.toFixed(1)}px</div>
            <div>Gravity @ {currentDistance}m: {gravityForDistance(currentDistance, gravityFactor).toFixed(1)}px</div>
            <div>Wind: {effectiveWindKmh.toFixed(1)} km/h {effectiveWindDir} → {Math.abs(windForDistance(currentDistance, effectiveWindKmh, effectiveWindDir, windFactor)).toFixed(1)}px</div>
          </div>

          <button className={styles.debugAutoBtn} onClick={() => setShowDbgCrosshair(v => !v)}>
            {showDbgCrosshair ? 'Hide' : 'Show'} Bullseye Crosshair
          </button>

          <div className={styles.debugDivider} />

          <button className={styles.debugExportBtn} onClick={handleExport}>
            Export Values
          </button>

          {exportJson && (
            <pre className={styles.debugExportPre}>{exportJson}</pre>
          )}
        </div>
      )}
    </div>
  )
}
