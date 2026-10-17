import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SectionOverview from './SectionOverview'

vi.mock('../content/index', () => ({
  sections: [
    {
      slug: 'math',
      title: 'Math',
      domains: [
        { slug: 'algebra', title: 'Algebra', subsections: [{ slug: 'linear-equations-one-variable', title: 'Linear Equations in One Variable' }] },
      ],
    },
  ],
  getQuestions: () => [{ id: 'alg-leov-1' }, { id: 'alg-leov-2' }],
}))

describe('SectionOverview', () => {
  beforeEach(() => localStorage.clear())

  it('lists domains for the current section with links and an aggregate progress badge', () => {
    localStorage.setItem(
      'sat-prep-progress:algebra/linear-equations-one-variable',
      JSON.stringify({ 'alg-leov-1': { attempted: true, correct: true } })
    )
    render(
      <MemoryRouter initialEntries={['/math']}>
        <Routes><Route path="/:sectionSlug" element={<SectionOverview />} /></Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /math/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /algebra/i })).toHaveAttribute('href', '/math/algebra')
    expect(screen.getByText(/1 \/ 2 correct/i)).toBeInTheDocument()
  })
})
