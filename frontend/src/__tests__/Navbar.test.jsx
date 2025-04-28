import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from '../components/Navbar'

describe('Navbar', () => {
  test('вызывает setSearch при вводе', () => {
    const mockSetSearch = vi.fn()

    render(<Navbar search="" onSearch={mockSetSearch} />)

    const input = screen.getByTestId('search-input')
    fireEvent.change(input, { target: { value: 'Avatar' } })

    expect(mockSetSearch).toHaveBeenCalledWith('Avatar')
  })
})
