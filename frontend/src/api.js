const API = import.meta.env.VITE_API_BASE

// ===== Movies =====
export async function getMovies() {
  const r = await fetch(`${API}/movies`)
  if (!r.ok) throw new Error('Не удалось получить список фильмов')
  return await r.json()
}

export async function getMovie(id) {
  const r = await fetch(`${API}/movies/${id}`)
  if (!r.ok) throw new Error('Фильм не найден')
  return await r.json()
}

// ===== Reviews =====
export async function addReview(movieId, body) {
  const r = await fetch(`${API}/movies/${movieId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error('Не удалось добавить отзыв')
  return await r.json()
}

export async function updateReview(movieId, reviewId, body) {
  const r = await fetch(`${API}/movies/${movieId}/review/${reviewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error('Не удалось изменить отзыв')
  return await r.json()
}

export async function deleteReview(movieId, reviewId) {
  const r = await fetch(`${API}/movies/${movieId}/review/${reviewId}`, {
    method: 'DELETE',
  })
  if (!r.ok) throw new Error('Не удалось удалить отзыв')

  if (r.headers.get('content-type')?.includes('application/json')) {
    return await r.json()
  }

  return await getMovie(movieId)
}
