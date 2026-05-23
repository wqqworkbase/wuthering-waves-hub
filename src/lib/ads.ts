export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true'
export const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? ''

export const AD_SLOTS = {
  topBanner: process.env.NEXT_PUBLIC_ADSENSE_TOP_SLOT ?? '',
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT ?? '',
} as const
