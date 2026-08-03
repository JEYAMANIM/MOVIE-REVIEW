import { useState, useEffect, useRef } from 'react'

// Curated list of high-quality posters for the animated background
const BACKGROUND_POSTERS = [
  "https://static.tvmaze.com/uploads/images/medium_portrait/213/534017.jpg",
  "https://static.tvmaze.com/uploads/images/medium_portrait/396/991288.jpg",
  "https://static.tvmaze.com/uploads/images/medium_portrait/402/1006397.jpg",
  "https://static.tvmaze.com/uploads/images/medium_portrait/417/1044456.jpg",
  "https://static.tvmaze.com/uploads/images/medium_portrait/362/906711.jpg",
  "https://static.tvmaze.com/uploads/images/medium_portrait/297/744253.jpg",
  "https://static.tvmaze.com/uploads/images/medium_portrait/78/19547.jpg",
  "https://static.tvmaze.com/uploads/images/medium_portrait/476/1190697.jpg",
]

// 🚀 NEW: Updated Categories
const CATEGORIES = [
  'Home', 'Anime Series', 'Anime Movie', 'Series', 
  'Entertainment', 'Action', 'Romance', 'Horror', 'Adventure'
]

// 🎬 REUSABLE MOVIE CARD COMPONENT
const MovieCard = ({ show, onClick }) => (
  <div 
    onClick={onClick}
    className="min-w-[200px] max-w-[200px] flex flex-col items-center hover:scale-[1.08] hover:z-30 cursor-pointer transition-all duration-300 group flex-shrink-0"
  >
    <div className="relative w-full overflow-hidden rounded-xl shadow-xl shadow-black/50 border border-zinc-800 group-hover:border-red-600">
      <img 
        src={show.image?.medium || 'https://via.placeholder.com/210x295?text=No+Poster'} 
        alt={show.name}
        className="w-full h-72 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
        <span className="bg-red-600 text-xs px-3 py-1 rounded-full text-white font-bold shadow-lg">
          View Details
        </span>
      </div>
    </div>
    <h2 className="font-bold text-base text-center line-clamp-1 w-full mt-3 drop-shadow-md">{show.name}</h2>
    <div className="flex justify-between w-full text-zinc-400 text-xs mt-1 px-2 font-medium">
      <span>{show.premiered ? show.premiered.substring(0, 4) : 'N/A'}</span>
      <span className="text-yellow-500 font-bold drop-shadow-md">
        {show.rating?.average ? `⭐ ${show.rating.average}` : ''}
      </span>
    </div>
  </div>
)

