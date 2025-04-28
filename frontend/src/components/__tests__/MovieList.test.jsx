import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieList from '../MovieList';

describe('MovieList Component', () => {
  const mockMovies = [
    {
      id: 1,
      title: 'Test Movie 1',
      year: 2020,
      rating: 8.5,
      posterUrl: 'https://example.com/poster1.jpg'
    },
    {
      id: 2,
      title: 'Test Movie 2',
      year: 2021,
      rating: 7.5,
      posterUrl: 'https://example.com/poster2.jpg'
    }
  ];

  beforeEach(() => {
    // Reset any mocks or state before each test
  });

  it('renders the movie list correctly', () => {
    render(
      <BrowserRouter>
        <MovieList movies={mockMovies} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Popular Movies')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('2021')).toBeInTheDocument();
    expect(screen.getByText('8.5/10')).toBeInTheDocument();
    expect(screen.getByText('7.5/10')).toBeInTheDocument();
  });

  it('displays a message when no movies are found', () => {
    render(
      <BrowserRouter>
        <MovieList movies={[]} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('No movies found. Try a different search term.')).toBeInTheDocument();
  });
});