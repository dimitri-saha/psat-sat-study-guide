export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randNonZero(min: number, max: number): number {
  let n = 0
  while (n === 0) n = randInt(min, max)
  return n
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a || 1
}

/** Reduced fraction as an SAT-style answer string: "3", "-1/3", "9/4". */
export function frac(num: number, den: number): string {
  if (den < 0) {
    num = -num
    den = -den
  }
  const g = gcd(num, den)
  num /= g
  den /= g
  return den === 1 ? String(num) : `${num}/${den}`
}

/** Formats a coefficient-and-variable term for the start of an expression: 1x → "x", -1x → "-x". */
function leadTerm(coef: number, variable: string): string {
  if (variable === '') return String(coef)
  if (coef === 1) return variable
  if (coef === -1) return `-${variable}`
  return `${coef}${variable}`
}

/** Builds "3x^2 - x + 4" style polynomials from [coefficient, variable] pairs, skipping zero terms. */
export function poly(terms: [number, string][]): string {
  const nonZero = terms.filter(([c]) => c !== 0)
  if (nonZero.length === 0) return '0'
  return nonZero
    .map(([c, v], i) => {
      if (i === 0) return leadTerm(c, v)
      const body = leadTerm(Math.abs(c), v)
      return c < 0 ? ` - ${body}` : ` + ${body}`
    })
    .join('')
}

/** "(x + 3)" / "(x - 3)" */
export function binomial(variable: string, constant: number): string {
  return `(${poly([[1, variable], [constant, '']])})`
}

/**
 * Four shuffled answer choices containing `correct`. Distractors that duplicate the
 * correct answer or each other are dropped, and `fallback` fills any remaining slots.
 */
export function choicesWith(correct: string, distractors: string[], fallback: () => string): string[] {
  const set = new Set([correct])
  for (const d of distractors) {
    if (set.size === 4) break
    set.add(d)
  }
  let guard = 0
  while (set.size < 4 && guard++ < 100) set.add(fallback())
  return shuffle([...set])
}
