export default function Footer() {
  return (
    <footer className="border-t border-ww-border bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-8 text-center text-xs text-ww-muted space-y-1">
        <p>WUWA.wiki is a fan-made resource hub. Not affiliated with Kuro Games.</p>
        <p>&copy; {new Date().getFullYear()} WUWA.wiki &mdash; All game assets belong to their respective owners.</p>
      </div>
    </footer>
  )
}
