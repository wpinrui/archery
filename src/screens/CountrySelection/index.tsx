import Flag from '../../components/Flag'
import styles from './styles.module.scss'

// ── Data ──────────────────────────────────────────────────────────────
const ROSTER = [
  { code: 'ARG', name: 'Argentina',      athlete: 'Alejandro Ponce' },
  { code: 'AUS', name: 'Australia',      athlete: 'Liam Nguyen' },
  { code: 'AUT', name: 'Austria',        athlete: 'Stefan Huber' },
  { code: 'BEL', name: 'Belgium',        athlete: 'Pieter Claes' },
  { code: 'BRA', name: 'Brazil',         athlete: 'Carlos Souza' },
  { code: 'CAN', name: 'Canada',         athlete: 'Lucas Tremblay' },
  { code: 'CHE', name: 'Switzerland',    athlete: 'Lukas Meier' },
  { code: 'CHN', name: 'China',          athlete: 'Chen Wei' },
  { code: 'CMR', name: 'Cameroon',       athlete: 'Jean-Paul Mbida' },
  { code: 'CZE', name: 'Czech Republic', athlete: 'Radek Novák' },
  { code: 'DEU', name: 'Germany',        athlete: 'Hans Schmidt' },
  { code: 'DNK', name: 'Denmark',        athlete: 'Søren Holm' },
  { code: 'EGY', name: 'Egypt',          athlete: 'Ahmed Hassan' },
  { code: 'ESP', name: 'Spain',          athlete: 'Miguel Herrera' },
  { code: 'ETH', name: 'Ethiopia',       athlete: 'Dawit Girma' },
  { code: 'FIN', name: 'Finland',        athlete: 'Lauri Mäkinen' },
  { code: 'FRA', name: 'France',         athlete: 'Édouard Blanc' },
  { code: 'GBR', name: 'Great Britain',  athlete: 'James Fletcher' },
  { code: 'GHA', name: 'Ghana',          athlete: 'Kwame Asante' },
  { code: 'GRC', name: 'Greece',         athlete: 'Nikos Papadopoulos' },
  { code: 'HRV', name: 'Croatia',        athlete: 'Ivan Horvat' },
  { code: 'HUN', name: 'Hungary',        athlete: 'Gábor Vásárhelyi' },
  { code: 'IND', name: 'India',          athlete: 'Arjun Sharma' },
  { code: 'IRN', name: 'Iran',           athlete: 'Dariush Karimi' },
  { code: 'ITA', name: 'Italy',          athlete: 'Marco Rossi' },
  { code: 'JPN', name: 'Japan',          athlete: 'Akira Nakamura' },
  { code: 'KEN', name: 'Kenya',          athlete: 'James Mwangi' },
  { code: 'KOR', name: 'South Korea',    athlete: 'Soo-Jin Park' },
  { code: 'MAR', name: 'Morocco',        athlete: 'Youssef Berrada' },
  { code: 'MEX', name: 'Mexico',         athlete: 'Rodrigo Fuentes' },
  { code: 'NGA', name: 'Nigeria',        athlete: 'Peter Okonkwo' },
  { code: 'NLD', name: 'Netherlands',    athlete: 'Joost Visser' },
  { code: 'NOR', name: 'Norway',         athlete: 'Erik Larsen' },
  { code: 'NZL', name: 'New Zealand',    athlete: 'Sam Cooper' },
  { code: 'PAK', name: 'Pakistan',       athlete: 'Bilal Chaudhry' },
  { code: 'POL', name: 'Poland',         athlete: 'Tomasz Wójcik' },
  { code: 'PRT', name: 'Portugal',       athlete: 'Diogo Pereira' },
  { code: 'ROU', name: 'Romania',        athlete: 'Alexandru Popa' },
  { code: 'RUS', name: 'Russia',         athlete: 'Dmitri Voronov' },
  { code: 'SEN', name: 'Senegal',        athlete: 'Ousmane Diallo' },
  { code: 'SRB', name: 'Serbia',         athlete: 'Nikola Marković' },
  { code: 'SWE', name: 'Sweden',         athlete: 'Tobias Bergström' },
  { code: 'TUN', name: 'Tunisia',        athlete: 'Karim Ben Salem' },
  { code: 'TUR', name: 'Turkey',         athlete: 'Mehmet Yıldız' },
  { code: 'TZA', name: 'Tanzania',       athlete: 'Emmanuel Mwamba' },
  { code: 'UGA', name: 'Uganda',         athlete: 'Moses Okello' },
  { code: 'UKR', name: 'Ukraine',        athlete: 'Oleksiy Bondar' },
  { code: 'USA', name: 'United States',  athlete: 'Tyler Brooks' },
  { code: 'ZAF', name: 'South Africa',   athlete: 'Bongani Dlamini' },
  { code: 'ZMB', name: 'Zambia',         athlete: 'Kabelo Mbeki' },
]

const SELECTED_CODE = 'AUS'
const PLAYER_NAME   = 'Alex Johnson'

// ── Component ─────────────────────────────────────────────────────────
export default function CountrySelection() {
  const selected = ROSTER.find(c => c.code === SELECTED_CODE)!

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
              defaultValue={PLAYER_NAME}
              placeholder="Enter your name"
              readOnly
            />
          </div>

          <div className={styles.cardDivider} />

          {/* ── Country ─────────────────────────────────────────── */}
          <div className={styles.countrySection}>

            <div className={styles.countryHeader}>
              <span className={styles.sectionLabel}>Your Country</span>
            </div>

            {/* Selected country preview */}
            <div className={styles.selectedPreview}>
              <Flag code={selected.code} className={styles.selectedFlag} />
              <div className={styles.selectedInfo}>
                <span className={styles.selectedName}>{selected.name}</span>
                <span className={styles.selectedReplaces}>Replaces {selected.athlete} on the World Tour</span>
              </div>
            </div>

            {/* Scrollable country list */}
            <div className={styles.countryGrid}>
              {ROSTER.map(c => (
                <div
                  key={c.code}
                  className={`${styles.countryItem} ${c.code === SELECTED_CODE ? styles.countryItemSelected : ''}`}
                >
                  <Flag code={c.code} className={styles.itemFlag} />
                  <span className={styles.itemName}>{c.name}</span>
                  <span className={styles.itemAthlete}>{c.athlete}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Action row ──────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <button className={styles.beginBtn}>Begin Career →</button>
        </div>

      </div>
    </div>
  )
}
