import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import SubsectionPage from './SubsectionPage'

vi.mock('../content/index', () => ({
  getLesson: () => ({
    domain: 'algebra', subsection: 'linear-equations-one-variable',
    title: 'Linear Equations', summary: 'Solve for x.', body: 'Isolate the variable.',
    tips: ['Balance both sides.'], videoId: 'abc123',
  }),
  getQuestions: () => [{
    id: 'alg-1', domain: 'algebra', subsection: 'linear-equations-one-variable', difficulty: 'easy',
    prompt: 'Solve: x + 1 = 2', choices: ['1', '2'], correctAnswer: '1',
    hints: ['Subtract 1.'], walkthrough: ['x = 1'],
  }],
}))

describe('SubsectionPage', () => {
  it('defaults to the Lesson tab and switches to Practice on click', () => {
    render(
      <MemoryRouter initialEntries={['/math/algebra/linear-equations-one-variable']}>
        <Routes>
          <Route path="/:sectionSlug/:domainSlug/:subsectionSlug" element={<SubsectionPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: /linear equations/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /practice/i }))
    expect(screen.getByText(/solve: x \+ 1 = 2/i)).toBeInTheDocument()
  })
})
