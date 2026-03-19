import { useRef, useState, useCallback, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import styles from './App.module.scss'
import CountrySelection from './screens/CountrySelection'
import ShootingHUD from './screens/ShootingHUD'
import PostEventLeaderboard from './screens/PostEventLeaderboard'
import SeasonSummary from './screens/SeasonSummary'
import CareerScreen from './screens/CareerScreen'
import VictoryScreen from './screens/VictoryScreen'
import RetirementScreen from './screens/RetirementScreen'
import EventLobby from './screens/EventLobby'

const SCREENS = [
  { path: '/country-selection',      label: 'Country Selection',      component: CountrySelection },
  { path: '/event-lobby',            label: 'Event Lobby',            component: EventLobby },
  { path: '/shooting-hud',           label: 'Shooting HUD',           component: ShootingHUD },
  { path: '/post-event-leaderboard', label: 'Post-Event Leaderboard', component: PostEventLeaderboard },
  { path: '/season-summary',         label: 'Season Summary',         component: SeasonSummary },
  { path: '/career',                 label: 'Career',                 component: CareerScreen },
  { path: '/victory',                label: 'Victory',                component: VictoryScreen },
  { path: '/retirement',             label: 'Retirement',             component: RetirementScreen },
]

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
      <span className={styles.devLabel}>screens</span>
      {SCREENS.map(s => (
        <Link key={s.path} to={s.path} className={styles.devLink} onMouseDown={e => e.stopPropagation()}>
          {s.label}
        </Link>
      ))}
    </div>
  )
}

function Home() {
  return (
    <div className={styles.home}>
      <h1 className={styles.title}>Long Draw Archery</h1>
      <p className={styles.sub}>mockup workspace</p>
      <div className={styles.grid}>
        {SCREENS.map(s => (
          <Link key={s.path} to={s.path} className={styles.card}>
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DevNav />
      <Routes>
        <Route path="/" element={<Home />} />
        {SCREENS.map(s => (
          <Route key={s.path} path={s.path} element={<s.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  )
}
