import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import DesmosTricksHub from './DesmosTricksHub'

vi.mock('../content/index', () => ({
  getDesmosTopics: () => [
    { slug: 'intersections', title: 'Finding Intersections', summary: 'Graph both sides.', body: '...', tips: [], desmosConfig: { expressions: [] } },
  ],
}))

describe('DesmosTricksHub', () => {
  it('lists each topic with a link to its page', () => {
    render(<MemoryRouter><DesmosTricksHub /></MemoryRouter>)
    expect(screen.getByRole('link', { name: /finding intersections/i })).toHaveAttribute('href', '/desmos-tricks/intersections')
  })
})
