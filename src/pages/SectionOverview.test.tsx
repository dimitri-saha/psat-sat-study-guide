import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
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
}))

describe('SectionOverview', () => {
  it('lists domains for the current section with links', () => {
    render(
      <MemoryRouter initialEntries={['/math']}>
        <Routes>
          <Route path="/:sectionSlug" element={<SectionOverview />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /math/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /algebra/i })).toHaveAttribute('href', '/math/algebra')
  })
})
