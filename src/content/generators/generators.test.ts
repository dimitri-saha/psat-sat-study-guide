import { describe, it, expect } from 'vitest'
import { sections } from '../index'
import { getGenerator } from './index'
import { mathGenerators } from './math'

describe('question generators', () => {
  it('every math subsection has a generator', () => {
    const math = sections.find(s => s.slug === 'math')!
    for (const domain of math.domains) {
      for (const sub of domain.subsections) {
        expect(getGenerator(domain.slug, sub.slug), `${domain.slug}/${sub.slug}`).toBeDefined()
      }
    }
  })

  it('reading & writing subsections have no generator', () => {
    expect(getGenerator('standard-english-conventions', 'boundaries')).toBeUndefined()
  })

  for (const [key, generate] of Object.entries(mathGenerators)) {
    it(`${key} produces well-formed questions`, () => {
      for (let i = 0; i < 2000; i++) {
        const q = generate()
        const text = JSON.stringify(q)
        expect(text, `${key}: ${text}`).not.toMatch(/NaN|undefined|Infinity|null/)
        expect(q.correctAnswer.length).toBeGreaterThan(0)
        expect(q.hints.length).toBeGreaterThanOrEqual(1)
        expect(q.walkthrough.length).toBeGreaterThanOrEqual(1)
        expect(q.desmosConfig?.expressions.length, `${key} needs a Desmos solution`).toBeGreaterThan(0)
        if (q.choices) {
          expect(q.choices, text).toHaveLength(4)
          expect(new Set(q.choices).size, text).toBe(4)
          expect(q.choices, text).toContain(q.correctAnswer)
        }
      }
    })
  }

  it('stamps unique ids with domain and subsection', () => {
    const generate = getGenerator('algebra', 'systems-of-equations')!
    const a = generate()
    const b = generate()
    expect(a.id).not.toBe(b.id)
    expect(a.domain).toBe('algebra')
    expect(a.subsection).toBe('systems-of-equations')
  })
})
