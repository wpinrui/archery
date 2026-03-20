import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COUNTRIES } from '../data/countries'
import type { CountryCode } from '../types'
import Flag from '../components/Flag'
import { useGameStore } from '../store/gameStore'
import styles from './CountrySelectionScreen.module.scss'

const SORTED_COUNTRIES = [...COUNTRIES].sort((a, b) => a.name.localeCompare(b.name))

export default function CountrySelectionScreen() {
  const startCareer = useGameStore(s => s.startCareer)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [selectedCode, setSelectedCode] = useState<CountryCode | null>(null)

  const selected = selectedCode ? SORTED_COUNTRIES.find(c => c.code === selectedCode) : null
  const canBegin = name.trim().length > 0 && selectedCode !== null

  function handleBegin() {
    if (!canBegin) return
    startCareer(name.trim(), selectedCode!)
    navigate('/game/event-lobby')
  }

  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <div className={styles.vignette} />

      <div className={styles.content}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className={styles.header}>
          <span className={styles.gameLabel}>Long Draw Archery</span>
          <h1 className={styles.title}>Set Up Your Profile</h1>
          <p className={styles.subtitle}>
            Choose the nation you'll represent on the World Tour. This cannot be changed.
          </p>
        </div>

        {/* ── Setup card ──────────────────────────────────────────── */}
        <div className={styles.setupCard}>

          {/* ── Name ────────────────────────────────────────────── */}
          <div className={styles.nameSection}>
            <span className={styles.sectionLabel}>Your Name</span>
            <input
              className={styles.nameInput}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className={styles.cardDivider} />

          {/* ── Country ─────────────────────────────────────────── */}
          <div className={styles.countrySection}>

            <div className={styles.countryHeader}>
              <span className={styles.sectionLabel}>Your Country</span>
            </div>

            {/* Selected country preview */}
            {selected && (
              <div className={styles.selectedPreview}>
                <Flag code={selected.code} className={styles.selectedFlag} />
                <div className={styles.selectedInfo}>
                  <span className={styles.selectedName}>{selected.name}</span>
                  <span className={styles.selectedReplaces}>
                    Replaces {selected.athleteName} on the World Tour
                  </span>
                </div>
              </div>
            )}

            {/* Scrollable country list */}
            <div className={styles.countryGrid}>
              {SORTED_COUNTRIES.map(c => (
                <div
                  key={c.code}
                  className={`${styles.countryItem} ${c.code === selectedCode ? styles.countryItemSelected : ''}`}
                  onClick={() => setSelectedCode(c.code)}
                >
                  <Flag code={c.code} className={styles.itemFlag} />
                  <span className={styles.itemName}>{c.name}</span>
                  <span className={styles.itemAthlete}>{c.athleteName}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Action row ──────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <button
            className={styles.beginBtn}
            onClick={handleBegin}
            disabled={!canBegin}
          >
            Begin Career →
          </button>
        </div>

      </div>
    </div>
  )
}
