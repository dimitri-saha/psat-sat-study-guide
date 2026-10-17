import type { SectionMeta } from './types'
import { registerInformationAndIdeas } from './readingWriting/informationAndIdeas'
import { registerCraftAndStructure } from './readingWriting/craftAndStructure'
import { registerExpressionOfIdeas } from './readingWriting/expressionOfIdeas'
import { registerStandardEnglishConventions } from './readingWriting/standardEnglishConventions'
import { registerAlgebra } from './math/algebra'
import { registerAdvancedMath } from './math/advancedMath'
import { registerProblemSolvingDataAnalysis } from './math/problemSolvingDataAnalysis'
import { registerGeometryAndTrigonometry } from './math/geometryAndTrigonometry'

export { getLesson, getQuestions } from './registry'

export const sections: SectionMeta[] = [
  {
    slug: 'reading-writing',
    title: 'Reading & Writing',
    domains: [
      registerInformationAndIdeas(),
      registerCraftAndStructure(),
      registerExpressionOfIdeas(),
      registerStandardEnglishConventions(),
    ],
  },
  {
    slug: 'math',
    title: 'Math',
    domains: [
      registerAlgebra(),
      registerAdvancedMath(),
      registerProblemSolvingDataAnalysis(),
      registerGeometryAndTrigonometry(),
    ],
  },
]
