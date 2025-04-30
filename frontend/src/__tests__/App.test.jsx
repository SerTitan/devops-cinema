import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { getMovies } from '../api'

vi.mock('../api', () => ({
  getMovies: vi.fn(() => Promise.resolve([
    {
      id: 1,
      title: 'Inception',
      year: 2010,
      posterUrl: 'https://example.com/inception.jpg'
    },
    {
      id: 2,
      title: 'Interstellar',
      year: 2014,
      posterUrl: 'https://example.com/interstellar.jpg'
    }
  ]))
}))

describe('App Component', () => {
  test('renders movie list and filters by input', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(await screen.findByText('Inception')).toBeInTheDocument()
    expect(screen.getByText('Interstellar')).toBeInTheDocument()
  })

  test('navigates to detail page on click', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    const link = await screen.findByText('Inception')
    expect(link).toBeInTheDocument()
  })
})
