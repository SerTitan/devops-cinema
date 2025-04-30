import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMovie, addReview, updateReview, deleteReview } from '../api'
import ReviewList from './ReviewList'
import ReviewForm from './ReviewForm'
import { ratingColor } from '../utils/ratingColor'

export default function MovieDetail() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [error, setError] = useState(null)
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    getMovie(id).then(setMovie).catch(setError)
  }, [id])

  const handleAdd = body =>
    addReview(id, body).then(() => getMovie(id).then(setMovie).catch(setError)).finally(() => setAdding(false))

  const handleUpdate = (rid, body) =>
    updateReview(id, rid, body).then(() => getMovie(id).then(setMovie).catch(setError)).finally(() => setEditing(null))

  const handleDelete = r =>
    window.confirm('Удалить отзыв?') &&
    deleteReview(id, r.id).then(() => getMovie(id).then(setMovie).catch(setError))

  if (error) return <p className="text-red-500">{error.message}</p>
  if (!movie) return <p className="text-gray-400">Download...</p>

  return (
    <div className="max-w-4xl mx-auto">
      {/* Карточка фильма */}
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl mb-8 md:flex">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="md:w-1/3 h-96 object-contain bg-gray-900"
        />
        <div className="md:w-2/3 p-6">
          <div className="flex justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
              <p className="text-gray-400">{movie.year} • {movie.genre}</p>
            </div>
            <span className={`${ratingColor(movie.rating)} flex items-center justify-center w-14 h-14 rounded-full text-xl font-bold text-white`}>
              {movie.rating}
            </span>
          </div>

          <section className="my-6">
            <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
            <p className="text-gray-300">{movie.description}</p>
          </section>
          
          {/* Кнопка удаления формы и навигации назад удалены */}
        </div>
      </div>

      {/* Отзывы */}
      <div className="bg-gray-800 rounded-lg p-6 mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Reviews</h2>
          {!adding && !editing && (
            <button
              onClick={() => setAdding(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Review
            </button>
          )}
        </div>

        {adding && (
          <ReviewForm onSubmit={handleAdd} onCancel={() => setAdding(false)} />
        )}
        {editing && (
          <ReviewForm
            review={editing}
            onSubmit={body => handleUpdate(editing.id, body)}
            onCancel={() => setEditing(null)}
          />
        )}

        <ReviewList
          reviews={movie.reviews}
          onEdit={r => { setEditing(r); setAdding(false) }}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
