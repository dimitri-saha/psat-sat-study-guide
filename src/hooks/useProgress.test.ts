import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useProgress } from './useProgress'

describe('useProgress', () => {
  beforeEach(() => localStorage.clear())

  it('starts with nothing attempted', () => {
    const { result } = renderHook(() => useProgress('math/algebra', ['q1', 'q2']))
    expect(result.current.isAttempted('q1')).toBe(false)
    expect(result.current.correctCount).toBe(0)
  })

  it('records a correct answer and persists it across remounts', () => {
    const { result, unmount } = renderHook(() => useProgress('math/algebra', ['q1', 'q2']))
    act(() => result.current.record('q1', true))
    expect(result.current.isAttempted('q1')).toBe(true)
    expect(result.current.isCorrect('q1')).toBe(true)
    expect(result.current.correctCount).toBe(1)
    unmount()

    const { result: result2 } = renderHook(() => useProgress('math/algebra', ['q1', 'q2']))
    expect(result2.current.isCorrect('q1')).toBe(true)
    expect(result2.current.correctCount).toBe(1)
  })

  it('records an incorrect answer as attempted but not correct', () => {
    const { result } = renderHook(() => useProgress('math/algebra', ['q1']))
    act(() => result.current.record('q1', false))
    expect(result.current.isAttempted('q1')).toBe(true)
    expect(result.current.isCorrect('q1')).toBe(false)
  })
})
