import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewForm from '../ReviewForm';

describe('ReviewForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form correctly for adding a new review', () => {
    const mockSubmit = vi.fn();
    const mockCancel = vi.fn();
    
    render(<ReviewForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Rating (1-10)')).toBeInTheDocument();
    expect(screen.getByLabelText('Comment')).toBeInTheDocument();
    expect(screen.getByText('Submit Review')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });
  
  it('renders the form correctly for editing a review', () => {
    const mockSubmit = vi.fn();
    const mockCancel = vi.fn();
    const mockReview = {
      id: 1,
      username: 'testuser',
      rating: 8,
      comment: 'Great movie!',
      date: '2023-01-01'
    };
    
    render(<ReviewForm review={mockReview} onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    expect(screen.getByLabelText('Username')).toHaveValue('testuser');
    expect(screen.getByLabelText('Comment')).toHaveValue('Great movie!');
    expect(screen.getByText('Update Review')).toBeInTheDocument();
  });
  
  it('shows validation errors when form is submitted with empty fields', () => {
    const mockSubmit = vi.fn();
    const mockCancel = vi.fn();
    
    render(<ReviewForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    // Submit the form without filling any fields
    fireEvent.click(screen.getByText('Submit Review'));
    
    expect(screen.getByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Comment is required')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });
  
  it('calls onSubmit with form data when valid form is submitted', () => {
    const mockSubmit = vi.fn();
    const mockCancel = vi.fn();
    
    render(<ReviewForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Rating (1-10)'), { target: { value: '7' } });
    fireEvent.change(screen.getByLabelText('Comment'), { target: { value: 'Good movie!' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Submit Review'));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      username: 'testuser',
      rating: 7,
      comment: 'Good movie!'
    });
  });
  
  it('calls onCancel when cancel button is clicked', () => {
    const mockSubmit = vi.fn();
    const mockCancel = vi.fn();
    
    render(<ReviewForm onSubmit={mockSubmit} onCancel={mockCancel} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    
    expect(mockCancel).toHaveBeenCalled();
  });
});