// 🎬 REUSABLE HORIZONTAL ROW COMPONENT
const MovieRow = ({ title, movies, onMovieSelect }) => {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current
      const scrollAmount = direction === 'left' ? -clientWidth + 150 : clientWidth - 150
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!movies || movies.length === 0) return null

  return (
    <div className="relative w-full group mb-10">
      <h2 className="text-2xl font-bold mb-4 text-white pl-4 border-l-4 border-red-600 drop-shadow-lg">
        {title}
      </h2>
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-[55%] -translate-y-1/2 z-20 bg-black/80 hover:bg-red-600 text-white rounded-r-xl w-12 h-24 flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-2xl border-y border-r border-zinc-800 text-2xl backdrop-blur-sm"
      >❮</button>
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-[55%] -translate-y-1/2 z-20 bg-black/80 hover:bg-red-600 text-white rounded-l-xl w-12 h-24 flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-2xl border-y border-l border-zinc-800 text-2xl backdrop-blur-sm"
      >❯</button>
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto py-4 px-4 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map(show => (
          <MovieCard key={show.id} show={show} onClick={() => onMovieSelect(show)} />
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [allShows, setAllShows] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Home')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [selectedMovie, setSelectedMovie] = useState(null)
  // 🚀 NEW: State for Full Screen Video Player
  const [playingVideo, setPlayingVideo] = useState(null)

  useEffect(() => {
    const fetchInitialShows = async () => {
      try {
        const response = await fetch('https://api.tvmaze.com/shows')
        const data = await response.json()
        setAllShows(data)
      } catch (err) {
        setError('Failed to load database. Check connection.')
      } finally {
        setLoading(false)
      }
    }
    fetchInitialShows()
  }, [])

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    setLoading(true)
    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      setSearchResults(data.map(item => item.show))
      setActiveCategory('')
    } catch (err) {
      setError('Search failed.')
    } finally {
      setLoading(false)
    }
  }

  // 🚀 NEW: Advanced Filtering for Custom Categories
  const getCategoryMovies = (category) => {
    switch(category) {
      case 'Anime Series':
        return allShows.filter(show => show.genres?.includes('Anime'))
      case 'Anime Movie':
        // TVMaze relies heavily on shows, but we simulate movies by runtime/type
        return allShows.filter(show => show.genres?.includes('Anime') && (show.type === 'Movie' || show.runtime > 80))
      case 'Series':
        // Targets "Dark", "From" style mystery/thriller series
        return allShows.filter(show => show.genres?.includes('Mystery') || show.genres?.includes('Thriller') || show.genres?.includes('Crime'))
      case 'Entertainment':
        // General entertainment movies/shows
        return allShows.filter(show => show.genres?.includes('Comedy') || show.genres?.includes('Reality'))
      default:
        // Action, Romance, Horror, etc.
        return allShows.filter(show => show.genres?.includes(category))
    }
  }

  const stripHtml = (html) => {
    if (!html) return 'No description available.'
    return html.replace(/<[^>]*>?/gm, '')
  }

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-x-hidden pb-12">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .bg-wall-container {
          transform: rotate(-12deg) scale(1.3);
          width: 150vw; height: 150vh; position: fixed; left: -25vw; top: -25vh; display: flex; gap: 1rem;
        }
        .scroll-column { display: flex; flex-direction: column; gap: 1rem; width: 250px; }
        .animate-scroll-up { animation: scrollUp 45s linear infinite; }
        .animate-scroll-down { animation: scrollDown 45s linear infinite; }
        @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
      `}</style>

      {/* BACKGROUND WALL */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="bg-wall-container">
          {[...Array(10)].map((_, colIndex) => (
            <div key={colIndex} className={`scroll-column ${colIndex % 2 === 0 ? 'animate-scroll-up' : 'animate-scroll-down'}`}>
              {[...BACKGROUND_POSTERS, ...BACKGROUND_POSTERS].map((poster, imgIndex) => (
                <img key={imgIndex} src={poster} alt="bg" className="w-full rounded-lg shadow-2xl brightness-50" />
              ))}
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>

      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-40 bg-gradient-to-b from-black via-black/90 to-transparent pt-6 pb-8 px-8 flex flex-col xl:flex-row justify-between items-center gap-6 transition-all">
        <div className="flex flex-col xl:flex-row items-center gap-8 w-full xl:w-auto">
          <h1 
            onClick={() => { setIsSearching(false); setActiveCategory('Home'); setSearchTerm(''); }}
            className="text-4xl font-extrabold text-red-600 uppercase tracking-widest cursor-pointer drop-shadow-lg shrink-0"
          >
            Review
          </h1>
          
          <ul className="flex overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 scroll-smooth no-scrollbar gap-5 text-sm font-semibold text-zinc-300 whitespace-nowrap">
            {CATEGORIES.map(category => (
              <li 
                key={category} 
                onClick={() => { setIsSearching(false); setActiveCategory(category); setSearchTerm(''); }}
                className={`cursor-pointer transition hover:text-white hover:scale-110 ${activeCategory === category && !isSearching ? 'text-white border-b-2 border-red-600 pb-1' : ''}`}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Search */}
        <div className="flex gap-2 w-full sm:w-auto justify-center shrink-0">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Titles, people, genres..." 
            className="px-4 py-2 rounded bg-zinc-900/80 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 backdrop-blur-md w-full sm:w-64 text-sm shadow-inner"
          />
          <button 
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold text-white shadow-lg transition"
          >Search</button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full px-8 pt-56 xl:pt-40">
        
        {loading && <div className="text-center text-red-500 font-bold text-2xl animate-pulse mt-20">Loading Library...</div>}
        {error && <div className="text-center text-red-400 font-bold mt-20">{error}</div>}

        {!loading && (
          <>
            {isSearching ? (
              <div>
                <h2 className="text-3xl font-bold mb-8 pl-4 border-l-4 border-red-600">Search Results</h2>
                {searchResults.length === 0 ? (
                  <p className="text-zinc-400 text-lg">No movies found for "{searchTerm}".</p>
                ) : (
                  <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                    {searchResults.map(show => (
                      <MovieCard key={show.id} show={show} onClick={() => setSelectedMovie(show)} />
                    ))}
                  </div>
                )}
              </div>
            ) : 
            
            activeCategory === 'Home' ? (
              <div className="flex flex-col gap-4">
                <MovieRow title="Intense Series" movies={getCategoryMovies('Series')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Anime Series" movies={getCategoryMovies('Anime Series')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Blockbuster Action" movies={getCategoryMovies('Action')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Entertainment & Comedy" movies={getCategoryMovies('Entertainment')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Chilling Horror" movies={getCategoryMovies('Horror')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Romance & Drama" movies={getCategoryMovies('Romance')} onMovieSelect={setSelectedMovie} />
              </div>
            ) : 
            
            (
              <div>
                <h2 className="text-3xl font-bold mb-8 pl-4 border-l-4 border-red-600">{activeCategory}</h2>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  {getCategoryMovies(activeCategory).map(show => (
                    <MovieCard key={show.id} show={show} onClick={() => setSelectedMovie(show)} />
                  ))}
                  {getCategoryMovies(activeCategory).length === 0 && (
                    <p className="text-zinc-400 text-lg">No movies found in this category.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 🎬 MODAL POPUP (DETAILS) */}
      {selectedMovie && !playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-all">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-[0_0_50px_rgba(220,38,38,0.15)] text-white">
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 bg-zinc-900 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition font-bold shadow-lg z-10"
            >✕</button>

            <div className="flex flex-col md:flex-row gap-8">
              <img 
                src={selectedMovie.image?.original || selectedMovie.image?.medium || 'https://via.placeholder.com/300x450?text=No+Poster'} 
                alt={selectedMovie.name} 
                className="w-full md:w-72 h-auto object-cover rounded-lg shadow-2xl border border-zinc-800"
              />

              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4">{selectedMovie.name}</h2>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedMovie.genres?.map((genre) => (
                    <span key={genre} className="bg-red-600/20 text-red-400 text-xs px-3 py-1 rounded-full border border-red-600/30 font-bold uppercase tracking-wider">
                      {genre}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mb-6 text-sm font-semibold">
                  <span className="text-yellow-500 text-lg flex items-center gap-1">⭐ {selectedMovie.rating?.average || 'N/A'}</span>
                  <span className="bg-zinc-800 px-2 py-1 rounded">{selectedMovie.premiered?.substring(0, 4) || 'Unknown'}</span>
                  <span className="bg-zinc-800 px-2 py-1 rounded">{selectedMovie.language || 'N/A'}</span>
                </div>

                <p className="text-zinc-300 text-base leading-relaxed mb-8">
                  {stripHtml(selectedMovie.summary)}
                </p>

                {/* 🚀 NEW: Play Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button 
                    onClick={() => setPlayingVideo(selectedMovie)}
                    className="flex-1 inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg gap-3 transition transform hover:scale-105 shadow-lg shadow-red-600/30 text-lg"
                  >
                    ▶ Play Full Video
                  </button>
                  <a 
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(selectedMovie.name + ' official trailer')}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 py-4 rounded-lg gap-3 transition transform hover:scale-105 shadow-lg text-lg border border-zinc-700"
                  >
                    Watch Trailer
                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 NEW: FULL SCREEN VIDEO PLAYER */}
      {playingVideo && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in zoom-in duration-300">
          
          <button 
            onClick={() => setPlayingVideo(null)}
            className="absolute top-6 right-8 z-50 bg-black/50 hover:bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center transition font-bold text-2xl border border-zinc-700 backdrop-blur-md"
            title="Close Player"
          >✕</button>

          {/* 
            Since we don't have paid streaming rights, this iframe securely searches and embeds 
            the best matching full-length episode/movie directly from YouTube.
          */}
          <iframe 
            className="w-full h-full max-w-[1920px] max-h-[1080px] shadow-2xl"
            src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(playingVideo.name + ' full movie episode')}&autoplay=1`}
            title={`${playingVideo.name} Full Video`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

    </div>
  )
}