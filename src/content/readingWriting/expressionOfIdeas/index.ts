import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as rsLesson, questions as rsQuestions } from './rhetoricalSynthesis'
import { lesson as trLesson, questions as trQuestions } from './transitions'

export function registerExpressionOfIdeas(): DomainMeta {
  registerContent('expression-of-ideas', 'rhetorical-synthesis', rsLesson, rsQuestions)
  registerContent('expression-of-ideas', 'transitions', trLesson, trQuestions)
  return {
    slug: 'expression-of-ideas',
    title: 'Expression of Ideas',
    subsections: [
      { slug: 'rhetorical-synthesis', title: 'Rhetorical Synthesis' },
      { slug: 'transitions', title: 'Transitions' },
    ],
  }
}
