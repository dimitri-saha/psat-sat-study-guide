import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from './Home'

vi.mock('../content/index', () => ({
  sections: [
    {
      slug: 'math', title: 'Math',
      domains: [{ slug: 'algebra', title: 'Algebra', subsections: [{ slug: 'linear-equations-one-variable', title: 'Linear Equations' }] }],
    },
  ],
  getQuestions: () => [{ id: 'alg-leov-1' }, { id: 'alg-leov-2' }],
}))

describe('Home', () => {
  beforeEach(() => localStorage.clear())

  it('shows a site-wide progress summary', () => {
    localStorage.setItem(
      'sat-prep-progress:algebra/linear-equations-one-variable',
      JSON.stringify({ 'alg-leov-1': { attempted: true, correct: true } })
    )
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText(/1 \/ 2 correct overall/i)).toBeInTheDocument()
  })
})
