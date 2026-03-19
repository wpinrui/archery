import Flag from '../../components/Flag'
import styles from './styles.module.scss'

// ── Helpers ───────────────────────────────────────────────────────────

function eventPts(pos: number): number {
  if (pos === 1)  return 100
  if (pos === 2)  return 85
  if (pos === 3)  return 72
  if (pos === 4)  return 61
  if (pos === 5)  return 52
  if (pos === 6)  return 44
  if (pos === 7)  return 37
  if (pos === 8)  return 31
  if (pos === 9)  return 26
  if (pos === 10) return 22
  if (pos <= 15)  return 15
  if (pos <= 20)  return 10
  if (pos <= 30)  return 6
  if (pos <= 40)  return 3
  return 0
}

function ep(pos: number): EventResult { return { pos, pts: eventPts(pos) } }

function totalPts(events: EventResult[]): number {
  return events.reduce((s, e) => s + e.pts, 0)
}

function posColor(pos: number): string {
  if (pos === 1) return '#e8c84a'
  if (pos === 2) return '#9eb8cc'
  if (pos === 3) return '#c8824a'
  return 'rgba(255,255,255,0.75)'
}

// ── Data ──────────────────────────────────────────────────────────────

const EVENTS = [
  { name: 'Seoul Cup',            shortName: 'Seoul',     code: 'KOR' },
  { name: 'Paris Open',           shortName: 'Paris',     code: 'FRA' },
  { name: 'Cape Town Cup',        shortName: 'Cape Town', code: 'ZAF' },
  { name: 'Las Vegas Classic',    shortName: 'Las Vegas', code: 'USA' },
  { name: 'Sydney International', shortName: 'Sydney',    code: 'AUS' },
]

interface EventResult { pos: number; pts: number }

interface Athlete {
  rank: number
  code: string
  name: string
  isPlayer?: boolean
  events: EventResult[]
}

