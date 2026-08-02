import { useState, useEffect, useRef } from 'react'

// A curated list of high-quality TVMaze poster URLs for the background wall
const BACKGROUND_POSTERS = [
  "https://static.tvmaze.com/uploads/images/medium_portrait/213/534017.jpg", // Witcher
  "https://static.tvmaze.com/uploads/images/medium_portrait/396/991288.jpg", // Stranger Things
  "https://static.tvmaze.com/uploads/images/medium_portrait/402/1006397.jpg", // The Boys
  "https://static.tvmaze.com/uploads/images/medium_portrait/417/1044456.jpg", // House of the Dragon
  "https://static.tvmaze.com/uploads/images/medium_portrait/362/906711.jpg", // Arcane
  "https://static.tvmaze.com/uploads/images/medium_portrait/297/744253.jpg", // Invincible
  "https://static.tvmaze.com/uploads/images/medium_portrait/78/19547.jpg",   // Daredevil
  "https://static.tvmaze.com/uploads/images/medium_portrait/476/1190697.jpg", // Loki
  "https://static.tvmaze.com/uploads/images/medium_portrait/481/1202727.jpg", // Gen V
  "https://static.tvmaze.com/uploads/images/medium_portrait/498/1247240.jpg", // Fallout
  "https://static.tvmaze.com/uploads/images/medium_portrait/400/1000562.jpg", // Severance
  "https://static.tvmaze.com/uploads/images/medium_portrait/399/999587.jpg", // Peaky Blinders
]

