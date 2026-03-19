import { useEffect, useRef, useState, useCallback } from 'react'
import Flag from 'react-world-flags'
import styles from './styles.module.scss'

// ── Config ───────────────────────────────────────────────────────────
const ARROW_DISTANCES: Record<number, number> = {
  1: 18, 2: 18, 3: 30, 4: 30, 5: 50, 6: 50, 7: 70, 8: 70, 9: 90, 10: 90,
}
// Target size per distance — mildly bigger when closer, not linear (avoids 18m looking absurd)
const DISTANCE_TARGET_SIZE: Record<number, number> = {
  18: 350, 30: 312, 50: 275, 70: 237, 90: 200,
}
// Arrow flight zoom: 20% longer per distance step (18m fastest, 90m slowest)
const DISTANCE_ZOOM_IN_MS: Record<number, number> = {
  18: 1200, 30: 1440, 50: 1728, 70: 2074, 90: 2488,
}
const SHAKE_AMP   = 28
const TIMER_MAX   = 20
const GRAVITY_PX  = 30
const KMH_TO_PX   = 1.25
const ZOOM_SCALE   = 5
const ZOOM_HOLD_MS = 1500
const ZOOM_OUT_MS = 700

// ── Helpers ───────────────────────────────────────────────────────────
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function windArrows(kmh: number, dir: 'left' | 'right') {
  const s = dir === 'left' ? '←' : '→'
  if (kmh <= 6) return s
  if (kmh <= 9) return `${s} ${s}`
  return `${s} ${s} ${s}`
}

