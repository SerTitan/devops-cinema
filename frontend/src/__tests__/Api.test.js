import { describe, it, vi, expect } from 'vitest'
import * as api from '../api'

global.fetch = vi.fn()

describe('api.js', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('getMovies – success', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ['movie'] })
    const result = await api.getMovies()
    expect(result).toEqual(['movie'])
  })

  it('getMovies – failure', async () => {
    fetch.mockResolvedValueOnce({ ok: false })
    await expect(api.getMovies()).rejects.toThrow('Не удалось получить список фильмов')
  })

  it('getMovie – success', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1 }) })
    const result = await api.getMovie(1)
    expect(result).toEqual({ id: 1 })
  })

  it('addReview – success', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) })
    const result = await api.addReview(1, { comment: 'ok' })
    expect(result).toEqual({ success: true })
  })

  it('updateReview – success', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ updated: true }) })
    const result = await api.updateReview(1, 2, { comment: 'changed' })
    expect(result).toEqual({ updated: true })
  })

  it('deleteReview – with json response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ deleted: true }),
    })
    const result = await api.deleteReview(1, 2)
    expect(result).toEqual({ deleted: true })
  })

  it('deleteReview – fallback to getMovie', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        headers: { get: () => 'text/html' },
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1 }) })

    const result = await api.deleteReview(1, 2)
    expect(result).toEqual({ id: 1 })
  })
})
