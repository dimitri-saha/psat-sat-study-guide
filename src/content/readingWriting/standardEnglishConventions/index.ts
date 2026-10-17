import { registerContent } from '../../registry'
import type { DomainMeta } from '../../types'
import { lesson as bdLesson, questions as bdQuestions } from './boundaries'
import { lesson as fssLesson, questions as fssQuestions } from './formStructureSense'

export function registerStandardEnglishConventions(): DomainMeta {
  registerContent('standard-english-conventions', 'boundaries', bdLesson, bdQuestions)
  registerContent('standard-english-conventions', 'form-structure-sense', fssLesson, fssQuestions)
  return {
    slug: 'standard-english-conventions',
    title: 'Standard English Conventions',
    subsections: [
      { slug: 'boundaries', title: 'Boundaries' },
      { slug: 'form-structure-sense', title: 'Form, Structure, and Sense' },
    ],
  }
}
