import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import styles from './App.module.scss'
import CountrySelection from './screens/CountrySelection'
import ShootingHUD from './screens/ShootingHUD'
import PostEventLeaderboard from './screens/PostEventLeaderboard'
import SeasonSummary from './screens/SeasonSummary'
import CareerScreen from './screens/CareerScreen'
import VictoryScreen from './screens/VictoryScreen'
import RetirementScreen from './screens/RetirementScreen'

const SCREENS = [
  { path: '/country-selection',      label: 'Country Selection',      component: CountrySelection },
  { path: '/shooting-hud',           label: 'Shooting HUD',           component: ShootingHUD },
  { path: '/post-event-leaderboard', label: 'Post-Event Leaderboard', component: PostEventLeaderboard },
  { path: '/season-summary',         label: 'Season Summary',         component: SeasonSummary },
  { path: '/career',                 label: 'Career',                 component: CareerScreen },
  { path: '/victory',                label: 'Victory',                component: VictoryScreen },
  { path: '/retirement',             label: 'Retirement',             component: RetirementScreen },
]

function DevNav() {
  return (
    <div className={styles.devNav}>
      <span className={styles.devLabel}>screens</span>
      {SCREENS.map(s => (
        <Link key={s.path} to={s.path} className={styles.devLink}>
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
