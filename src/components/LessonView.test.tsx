// src/components/LessonView.test.tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LessonView from './LessonView'
import type { Lesson } from '../content/types'

const lesson: Lesson = {
  domain: 'algebra',
  subsection: 'linear-equations-one-variable',
  title: 'Linear Equations in One Variable',
  summary: 'Solve for x by isolating the variable.',
  body: 'Distribute, combine like terms, then isolate x.',
  tips: ['Always do the same operation to both sides.'],
  videoId: 'abc123XYZ',
}

describe('LessonView', () => {
  it('renders title, body, tips, and the embedded video', () => {
    render(<LessonView lesson={lesson} />)
    expect(screen.getByRole('heading', { name: lesson.title })).toBeInTheDocument()
    expect(screen.getByText(lesson.body)).toBeInTheDocument()
    expect(screen.getByText(lesson.tips[0])).toBeInTheDocument()
    const iframe = screen.getByTitle(/video/i) as HTMLIFrameElement
    expect(iframe.src).toContain('youtube.com/embed/abc123XYZ')
  })
})
