import { describe, it, expect } from 'vitest'
import { sections, getQuestions } from './index'

describe('content integrity', () => {
  it('every subsection listed in sections has at least 5 questions', () => {
    for (const section of sections) {
      for (const domain of section.domains) {
        for (const sub of domain.subsections) {
          const qs = getQuestions(domain.slug, sub.slug)
          expect(qs.length, `${domain.slug}/${sub.slug} question count`).toBeGreaterThanOrEqual(5)
        }
      }
    }
  })

  it('every question with choices has a correctAnswer that exactly matches one choice', () => {
    for (const section of sections) {
      for (const domain of section.domains) {
        for (const sub of domain.subsections) {
          for (const q of getQuestions(domain.slug, sub.slug)) {
            if (q.choices) {
              expect(q.choices, `${q.id} correctAnswer must be in choices`).toContain(q.correctAnswer)
            }
            expect(q.hints.length, `${q.id} needs at least 1 hint`).toBeGreaterThanOrEqual(1)
            expect(q.walkthrough.length, `${q.id} needs at least 1 walkthrough step`).toBeGreaterThanOrEqual(1)
          }
        }
      }
    }
  })
})