function scoreColor(s: number): { bg: string; fg: string; display: string } {
  if (s >= 9) return { bg: '#c8a820', fg: '#1a1200', display: '#e8c84a' }  // gold ring
  if (s >= 7) return { bg: '#b83838', fg: '#fff',    display: '#e06060' }  // red ring
  if (s >= 5) return { bg: '#2e7da8', fg: '#fff',    display: '#5ab4e0' }  // blue ring — lighter for dark bg
  if (s >= 3) return { bg: '#2a2a2a', fg: '#eee',    display: '#aaaaaa' }  // black ring
  if (s >= 1) return { bg: '#c8c8c8', fg: '#1a1a1a', display: '#d8d8d8' }  // white ring
  return { bg: '#444', fg: '#888',    display: '#888' }                     // miss
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

// ── Mock data ─────────────────────────────────────────────────────────
interface LbRow { rank: number; name: string; code: string; pts: number; recent: number[]; isPlayer: boolean }

const LB_COMPACT: LbRow[] = [
  { rank: 3, name: 'Chen Wei',    code: 'CHN', pts: 53, recent: [9, 8, 9], isPlayer: false },
  { rank: 4, name: 'A. Nakamura', code: 'JPN', pts: 51, recent: [8, 9, 7], isPlayer: false },
  { rank: 5, name: 'YOU',         code: 'ZAF', pts: 48, recent: [],        isPlayer: true  },
  { rank: 6, name: 'L. Mäkinen',  code: 'FIN', pts: 47, recent: [7, 8, 8], isPlayer: false },
  { rank: 7, name: 'P. Okonkwo',  code: 'NGA', pts: 45, recent: [7, 7, 8], isPlayer: false },
]

const LB_FULL: LbRow[] = [
  { rank:  1, name: 'J. Visser',    code: 'NLD', pts: 58, recent: [10, 9, 10], isPlayer: false },
  { rank:  2, name: 'M. Rossi',     code: 'ITA', pts: 55, recent: [9, 9, 8],  isPlayer: false },
  { rank:  3, name: 'Chen Wei',     code: 'CHN', pts: 53, recent: [9, 8, 9],  isPlayer: false },
  { rank:  4, name: 'A. Nakamura',  code: 'JPN', pts: 51, recent: [8, 9, 7],  isPlayer: false },
  { rank:  5, name: 'YOU',          code: 'ZAF', pts: 48, recent: [],          isPlayer: true  },
  { rank:  6, name: 'L. Mäkinen',   code: 'FIN', pts: 47, recent: [7, 8, 8],  isPlayer: false },
  { rank:  7, name: 'P. Okonkwo',   code: 'NGA', pts: 45, recent: [7, 7, 8],  isPlayer: false },
  { rank:  8, name: 'H. Schmidt',   code: 'DEU', pts: 44, recent: [8, 7, 6],  isPlayer: false },
  { rank:  9, name: 'S. Park',      code: 'KOR', pts: 42, recent: [7, 6, 8],  isPlayer: false },
  { rank: 10, name: 'K. Mbeki',     code: 'ZMB', pts: 41, recent: [6, 7, 7],  isPlayer: false },
  { rank: 11, name: 'T. Bergström', code: 'SWE', pts: 39, recent: [7, 6, 6],  isPlayer: false },
  { rank: 12, name: 'R. Novák',     code: 'CZE', pts: 37, recent: [6, 6, 7],  isPlayer: false },
]

interface ArrowHit { x: number; y: number; score: number; radius: number }

// ── Component ─────────────────────────────────────────────────────────
export default function ShootingHUD() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shakeRafRef     = useRef<number>(0)
  const zoomRafRef      = useRef<number>(0)
  const t0Ref           = useRef(performance.now())
  const timeoutResetRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const arrowNumRef     = useRef(1)
  const targetSizeRef   = useRef(DISTANCE_TARGET_SIZE[18])

  // Zoom animation state stored in a ref to avoid stale closures
  const zoomStateRef = useRef<{
    startTime: number
    aimX: number; aimY: number
    impX: number; impY: number
    phase: 'in' | 'out'
    duration: number
  } | null>(null)

  const [mouse,        setMouse]        = useState({ x: 0, y: 0 })
  const [shake,        setShake]        = useState({ x: 0, y: 0 })
  const [timeLeft,     setTimeLeft]     = useState(TIMER_MAX)
  const [phase,        setPhase]        = useState<'distance' | 'idle' | 'ready' | 'result'>('distance')
  const [lastHit,      setLastHit]      = useState<ArrowHit | null>(null)
  const [showHole,     setShowHole]     = useState(false)
  const [showScore,    setShowScore]    = useState(false)
  const [arrowNum,     setArrowNum]     = useState(1)
  const [expanded,     setExpanded]     = useState(false)
  const [recentScores, setRecentScores] = useState<number[]>([])
  const [targetXform,  setTargetXform]  = useState(makeTransform(0, 0, 1))
  const [timedOut,     setTimedOut]     = useState(false)
  const [wind,         setWind]         = useState<{ dir: 'left' | 'right'; kmh: number }>({ dir: 'left', kmh: 5 })

  // Shake loop
  useEffect(() => {
    const loop = () => {
      const t = (performance.now() - t0Ref.current) / 1000
      setShake(computeShake(t, SHAKE_AMP))
      shakeRafRef.current = requestAnimationFrame(loop)
    }
    shakeRafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(shakeRafRef.current)
  }, [])

  // Wind drift — single signed velocity so direction only changes through near-calm
  useEffect(() => {
    const start = performance.now()
    const id = setInterval(() => {
      const t      = (performance.now() - start) / 1000
      const vel    = 4 * Math.sin(t * 0.1 + 1.0) + 1.5 * Math.sin(t * 0.23 + 0.5) + 0.8 * Math.sin(t * 0.07 + 2.1)
      const dir: 'left' | 'right' = vel <= 0 ? 'left' : 'right'
      const kmh    = Math.abs(vel)
      setWind({ dir, kmh })
    }, 250)
    return () => clearInterval(id)
  }, [])

  // Keep refs in sync so RAF/timeout callbacks can read them without stale closures
  useEffect(() => {
    arrowNumRef.current   = arrowNum
    targetSizeRef.current = DISTANCE_TARGET_SIZE[ARROW_DISTANCES[arrowNum]]
  }, [arrowNum])

  // Distance transition — auto-advances to idle after 2s
  useEffect(() => {
    if (phase !== 'distance') return
    const id = setTimeout(() => setPhase('idle'), 2000)
    return () => clearTimeout(id)
  }, [phase])

  // Timer
  useEffect(() => {
    if (phase !== 'ready') return
    const id = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [phase])

  // Timeout — triggers when timer hits 0 while in ready phase
  // ID stored in ref so the re-render caused by setPhase doesn't cancel it via cleanup
  useEffect(() => {
    if (phase !== 'ready' || timeLeft > 0) return
    setTimedOut(true)
    setShowScore(true)
    setPhase('result')
    timeoutResetRef.current = setTimeout(() => {
      const cur  = arrowNumRef.current
      const next = Math.min(cur + 1, 10)
      arrowNumRef.current = next
      setTimedOut(false)
      setShowScore(false)
      setTimeLeft(TIMER_MAX)
      setArrowNum(next)
      setPhase(ARROW_DISTANCES[next] !== ARROW_DISTANCES[cur] ? 'distance' : 'idle')
    }, 2000)
  }, [phase, timeLeft])

  useEffect(() => () => { if (timeoutResetRef.current) clearTimeout(timeoutResetRef.current) }, [])

  // Mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      setMouse({ x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // RAF zoom animation
  const runZoom = useCallback(() => {
    const z = zoomStateRef.current
    if (!z) return

    const t = Math.min((performance.now() - z.startTime) / z.duration, 1)

    if (z.phase === 'in') {
      const scale  = 1 + (ZOOM_SCALE - 1) * easeInOut(t)
      // Quadratic drift: slow start (arrow on trajectory), fast end (gravity/wind accumulate)
      // Start at (0,0) so there's no jump — camera was already centred before shot
      const drift  = t * t
      const cx     = z.impX * drift
      const cy     = z.impY * drift
      setTargetXform(makeTransform(cx, cy, scale))

      if (t < 1) {
        zoomRafRef.current = requestAnimationFrame(runZoom)
      } else {
        // Zoom in complete — show hole, then score, then zoom out
        setShowHole(true)
        setTimeout(() => setShowScore(true), 400)
        setTimeout(() => {
          zoomStateRef.current = { ...z, phase: 'out', startTime: performance.now(), duration: ZOOM_OUT_MS }
          zoomRafRef.current = requestAnimationFrame(runZoom)
        }, ZOOM_HOLD_MS)
      }
    } else {
      // Zoom out: scale back to 1, center drifts back to 0,0
      const scale = ZOOM_SCALE + (1 - ZOOM_SCALE) * easeInOut(t)
      const cx    = z.impX * (1 - t)
      const cy    = z.impY * (1 - t)
      setTargetXform(makeTransform(cx, cy, scale))

      if (t < 1) {
        zoomRafRef.current = requestAnimationFrame(runZoom)
      } else {
        setTargetXform(makeTransform(0, 0, 1))
        setShowHole(false)
        setShowScore(false)
        setLastHit(null)
        setTimeLeft(TIMER_MAX)
        const cur  = arrowNumRef.current
        const next = Math.min(cur + 1, 10)
        arrowNumRef.current = next
        setArrowNum(next)
        setPhase(ARROW_DISTANCES[next] !== ARROW_DISTANCES[cur] ? 'distance' : 'idle')
        zoomStateRef.current = null
      }
    }
  }, [])

  // Fire
  const fire = useCallback(() => {
    if (phase !== 'ready') return
    const radius  = targetSizeRef.current / 2
    const windOff = wind.dir === 'left' ? -(wind.kmh * KMH_TO_PX) : (wind.kmh * KMH_TO_PX)
    const aimX    = mouse.x + shake.x
    const aimY    = mouse.y + shake.y
    const impX    = aimX + windOff
    const impY    = aimY + GRAVITY_PX
    const score   = impactToScore(impX, impY, radius)

    setLastHit({ x: impX, y: impY, score, radius })
    setShowHole(false)
    setShowScore(false)
    setPhase('result')
    setRecentScores(prev => [...prev, score].slice(-3))

    const zoomInMs = DISTANCE_ZOOM_IN_MS[ARROW_DISTANCES[arrowNumRef.current]]
    cancelAnimationFrame(zoomRafRef.current)
    zoomStateRef.current = {
      startTime: performance.now(),
      aimX, aimY, impX, impY,
      phase: 'in',
      duration: zoomInMs,
    }
    zoomRafRef.current = requestAnimationFrame(runZoom)
  }, [phase, mouse, shake, wind, runZoom])

  useEffect(() => {
    window.addEventListener('click', fire)
    return () => window.removeEventListener('click', fire)
  }, [fire])

  useEffect(() => () => cancelAnimationFrame(zoomRafRef.current), [])

  const currentDistance   = ARROW_DISTANCES[arrowNum]
  const currentTargetSize = DISTANCE_TARGET_SIZE[currentDistance]
  const bgScale = ({ 18: 1.5, 30: 1.35, 50: 1.2, 70: 1.1, 90: 1.05 } as Record<number, number>)[currentDistance]
  const crossX   = mouse.x + shake.x
  const crossY   = mouse.y + shake.y
  const urgent   = timeLeft <= 5 && phase === 'ready'
  const timerPct = (timeLeft / TIMER_MAX) * 100
  const wColor   = windColor(wind.kmh)
  const dColor   = distanceColor(currentDistance)

  const injectRecent = (rows: LbRow[]) =>
    rows.map(r => r.isPlayer ? { ...r, recent: recentScores } : r)

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${phase === 'ready' ? styles.aiming : ''}`}
    >
      <div className={styles.bg} style={{ transform: `scale(${bgScale})` }} />
      <div className={styles.vignette} />

      <div className={styles.topLeft}>
        <div className={styles.eventLabel}>Cape Town Cup</div>
        <div className={styles.arrowCount}>Arrow {arrowNum} / 10</div>
      </div>

      <div className={styles.centerTop}>
        <div className={styles.windCard} style={{ borderColor: wColor, color: wColor }}>
          <span className={styles.windArrows}>{windArrows(wind.kmh, wind.dir)}</span>
          <span className={styles.windVal}>{wind.kmh.toFixed(1)} km/h</span>
        </div>
        <div className={styles.distanceCard} style={{ borderColor: dColor, color: dColor }}>
          {currentDistance}m
        </div>
      </div>

      <div className={`${styles.timerWrap} ${urgent ? styles.urgent : ''}`}>
        <span className={styles.timerNum}>{String(timeLeft).padStart(2, '0')}</span>
        <div className={styles.timerTrack}>
          <div className={styles.timerFill} style={{ width: `${timerPct}%` }} />
        </div>
      </div>

      <div className={styles.targetWrap} style={{ transform: targetXform }}>
        <div className={styles.target} style={{ width: currentTargetSize, height: currentTargetSize }}>
          <img src="/target.svg" width={currentTargetSize} height={currentTargetSize} draggable={false} alt="target" />
          {showHole && lastHit && (() => {
            const r  = lastHit.radius
            const hx = r + Math.max(-r + 3, Math.min(r - 3, lastHit.x))
            const hy = r + Math.max(-r + 3, Math.min(r - 3, lastHit.y))
            return <div className={styles.hole} style={{ left: hx - 3, top: hy - 3 }} />
          })()}
        </div>
      </div>

      {phase === 'ready' && (
        <div
          className={styles.crosshair}
          style={{ transform: `translate(calc(-50% + ${crossX}px), calc(-50% + ${crossY}px))` }}
          aria-hidden
        >
          <div className={`${styles.arm} ${styles.armTop}`} />
          <div className={`${styles.arm} ${styles.armBottom}`} />
          <div className={`${styles.arm} ${styles.armLeft}`} />
          <div className={`${styles.arm} ${styles.armRight}`} />
        </div>
      )}

      {phase === 'idle' && (
        <button className={styles.readyBtn} onClick={e => { e.stopPropagation(); setPhase('ready') }}>
          Ready
        </button>
      )}

      {showScore && timedOut && (
        <div className={styles.resultOverlay} key={`timeout-${arrowNum}`}>
          <span className={styles.resultMessage} style={{ color: 'var(--danger)' }}>TIME'S UP</span>
        </div>
      )}

      {showScore && lastHit && !timedOut && (() => {
        const sc = scoreColor(lastHit.score)
        return (
          <div className={styles.resultOverlay} key={arrowNum}>
            <span className={styles.resultScore} style={{ color: sc.display }}>{lastHit.score}</span>
            {lastHit.score === 10 && <span className={styles.resultTag}>GOLD</span>}
            {lastHit.score === 0  && <span className={styles.resultTag}>MISS</span>}
          </div>
        )
      })()}

      <div className={styles.lb}>
        <button className={styles.lbHeader} onClick={() => setExpanded(e => !e)}>
          <span>Standings</span>
          <span className={styles.lbToggle}>{expanded ? '▾' : '▴'}</span>
        </button>
        <div className={`${styles.lbBody} ${expanded ? styles.lbExpanded : ''}`}>
          {injectRecent(expanded ? LB_FULL : LB_COMPACT).map(r => (
            <div key={r.rank} className={`${styles.lbRow} ${r.isPlayer ? styles.lbPlayer : ''}`}>
              <span className={styles.lbRank}>{r.rank}</span>
              <Flag code={r.code} className={styles.lbFlag} />
              <span className={styles.lbName}>{r.name}</span>
              <span className={styles.lbRecent}>
                {r.recent.map((s, i) => {
                  const sc = scoreColor(s)
                  return <span key={i} className={styles.lbRecentScore} style={{ background: sc.bg, color: sc.fg }}>{s}</span>
                })}
              </span>
              <span className={styles.lbPts}>{r.pts}</span>
            </div>
          ))}
        </div>
      </div>

      {phase === 'distance' && (
        <div className={styles.distanceOverlay} key={currentDistance}>
          <div className={styles.distancePanel} style={{ borderColor: dColor }}>
            <span className={styles.distanceLabel}>Distance</span>
            <span className={styles.distancePanelValue} style={{ color: dColor }}>{currentDistance}m</span>
          </div>
        </div>
      )}
    </div>
  )
}
