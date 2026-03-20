import type { CountryCode } from '../types'

export interface CountryData {
  code: CountryCode
  name: string
  athleteName: string
}

/**
 * The 50 countries on the world tour, each with a default athlete name.
 * Country slots are permanent — only the athlete occupying them changes.
 */
export const COUNTRIES: readonly CountryData[] = [
  { code: 'ARG', name: 'Argentina',      athleteName: 'Alejandro Ponce' },
  { code: 'AUS', name: 'Australia',      athleteName: 'Liam Nguyen' },
  { code: 'AUT', name: 'Austria',        athleteName: 'Stefan Huber' },
  { code: 'BEL', name: 'Belgium',        athleteName: 'Pieter Claes' },
  { code: 'BRA', name: 'Brazil',         athleteName: 'Carlos Souza' },
  { code: 'CAN', name: 'Canada',         athleteName: 'Lucas Tremblay' },
  { code: 'CHE', name: 'Switzerland',    athleteName: 'Lukas Meier' },
  { code: 'CHN', name: 'China',          athleteName: 'Chen Wei' },
  { code: 'CMR', name: 'Cameroon',       athleteName: 'Jean-Paul Mbida' },
  { code: 'CZE', name: 'Czech Republic', athleteName: 'Radek Novák' },
  { code: 'DEU', name: 'Germany',        athleteName: 'Hans Schmidt' },
  { code: 'DNK', name: 'Denmark',        athleteName: 'Søren Holm' },
  { code: 'EGY', name: 'Egypt',          athleteName: 'Ahmed Hassan' },
  { code: 'ESP', name: 'Spain',          athleteName: 'Miguel Herrera' },
  { code: 'ETH', name: 'Ethiopia',       athleteName: 'Dawit Girma' },
  { code: 'FIN', name: 'Finland',        athleteName: 'Lauri Mäkinen' },
  { code: 'FRA', name: 'France',         athleteName: 'Édouard Blanc' },
  { code: 'GBR', name: 'Great Britain',  athleteName: 'James Fletcher' },
  { code: 'GHA', name: 'Ghana',          athleteName: 'Kwame Asante' },
  { code: 'GRC', name: 'Greece',         athleteName: 'Nikos Papadopoulos' },
  { code: 'HRV', name: 'Croatia',        athleteName: 'Ivan Horvat' },
  { code: 'HUN', name: 'Hungary',        athleteName: 'Gábor Vásárhelyi' },
  { code: 'IND', name: 'India',          athleteName: 'Arjun Sharma' },
  { code: 'IRN', name: 'Iran',           athleteName: 'Dariush Karimi' },
  { code: 'ITA', name: 'Italy',          athleteName: 'Marco Rossi' },
  { code: 'JPN', name: 'Japan',          athleteName: 'Akira Nakamura' },
  { code: 'KEN', name: 'Kenya',          athleteName: 'James Mwangi' },
  { code: 'KOR', name: 'South Korea',    athleteName: 'Soo-Jin Park' },
  { code: 'MAR', name: 'Morocco',        athleteName: 'Youssef Berrada' },
  { code: 'MEX', name: 'Mexico',         athleteName: 'Rodrigo Fuentes' },
  { code: 'NGA', name: 'Nigeria',        athleteName: 'Peter Okonkwo' },
  { code: 'NLD', name: 'Netherlands',    athleteName: 'Joost Visser' },
  { code: 'NOR', name: 'Norway',         athleteName: 'Erik Larsen' },
  { code: 'NZL', name: 'New Zealand',    athleteName: 'Sam Cooper' },
  { code: 'PAK', name: 'Pakistan',       athleteName: 'Bilal Chaudhry' },
  { code: 'POL', name: 'Poland',         athleteName: 'Tomasz Wójcik' },
  { code: 'PRT', name: 'Portugal',       athleteName: 'Diogo Pereira' },
  { code: 'ROU', name: 'Romania',        athleteName: 'Alexandru Popa' },
  { code: 'RUS', name: 'Russia',         athleteName: 'Dmitri Voronov' },
  { code: 'SEN', name: 'Senegal',        athleteName: 'Ousmane Diallo' },
  { code: 'SRB', name: 'Serbia',         athleteName: 'Nikola Marković' },
  { code: 'SWE', name: 'Sweden',         athleteName: 'Tobias Bergström' },
  { code: 'TUN', name: 'Tunisia',        athleteName: 'Karim Ben Salem' },
  { code: 'TUR', name: 'Turkey',         athleteName: 'Mehmet Yıldız' },
  { code: 'TZA', name: 'Tanzania',       athleteName: 'Emmanuel Mwamba' },
  { code: 'UGA', name: 'Uganda',         athleteName: 'Moses Okello' },
  { code: 'UKR', name: 'Ukraine',        athleteName: 'Oleksiy Bondar' },
  { code: 'USA', name: 'United States',  athleteName: 'Tyler Brooks' },
  { code: 'ZAF', name: 'South Africa',   athleteName: 'Bongani Dlamini' },
  { code: 'ZMB', name: 'Zambia',         athleteName: 'Kabelo Mbeki' },
]
