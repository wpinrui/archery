import type { Country } from '../types'

export interface CountryData extends Country {
  athleteName: string
}

/**
 * The 50 countries on the world tour, each with a default athlete name.
 * Country slots are permanent — only the athlete occupying them changes.
 */
export const COUNTRIES: readonly CountryData[] = [
  // East Asia
  { code: 'KOR', name: 'South Korea',    athleteName: 'Soo-Jin Park' },
  { code: 'JPN', name: 'Japan',          athleteName: 'Akira Nakamura' },
  { code: 'CHN', name: 'China',          athleteName: 'Chen Wei' },
  { code: 'TWN', name: 'Taiwan',         athleteName: 'Lin Cheng' },
  { code: 'MNG', name: 'Mongolia',       athleteName: 'Batbayar Erdene' },
  { code: 'HKG', name: 'Hong Kong',      athleteName: 'Wong Kai-Ming' },
  // Southeast Asia
  { code: 'SGP', name: 'Singapore',      athleteName: 'Tan Wei Jie' },
  { code: 'IDN', name: 'Indonesia',      athleteName: 'Adi Pratama' },
  { code: 'PHL', name: 'Philippines',    athleteName: 'Rafael Santos' },
  { code: 'THA', name: 'Thailand',       athleteName: 'Somchai Prasert' },
  { code: 'VNM', name: 'Vietnam',        athleteName: 'Nguyen Minh Duc' },
  { code: 'MYS', name: 'Malaysia',       athleteName: 'Ahmad Rizal' },
  // South Asia
  { code: 'IND', name: 'India',          athleteName: 'Arjun Sharma' },
  { code: 'NPL', name: 'Nepal',          athleteName: 'Sanjay Tamang' },
  // Central / West Asia
  { code: 'TUR', name: 'Turkey',         athleteName: 'Mehmet Yıldız' },
  { code: 'KAZ', name: 'Kazakhstan',     athleteName: 'Nursultan Akhmetov' },
  // Oceania
  { code: 'AUS', name: 'Australia',      athleteName: 'Liam Nguyen' },
  { code: 'NZL', name: 'New Zealand',    athleteName: 'Sam Cooper' },
  // North America
  { code: 'USA', name: 'United States',  athleteName: 'Tyler Brooks' },
  { code: 'CAN', name: 'Canada',         athleteName: 'Lucas Tremblay' },
  { code: 'MEX', name: 'Mexico',         athleteName: 'Rodrigo Fuentes' },
  // Central America & Caribbean
  { code: 'CRI', name: 'Costa Rica',     athleteName: 'Andrés Solano' },
  { code: 'JAM', name: 'Jamaica',        athleteName: 'Andre Campbell' },
  // South America
  { code: 'BRA', name: 'Brazil',         athleteName: 'Carlos Souza' },
  { code: 'ARG', name: 'Argentina',      athleteName: 'Alejandro Ponce' },
  { code: 'COL', name: 'Colombia',       athleteName: 'Santiago Restrepo' },
  { code: 'CHL', name: 'Chile',          athleteName: 'Matías Valdés' },
  // Western Europe
  { code: 'GBR', name: 'United Kingdom', athleteName: 'James Fletcher' },
  { code: 'FRA', name: 'France',         athleteName: 'Édouard Blanc' },
  { code: 'DEU', name: 'Germany',        athleteName: 'Hans Schmidt' },
  { code: 'ESP', name: 'Spain',          athleteName: 'Miguel Herrera' },
  { code: 'ITA', name: 'Italy',          athleteName: 'Marco Rossi' },
  { code: 'NLD', name: 'Netherlands',    athleteName: 'Joost Visser' },
  { code: 'PRT', name: 'Portugal',       athleteName: 'Diogo Pereira' },
  // Northern Europe
  { code: 'SWE', name: 'Sweden',         athleteName: 'Tobias Bergström' },
  { code: 'NOR', name: 'Norway',         athleteName: 'Erik Larsen' },
  { code: 'DNK', name: 'Denmark',        athleteName: 'Søren Holm' },
  { code: 'FIN', name: 'Finland',        athleteName: 'Lauri Mäkinen' },
  // Eastern Europe
  { code: 'POL', name: 'Poland',         athleteName: 'Tomasz Wójcik' },
  { code: 'CZE', name: 'Czech Republic', athleteName: 'Radek Novák' },
  { code: 'ROU', name: 'Romania',        athleteName: 'Alexandru Popa' },
  // Southern Europe
  { code: 'GRC', name: 'Greece',         athleteName: 'Nikos Papadopoulos' },
  { code: 'HRV', name: 'Croatia',        athleteName: 'Ivan Horvat' },
  // Africa
  { code: 'ZAF', name: 'South Africa',   athleteName: 'Bongani Dlamini' },
  { code: 'KEN', name: 'Kenya',          athleteName: 'James Mwangi' },
  { code: 'NGA', name: 'Nigeria',        athleteName: 'Peter Okonkwo' },
  { code: 'MAR', name: 'Morocco',        athleteName: 'Youssef Berrada' },
  { code: 'EGY', name: 'Egypt',          athleteName: 'Ahmed Hassan' },
  // Europe (remaining)
  { code: 'IRL', name: 'Ireland',        athleteName: 'Cian O\'Sullivan' },
  { code: 'CHE', name: 'Switzerland',    athleteName: 'Lukas Meier' },
]
