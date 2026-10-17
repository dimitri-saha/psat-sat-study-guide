import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as wicLesson, questions as wicQuestions } from './wordsInContext'
import { lesson as tspLesson, questions as tspQuestions } from './textStructurePurpose'
import { lesson as ctcLesson, questions as ctcQuestions } from './crossTextConnections'

export function registerCraftAndStructure(): DomainMeta {
  registerContent('craft-and-structure', 'words-in-context', wicLesson, wicQuestions)
  registerContent('craft-and-structure', 'text-structure-purpose', tspLesson, tspQuestions)
  registerContent('craft-and-structure', 'cross-text-connections', ctcLesson, ctcQuestions)
  return {
    slug: 'craft-and-structure',
    title: 'Craft and Structure',
    subsections: [
      { slug: 'words-in-context', title: 'Words in Context' },
      { slug: 'text-structure-purpose', title: 'Text Structure and Purpose' },
      { slug: 'cross-text-connections', title: 'Cross-Text Connections' },
    ],
  }
}
