import { execSync } from 'child_process'

const scripts = [
  ['Discovering pages', 'npx tsx scripts/fetch-page-list.ts'],
  ['Fetching page content', 'npx tsx scripts/fetch-page-content.ts'],
  ['Downloading images', 'npx tsx scripts/download-images.ts'],
  ['Transforming to content files', 'npx tsx scripts/transform-to-content.ts'],
]

for (const [label, cmd] of scripts) {
  console.log(`\n=== ${label} ===`)
  try {
    execSync(cmd, { stdio: 'inherit' })
  } catch (err) {
    console.error(`Failed: ${label}`)
    process.exit(1)
  }
}

console.log('\n=== All done! ===')
console.log('Run `npm run build` to generate the static site.')
