import { render, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DesmosCalculator from './DesmosCalculator'

describe('DesmosCalculator', () => {
  beforeEach(() => {
    window.Desmos = {
      GraphingCalculator: vi.fn(() => ({
        setExpression: vi.fn(),
        setMathBounds: vi.fn(),
      })),
    }
  })

  it('mounts a Desmos calculator and pushes each expression', async () => {
    const setExpression = vi.fn()
    window.Desmos.GraphingCalculator = vi.fn(() => ({ setExpression, setMathBounds: vi.fn() }))

    render(<DesmosCalculator config={{ expressions: ['y=2x+1', 'y=x^2'] }} />)

    await waitFor(() => {
      expect(window.Desmos.GraphingCalculator).toHaveBeenCalled()
      expect(setExpression).toHaveBeenCalledWith({ latex: 'y=2x+1' })
      expect(setExpression).toHaveBeenCalledWith({ latex: 'y=x^2' })
    })
  })

  it('applies bounds when provided', async () => {
    const setMathBounds = vi.fn()
    window.Desmos.GraphingCalculator = vi.fn(() => ({ setExpression: vi.fn(), setMathBounds }))

    render(<DesmosCalculator config={{ expressions: [], bounds: { left: -10, right: 10, top: 10, bottom: -10 } }} />)

    await waitFor(() => {
      expect(setMathBounds).toHaveBeenCalledWith({ left: -10, right: 10, top: 10, bottom: -10 })
    })
  })
})
