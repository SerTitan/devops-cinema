import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ReviewList from '../components/ReviewList'

describe('ReviewList', () => {
  const reviews = [
    { id: 1, username: 'User1', rating: 8, comment: 'Good movie' },
  ]

  it('показывает сообщение, если нет отзывов', () => {
    render(<ReviewList reviews={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Отзывов пока нет')).toBeInTheDocument()
  })

  it('вызывает onDelete с объектом отзыва', () => {
    const mockDel = vi.fn()
    render(
      <ReviewList reviews={reviews} onEdit={vi.fn()} onDelete={mockDel} />
    )
    fireEvent.click(screen.getByText('Delete'))
    expect(mockDel).toHaveBeenCalledWith(reviews[0])
  })
})
