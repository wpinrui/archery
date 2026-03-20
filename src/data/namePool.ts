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
  ARG: {
    first: ['Alejandro', 'Matías', 'Santiago', 'Nicolás', 'Facundo', 'Leandro', 'Gonzalo', 'Sebastián'],
    last: ['Ponce', 'Fernández', 'Álvarez', 'Romero', 'Gutiérrez', 'Acosta', 'Morales', 'Díaz'],
  },
  AUS: {
    first: ['Liam', 'Jack', 'Noah', 'Oliver', 'Ethan', 'Cooper', 'Riley', 'Harry'],
    last: ['Nguyen', 'Smith', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Kelly', 'Robinson'],
  },
  AUT: {
    first: ['Stefan', 'Florian', 'Markus', 'Lukas', 'Dominik', 'Philipp', 'Matthias', 'Georg'],
    last: ['Huber', 'Wagner', 'Gruber', 'Bauer', 'Steiner', 'Moser', 'Hofer', 'Berger'],
  },
  BEL: {
    first: ['Pieter', 'Sander', 'Jens', 'Thibault', 'Wout', 'Bram', 'Maxime', 'Ruben'],
    last: ['Claes', 'Peeters', 'Janssens', 'Willems', 'Dupont', 'Mertens', 'De Smedt', 'Maes'],
  },
  BRA: {
    first: ['Carlos', 'Rafael', 'Henrique', 'Thiago', 'Gustavo', 'Matheus', 'Leonardo', 'Bruno'],
    last: ['Souza', 'Oliveira', 'Santos', 'Ferreira', 'Pereira', 'Costa', 'Almeida', 'Ribeiro'],
  },
  CAN: {
    first: ['Lucas', 'Étienne', 'Nathan', 'William', 'Samuel', 'Gabriel', 'Alexis', 'Benjamin'],
    last: ['Tremblay', 'Roy', 'Gagnon', 'Martin', 'Campbell', 'Anderson', 'Thompson', 'Côté'],
  },
  CHE: {
    first: ['Lukas', 'Fabian', 'Niklaus', 'Marc', 'David', 'Simon', 'Tobias', 'Patrick'],
    last: ['Meier', 'Müller', 'Schmid', 'Brunner', 'Keller', 'Weber', 'Baumann', 'Frei'],
  },
  CHN: {
    first: ['Chen', 'Wang', 'Zhang', 'Liu', 'Li', 'Yang', 'Zhao', 'Huang'],
    last: ['Wei', 'Jun', 'Hao', 'Lei', 'Ming', 'Tao', 'Peng', 'Feng'],
  },
  CMR: {
    first: ['Jean-Paul', 'Franck', 'Hervé', 'Patrick', 'Samuel', 'Emmanuel', 'Pierre', 'Stéphane'],
    last: ['Mbida', 'Ndongo', 'Tamba', 'Fotso', 'Kamga', 'Nkoulou', 'Etundi', 'Onana'],
  },
  CZE: {
    first: ['Radek', 'Tomáš', 'Jakub', 'Pavel', 'Martin', 'Ondřej', 'Petr', 'Filip'],
    last: ['Novák', 'Svoboda', 'Dvořák', 'Černý', 'Procházka', 'Kučera', 'Veselý', 'Horák'],
  },
  DEU: {
    first: ['Hans', 'Maximilian', 'Felix', 'Jonas', 'Leon', 'Moritz', 'Niklas', 'Tim'],
    last: ['Schmidt', 'Müller', 'Schneider', 'Fischer', 'Weber', 'Wagner', 'Becker', 'Richter'],
  },
  DNK: {
    first: ['Søren', 'Mads', 'Rasmus', 'Kasper', 'Anders', 'Magnus', 'Frederik', 'Mikkel'],
    last: ['Holm', 'Jensen', 'Nielsen', 'Hansen', 'Andersen', 'Christensen', 'Larsen', 'Pedersen'],
  },
  EGY: {
    first: ['Ahmed', 'Mohamed', 'Youssef', 'Omar', 'Mahmoud', 'Khaled', 'Tarek', 'Mostafa'],
    last: ['Hassan', 'Ibrahim', 'Ali', 'Farouk', 'Sayed', 'Mansour', 'Abdel-Rahman', 'Soliman'],
  },
  ESP: {
    first: ['Miguel', 'Alejandro', 'Pablo', 'Javier', 'Daniel', 'Carlos', 'Adrián', 'Sergio'],
    last: ['Herrera', 'García', 'Martínez', 'López', 'Sánchez', 'Romero', 'Fernández', 'Ruiz'],
  },
  ETH: {
    first: ['Dawit', 'Yonas', 'Biruk', 'Abel', 'Nahom', 'Tewodros', 'Henok', 'Kidus'],
    last: ['Girma', 'Bekele', 'Tadesse', 'Gebremedhin', 'Desta', 'Haile', 'Abebe', 'Mekonnen'],
  },
  FIN: {
    first: ['Lauri', 'Eero', 'Juhani', 'Mikko', 'Antti', 'Ville', 'Juha', 'Timo'],
    last: ['Mäkinen', 'Korhonen', 'Virtanen', 'Nieminen', 'Hämäläinen', 'Laine', 'Heikkinen', 'Koskinen'],
  },
  FRA: {
    first: ['Édouard', 'Antoine', 'Julien', 'Mathieu', 'Hugo', 'Clément', 'Romain', 'Baptiste'],
    last: ['Blanc', 'Moreau', 'Leroy', 'Simon', 'Laurent', 'Michel', 'Lefèvre', 'Roux'],
  },
  GBR: {
    first: ['James', 'Oliver', 'George', 'Thomas', 'William', 'Harry', 'Edward', 'Charlie'],
    last: ['Fletcher', 'Bennett', 'Clarke', 'Davies', 'Evans', 'Hughes', 'Morgan', 'Wright'],
  },
  GHA: {
    first: ['Kwame', 'Kofi', 'Yaw', 'Kwesi', 'Nana', 'Akwasi', 'Kwaku', 'Kojo'],
    last: ['Asante', 'Mensah', 'Boateng', 'Owusu', 'Agyemang', 'Appiah', 'Osei', 'Antwi'],
  },
  GRC: {
    first: ['Nikos', 'Dimitris', 'Giorgos', 'Kostas', 'Yannis', 'Thanasis', 'Vasilis', 'Panagiotis'],
    last: ['Papadopoulos', 'Nikolaidis', 'Georgiou', 'Konstantinou', 'Pappas', 'Alexiou', 'Stavridis', 'Makris'],
  },
  HRV: {
    first: ['Ivan', 'Luka', 'Marko', 'Matej', 'Nikola', 'Tomislav', 'Petar', 'Ante'],
    last: ['Horvat', 'Kovačević', 'Babić', 'Marić', 'Jurić', 'Novak', 'Knežević', 'Vuković'],
  },
  HUN: {
    first: ['Gábor', 'László', 'Zoltán', 'István', 'Attila', 'Péter', 'Tamás', 'Dániel'],
    last: ['Vásárhelyi', 'Tóth', 'Nagy', 'Kovács', 'Szabó', 'Horváth', 'Farkas', 'Molnár'],
  },
  IND: {
    first: ['Arjun', 'Vikram', 'Rohit', 'Amit', 'Rajesh', 'Suresh', 'Deepak', 'Anil'],
    last: ['Sharma', 'Singh', 'Patel', 'Kumar', 'Gupta', 'Reddy', 'Nair', 'Verma'],
  },
  IRN: {
    first: ['Dariush', 'Reza', 'Ali', 'Mehdi', 'Amir', 'Saeed', 'Hossein', 'Farhad'],
    last: ['Karimi', 'Hosseini', 'Mohammadi', 'Ahmadi', 'Rezaei', 'Mousavi', 'Hashemi', 'Moradi'],
  },
  ITA: {
    first: ['Marco', 'Luca', 'Alessandro', 'Matteo', 'Lorenzo', 'Andrea', 'Davide', 'Fabio'],
    last: ['Rossi', 'Russo', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco'],
  },
  JPN: {
    first: ['Akira', 'Haruto', 'Yuto', 'Sota', 'Kaito', 'Ren', 'Takumi', 'Daiki'],
    last: ['Nakamura', 'Tanaka', 'Suzuki', 'Yamamoto', 'Sato', 'Watanabe', 'Kobayashi', 'Ito'],
  },
  KEN: {
    first: ['James', 'David', 'Peter', 'Joseph', 'Daniel', 'Stephen', 'Samuel', 'Michael'],
    last: ['Mwangi', 'Kipchoge', 'Odhiambo', 'Wanjiru', 'Kamau', 'Mutua', 'Kiprotich', 'Korir'],
  },
  KOR: {
    first: ['Soo-Jin', 'Min-Ho', 'Jun-Seo', 'Hyun-Woo', 'Jae-Won', 'Dong-Hyun', 'Sung-Min', 'Tae-Hyung'],
    last: ['Park', 'Kim', 'Lee', 'Choi', 'Jung', 'Kang', 'Yoon', 'Shin'],
  },
  MAR: {
    first: ['Youssef', 'Amine', 'Mehdi', 'Omar', 'Hamza', 'Rachid', 'Khalid', 'Samir'],
    last: ['Berrada', 'El Amrani', 'Benali', 'Fassi', 'Tazi', 'Chraibi', 'Idrissi', 'Alaoui'],
  },
  MEX: {
    first: ['Rodrigo', 'Diego', 'Andrés', 'Luis', 'Fernando', 'Emilio', 'Jorge', 'Ricardo'],
    last: ['Fuentes', 'Hernández', 'López', 'González', 'Ramírez', 'Torres', 'Reyes', 'Castillo'],
  },
  NGA: {
    first: ['Peter', 'Emeka', 'Chukwudi', 'Babatunde', 'Oluwaseun', 'Adewale', 'Ibrahim', 'Chidera'],
    last: ['Okonkwo', 'Adeyemi', 'Okafor', 'Balogun', 'Eze', 'Ogundipe', 'Nwosu', 'Abubakar'],
  },
  NLD: {
    first: ['Joost', 'Daan', 'Lars', 'Bram', 'Thijs', 'Sander', 'Ruben', 'Stijn'],
    last: ['Visser', 'De Vries', 'Van Dijk', 'Bakker', 'Jansen', 'Smit', 'De Boer', 'Mulder'],
  },
  NOR: {
    first: ['Erik', 'Magnus', 'Lars', 'Håkon', 'Kristian', 'Jonas', 'Eirik', 'Henrik'],
    last: ['Larsen', 'Hansen', 'Johansen', 'Olsen', 'Nilsen', 'Kristiansen', 'Berg', 'Haugen'],
  },
  NZL: {
    first: ['Sam', 'Josh', 'Ben', 'Luke', 'Finn', 'Connor', 'Lachlan', 'Caleb'],
    last: ['Cooper', 'Wilson', 'Taylor', 'Anderson', 'Mitchell', 'Harris', 'Walker', 'King'],
  },
  PAK: {
    first: ['Bilal', 'Usman', 'Ali', 'Hassan', 'Faisal', 'Adnan', 'Kamran', 'Rizwan'],
    last: ['Chaudhry', 'Khan', 'Ahmed', 'Malik', 'Iqbal', 'Hussain', 'Raza', 'Sheikh'],
  },
  POL: {
    first: ['Tomasz', 'Krzysztof', 'Marcin', 'Paweł', 'Michał', 'Łukasz', 'Piotr', 'Jakub'],
    last: ['Wójcik', 'Kowalski', 'Nowak', 'Wiśniewski', 'Kamiński', 'Lewandowski', 'Zieliński', 'Dąbrowski'],
  },
  PRT: {
    first: ['Diogo', 'Tiago', 'Gonçalo', 'André', 'Pedro', 'Rui', 'Nuno', 'Bruno'],
    last: ['Pereira', 'Santos', 'Ferreira', 'Costa', 'Oliveira', 'Rodrigues', 'Martins', 'Sousa'],
  },
  ROU: {
    first: ['Alexandru', 'Andrei', 'Mihai', 'Ionuț', 'Marius', 'Cristian', 'Vlad', 'Bogdan'],
    last: ['Popa', 'Ionescu', 'Dumitrescu', 'Stan', 'Stoica', 'Marinescu', 'Gheorghe', 'Radu'],
  },
  RUS: {
    first: ['Dmitri', 'Andrei', 'Sergei', 'Alexei', 'Mikhail', 'Nikolai', 'Pavel', 'Viktor'],
    last: ['Voronov', 'Petrov', 'Sokolov', 'Kuznetsov', 'Popov', 'Lebedev', 'Novikov', 'Morozov'],
  },
  SEN: {
    first: ['Ousmane', 'Moussa', 'Ibrahima', 'Mamadou', 'Cheikh', 'Abdoulaye', 'Pape', 'Modou'],
    last: ['Diallo', 'Diop', 'Ndiaye', 'Fall', 'Sow', 'Ba', 'Gueye', 'Sarr'],
  },
  SRB: {
    first: ['Nikola', 'Aleksandar', 'Stefan', 'Lazar', 'Nemanja', 'Dušan', 'Miloš', 'Branislav'],
    last: ['Marković', 'Jovanović', 'Petrović', 'Nikolić', 'Đorđević', 'Stojanović', 'Ilić', 'Pavlović'],
  },
  SWE: {
    first: ['Tobias', 'Emil', 'Oscar', 'Viktor', 'Gustav', 'Axel', 'Filip', 'Nils'],
    last: ['Bergström', 'Lindqvist', 'Johansson', 'Eriksson', 'Andersson', 'Karlsson', 'Nilsson', 'Svensson'],
  },
  TUN: {
    first: ['Karim', 'Nabil', 'Raouf', 'Anis', 'Samir', 'Wissem', 'Chaker', 'Fathi'],
    last: ['Ben Salem', 'Trabelsi', 'Bouazizi', 'Hammami', 'Jebali', 'Khelifi', 'Maaloul', 'Sassi'],
  },
  TUR: {
    first: ['Mehmet', 'Emre', 'Burak', 'Cem', 'Oğuz', 'Serkan', 'Tolga', 'Barış'],
    last: ['Yıldız', 'Demir', 'Kaya', 'Çelik', 'Şahin', 'Yılmaz', 'Öztürk', 'Aydın'],
  },
  TZA: {
    first: ['Emmanuel', 'Baraka', 'Juma', 'Rashid', 'Hamisi', 'Daudi', 'Salum', 'Goodluck'],
    last: ['Mwamba', 'Kimaro', 'Msangi', 'Mfinanga', 'Swai', 'Mushi', 'Lyimo', 'Massawe'],
  },
  UGA: {
    first: ['Moses', 'Ronald', 'Brian', 'Dennis', 'Ivan', 'Timothy', 'Martin', 'Geoffrey'],
    last: ['Okello', 'Ouma', 'Kato', 'Ssemakula', 'Mubiru', 'Lubega', 'Nakamya', 'Tumusiime'],
  },
  UKR: {
    first: ['Oleksiy', 'Andriy', 'Dmytro', 'Taras', 'Bohdan', 'Yuriy', 'Mykola', 'Serhiy'],
    last: ['Bondar', 'Kovalenko', 'Shevchenko', 'Tkachenko', 'Kravchenko', 'Polishchuk', 'Lysenko', 'Marchenko'],
  },
  USA: {
    first: ['Tyler', 'Ryan', 'Jake', 'Caleb', 'Mason', 'Dylan', 'Ethan', 'Logan'],
    last: ['Brooks', 'Johnson', 'Williams', 'Miller', 'Davis', 'Garcia', 'Martinez', 'Anderson'],
  },
  ZAF: {
    first: ['Bongani', 'Thabo', 'Sipho', 'Pieter', 'Johan', 'Andile', 'Lebo', 'Mandla'],
    last: ['Dlamini', 'Nkosi', 'Ndlovu', 'Van der Merwe', 'Pretorius', 'Mokoena', 'Mthembu', 'Molefe'],
  },
  ZMB: {
    first: ['Kabelo', 'Chilufya', 'Mwansa', 'Bwalya', 'Mutale', 'Nkandu', 'Chanda', 'Mulenga'],
    last: ['Mbeki', 'Banda', 'Mwale', 'Phiri', 'Tembo', 'Zulu', 'Mbewe', 'Sakala'],
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
