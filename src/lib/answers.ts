function normalize(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, '').replace(/π/g, 'pi').replace(/−/g, '-')
}

function toNumber(answer: string): number | null {
  const fraction = answer.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/)
  if (fraction) {
    const den = Number(fraction[2])
    return den === 0 ? null : Number(fraction[1]) / den
  }
  return /^-?\d*\.?\d+$/.test(answer) ? Number(answer) : null
}

/**
 * Grades a response the way SAT grid-ins do: exact text matches count, and so do
 * numerically equivalent forms ("0.5" for "1/2", or ".333"/".3333" for "1/3").
 */
export function isAnswerCorrect(response: string, correctAnswer: string): boolean {
  const given = normalize(response)
  const expected = normalize(correctAnswer)
  if (given === expected) return true
  const a = toNumber(given)
  const b = toNumber(expected)
  if (a === null || b === null) return false
  // A grid-in decimal may be truncated or rounded to the space available, so
  // accept anything within 0.001 of the exact value.
  return Math.abs(a - b) < 0.001 + 1e-9
}
