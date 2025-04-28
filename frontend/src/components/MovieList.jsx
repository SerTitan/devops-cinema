import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMovies } from '../api'

export default function MovieList({ search }) {
  const [movies, setMovies] = useState([])
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMovies()
      .then(data => {
        setMovies(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err)
        setLoading(false)
      })
  }, [])

  const filtered = movies.filter(m =>
    m.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <p className="text-gray-400">Download…</p>
  if (error)   return <p className="text-red-500">{error.message}</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filtered.map(movie => (
        <Link to={`/movie/${movie.id}`} key={movie.id}>
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="overflow-hidden h-80 flex items-center justify-center bg-gray-800">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-white">{movie.title}</h2>
              <p className="text-sm text-gray-400">{movie.year}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
