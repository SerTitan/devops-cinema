import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewList from '../ReviewList';

describe('ReviewList Component', () => {
  const mockReviews = [
    {
      id: 1,
      username: 'user1',
      rating: 9,
      comment: 'Excellent movie!',
      date: '2023-01-15'
    },
    {
      id: 2,
      username: 'user2',
      rating: 7,
      comment: 'Good but not great.',
      date: '2023-02-20'
    }
  ];

  // Mock window.confirm
  global.confirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.confirm.mockReturnValue(true); // Default to confirming
  });

  it('renders the reviews correctly', () => {
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();
    
    render(<ReviewList reviews={mockReviews} onEdit={mockEdit} onDelete={mockDelete} />);
    
    expect(screen.getByText('user1')).toBeInTheDocument();
    expect(screen.getByText('user2')).toBeInTheDocument();
    expect(screen.getByText('Excellent movie!')).toBeInTheDocument();
    expect(screen.getByText('Good but not great.')).toBeInTheDocument();
    expect(screen.getByText('9/10')).toBeInTheDocument();
    expect(screen.getByText('7/10')).toBeInTheDocument();
  });
  
  it('displays a message when no reviews are available', () => {
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();
    
    render(<ReviewList reviews={[]} onEdit={mockEdit} onDelete={mockDelete} />);
    
    expect(screen.getByText('No reviews yet. Be the first to review!')).toBeInTheDocument();
  });
  
  it('calls onEdit when edit button is clicked', () => {
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();
    
    render(<ReviewList reviews={mockReviews} onEdit={mockEdit} onDelete={mockDelete} />);
    
    // Click the first edit button
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(mockEdit).toHaveBeenCalledWith(mockReviews[0]);
  });
  
  it('calls onDelete when delete button is clicked', () => {
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();
    
    render(<ReviewList reviews={mockReviews} onEdit={mockEdit} onDelete={mockDelete} />);
    
    // Click the first delete button
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockDelete).toHaveBeenCalledWith(mockReviews[0].id);
  });
  
  it('sorts reviews when sort options are changed', () => {
    const mockEdit = vi.fn();
    const mockDelete = vi.fn();
    
    render(<ReviewList reviews={mockReviews} onEdit={mockEdit} onDelete={mockDelete} />);
    
    // Default sort is by date in descending order, so user2 should be first
    const reviewElements = screen.getAllByText(/user\d/);
    expect(reviewElements[0].textContent).toBe('user2');
    
    // Change sort to username
    fireEvent.change(screen.getByLabelText('Sort by:'), { target: { value: 'username' } });
    
    // After sorting by username in descending order, user2 should still be first
    const reviewElementsAfterSort = screen.getAllByText(/user\d/);
    expect(reviewElementsAfterSort[0].textContent).toBe('user2');
    
    // Toggle sort order
    fireEvent.click(screen.getByText('↓'));
    
    // After toggling to ascending order, user1 should be first
    const reviewElementsAfterToggle = screen.getAllByText(/user\d/);
    expect(reviewElementsAfterToggle[0].textContent).toBe('user1');
  });
});