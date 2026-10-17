// src/components/Practice.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import Practice from './Practice'
import type { Question } from '../content/types'

const mcQuestion: Question = {
  id: 'alg-1',
  domain: 'algebra',
  subsection: 'linear-equations-one-variable',
  difficulty: 'easy',
  prompt: 'Solve for x: 3(x - 4) = 2x + 5',
  choices: ['11', '17', '-17', '7'],
  correctAnswer: '17',
  hints: ['Distribute the 3 first.', 'Collect x terms on one side.'],
  walkthrough: ['3x - 12 = 2x + 5', 'x - 12 = 5', 'x = 17'],
}

const gridInQuestion: Question = {
  id: 'alg-2',
  domain: 'algebra',
  subsection: 'linear-equations-one-variable',
  difficulty: 'easy',
  prompt: 'If 5x - 7 = 2x + 8, what is the value of x?',
  correctAnswer: '5',
  hints: ['Move the x terms to one side.'],
  walkthrough: ['3x = 15', 'x = 5'],
}

describe('Practice', () => {
  beforeEach(() => localStorage.clear())

  it('reveals hints one at a time without showing the answer', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[mcQuestion]} />)
    expect(screen.queryByText(mcQuestion.hints[1])).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /get a hint/i }))
    expect(screen.getByText(mcQuestion.hints[0])).toBeInTheDocument()
    expect(screen.queryByText(mcQuestion.hints[1])).not.toBeInTheDocument()
    expect(screen.queryByText(/correct answer is/i)).not.toBeInTheDocument() // the reveal-answer text only appears after submit, not from a hint
    fireEvent.click(screen.getByRole('button', { name: /get a hint/i }))
    expect(screen.getByText(mcQuestion.hints[1])).toBeInTheDocument()
  })

  it('renders choice buttons for multiple-choice questions and grades on submit', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[mcQuestion]} />)
    fireEvent.click(screen.getByRole('button', { name: '17' }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText(/correct/i)).toBeInTheDocument()
  })

  it('renders a text input for grid-in questions with no choices', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[gridInQuestion]} />)
    expect(screen.queryByRole('button', { name: /^5$/ })).not.toBeInTheDocument()
    const input = screen.getByRole('textbox', { name: /your answer/i })
    fireEvent.change(input, { target: { value: '5' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText(/correct/i)).toBeInTheDocument()
  })

  it('does not render a Desmos pane when desmosConfig is absent', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[mcQuestion]} />)
    expect(screen.queryByRole('img', { name: /desmos graphing calculator/i })).not.toBeInTheDocument()
  })

  it('shows the walkthrough only after the button is clicked', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[mcQuestion]} />)
    expect(screen.queryByText(mcQuestion.walkthrough[0])).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '17' }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    fireEvent.click(screen.getByRole('button', { name: /show walkthrough/i }))
    expect(screen.getByText(mcQuestion.walkthrough[0])).toBeInTheDocument()
  })
})