// Events order: Seoul | Paris | Cape Town | Las Vegas | Sydney
const STANDINGS: Athlete[] = [
  // ── Top 4 — championship contenders ──────────────────────────────
  { rank:  1, code: 'NLD', name: 'Joost Visser',        events: [ep( 1), ep( 2), ep( 1), ep( 1), ep( 3)] }, // 457
  { rank:  2, code: 'CHN', name: 'Chen Wei',            events: [ep( 4), ep( 1), ep( 3), ep( 2), ep( 2)] }, // 403
  { rank:  3, code: 'ITA', name: 'Marco Rossi',         events: [ep( 2), ep( 3), ep( 2), ep( 3), ep( 4)] }, // 375
  { rank:  4, code: 'JPN', name: 'Akira Nakamura',      events: [ep( 3), ep( 4), ep( 5), ep( 4), ep( 1)] }, // 346
  // ── P5–10 — solid mid-field ───────────────────────────────────────
  { rank:  5, code: 'KOR', name: 'Soo-Jin Park',        events: [ep( 6), ep( 7), ep( 9), ep( 5), ep( 5)] }, // 211
  { rank:  6, code: 'FIN', name: 'Lauri Mäkinen',       events: [ep( 8), ep( 6), ep( 6), ep( 7), ep( 6)] }, // 200
  { rank:  7, code: 'DEU', name: 'Hans Schmidt',        events: [ep( 5), ep( 8), ep( 8), ep( 6), ep( 7)] }, // 195
  { rank:  8, code: 'ZAF', name: 'Player One',          events: [ep( 7), ep( 5), ep( 4), ep(12), ep( 9)], isPlayer: true }, // 191
  { rank:  9, code: 'NGA', name: 'Peter Okonkwo',       events: [ep(10), ep( 9), ep( 7), ep( 8), ep( 8)] }, // 147
  { rank: 10, code: 'SWE', name: 'Tobias Bergström',    events: [ep(11), ep(10), ep(11), ep( 9), ep(10)] }, // 100
  // ── P11–20 ────────────────────────────────────────────────────────
  { rank: 11, code: 'ZMB', name: 'Kabelo Mbeki',        events: [ep( 9), ep(11), ep(10), ep(11), ep(11)] }, // 93
  { rank: 12, code: 'CZE', name: 'Radek Novák',         events: [ep(13), ep(12), ep(12), ep(10), ep(12)] }, // 82
  { rank: 13, code: 'AUS', name: 'Liam Nguyen',         events: [ep(14), ep(14), ep(13), ep(13), ep(15)] }, // 75
  { rank: 14, code: 'BRA', name: 'Carlos Souza',        events: [ep(15), ep(15), ep(14), ep(14), ep(16)] }, // 70
  { rank: 15, code: 'GBR', name: 'James Fletcher',      events: [ep(16), ep(16), ep(15), ep(15), ep(17)] }, // 60
  { rank: 16, code: 'USA', name: 'Tyler Brooks',        events: [ep(17), ep(17), ep(16), ep(16), ep(18)] }, // 50
  { rank: 17, code: 'FRA', name: 'Édouard Blanc',       events: [ep(19), ep(18), ep(18), ep(19), ep(21)] }, // 46
  { rank: 18, code: 'ESP', name: 'Miguel Herrera',      events: [ep(20), ep(20), ep(20), ep(22), ep(23)] }, // 42
  { rank: 19, code: 'NOR', name: 'Erik Larsen',         events: [ep(18), ep(22), ep(23), ep(21), ep(20)] }, // 38
  { rank: 20, code: 'DNK', name: 'Søren Holm',          events: [ep(21), ep(21), ep(20), ep(22), ep(22)] }, // 34
  // ── P21–30 ────────────────────────────────────────────────────────
  { rank: 21, code: 'POL', name: 'Tomasz Wójcik',       events: [ep(22), ep(24), ep(24), ep(23), ep(21)] }, // 30
  { rank: 22, code: 'TUR', name: 'Mehmet Yıldız',       events: [ep(25), ep(23), ep(26), ep(24), ep(25)] }, // 30
  { rank: 23, code: 'ARG', name: 'Alejandro Ponce',     events: [ep(26), ep(26), ep(27), ep(25), ep(26)] }, // 30
  { rank: 24, code: 'MEX', name: 'Rodrigo Fuentes',     events: [ep(27), ep(27), ep(28), ep(27), ep(27)] }, // 30
  { rank: 25, code: 'IND', name: 'Arjun Sharma',        events: [ep(28), ep(28), ep(29), ep(28), ep(29)] }, // 30
  { rank: 26, code: 'PAK', name: 'Bilal Chaudhry',      events: [ep(29), ep(29), ep(30), ep(29), ep(30)] }, // 30
  { rank: 27, code: 'IRN', name: 'Dariush Karimi',      events: [ep(21), ep(22), ep(31), ep(30), ep(35)] }, // 21
  { rank: 28, code: 'UKR', name: 'Oleksiy Bondar',      events: [ep(21), ep(31), ep(32), ep(33), ep(34)] }, // 18
  { rank: 29, code: 'BEL', name: 'Pieter Claes',        events: [ep(32), ep(33), ep(33), ep(34), ep(35)] }, // 15
  { rank: 30, code: 'NZL', name: 'Sam Cooper',          events: [ep(33), ep(33), ep(34), ep(34), ep(34)] }, // 15
  // ── P31–40 ────────────────────────────────────────────────────────
  { rank: 31, code: 'CAN', name: 'Lucas Tremblay',      events: [ep(35), ep(36), ep(37), ep(38), ep(36)] }, // 15
  { rank: 32, code: 'PRT', name: 'Diogo Pereira',       events: [ep(36), ep(37), ep(38), ep(39), ep(37)] }, // 15
  { rank: 33, code: 'CHE', name: 'Lukas Meier',         events: [ep(37), ep(38), ep(39), ep(40), ep(38)] }, // 15
  { rank: 34, code: 'AUT', name: 'Stefan Huber',        events: [ep(38), ep(39), ep(40), ep(45), ep(39)] }, // 12
  { rank: 35, code: 'HUN', name: 'Gábor Vásárhelyi',    events: [ep(39), ep(40), ep(45), ep(39), ep(45)] }, // 9
  { rank: 36, code: 'HRV', name: 'Ivan Horvat',         events: [ep(40), ep(45), ep(40), ep(40), ep(45)] }, // 9
  { rank: 37, code: 'SRB', name: 'Nikola Marković',     events: [ep(40), ep(40), ep(45), ep(45), ep(40)] }, // 9
  { rank: 38, code: 'ROU', name: 'Alexandru Popa',      events: [ep(45), ep(40), ep(45), ep(40), ep(45)] }, // 6
  { rank: 39, code: 'GRC', name: 'Nikos Papadopoulos',  events: [ep(45), ep(45), ep(40), ep(45), ep(40)] }, // 6
  { rank: 40, code: 'EGY', name: 'Ahmed Hassan',        events: [ep(45), ep(45), ep(45), ep(40), ep(45)] }, // 3
  // ── P41–50 — zero-points finishers ───────────────────────────────
  { rank: 41, code: 'MAR', name: 'Youssef Berrada',     events: [ep(44), ep(44), ep(43), ep(43), ep(43)] }, // 0
  { rank: 42, code: 'KEN', name: 'James Mwangi',        events: [ep(45), ep(45), ep(44), ep(44), ep(44)] }, // 0
  { rank: 43, code: 'ETH', name: 'Dawit Girma',         events: [ep(46), ep(46), ep(45), ep(45), ep(45)] }, // 0
  { rank: 44, code: 'GHA', name: 'Kwame Asante',        events: [ep(47), ep(47), ep(46), ep(46), ep(46)] }, // 0
  { rank: 45, code: 'UGA', name: 'Moses Okello',        events: [ep(48), ep(48), ep(47), ep(47), ep(47)] }, // 0
  { rank: 46, code: 'TZA', name: 'Emmanuel Mwamba',     events: [ep(49), ep(49), ep(48), ep(48), ep(48)] }, // 0
  { rank: 47, code: 'CMR', name: 'Jean-Paul Mbida',     events: [ep(50), ep(50), ep(49), ep(49), ep(49)] }, // 0
  { rank: 48, code: 'SEN', name: 'Ousmane Diallo',      events: [ep(47), ep(50), ep(50), ep(50), ep(50)] }, // 0
  { rank: 49, code: 'TUN', name: 'Karim Ben Salem',     events: [ep(48), ep(49), ep(50), ep(50), ep(50)] }, // 0
  { rank: 50, code: 'RUS', name: 'Dmitri Voronov',      events: [ep(49), ep(50), ep(50), ep(50), ep(50)] }, // 0
]

