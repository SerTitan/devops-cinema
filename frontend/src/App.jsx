import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import MovieList from './components/MovieList'
import MovieDetail from './components/MovieDetail'

export default function App() {
  const [search, setSearch] = useState('')

  return (
    <>
      <Routes>
        {/* Главная с полем поиска */}
        <Route
          path="/"
          element={
            <>
              <Navbar
                search={search}
                onSearch={setSearch}
                showSearch={true}
              />
              <main className="container mx-auto px-4 py-6">
                <MovieList search={search} />
              </main>
            </>
          }
        />

        {/* Детальная без поиска */}
        <Route
          path="/movie/:id"
          element={
            <>
              <Navbar showSearch={false} />
              <main className="container mx-auto px-4 py-6">
                <MovieDetail />
              </main>
            </>
          }
        />
      </Routes>
    </>
  )
}
