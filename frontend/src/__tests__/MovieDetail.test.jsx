import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MovieDetail from '../components/MovieDetail';

describe('MovieDetail Component', () => {
  const mockMovies = [
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
  ];
  
  const mockAddReview = vi.fn();
  const mockUpdateReview = vi.fn();
  const mockDeleteReview = vi.fn();
  
  // Mock window.confirm
  global.confirm = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    global.confirm.mockReturnValue(true); // Default to confirming
  });
  
  it('renders movie details correctly', () => {
    render(
      <MemoryRouter initialEntries={['/movie/1']}>
        <Routes>
          <Route 
            path="/movie/:id" 
            element={
              <MovieDetail 
                movies={mockMovies} 
                addReview={mockAddReview}
                updateReview={mockUpdateReview}
                deleteReview={mockDeleteReview}
              />
            } 
          />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('2022 • Action')).toBeInTheDocument();
    expect(screen.getByText('Test Director')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Actor 1')).toBeInTheDocument();
    expect(screen.getByText('Actor 2')).toBeInTheDocument();
    expect(screen.getByText('8.5/10')).toBeInTheDocument();
    expect(screen.getByText('Reviews')).toBeInTheDocument();
    expect(screen.getByText('reviewer1')).toBeInTheDocument();
    expect(screen.getByText('Good movie')).toBeInTheDocument();
  });
  
  it('shows "Movie not found" when movie does not exist', () => {
    render(
      <MemoryRouter initialEntries={['/movie/999']}>
        <Routes>
          <Route 
            path="/movie/:id" 
            element={
              <MovieDetail 
                movies={mockMovies} 
                addReview={mockAddReview}
                updateReview={mockUpdateReview}
                deleteReview={mockDeleteReview}
              />
            } 
          />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Movie not found')).toBeInTheDocument();
  });
  
  it('shows review form when "Add Review" button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/movie/1']}>
        <Routes>
          <Route 
            path="/movie/:id" 
            element={
              <MovieDetail 
                movies={mockMovies} 
                addReview={mockAddReview}
                updateReview={mockUpdateReview}
                deleteReview={mockDeleteReview}
              />
            } 
          />
        </Routes>
      </MemoryRouter>
    );
    
    fireEvent.click(screen.getByText('Add Review'));
    
    expect(screen.getByText('Add Your Review')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Comment')).toBeInTheDocument();
  });
  
  it('calls addReview when a new review is submitted', () => {
    render(
      <MemoryRouter initialEntries={['/movie/1']}>
        <Routes>
          <Route 
            path="/movie/:id" 
            element={
              <MovieDetail 
                movies={mockMovies} 
                addReview={mockAddReview}
                updateReview={mockUpdateReview}
                deleteReview={mockDeleteReview}
              />
            } 
          />
        </Routes>
      </MemoryRouter>
    );
    
    // Click Add Review button
    fireEvent.click(screen.getByText('Add Review'));
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Comment'), { target: { value: 'Test comment' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Submit Review'));
    
    expect(mockAddReview).toHaveBeenCalledWith(1, {
      username: 'testuser',
      rating: 5, // Default value
      comment: 'Test comment'
    });
  });
  
  it('shows edit form when edit button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/movie/1']}>
        <Routes>
          <Route 
            path="/movie/:id" 
            element={
              <MovieDetail 
                movies={mockMovies} 
                addReview={mockAddReview}
                updateReview={mockUpdateReview}
                deleteReview={mockDeleteReview}
              />
            } 
          />
        </Routes>
      </MemoryRouter>
    );
    
    // Click Edit button
    fireEvent.click(screen.getByText('Edit'));
    
    expect(screen.getByText('Edit Your Review')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toHaveValue('reviewer1');
    expect(screen.getByLabelText('Comment')).toHaveValue('Good movie');
  });
  
  it('calls deleteReview when delete button is clicked and confirmed', () => {
    global.confirm.mockReturnValue(true); // Mock confirm dialog to return true
    
    render(
      <MemoryRouter initialEntries={['/movie/1']}>
        <Routes>
          <Route 
            path="/movie/:id" 
            element={
              <MovieDetail 
                movies={mockMovies} 
                addReview={mockAddReview}
                updateReview={mockUpdateReview}
                deleteReview={mockDeleteReview}
              />
            } 
          />
        </Routes>
      </MemoryRouter>
    );
    
    // Click Delete button
    fireEvent.click(screen.getByText('Delete'));
    
    expect(global.confirm).toHaveBeenCalled();
    expect(mockDeleteReview).toHaveBeenCalledWith(1, 1);
  });
  
  it('does not call deleteReview when delete is not confirmed', () => {
    global.confirm.mockReturnValue(false); // Mock confirm dialog to return false
    
    render(
      <MemoryRouter initialEntries={['/movie/1']}>
        <Routes>
          <Route 
            path="/movie/:id" 
            element={
              <MovieDetail 
                movies={mockMovies} 
                addReview={mockAddReview}
                updateReview={mockUpdateReview}
                deleteReview={mockDeleteReview}
              />
            } 
          />
        </Routes>
      </MemoryRouter>
    );
    
    // Click Delete button
    fireEvent.click(screen.getByText('Delete'));
    
    expect(global.confirm).toHaveBeenCalled();
    expect(mockDeleteReview).not.toHaveBeenCalled();
  });
});