import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    const mockSetSearchTerm = vi.fn();
    render(
      <BrowserRouter>
        <Navbar searchTerm="" setSearchTerm={mockSetSearchTerm} />
      </BrowserRouter>
    );
    
    // Check if the logo text is rendered
    expect(screen.getByText('MovieFlix')).toBeInTheDocument();
    
    // Check if the search input is rendered
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
  });
  
  it('calls setSearchTerm when input changes', () => {
    const mockSetSearchTerm = vi.fn();
    render(
      <BrowserRouter>
        <Navbar searchTerm="" setSearchTerm={mockSetSearchTerm} />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText('Search movies...');
    fireEvent.change(searchInput, { target: { value: 'inception' } });
    
    expect(mockSetSearchTerm).toHaveBeenCalledWith('inception');
  });
});