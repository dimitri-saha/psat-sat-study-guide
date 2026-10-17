import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as rrpLesson, questions as rrpQuestions } from './ratiosRatesProportions'
import { lesson as pctLesson, questions as pctQuestions } from './percentages'
import { lesson as dapLesson, questions as dapQuestions } from './dataAndProbability'

export function registerProblemSolvingDataAnalysis(): DomainMeta {
  registerContent('problem-solving-data-analysis', 'ratios-rates-proportions', rrpLesson, rrpQuestions)
  registerContent('problem-solving-data-analysis', 'percentages', pctLesson, pctQuestions)
  registerContent('problem-solving-data-analysis', 'data-and-probability', dapLesson, dapQuestions)
  return {
    slug: 'problem-solving-data-analysis',
    title: 'Problem-Solving and Data Analysis',
    subsections: [
      { slug: 'ratios-rates-proportions', title: 'Ratios, Rates, and Proportions' },
      { slug: 'percentages', title: 'Percentages' },
      { slug: 'data-and-probability', title: 'Data and Probability' },
    ],
  }
}
