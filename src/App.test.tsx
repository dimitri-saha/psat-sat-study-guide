import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App shell', () => {
  it('renders nav links to all four top-level sections', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /reading & writing/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^math$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /desmos tricks/i })).toBeInTheDocument()
  })
})
