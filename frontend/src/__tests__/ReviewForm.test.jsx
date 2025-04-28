import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReviewForm from '../components/ReviewForm'

describe('ReviewForm', () => {
  it('вызывает onSubmit и onCancel', async () => {
    const mockSubmit = vi.fn().mockResolvedValue()
    const mockCancel = vi.fn()

    render(<ReviewForm onSubmit={mockSubmit} onCancel={mockCancel} />)

    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'User1' },
    })
    fireEvent.change(screen.getByRole('spinbutton'), {
      target: { value: '8' },
    })
    fireEvent.change(screen.getByPlaceholderText('Comment'), {
      target: { value: 'Good movie' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Add/i }))
    await waitFor(() => expect(mockSubmit).toHaveBeenCalled())
    fireEvent.click(screen.getByRole('button', { name: /Отмена/i }))
    expect(mockCancel).toHaveBeenCalled()
  })
})
