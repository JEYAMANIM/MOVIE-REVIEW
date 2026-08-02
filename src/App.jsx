import { useState, useEffect, useRef } from 'react'

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  
  // Controls for auto-scrolling
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef(null)

  // 🚀 NEW: Unified fetch function that takes a query
  const fetchMovies = async (query) => {
    if (!query.trim()) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
      )
      const data = await response.json()

      if (data.length > 0) {
        setMovies(data)
      } else {
        setError('No movies or shows found.')
        setMovies([])
      }
    } catch (err) {
      setError('Something went wrong. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  // 🚀 NEW: Load initial movies when the website first opens
  useEffect(() => {
    // You can change 'marvel' to any default keyword you want (e.g., 'batman', 'action', 'dark')
    fetchMovies('marvel')
  }, [])

  // Handle the manual search button click
  const handleSearch = () => {
    fetchMovies(searchTerm)
  }

  // 🔄 AUTO-MOVE CAROUSEL EFFECT
  useEffect(() => {
    if (isHovered || movies.length === 0 || selectedMovie) return

    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        
        // If reached near the end, reset scroll back to start
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' })
        }
      }
    }, 2500) // Moves every 2.5 seconds

    return () => clearInterval(timer)
  }, [isHovered, movies, selectedMovie])

  // Manual scroll buttons
  const handleManualScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const stripHtml = (html) => {
    if (!html) return 'No description available.'
    return html.replace(/<[^>]*>?/gm, '')
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-zinc-900 to-black text-white flex flex-col items-center p-8 overflow-x-hidden">
      <h1 className="text-4xl font-bold mb-6 tracking-tight drop-shadow-md">Movie review</h1>
      
      {/* Search Input */}
      <div className="flex gap-2 mb-8 z-10">
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Enter movie title (e.g. Dark)" 
          className="px-4 py-2 rounded-md bg-zinc-900/80 border border-zinc-700/60 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 backdrop-blur-sm w-72 shadow-lg"
        />
        <button 
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-md font-semibold text-white shadow-lg shadow-blue-600/20 transition"
        >
          search
        </button>
      </div>

      {/* Loading & Error States */}
      {loading && <p className="text-blue-400 font-semibold animate-pulse mb-4">Fetching movies...</p>}
      {error && <p className="text-red-400 font-medium mb-4">{error}</p>}

      {/* 🎬 AUTO-MOVING CAROUSEL SECTION */}
      {movies.length > 0 && !loading && (
        <div className="relative w-full max-w-6xl group mt-4">
          
          {/* Left Arrow Button */}
          <button 
            onClick={() => handleManualScroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition shadow-lg border border-zinc-700"
          >
            ❮
          </button>

          {/* Right Arrow Button */}
          <button 
            onClick={() => handleManualScroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition shadow-lg border border-zinc-700"
          >
            ❯
          </button>

          {/* Horizontal Auto-Moving Scroll Container */}
          <div 
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-2 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {movies.map((item) => {
              const show = item.show
              return (
                <div 
                  key={show.id} 
                  onClick={() => setSelectedMovie(show)}
                  className="min-w-[260px] max-w-[260px] bg-zinc-900/80 border border-zinc-800 rounded-lg p-4 flex flex-col items-center hover:scale-105 hover:border-blue-500 cursor-pointer transition duration-300 group shadow-lg flex-shrink-0"
                >
                  <div className="relative w-full overflow-hidden rounded-md mb-3">
                    <img 
                      src={show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Poster'} 
                      alt={show.name}
                      className="w-full h-72 object-cover rounded-md group-hover:opacity-90 transition"
                    />
                    <span className="absolute bottom-2 right-2 bg-blue-600/90 text-xs px-2 py-1 rounded text-white font-medium backdrop-blur-md">
                      Click Details
                    </span>
                  </div>
                  
                  <h2 className="font-semibold text-lg text-center line-clamp-1 w-full">{show.name}</h2>
                  <div className="flex justify-between w-full text-slate-400 text-sm mt-2 px-1">
                    <span>{show.premiered ? show.premiered.substring(0, 4) : 'N/A'}</span>
                    <span className="text-yellow-400 font-semibold">
                      {show.rating?.average ? `⭐ ${show.rating.average}` : ''}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 🎬 MOVIE DETAILS & TRAILER MODAL POPUP */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-2xl text-white">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white rounded-full w-8 h-8 flex items-center justify-center transition font-bold"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-6 mb-6 mt-2">
              {/* Poster */}
              <img 
                src={selectedMovie.image?.original || selectedMovie.image?.medium || 'https://via.placeholder.com/210x295?text=No+Poster'} 
                alt={selectedMovie.name} 
                className="w-full sm:w-48 h-72 object-cover rounded-lg shadow-lg"
              />

              {/* Details */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{selectedMovie.name}</h2>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedMovie.genres?.map((genre) => (
                    <span key={genre} className="bg-zinc-800 text-slate-300 text-xs px-2.5 py-1 rounded-full border border-zinc-700">
                      {genre}
                    </span>
                  ))}
                </div>

                <p className="text-yellow-400 font-semibold mb-2">
                  {selectedMovie.rating?.average ? `⭐ Rating: ${selectedMovie.rating.average} / 10` : '⭐ Rating: N/A'}
                </p>
                
                <p className="text-slate-400 text-sm mb-4">
                  <strong>Premiered:</strong> {selectedMovie.premiered || 'Unknown'} | <strong>Language:</strong> {selectedMovie.language || 'N/A'}
                </p>

                <h3 className="font-semibold text-lg mb-1 text-slate-200">Overview</h3>
                <p className="text-slate-300 text-sm leading-relaxed max-h-36 overflow-y-auto pr-2">
                  {stripHtml(selectedMovie.summary)}
                </p>
              </div>
            </div>

            {/* YouTube Trailer Action Card */}
            <div className="border-t border-zinc-800 pt-4 mt-4">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span>🎬</span> Official Trailer
              </h3>
              
              <div className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                <p className="text-slate-300 text-sm mb-4">
                  Watch official trailers and clips for <span className="font-semibold text-white">{selectedMovie.name}</span>
                </p>
                
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedMovie.name + ' official trailer')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-3 transition transform hover:scale-105 shadow-lg shadow-red-600/30"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                  Watch Trailer on YouTube
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}