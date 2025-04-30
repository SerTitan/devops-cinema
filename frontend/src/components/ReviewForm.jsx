import { useState } from 'react'

export default function ReviewForm({ review, onSubmit, onCancel }) {
  const [username, setUsername] = useState(review?.username ?? '')
  const [rating, setRating]     = useState(review?.rating   ?? 5)
  const [comment, setComment]   = useState(review?.comment  ?? '')

  const handleSend = e => {
    e.preventDefault()
    if (typeof onSubmit !== 'function') return

    const body = {
      username,
      rating,
      comment,
      date: new Date().toISOString().slice(0, 10)
    }
    return onSubmit(body).then(() => {
      if (!review) {
        setUsername('')
        setRating(5)
        setComment('')
      }
    })
  }

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Name"
        required
        className="w-full p-2 rounded bg-gray-700 text-white"
      />
      <input
        type="number" min="1" max="10"
        value={rating}
        onChange={e => setRating(+e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white"
      />
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Comment"
        required
        className="w-full p-2 rounded bg-gray-700 text-white"
      />
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-green-600 rounded text-white hover:bg-green-700">
          {review ? 'Save' : 'Add'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-700"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  )
}
