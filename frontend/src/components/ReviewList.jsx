import { ratingColor } from '../utils/ratingColor'

export default function ReviewList({ reviews, onEdit, onDelete }) {
  if (!reviews?.length) return <p className="text-gray-400">Отзывов пока нет</p>

  const safeEdit   = typeof onEdit   === 'function' ? onEdit   : () => {}
  const safeDelete = typeof onDelete === 'function' ? onDelete : () => {}

  return (
    <ul className="space-y-4">
      {reviews.map(r => (
        <li key={r.id} className="bg-gray-800 p-4 rounded flex justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`${ratingColor(r.rating)}
                                px-2 py-0.5 rounded-full text-xs text-white`}>
                {r.rating}/10
              </span>
              <span className="font-semibold text-white">{r.username}</span>
            </div>
            <p className="text-gray-300 mt-1">{r.comment}</p>
            <p className="text-gray-500 text-xs">{r.date}</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => safeEdit(r)}
              className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm text-white"
            >
              Edit
            </button>
            <button
              onClick={() => safeDelete(r)}
              className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm text-white"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
