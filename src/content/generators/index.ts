import type { Question } from '../types'
import { mathGenerators } from './math'

let counter = 0

/**
 * Returns a function that produces a fresh, randomized question for the subsection,
 * or undefined if the subsection has no generator (all Reading & Writing subsections).
 */
export function getGenerator(domainSlug: string, subsectionSlug: string): (() => Question) | undefined {
  const generate = mathGenerators[`${domainSlug}/${subsectionSlug}`]
  if (!generate) return undefined
  return () => ({
    ...generate(),
    id: `gen-${domainSlug}-${subsectionSlug}-${Date.now().toString(36)}-${counter++}`,
    domain: domainSlug,
    subsection: subsectionSlug,
  })
}
