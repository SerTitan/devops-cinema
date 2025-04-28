import { render, screen } from '@testing-library/react'
import MovieList from '../components/MovieList'
import { BrowserRouter } from 'react-router-dom'

vi.mock('../api', () => ({
  getMovies: () => Promise.resolve([
    { id: 1, title: 'Inception', year: 2010, posterUrl: 'inception.jpg' },
    { id: 2, title: 'Interstellar', year: 2014, posterUrl: 'interstellar.jpg' }
  ])
}))

describe('MovieList', () => {
  test('renders all movies', async () => {
    render(
      <BrowserRouter>
        <MovieList search="" />
      </BrowserRouter>
    )

    expect(await screen.findByText('Inception')).toBeInTheDocument()
    expect(await screen.findByText('Interstellar')).toBeInTheDocument()
  })
})
