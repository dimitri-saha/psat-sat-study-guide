import type { SectionMeta } from './types'
import { registerInformationAndIdeas } from './readingWriting/informationAndIdeas'
import { registerCraftAndStructure } from './readingWriting/craftAndStructure'
import { registerExpressionOfIdeas } from './readingWriting/expressionOfIdeas'

export { getLesson, getQuestions } from './registry'

export const sections: SectionMeta[] = [
  {
    slug: 'reading-writing',
    title: 'Reading & Writing',
    domains: [registerInformationAndIdeas(), registerCraftAndStructure(), registerExpressionOfIdeas()],
  },
]
