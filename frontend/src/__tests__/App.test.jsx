import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock the moviesData to avoid external dependencies
vi.mock('../data/moviesData', () => ({
  moviesData: [
    {
      id: 1,
      title: 'Test Movie',
      year: 2022,
      genre: 'Action',
      director: 'Test Director',
      cast: ['Actor 1', 'Actor 2'],
      rating: 8.5,
      description: 'Test description',
      posterUrl: 'https://example.com/poster.jpg',
      reviews: [
        { id: 1, username: 'reviewer1', rating: 8, comment: 'Good movie', date: '2023-01-01' }
      ]
    }
  ]
}));

// Mock window.confirm
global.confirm = vi.fn(() => true);

describe('App Component', () => {
  beforeEach(() => {
    // Reset the window location before each test
    window.history.pushState({}, '', '/');
    vi.clearAllMocks();
  });

  it('renders the movie list on the home page', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Popular Movies')).toBeInTheDocument();
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });
  
  it('filters movies based on search term', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText('Search movies...');
    
    // Movie should be visible initially
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    
    // Search for a non-matching term
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    // Movie should not be visible
    expect(screen.getByText('No movies found. Try a different search term.')).toBeInTheDocument();
    
    // Search for a matching term
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    
    // Movie should be visible again
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });
  
  it('navigates to movie detail page when a movie is clicked', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    // Click on the movie
    fireEvent.click(screen.getByText('Test Movie'));
    
    // Wait for navigation to complete
    await waitFor(() => {
      expect(window.location.pathname).toContain('/movie/');
      expect(screen.getByText('Overview')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });
  });
});