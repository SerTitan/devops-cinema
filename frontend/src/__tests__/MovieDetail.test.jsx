import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MovieDetail from '../components/MovieDetail';
import { getMovie } from '../api';

// Мокаем модуль до первого использования getMovie
vi.mock('../api', () => ({
  getMovie: vi.fn()
}));

test('applies correct rating color class for rating >= 7', async () => {
  getMovie.mockResolvedValueOnce({
    id: 1,
    title: 'Green Movie',
    posterUrl: 'https://example.com/poster.jpg',
    year: 2023,
    genre: 'Drama',
    rating: 8.1,
    description: 'High rated movie',
    reviews: []
  });

  render(
    <MemoryRouter initialEntries={['/movie/1']}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </MemoryRouter>
  );

  const badge = await screen.findByTestId('rating-badge');
  expect(badge).toHaveClass('bg-green-600');
});

test('applies correct rating color class for 4 <= rating < 7', async () => {
  getMovie.mockResolvedValueOnce({
    id: 2,
    title: 'Yellow Movie',
    posterUrl: 'https://example.com/poster2.jpg',
    year: 2022,
    genre: 'Comedy',
    rating: 5.5,
    description: 'Average movie',
    reviews: []
  });

  render(
    <MemoryRouter initialEntries={['/movie/2']}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </MemoryRouter>
  );

  const badge = await screen.findByTestId('rating-badge');
  expect(badge).toHaveClass('bg-yellow-500');
});

test('applies correct rating color class for rating < 4', async () => {
  getMovie.mockResolvedValueOnce({
    id: 3,
    title: 'Red Movie',
    posterUrl: 'https://example.com/poster3.jpg',
    year: 2021,
    genre: 'Horror',
    rating: 3.0,
    description: 'Low rated movie',
    reviews: []
  });

  render(
    <MemoryRouter initialEntries={['/movie/3']}>
      <Routes>
        <Route path="/movie/:id" element={<MovieDetail />} />
      </Routes>
    </MemoryRouter>
  );

  const badge = await screen.findByTestId('rating-badge');
  expect(badge).toHaveClass('bg-red-600');
});
