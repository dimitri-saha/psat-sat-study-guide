// src/components/Practice.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
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

const emptyChoiceQuestion: Question = {
  id: 'sec-bd-3',
  domain: 'standard-english-conventions',
  subsection: 'boundaries',
  difficulty: 'medium',
  prompt: 'The committee reviewed dozens of applications______ only three candidates were selected for interviews.',
  choices: [';', ',', '', ', being that'],
  correctAnswer: ';',
  hints: ['Check whether both halves are independent clauses.'],
  walkthrough: ['A semicolon can directly join two independent clauses.'],
}

describe('Practice', () => {
  beforeEach(() => localStorage.clear())

  it('renders a fallback message when questions array is empty', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[]} />)
    expect(screen.getByText('No questions available for this subsection yet.')).toBeInTheDocument()
  })

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

  it('does not render a Desmos pane unless showCalculator is set', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[mcQuestion]} />)
    expect(screen.queryByRole('img', { name: /desmos graphing calculator/i })).not.toBeInTheDocument()
  })

  it('renders a blank Desmos calculator for every question when showCalculator is set', () => {
    const setExpression = vi.fn()
    window.Desmos = { GraphingCalculator: vi.fn(() => ({ setExpression, setMathBounds: vi.fn() })) }
    const withConfig = { ...gridInQuestion, desmosConfig: { expressions: ['y=5x-7', 'y=2x+8'] } }
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[withConfig]} showCalculator />)
    expect(screen.getByRole('img', { name: /desmos graphing calculator/i })).toBeInTheDocument()
    expect(setExpression).not.toHaveBeenCalled()

    fireEvent.change(screen.getByRole('textbox', { name: /your answer/i }), { target: { value: '5' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    fireEvent.click(screen.getByRole('button', { name: /show the desmos solution/i }))
    expect(setExpression).toHaveBeenCalledWith({ id: 'preset-0', latex: 'y=5x-7' })
  })

  it('accepts an equivalent decimal for a fraction grid-in answer', () => {
    const fractionQuestion = { ...gridInQuestion, correctAnswer: '-1/3' }
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[fractionQuestion]} />)
    fireEvent.change(screen.getByRole('textbox', { name: /your answer/i }), { target: { value: '-.3333' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText('Correct!')).toBeInTheDocument()
  })

  it('keeps serving generated questions after the fixed set runs out', () => {
    let n = 0
    const generate = (): Question => ({ ...gridInQuestion, id: `gen-${n}`, prompt: `Generated prompt ${n++}` })
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[gridInQuestion]} generate={generate} />)
    expect(screen.getByText(/unlimited practice/i)).toBeInTheDocument()
    for (let i = 0; i < 3; i++) {
      fireEvent.change(screen.getByRole('textbox', { name: /your answer/i }), { target: { value: '5' } })
      fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      fireEvent.click(screen.getByRole('button', { name: /next question/i }))
    }
    expect(screen.getByText('Generated prompt 2')).toBeInTheDocument()
    expect(screen.getByText('Question 4')).toBeInTheDocument()
  })

  it('toggles mark for review', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[mcQuestion]} />)
    const mark = screen.getByRole('button', { name: /mark for review/i })
    fireEvent.click(mark)
    expect(mark).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/1 marked/i)).toBeInTheDocument()
  })

  it('shows the walkthrough only after the button is clicked', () => {
    render(<Practice subsectionKey="algebra/linear-equations-one-variable" questions={[mcQuestion]} />)
    expect(screen.queryByText(mcQuestion.walkthrough[0])).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '17' }))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    fireEvent.click(screen.getByRole('button', { name: /show walkthrough/i }))
    expect(screen.getByText(mcQuestion.walkthrough[0])).toBeInTheDocument()
  })

  it('renders a usable, non-pre-selected button for an empty-string choice', () => {
    render(<Practice subsectionKey="standard-english-conventions/boundaries" questions={[emptyChoiceQuestion]} />)
    const emptyChoiceButton = screen.getByRole('button', { name: '(no punctuation)' })
    expect(emptyChoiceButton).toBeInTheDocument()
    expect(emptyChoiceButton.className).not.toContain('selected')
    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).toBeDisabled()
    fireEvent.click(emptyChoiceButton)
    expect(emptyChoiceButton.className).toMatch(/selected/)
    expect(submitButton).not.toBeDisabled()
  })
})
