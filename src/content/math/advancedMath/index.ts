import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as nefLesson, questions as nefQuestions } from './nonlinearEquationsFunctions'
import { lesson as eeLesson, questions as eeQuestions } from './equivalentExpressions'

export function registerAdvancedMath(): DomainMeta {
  registerContent('advanced-math', 'nonlinear-equations-functions', nefLesson, nefQuestions)
  registerContent('advanced-math', 'equivalent-expressions', eeLesson, eeQuestions)
  return {
    slug: 'advanced-math',
    title: 'Advanced Math',
    subsections: [
      { slug: 'nonlinear-equations-functions', title: 'Nonlinear Equations and Functions' },
      { slug: 'equivalent-expressions', title: 'Equivalent Expressions' },
    ],
  }
}
