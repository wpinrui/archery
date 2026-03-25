import { useRef, useState, useCallback, useEffect, useSyncExternalStore } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useGameStore } from './store/gameStore'
import { playMusic, stopMusic, advanceAndPlay } from './audio/musicManager'
import { preloadArrowSfx } from './audio/sfx'
import styles from './App.module.scss'

// Mockup imports — retained for reference routes only
import CountrySelectionMockup from './mockups/CountrySelection'
import EventLobbyMockup from './mockups/EventLobby'
import ShootingHUDMockup from './mockups/ShootingHUD'
import PostEventLeaderboardMockup from './mockups/PostEventLeaderboard'
import SeasonSummaryMockup from './mockups/SeasonSummary'
import CareerScreenMockup from './mockups/CareerScreen'
import VictoryScreenMockup from './mockups/VictoryScreen'
import RetirementScreenMockup from './mockups/RetirementScreen'

// Real screen stubs
import TitleScreen from './screens/TitleScreen'
import CountrySelectionScreen from './screens/CountrySelectionScreen'
import EventLobbyScreen from './screens/EventLobbyScreen'
import ShootingHUDScreen from './screens/ShootingHUDScreen'
import PostEventLeaderboardScreen from './screens/PostEventLeaderboardScreen'
import SeasonSummaryScreen from './screens/SeasonSummaryScreen'
import CareerScreen from './screens/CareerScreen'
import VictoryScreen from './screens/VictoryScreen'
import RetirementScreen from './screens/RetirementScreen'

const MOCKUP_SCREENS = [
  { path: 'country-selection',      label: 'Country Selection',      component: CountrySelectionMockup },
  { path: 'event-lobby',            label: 'Event Lobby',            component: EventLobbyMockup },
  { path: 'shooting-hud',           label: 'Shooting HUD',           component: ShootingHUDMockup },
  { path: 'post-event-leaderboard', label: 'Post-Event Leaderboard', component: PostEventLeaderboardMockup },
  { path: 'season-summary',         label: 'Season Summary',         component: SeasonSummaryMockup },
  { path: 'career',                 label: 'Career',                 component: CareerScreenMockup },
  { path: 'victory',                label: 'Victory',                component: VictoryScreenMockup },
  { path: 'retirement',             label: 'Retirement',             component: RetirementScreenMockup },
]

/** Draggable dev nav — visible only on /mockups/* routes */
function DevNav() {
  const [pos, setPos] = useState({ x: 16, y: 16 })
  const dragging = useRef(false)
  const origin   = useRef({ mx: 0, my: 0, px: 0, py: 0 })

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return
    setPos({
      x: origin.current.px + e.clientX - origin.current.mx,
      y: origin.current.py + e.clientY - origin.current.my,
    })
  }, [])

  const onMouseUp = useCallback(() => { dragging.current = false }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [onMouseMove, onMouseUp])

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true
    origin.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y }
    e.preventDefault()
  }

  return (
    <div
      className={styles.devNav}
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={onMouseDown}
    >
      <span className={styles.devHandle}>⠿</span>
      <span className={styles.devLabel}>mockups</span>
      {MOCKUP_SCREENS.map(s => (
        <Link
          key={s.path}
          to={`/mockups/${s.path}`}
          className={styles.devLink}
          onMouseDown={e => e.stopPropagation()}
        >
          {s.label}
        </Link>
      ))}
    </div>
  )
}

/** Layout wrapper for /mockups/* — injects the dev nav above each mockup */
function MockupLayout() {
  return (
    <>
      <DevNav />
      <Outlet />
    </>
  )
}

/**
 * Resume gate — reads game phase and redirects to the appropriate in-game screen.
 * Mounted at /play; reached when the player chooses "Continue" on TitleScreen.
 *
 * Playing sub-screen heuristic (for resume):
 *   - arrows in progress  → /game/shooting
 *   - otherwise           → /game/event-lobby
 *
 * Once real screens are in place they drive navigation themselves via
 * useNavigate(); this gate only determines the landing point on resume.
 */
function PhaseGate() {
  const phase             = useGameStore(s => s.phase)
  const currentArrowIndex = useGameStore(s => s.currentArrowIndex)

  if (phase === 'country-selection') return <Navigate to="/country-selection" replace />
  if (phase === 'retired')           return <Navigate to="/retired"           replace />

  // playing
  if (currentArrowIndex > 0) return <Navigate to="/game/shooting"    replace />
  return                            <Navigate to="/game/event-lobby" replace />
}

/** Block rendering until Zustand persist has hydrated from localStorage */
function useHasHydrated() {
  return useSyncExternalStore(
    useGameStore.persist.onFinishHydration,
    () => useGameStore.persist.hasHydrated(),
    () => false,
  )
}

/** Reacts to route changes to control background music. */
function MusicController() {
  const { pathname } = useLocation()
  const prevRef = useRef(pathname)

  useEffect(() => {
    preloadArrowSfx()
  }, [])

  useEffect(() => {
    const prev = prevRef.current
    prevRef.current = pathname

    const onShooting = pathname === '/game/shooting'
    const wasShooting = prev === '/game/shooting'

    if (onShooting) {
      stopMusic()
    } else if (wasShooting) {
      advanceAndPlay()
    } else {
      playMusic()
    }
  }, [pathname])

  return null
}

export default function App() {
  const hydrated = useHasHydrated()
  if (!hydrated) return null

  return (
    <BrowserRouter>
      <MusicController />
      <Routes>
        {/* Entry point — title screen on cold start */}
        <Route path="/" element={<TitleScreen />} />

        {/* Resume gate — reads phase and redirects to the correct in-game screen */}
        <Route path="/play" element={<PhaseGate />} />

        {/* ── Real game screens ─────────────────────────────────────────── */}
        <Route path="/country-selection"     element={<CountrySelectionScreen />} />
        <Route path="/game/event-lobby"      element={<EventLobbyScreen />} />
        <Route path="/game/shooting"         element={<ShootingHUDScreen />} />
        <Route path="/game/post-event"       element={<PostEventLeaderboardScreen />} />
        <Route path="/game/season-summary"   element={<SeasonSummaryScreen />} />
        <Route path="/game/victory"          element={<VictoryScreen />} />
        <Route path="/game/career"           element={<CareerScreen />} />
        <Route path="/retired"               element={<RetirementScreen />} />

        {/* ── Mockup routes (reference only — not part of game flow) ────── */}
        <Route path="/mockups" element={<MockupLayout />}>
          {MOCKUP_SCREENS.map(s => (
            <Route key={s.path} path={s.path} element={<s.component />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
