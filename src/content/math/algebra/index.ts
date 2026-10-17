import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as leovLesson, questions as leovQuestions } from './linearEquationsOneVariable'
import { lesson as letvLesson, questions as letvQuestions } from './linearEquationsTwoVariables'
import { lesson as soeLesson, questions as soeQuestions } from './systemsOfEquations'

export function registerAlgebra(): DomainMeta {
  registerContent('algebra', 'linear-equations-one-variable', leovLesson, leovQuestions)
  registerContent('algebra', 'linear-equations-two-variables', letvLesson, letvQuestions)
  registerContent('algebra', 'systems-of-equations', soeLesson, soeQuestions)
  return {
    slug: 'algebra',
    title: 'Algebra',
    subsections: [
      { slug: 'linear-equations-one-variable', title: 'Linear Equations in One Variable' },
      { slug: 'linear-equations-two-variables', title: 'Linear Equations in Two Variables' },
      { slug: 'systems-of-equations', title: 'Systems of Equations' },
    ],
  }
}
