import { loadIndex } from '@/lib/content-loader'
import type { ContentIndex } from '@/lib/types'
import CharactersClient from './CharactersClient'

export default function CharactersPage() {
  const index: ContentIndex = loadIndex('characters')
  return <CharactersClient index={index} />
}
