import type { Element, WeaponType } from './types'

export const ELEMENTS: Element[] = ['Glacio', 'Fusion', 'Electro', 'Aero', 'Spectro', 'Havoc']

export const WEAPON_TYPES: WeaponType[] = ['Sword', 'Broadblade', 'Pistols', 'Gauntlets', 'Rectifier']

export const ELEMENT_COLORS: Record<Element, { bg: string; text: string; border: string; gradient: string }> = {
  Glacio:   { bg: '#d4eafc', text: '#0c4a6e', border: '#7dd3fc', gradient: 'from-blue-100 to-blue-50' },
  Fusion:   { bg: '#fce0d4', text: '#7c2d12', border: '#fdba74', gradient: 'from-orange-100 to-orange-50' },
  Electro:  { bg: '#e8e0fc', text: '#4c1d95', border: '#c4b5fd', gradient: 'from-purple-100 to-purple-50' },
  Aero:     { bg: '#d4fce0', text: '#14532d', border: '#86efac', gradient: 'from-emerald-100 to-emerald-50' },
  Spectro:  { bg: '#fcf8d4', text: '#713f12', border: '#fde68a', gradient: 'from-yellow-100 to-yellow-50' },
  Havoc:    { bg: '#f0d4fc', text: '#4a1942', border: '#e879f9', gradient: 'from-fuchsia-100 to-fuchsia-50' },
}

export const RARITY_COLORS: Record<number, { star: string; badge: string }> = {
  5: { star: 'text-amber-400', badge: 'bg-amber-100 text-amber-800' },
  4: { star: 'text-purple-400', badge: 'bg-purple-100 text-purple-800' },
  3: { star: 'text-blue-400', badge: 'bg-blue-100 text-blue-800' },
  2: { star: 'text-green-400', badge: 'bg-green-100 text-green-800' },
  1: { star: 'text-gray-400', badge: 'bg-gray-100 text-gray-600' },
}

export const TIER_COLORS: Record<string, string> = {
  'S+': 'text-ww-cyan',
  'S':  'text-ww-gold',
  'A':  'text-purple-500',
  'B':  'text-blue-500',
  'C':  'text-gray-400',
}

export const ELEMENT_ICONS: Record<Element, string> = {
  Glacio:   '/images/ui/glacio.svg',
  Fusion:   '/images/ui/fusion.svg',
  Electro:  '/images/ui/electro.svg',
  Aero:     '/images/ui/aero.svg',
  Spectro:  '/images/ui/spectro.svg',
  Havoc:    '/images/ui/havoc.svg',
}

export const WEAPON_ICONS: Record<WeaponType, string> = {
  Sword:      '/images/ui/sword.svg',
  Broadblade: '/images/ui/broadblade.svg',
  Pistols:    '/images/ui/pistols.svg',
  Gauntlets:  '/images/ui/gauntlets.svg',
  Rectifier:  '/images/ui/rectifier.svg',
}
