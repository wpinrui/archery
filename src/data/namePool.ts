import type { CountryCode } from '../types'

// ═══════════════════════════════════════════════════════════════════════
// Name Pools — culturally appropriate first/last names per country
// ═══════════════════════════════════════════════════════════════════════

interface NamePool {
  first: string[]
  last: string[]
}

/**
 * Name pools keyed by CountryCode.
 * "first" = first part of displayed name, "last" = second part.
 * For East Asian names this follows each culture's typical display order
 * (e.g. Chinese: family name first; Japanese/Korean: given name first in
 * Western-style display, matching the existing roster format).
 */
const NAME_POOLS: Record<CountryCode, NamePool> = {
  // ── East Asia ──────────────────────────────────────────────────────
  KOR: {
    first: ['Soo-Jin', 'Min-Ho', 'Jun-Seo', 'Hyun-Woo', 'Jae-Won', 'Dong-Hyun', 'Sung-Min', 'Tae-Hyung'],
    last: ['Park', 'Kim', 'Lee', 'Choi', 'Jung', 'Kang', 'Yoon', 'Shin'],
  },
  JPN: {
    first: ['Akira', 'Haruto', 'Yuto', 'Sota', 'Kaito', 'Ren', 'Takumi', 'Daiki'],
    last: ['Nakamura', 'Tanaka', 'Suzuki', 'Yamamoto', 'Sato', 'Watanabe', 'Kobayashi', 'Ito'],
  },
  CHN: {
    first: ['Chen', 'Wang', 'Zhang', 'Liu', 'Li', 'Yang', 'Zhao', 'Huang'],
    last: ['Wei', 'Jun', 'Hao', 'Lei', 'Ming', 'Tao', 'Peng', 'Feng'],
  },
  TWN: {
    first: ['Lin', 'Tsai', 'Hsu', 'Wu', 'Lai', 'Chang', 'Kuo', 'Hung'],
    last: ['Cheng', 'Yu-Hsuan', 'Wei-Ting', 'Chih-Ming', 'Chia-Wei', 'Tzu-Hsien', 'Po-Wen', 'Hao-Yu'],
  },
  MNG: {
    first: ['Batbayar', 'Ganbaatar', 'Temuulen', 'Erdenebat', 'Munkhbat', 'Bayaraa', 'Boldbaatar', 'Tsogt'],
    last: ['Erdene', 'Dorj', 'Bat', 'Altangerel', 'Munkh', 'Ganbold', 'Otgon', 'Purev'],
  },
  HKG: {
    first: ['Wong', 'Chan', 'Lau', 'Leung', 'Cheung', 'Yeung', 'Ng', 'Tam'],
    last: ['Kai-Ming', 'Tsz-Hin', 'Hoi-Lam', 'Wai-Kit', 'Chi-Fung', 'Siu-Wai', 'Lok-Yin', 'Ho-Yin'],
  },
  // ── Southeast Asia ─────────────────────────────────────────────────
  SGP: {
    first: ['Tan', 'Lim', 'Lee', 'Ng', 'Ong', 'Koh', 'Goh', 'Chua'],
    last: ['Wei Jie', 'Jun Kai', 'Zhi Hao', 'Yi Xuan', 'Jia Jun', 'Rui En', 'Wei Liang', 'Jun Hao'],
  },
  IDN: {
    first: ['Adi', 'Budi', 'Dimas', 'Rizky', 'Fajar', 'Gilang', 'Hendra', 'Yoga'],
    last: ['Pratama', 'Saputra', 'Wijaya', 'Hidayat', 'Nugroho', 'Santoso', 'Kurniawan', 'Setiawan'],
  },
  PHL: {
    first: ['Rafael', 'Miguel', 'Jose', 'Marco', 'Carlo', 'Andrei', 'Gabriel', 'Joaquin'],
    last: ['Santos', 'Reyes', 'Cruz', 'Dela Cruz', 'Garcia', 'Ramos', 'Mendoza', 'Torres'],
  },
  THA: {
    first: ['Somchai', 'Prasert', 'Nattapong', 'Surachai', 'Wichai', 'Thanapon', 'Kittipong', 'Anon'],
    last: ['Prasert', 'Srisuk', 'Chaiyaporn', 'Thongchai', 'Rattanapong', 'Sukprasert', 'Wongsawat', 'Boonmee'],
  },
  VNM: {
    first: ['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Vo', 'Dang', 'Bui'],
    last: ['Minh Duc', 'Quang Huy', 'Thanh Tung', 'Duc Anh', 'Van Toan', 'Hoang Nam', 'Tien Dung', 'Xuan Truong'],
  },
  MYS: {
    first: ['Ahmad', 'Mohd', 'Hafiz', 'Iskandar', 'Faizal', 'Azlan', 'Syafiq', 'Amirul'],
    last: ['Rizal', 'Razak', 'Ibrahim', 'Ismail', 'Hassan', 'Abdullah', 'Rahman', 'Kamal'],
  },
  // ── South Asia ─────────────────────────────────────────────────────
  IND: {
    first: ['Arjun', 'Vikram', 'Rohit', 'Amit', 'Rajesh', 'Suresh', 'Deepak', 'Anil'],
    last: ['Sharma', 'Singh', 'Patel', 'Kumar', 'Gupta', 'Reddy', 'Nair', 'Verma'],
  },
  NPL: {
    first: ['Sanjay', 'Bikash', 'Sujan', 'Rajendra', 'Prakash', 'Nabin', 'Dipendra', 'Kiran'],
    last: ['Tamang', 'Gurung', 'Shrestha', 'Thapa', 'Rai', 'Magar', 'Lama', 'Basnet'],
  },
  // ── Central / West Asia ────────────────────────────────────────────
  TUR: {
    first: ['Mehmet', 'Emre', 'Burak', 'Cem', 'Oğuz', 'Serkan', 'Tolga', 'Barış'],
    last: ['Yıldız', 'Demir', 'Kaya', 'Çelik', 'Şahin', 'Yılmaz', 'Öztürk', 'Aydın'],
  },
  KAZ: {
    first: ['Nursultan', 'Daulet', 'Askar', 'Yerlan', 'Timur', 'Marat', 'Serik', 'Arman'],
    last: ['Akhmetov', 'Suleimenov', 'Omarov', 'Bekturov', 'Kasymov', 'Zhanseitov', 'Nurpeisov', 'Tulegenov'],
  },
  // ── Oceania ────────────────────────────────────────────────────────
  AUS: {
    first: ['Liam', 'Jack', 'Noah', 'Oliver', 'Ethan', 'Cooper', 'Riley', 'Harry'],
    last: ['Nguyen', 'Smith', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Kelly', 'Robinson'],
  },
  NZL: {
    first: ['Sam', 'Josh', 'Ben', 'Luke', 'Finn', 'Connor', 'Lachlan', 'Caleb'],
    last: ['Cooper', 'Wilson', 'Taylor', 'Anderson', 'Mitchell', 'Harris', 'Walker', 'King'],
  },
  // ── North America ──────────────────────────────────────────────────
  USA: {
    first: ['Tyler', 'Ryan', 'Jake', 'Caleb', 'Mason', 'Dylan', 'Ethan', 'Logan'],
    last: ['Brooks', 'Johnson', 'Williams', 'Miller', 'Davis', 'Garcia', 'Martinez', 'Anderson'],
  },
  CAN: {
    first: ['Lucas', 'Étienne', 'Nathan', 'William', 'Samuel', 'Gabriel', 'Alexis', 'Benjamin'],
    last: ['Tremblay', 'Roy', 'Gagnon', 'Martin', 'Campbell', 'Anderson', 'Thompson', 'Côté'],
  },
  MEX: {
    first: ['Rodrigo', 'Diego', 'Andrés', 'Luis', 'Fernando', 'Emilio', 'Jorge', 'Ricardo'],
    last: ['Fuentes', 'Hernández', 'López', 'González', 'Ramírez', 'Torres', 'Reyes', 'Castillo'],
  },
  // ── Central America & Caribbean ────────────────────────────────────
  CRI: {
    first: ['Andrés', 'José', 'Carlos', 'Daniel', 'David', 'Luis', 'Esteban', 'Marco'],
    last: ['Solano', 'Rodríguez', 'Jiménez', 'Mora', 'Vargas', 'Chaves', 'Castro', 'Hernández'],
  },
  JAM: {
    first: ['Andre', 'Damion', 'Kemar', 'Oshane', 'Rushane', 'Tyrone', 'Javon', 'Devon'],
    last: ['Campbell', 'Brown', 'Williams', 'Stewart', 'Thomas', 'Clarke', 'Gordon', 'Reid'],
  },
  // ── South America ──────────────────────────────────────────────────
  BRA: {
    first: ['Carlos', 'Rafael', 'Henrique', 'Thiago', 'Gustavo', 'Matheus', 'Leonardo', 'Bruno'],
    last: ['Souza', 'Oliveira', 'Santos', 'Ferreira', 'Pereira', 'Costa', 'Almeida', 'Ribeiro'],
  },
  ARG: {
    first: ['Alejandro', 'Matías', 'Santiago', 'Nicolás', 'Facundo', 'Leandro', 'Gonzalo', 'Sebastián'],
    last: ['Ponce', 'Fernández', 'Álvarez', 'Romero', 'Gutiérrez', 'Acosta', 'Morales', 'Díaz'],
  },
  COL: {
    first: ['Santiago', 'Camilo', 'Andrés', 'Sebastián', 'Juan', 'Felipe', 'David', 'Nicolás'],
    last: ['Restrepo', 'García', 'Rodríguez', 'Martínez', 'López', 'Ospina', 'Gómez', 'Herrera'],
  },
  CHL: {
    first: ['Matías', 'Sebastián', 'Benjamín', 'Vicente', 'Martín', 'Tomás', 'Ignacio', 'Felipe'],
    last: ['Valdés', 'Muñoz', 'Rojas', 'Soto', 'Contreras', 'Silva', 'Sepúlveda', 'Araya'],
  },
  // ── Western Europe ─────────────────────────────────────────────────
  GBR: {
    first: ['James', 'Oliver', 'George', 'Thomas', 'William', 'Harry', 'Edward', 'Charlie'],
    last: ['Fletcher', 'Bennett', 'Clarke', 'Davies', 'Evans', 'Hughes', 'Morgan', 'Wright'],
  },
  FRA: {
    first: ['Édouard', 'Antoine', 'Julien', 'Mathieu', 'Hugo', 'Clément', 'Romain', 'Baptiste'],
    last: ['Blanc', 'Moreau', 'Leroy', 'Simon', 'Laurent', 'Michel', 'Lefèvre', 'Roux'],
  },
  DEU: {
    first: ['Hans', 'Maximilian', 'Felix', 'Jonas', 'Leon', 'Moritz', 'Niklas', 'Tim'],
    last: ['Schmidt', 'Müller', 'Schneider', 'Fischer', 'Weber', 'Wagner', 'Becker', 'Richter'],
  },
  ESP: {
    first: ['Miguel', 'Alejandro', 'Pablo', 'Javier', 'Daniel', 'Carlos', 'Adrián', 'Sergio'],
    last: ['Herrera', 'García', 'Martínez', 'López', 'Sánchez', 'Romero', 'Fernández', 'Ruiz'],
  },
  ITA: {
    first: ['Marco', 'Luca', 'Alessandro', 'Matteo', 'Lorenzo', 'Andrea', 'Davide', 'Fabio'],
    last: ['Rossi', 'Russo', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco'],
  },
  NLD: {
    first: ['Joost', 'Daan', 'Lars', 'Bram', 'Thijs', 'Sander', 'Ruben', 'Stijn'],
    last: ['Visser', 'De Vries', 'Van Dijk', 'Bakker', 'Jansen', 'Smit', 'De Boer', 'Mulder'],
  },
  PRT: {
    first: ['Diogo', 'Tiago', 'Gonçalo', 'André', 'Pedro', 'Rui', 'Nuno', 'Bruno'],
    last: ['Pereira', 'Santos', 'Ferreira', 'Costa', 'Oliveira', 'Rodrigues', 'Martins', 'Sousa'],
  },
  // ── Northern Europe ────────────────────────────────────────────────
  SWE: {
    first: ['Tobias', 'Emil', 'Oscar', 'Viktor', 'Gustav', 'Axel', 'Filip', 'Nils'],
    last: ['Bergström', 'Lindqvist', 'Johansson', 'Eriksson', 'Andersson', 'Karlsson', 'Nilsson', 'Svensson'],
  },
  NOR: {
    first: ['Erik', 'Magnus', 'Lars', 'Håkon', 'Kristian', 'Jonas', 'Eirik', 'Henrik'],
    last: ['Larsen', 'Hansen', 'Johansen', 'Olsen', 'Nilsen', 'Kristiansen', 'Berg', 'Haugen'],
  },
  DNK: {
    first: ['Søren', 'Mads', 'Rasmus', 'Kasper', 'Anders', 'Magnus', 'Frederik', 'Mikkel'],
    last: ['Holm', 'Jensen', 'Nielsen', 'Hansen', 'Andersen', 'Christensen', 'Larsen', 'Pedersen'],
  },
  FIN: {
    first: ['Lauri', 'Eero', 'Juhani', 'Mikko', 'Antti', 'Ville', 'Juha', 'Timo'],
    last: ['Mäkinen', 'Korhonen', 'Virtanen', 'Nieminen', 'Hämäläinen', 'Laine', 'Heikkinen', 'Koskinen'],
  },
  // ── Eastern Europe ─────────────────────────────────────────────────
  POL: {
    first: ['Tomasz', 'Krzysztof', 'Marcin', 'Paweł', 'Michał', 'Łukasz', 'Piotr', 'Jakub'],
    last: ['Wójcik', 'Kowalski', 'Nowak', 'Wiśniewski', 'Kamiński', 'Lewandowski', 'Zieliński', 'Dąbrowski'],
  },
  CZE: {
    first: ['Radek', 'Tomáš', 'Jakub', 'Pavel', 'Martin', 'Ondřej', 'Petr', 'Filip'],
    last: ['Novák', 'Svoboda', 'Dvořák', 'Černý', 'Procházka', 'Kučera', 'Veselý', 'Horák'],
  },
  ROU: {
    first: ['Alexandru', 'Andrei', 'Mihai', 'Ionuț', 'Marius', 'Cristian', 'Vlad', 'Bogdan'],
    last: ['Popa', 'Ionescu', 'Dumitrescu', 'Stan', 'Stoica', 'Marinescu', 'Gheorghe', 'Radu'],
  },
  // ── Southern Europe ────────────────────────────────────────────────
  GRC: {
    first: ['Nikos', 'Dimitris', 'Giorgos', 'Kostas', 'Yannis', 'Thanasis', 'Vasilis', 'Panagiotis'],
    last: ['Papadopoulos', 'Nikolaidis', 'Georgiou', 'Konstantinou', 'Pappas', 'Alexiou', 'Stavridis', 'Makris'],
  },
  HRV: {
    first: ['Ivan', 'Luka', 'Marko', 'Matej', 'Nikola', 'Tomislav', 'Petar', 'Ante'],
    last: ['Horvat', 'Kovačević', 'Babić', 'Marić', 'Jurić', 'Novak', 'Knežević', 'Vuković'],
  },
  // ── Africa ─────────────────────────────────────────────────────────
  ZAF: {
    first: ['Bongani', 'Thabo', 'Sipho', 'Pieter', 'Johan', 'Andile', 'Lebo', 'Mandla'],
    last: ['Dlamini', 'Nkosi', 'Ndlovu', 'Van der Merwe', 'Pretorius', 'Mokoena', 'Mthembu', 'Molefe'],
  },
  KEN: {
    first: ['James', 'David', 'Peter', 'Joseph', 'Daniel', 'Stephen', 'Samuel', 'Michael'],
    last: ['Mwangi', 'Kipchoge', 'Odhiambo', 'Wanjiru', 'Kamau', 'Mutua', 'Kiprotich', 'Korir'],
  },
  NGA: {
    first: ['Peter', 'Emeka', 'Chukwudi', 'Babatunde', 'Oluwaseun', 'Adewale', 'Ibrahim', 'Chidera'],
    last: ['Okonkwo', 'Adeyemi', 'Okafor', 'Balogun', 'Eze', 'Ogundipe', 'Nwosu', 'Abubakar'],
  },
  MAR: {
    first: ['Youssef', 'Amine', 'Mehdi', 'Omar', 'Hamza', 'Rachid', 'Khalid', 'Samir'],
    last: ['Berrada', 'El Amrani', 'Benali', 'Fassi', 'Tazi', 'Chraibi', 'Idrissi', 'Alaoui'],
  },
  EGY: {
    first: ['Ahmed', 'Mohamed', 'Youssef', 'Omar', 'Mahmoud', 'Khaled', 'Tarek', 'Mostafa'],
    last: ['Hassan', 'Ibrahim', 'Ali', 'Farouk', 'Sayed', 'Mansour', 'Abdel-Rahman', 'Soliman'],
  },
  // ── Europe (remaining) ─────────────────────────────────────────────
  IRL: {
    first: ['Cian', 'Seán', 'Conor', 'Liam', 'Oisín', 'Darragh', 'Fionn', 'Eoin'],
    last: ["O'Sullivan", "O'Brien", 'Murphy', 'Kelly', 'Walsh', 'Byrne', 'Ryan', 'Doyle'],
  },
  CHE: {
    first: ['Lukas', 'Fabian', 'Niklaus', 'Marc', 'David', 'Simon', 'Tobias', 'Patrick'],
    last: ['Meier', 'Müller', 'Schmid', 'Brunner', 'Keller', 'Weber', 'Baumann', 'Frei'],
  },
}

// ── Recent-name tracking (prevents immediate repeats) ───────────────

const recentNames = new Map<CountryCode, Set<string>>()
const MAX_RECENT = 3

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Generate a random full name for a given country.
 * Avoids repeating the last few names generated for that country.
 * Falls back to any combination if the pool is exhausted.
 */
export function generateName(countryCode: CountryCode): string {
  const pool = NAME_POOLS[countryCode]
  const recent = recentNames.get(countryCode) ?? new Set<string>()

  // Try up to 20 times to find a non-recent combination
  for (let i = 0; i < 20; i++) {
    const name = `${pickRandom(pool.first)} ${pickRandom(pool.last)}`
    if (!recent.has(name)) {
      // Track this name as recent
      recent.add(name)
      if (recent.size > MAX_RECENT) {
        // Remove the oldest entry (first inserted)
        const oldest = recent.values().next().value!
        recent.delete(oldest)
      }
      recentNames.set(countryCode, recent)
      return name
    }
  }

  // Fallback: return whatever we got (pool may be small)
  return `${pickRandom(pool.first)} ${pickRandom(pool.last)}`
}

export { NAME_POOLS }
export type { NamePool }
