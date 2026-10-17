import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DomainPage from './DomainPage'

vi.mock('../content/index', () => ({
  sections: [
    {
      slug: 'math',
      title: 'Math',
      domains: [
        { slug: 'algebra', title: 'Algebra', subsections: [{ slug: 'linear-equations-one-variable', title: 'Linear Equations' }] },
      ],
    },
  ],
  getQuestions: () => [{ id: 'alg-leov-1' }, { id: 'alg-leov-2' }],
}))

describe('DomainPage', () => {
  beforeEach(() => localStorage.clear())

  it('shows a correct-count badge for each subsection', () => {
    localStorage.setItem(
      'sat-prep-progress:algebra/linear-equations-one-variable',
      JSON.stringify({ 'alg-leov-1': { attempted: true, correct: true } })
    )
    render(
      <MemoryRouter initialEntries={['/math/algebra']}>
        <Routes><Route path="/:sectionSlug/:domainSlug" element={<DomainPage />} /></Routes>
      </MemoryRouter>
    )
    expect(screen.getByText(/1 \/ 2 correct/i)).toBeInTheDocument()
  })
})