const CHAMPION = STANDINGS[0]
const PLAYER   = STANDINGS.find(a => a.isPlayer)!

// ── Component ─────────────────────────────────────────────────────────

export default function SeasonSummary() {
  const playerTotal = totalPts(PLAYER.events)
  const champTotal  = totalPts(CHAMPION.events)

  return (
    <div className={styles.container}>
      <div className={styles.bg} />
      <div className={styles.vignette} />

      <div className={styles.content}>

        {/* ── Season bar ──────────────────────────────────────── */}
        <div className={styles.seasonBar}>
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Season</span>
            <span className={styles.seasonBarValue}>1</span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Age</span>
            <span className={styles.seasonBarValue}>22</span>
          </div>
          <div className={styles.seasonBarDot} />
          <div className={styles.seasonBarItem}>
            <span className={styles.seasonBarLabel}>Final Standing</span>
            <span className={styles.seasonBarValue}>
              P{PLAYER.rank} <span className={styles.seasonBarOf}>· {playerTotal} pts</span>
            </span>
          </div>
          <div className={styles.seasonBarSpacer} />
          <div className={styles.completedBadge}>SEASON COMPLETE</div>
        </div>

        {/* ── Champion + player hero ───────────────────────────── */}
        <div className={styles.heroCard}>

          <div className={styles.champSide}>
            <div className={styles.champCrown}>WORLD CHAMPION</div>
            <div className={styles.champIdentity}>
              <Flag code={CHAMPION.code} className={styles.champFlag} />
              <span className={styles.champName}>{CHAMPION.name}</span>
            </div>
            <div className={styles.champTotal}>{champTotal} <span className={styles.champPtsLabel}>pts</span></div>
          </div>

          <div className={styles.heroDivider} />

          <div className={styles.playerSide}>
            <span className={styles.playerSideLabel}>YOUR SEASON</span>
            <div className={styles.playerResult}>
              <span className={styles.playerPos}>P{PLAYER.rank}</span>
              <span className={styles.playerPts}>{playerTotal} pts</span>
            </div>
            <div className={styles.playerNote}>Shakiness −4% next season</div>
          </div>

        </div>

        {/* ── Season arc recap ────────────────────────────────── */}
        <div className={styles.eventRecap}>
          {EVENTS.map((evt, i) => {
            const result = PLAYER.events[i]
            const medal  = result.pos <= 3
            return (
              <div key={evt.code} className={styles.recapStep}>
                <div className={styles.recapFlagWrap}>
                  <Flag code={evt.code} className={styles.recapFlag} />
                </div>
                <span className={styles.recapName}>{evt.shortName}</span>
                <span
                  className={styles.recapResult}
                  style={{ color: medal ? posColor(result.pos) : undefined }}
                >
                  P{result.pos} · {result.pts}pts
                </span>
              </div>
            )
          })}
        </div>

        {/* ── Championship standings ──────────────────────────── */}
        <div className={styles.standings}>
          <div className={styles.standingsLabel}>Championship Standings</div>
          <div className={styles.standingsTable}>

            {/* Header row */}
            <div className={`${styles.standingsRow} ${styles.standingsHeaderRow}`}>
              <span className={styles.cRank}>#</span>
              <span className={styles.cFlag} />
              <span className={styles.cName} />
              {EVENTS.map(evt => (
                <span key={evt.code} className={styles.cEvent}>
                  <Flag code={evt.code} className={styles.headerFlag} />
                </span>
              ))}
              <span className={styles.cTotal}>Total</span>
            </div>

            {/* Scrollable body */}
            <div className={styles.standingsBody}>
              {STANDINGS.map(row => {
                const total = totalPts(row.events)
                const medal = row.rank <= 3
                return (
                  <div
                    key={row.rank}
                    className={`${styles.standingsRow} ${row.isPlayer ? styles.playerRow : ''} ${medal ? styles.medalRow : ''}`}
                  >
                    <span
                      className={styles.cRank}
                      style={{ color: medal ? posColor(row.rank) : undefined }}
                    >
                      {row.rank}
                    </span>
                    <Flag code={row.code} className={styles.cFlag} />
                    <span className={styles.cName}>{row.name}</span>
                    {row.events.map((evt, i) => (
                      <span key={i} className={styles.cEvent}>
                        <span
                          className={styles.cEventPos}
                          style={{ color: evt.pos <= 3 ? posColor(evt.pos) : undefined }}
                        >
                          #{evt.pos}
                        </span>
                        <span className={styles.cEventPts}>{evt.pts > 0 ? evt.pts : '—'}</span>
                      </span>
                    ))}
                    <span className={styles.cTotal}>{total > 0 ? total : '—'}</span>
                  </div>
                )
              })}
            </div>

          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────── */}
        <div className={styles.actionRow}>
          <a href="/career" className={styles.careerBtn}>My Career</a>
          <button className={styles.nextBtn}>Next Season →</button>
        </div>

      </div>
    </div>
  )
}
