import { useCallback, useState } from 'react'

interface ProgressRecord {
  attempted: boolean
  correct: boolean
}

type ProgressMap = Record<string, ProgressRecord>

function storageKey(subsectionKey: string) {
  return `sat-prep-progress:${subsectionKey}`
}

function loadProgress(subsectionKey: string): ProgressMap {
  const raw = localStorage.getItem(storageKey(subsectionKey))
  return raw ? JSON.parse(raw) : {}
}

export function useProgress(subsectionKey: string, questionIds: string[]) {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress(subsectionKey))

  const record = useCallback((questionId: string, correct: boolean) => {
    setProgress(prev => {
      const next = { ...prev, [questionId]: { attempted: true, correct } }
      localStorage.setItem(storageKey(subsectionKey), JSON.stringify(next))
      return next
    })
  }, [subsectionKey])

  const isAttempted = useCallback((id: string) => Boolean(progress[id]?.attempted), [progress])
  const isCorrect = useCallback((id: string) => Boolean(progress[id]?.correct), [progress])
  const correctCount = questionIds.filter(id => progress[id]?.correct).length

  return { record, isAttempted, isCorrect, correctCount }
}
