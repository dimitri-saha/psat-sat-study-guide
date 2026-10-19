import { describe, it, expect } from 'vitest'
import { isAnswerCorrect } from './answers'

describe('isAnswerCorrect', () => {
  it('accepts exact matches regardless of spacing and case', () => {
    expect(isAnswerCorrect(' 17 ', '17')).toBe(true)
    expect(isAnswerCorrect('9PI', '9pi')).toBe(true)
    expect(isAnswerCorrect('9π', '9pi')).toBe(true)
  })

  it('accepts equivalent fractions and grid-in decimals', () => {
    expect(isAnswerCorrect('0.5', '1/2')).toBe(true)
    expect(isAnswerCorrect('2/4', '1/2')).toBe(true)
    expect(isAnswerCorrect('-.3333', '-1/3')).toBe(true)
    expect(isAnswerCorrect('.666', '2/3')).toBe(true)
    expect(isAnswerCorrect('.667', '2/3')).toBe(true)
    expect(isAnswerCorrect('9/4', '2.25')).toBe(true)
  })

  it('rejects wrong or too-rough answers', () => {
    expect(isAnswerCorrect('.3', '1/3')).toBe(false)
    expect(isAnswerCorrect('18', '17')).toBe(false)
    expect(isAnswerCorrect('1/0', '0')).toBe(false)
    expect(isAnswerCorrect('', '0')).toBe(false)
  })
})
