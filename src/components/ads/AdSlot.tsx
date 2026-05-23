import Script from 'next/script'
import { ADS_ENABLED, PUBLISHER_ID } from '@/lib/ads'

type AdSize = '728x90' | '300x250' | '300x600'

interface Props {
  slotId: string
  size: AdSize
  className?: string
}

export default function AdSlot({ slotId, size, className = '' }: Props) {
  // Placeholder mode — development / ads disabled
  if (!ADS_ENABLED || !PUBLISHER_ID) {
    const [w, h] = size.split('x').map(Number)
    return (
      <div
        className={`bg-slate-50 border border-dashed border-slate-300 rounded-ww
                    flex flex-col items-center justify-center gap-1.5 mx-auto ${className}`}
        style={{ width: '100%', maxWidth: `${w}px`, minHeight: `${h}px` }}
      >
        <span className="text-[0.6rem] font-bold uppercase tracking-wider text-slate-400 select-none">Advertisement</span>
        <span className="text-[0.7rem] text-slate-400 select-none">{size}</span>
      </div>
    )
  }

  // Production mode
  return (
    <div className={`mx-auto ${className}`} style={{ width: '100%', maxWidth: `${size.split('x')[0]}px` }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id="adsbygoogle-init" strategy="afterInteractive">
        {'(adsbygoogle = window.adsbygoogle || []).push({})'}
      </Script>
    </div>
  )
}
