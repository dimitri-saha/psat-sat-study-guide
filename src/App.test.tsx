import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App shell', () => {
  it('renders nav links to all four top-level sections', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    const nav = within(screen.getByRole('navigation'))
    expect(nav.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(nav.getByRole('link', { name: /reading & writing/i })).toBeInTheDocument()
    expect(nav.getByRole('link', { name: /^math$/i })).toBeInTheDocument()
    expect(nav.getByRole('link', { name: /desmos tricks/i })).toBeInTheDocument()
  })
})
