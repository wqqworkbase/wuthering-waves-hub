import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}', './content/**/*.mdx'],
  theme: {
    extend: {
      colors: {
        ww: {
          cyan: '#00c7e6',
          'cyan-light': '#5ce0f5',
          'cyan-glow': 'rgba(0,199,230,0.25)',
          gold: '#e8a840',
          'gold-light': '#f5c96a',
          bg: '#f3f5f9',
          surface: '#ffffff',
          nav: 'rgba(255,255,255,0.85)',
          text: '#1e293b',
          muted: '#64748b',
          label: '#475569',
          border: '#e2e8f0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'ww-sm': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
        'ww-md': '0 4px 16px rgba(0,0,0,0.06), 0 2px 6px rgba(0,150,200,0.06)',
        'ww-lg': '0 8px 32px rgba(0,0,0,0.08), 0 0 40px rgba(0,180,220,0.08)',
        'ww-glow': '0 4px 16px rgba(0,199,230,0.25)',
      },
      borderRadius: {
        'ww': '12px',
        'ww-sm': '8px',
      },
    },
  },
  plugins: [],
}
export default config
