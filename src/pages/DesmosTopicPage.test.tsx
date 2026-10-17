import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DesmosTopicPage from './DesmosTopicPage'

const mockTopic = {
  slug: 'intersections', title: 'Finding Intersections', summary: 'Graph both sides.',
  body: 'Explanation body.', tips: ['Tip one.'],
  desmosConfig: { expressions: ['y=2x+1'] },
}

vi.mock('../content/index', () => ({
  getDesmosTopics: () => [mockTopic],
  getDesmosTopic: () => mockTopic,
}))

describe('DesmosTopicPage', () => {
  beforeEach(() => {
    // @ts-expect-error test double
    window.Desmos = { GraphingCalculator: vi.fn(() => ({ setExpression: vi.fn(), setMathBounds: vi.fn() })) }
  })

  it('renders the topic title, body, tips, and a live Desmos calculator', async () => {
    render(
      <MemoryRouter initialEntries={['/desmos-tricks/intersections']}>
        <Routes><Route path="/desmos-tricks/:topicSlug" element={<DesmosTopicPage />} /></Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /finding intersections/i })).toBeInTheDocument()
    expect(screen.getByText('Explanation body.')).toBeInTheDocument()
    expect(screen.getByText('Tip one.')).toBeInTheDocument()
    await waitFor(() => {
      // @ts-expect-error test double
      expect(window.Desmos.GraphingCalculator).toHaveBeenCalled()
    })
  })
})
