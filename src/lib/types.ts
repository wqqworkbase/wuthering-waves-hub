export type Element = 'Glacio' | 'Fusion' | 'Electro' | 'Aero' | 'Spectro' | 'Havoc'
export type WeaponType = 'Sword' | 'Broadblade' | 'Pistols' | 'Gauntlets' | 'Rectifier'
export type Rarity = 5 | 4 | 3 | 2 | 1
export type Role = 'Main DPS' | 'Sub DPS' | 'Support' | 'Healer' | 'Shielder'
export type Tier = 'S+' | 'S' | 'A' | 'B' | 'C'

export interface CharacterFrontmatter {
  slug: string
  name: string
  element: Element
  weaponType: WeaponType
  rarity: Rarity
  role: Role
  image: string
  splashArt: string
  tier: Tier
  ascensionStat: string
  affiliation: string
  birthDate?: string
  voiceActors: { en: string; jp: string; cn: string }
}

export interface WeaponFrontmatter {
  slug: string
  name: string
  type: WeaponType
  rarity: Rarity
  image: string
  baseAtk: number
  subStat: string
  subStatValue: string
  effect: string
}

export interface EchoFrontmatter {
  slug: string
  name: string
  cost: 1 | 3 | 4
  element: Element
  class: 'Common' | 'Elite' | 'Overlord' | 'Calamity'
  image: string
  skill: string
  sonataEffects: string[]
}

export interface QuestFrontmatter {
  slug: string
  name: string
  type: 'Main' | 'Companion' | 'Side' | 'Exploration' | 'Daily'
  chapter: string
  requirements: string
  rewards: string
}

export interface ContentIndexItem {
  slug: string
  name: string
  element?: Element
  rarity?: Rarity
  weaponType?: WeaponType
  image?: string
}

export type ContentIndex = ContentIndexItem[]
