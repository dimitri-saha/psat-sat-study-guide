import type { Lesson, Question } from './types'

const lessonsBySubsection: Record<string, Lesson> = {}
const questionsBySubsection: Record<string, Question[]> = {}

export function registerContent(domainSlug: string, subsectionSlug: string, lesson: Lesson, questions: Question[]) {
  const key = `${domainSlug}/${subsectionSlug}`
  lessonsBySubsection[key] = lesson
  questionsBySubsection[key] = questions
}

export function getLesson(domainSlug: string, subsectionSlug: string): Lesson {
  const lesson = lessonsBySubsection[`${domainSlug}/${subsectionSlug}`]
  if (!lesson) throw new Error(`No lesson registered for ${domainSlug}/${subsectionSlug}`)
  return lesson
}

export function getQuestions(domainSlug: string, subsectionSlug: string): Question[] {
  return questionsBySubsection[`${domainSlug}/${subsectionSlug}`] ?? []
}
