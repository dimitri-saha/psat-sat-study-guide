import type { SectionMeta } from './types'

export { getLesson, getQuestions } from './registry'

// Tasks 6-14 each add one import here (a domain's `register*()` function, which
// calls `registerContent` for each of its subsections and returns that domain's
// DomainMeta) and push the result into the matching section's `domains` array below.
export const sections: SectionMeta[] = []
