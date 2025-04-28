import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MovieDetail from '../components/MovieDetail'
import { getMovie } from '../api'

vi.mock('../api', () => ({
  getMovie: vi.fn(() => Promise.resolve({
    id: 1,
    title: 'Test Movie',
    posterUrl: 'https://example.com/poster.jpg',
    year: 2023,
    genre: 'Action',
    rating: 8.5,
    description: 'Test description',
    reviews: []
  }))
}))

test('renders movie details', async () => {
  render(
    <MemoryRouter initialEntries={['/movie/1']}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </MemoryRouter>
  )

  expect(await screen.findByText('Test Movie')).toBeInTheDocument()
  expect(screen.getByText('2023 • Action')).toBeInTheDocument()
  expect(screen.getByText('Test description')).toBeInTheDocument()
})