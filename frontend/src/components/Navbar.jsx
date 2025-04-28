import React from 'react'

export default function Navbar({ search = '', onSearch = () => {}, showSearch = true }) {
  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Логотип — обычная ссылка на корень */}
          <a href="/" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" />
              <line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="2" y1="7" x2="7" y2="7" />
              <line x1="2" y1="17" x2="7" y2="17" />
              <line x1="17" y1="17" x2="22" y2="17" />
              <line x1="17" y1="7" x2="22" y2="7" />
            </svg>
            <span className="text-white text-xl font-bold">MovieFlix</span>
          </a>

          {/* Поле поиска, если нужно */}
          {showSearch && (
            <div className="w-1/2">
              <input
                data-testid="search-input"
                type="text"
                value={search}
                onChange={e => onSearch(e.target.value)}
                placeholder="Search movies..."
                className="px-3 py-2 rounded bg-gray-700 text-white w-full"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