export default function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedMovie, setSelectedMovie] = useState(null)
  
  // Controls for auto-scrolling
  const [isHovered, setIsHovered] = useState(false)
  const scrollRef = useRef(null)

  const fetchMovies = async (query) => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`)
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

  // Load initial movies when the website first opens
  useEffect(() => {
    fetchMovies('marvel')
  }, [])

  const handleSearch = () => {
    fetchMovies(searchTerm)
  }

  // AUTO-MOVE CAROUSEL EFFECT
  useEffect(() => {
    if (isHovered || movies.length === 0 || selectedMovie) return
    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollRef.current.scrollBy({ left: 280, behavior: 'smooth' })
        }
      }
    }, 2500)
    return () => clearInterval(timer)
  }, [isHovered, movies, selectedMovie])

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
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col items-center overflow-x-hidden">
      
      {/* 🚀 CUSTOM CSS FOR THE NETFLIX BACKGROUND ANIMATION */}
      <style>{`
        .bg-wall-container {
          transform: rotate(-12deg) scale(1.3);
          width: 150vw;
          height: 150vh;
          position: absolute;
          left: -25vw;
          top: -25vh;
          display: flex;
          gap: 1rem;
        }
        .scroll-column {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 250px;
        }
        .animate-scroll-up {
          animation: scrollUp 45s linear infinite;
        }
        .animate-scroll-down {
          animation: scrollDown 45s linear infinite;
        }
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* 🎬 ANIMATED BACKGROUND WALL */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="bg-wall-container">
          {/* Create 8 columns for the background */}
          {[...Array(8)].map((_, colIndex) => (
            <div 
              key={colIndex} 
              // Alternate direction based on odd/even columns
              className={`scroll-column ${colIndex % 2 === 0 ? 'animate-scroll-up' : 'animate-scroll-down'}`}
            >
              {/* Duplicate the array twice inside each column to create a seamless infinite loop */}
              {[...BACKGROUND_POSTERS, ...BACKGROUND_POSTERS].map((poster, imgIndex) => (
                <img 
                  key={imgIndex} 
                  src={poster} 
                  alt="bg-poster" 
                  className="w-full rounded-lg shadow-2xl brightness-75"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Netflix-style Vignette Overlays (Darkens the edges) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/90"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
      </div>

      {/* 🌟 FOREGROUND CONTENT (z-10 ensures it stays above background) */}
      <div className="relative z-10 flex flex-col items-center w-full p-8">
        <h1 className="text-5xl font-extrabold mb-8 tracking-tight drop-shadow-2xl mt-12 text-red-600 uppercase">
          Movie Review
        </h1>
        
        {/* Search Input */}
        <div className="flex gap-2 mb-12">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for movies, shows..." 
            className="px-5 py-3 rounded-md bg-black/60 border border-zinc-700/80 text-white placeholder-zinc-400 focus:outline-none focus:border-red-600 backdrop-blur-md w-80 shadow-2xl text-lg"
          />
          <button 
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md font-bold text-white shadow-xl transition"
          >
            Search
          </button>
        </div>

        {/* Loading & Error States */}
        {loading && <p className="text-red-500 font-bold animate-pulse mb-4 text-xl">Fetching library...</p>}
        {error && <p className="text-red-400 font-medium mb-4">{error}</p>}

        {/* AUTO-MOVING CAROUSEL */}
        {movies.length > 0 && !loading && (
          <div className="relative w-full max-w-[90rem] group mt-4">
            
            {/* Left Arrow */}
            <button 
              onClick={() => handleManualScroll('left')}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center transition shadow-2xl border border-zinc-800 text-xl backdrop-blur-sm"
            >
              ❮
            </button>

            {/* Right Arrow */}
            <button 
              onClick={() => handleManualScroll('right')}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-black/80 hover:bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center transition shadow-2xl border border-zinc-800 text-xl backdrop-blur-sm"
            >
              ❯
            </button>

            {/* Scroll Container */}
            <div 
              ref={scrollRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex gap-6 overflow-x-auto py-6 px-4 scroll-smooth no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {movies.map((item) => {
                const show = item.show
                return (
                  <div 
                    key={show.id} 
                    onClick={() => setSelectedMovie(show)}
                    className="min-w-[240px] max-w-[240px] flex flex-col items-center hover:scale-[1.08] hover:z-30 cursor-pointer transition-all duration-300 group flex-shrink-0"
                  >
                    <div className="relative w-full overflow-hidden rounded-xl shadow-2xl shadow-black border border-zinc-800 group-hover:border-red-600">
                      <img 
                        src={show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Poster'} 
                        alt={show.name}
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <span className="bg-red-600 text-sm px-3 py-1 rounded-full text-white font-bold shadow-lg">
                          Details
                        </span>
                      </div>
                    </div>
                    
                    <h2 className="font-bold text-lg text-center line-clamp-1 w-full mt-3 drop-shadow-md">{show.name}</h2>
                    <div className="flex justify-between w-full text-zinc-400 text-sm mt-1 px-2 font-medium">
                      <span>{show.premiered ? show.premiered.substring(0, 4) : 'N/A'}</span>
                      <span className="text-yellow-500 font-bold drop-shadow-md">
                        {show.rating?.average ? `⭐ ${show.rating.average}` : ''}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 🎬 MODAL POPUP */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg transition-all">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-8 relative shadow-2xl text-white">
            
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-5 right-5 bg-zinc-800 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition font-bold shadow-lg"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row gap-8 mb-6 mt-2">
              <img 
                src={selectedMovie.image?.original || selectedMovie.image?.medium || 'https://via.placeholder.com/210x295?text=No+Poster'} 
                alt={selectedMovie.name} 
                className="w-full md:w-64 h-auto object-cover rounded-xl shadow-2xl border border-zinc-800"
              />

              <div className="flex-1">
                <h2 className="text-4xl font-extrabold mb-3">{selectedMovie.name}</h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedMovie.genres?.map((genre) => (
                    <span key={genre} className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-full border border-zinc-700 font-semibold">
                      {genre}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm font-medium">
                  <span className="text-yellow-500 text-lg">
                    {selectedMovie.rating?.average ? `⭐ ${selectedMovie.rating.average} / 10` : '⭐ N/A'}
                  </span>
                  <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">{selectedMovie.premiered?.substring(0, 4) || 'Unknown'}</span>
                  <span className="bg-zinc-800 px-2 py-1 rounded text-zinc-300">{selectedMovie.language || 'N/A'}</span>
                </div>

                <h3 className="font-bold text-lg mb-2 text-zinc-200 border-b border-zinc-800 pb-2">Overview</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-h-40 overflow-y-auto pr-2">
                  {stripHtml(selectedMovie.summary)}
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6 mt-6">
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedMovie.name + ' official trailer')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-3 transition transform shadow-lg shadow-red-600/20 text-lg"
              >
                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                Watch Trailer
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}