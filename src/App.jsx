import { useState, useEffect, useRef } from 'react'

const CURATED_ANIME_MOVIES = [
  {
    id: 'anime-1',
    name: 'Your Name (Kimi no Na wa)',
    genres: ['Anime', 'Romance', 'Drama', 'Fantasy'],
    rating: { average: 8.9 },
    premiered: '2016-08-26',
    language: 'Japanese',
    runtime: 106,
    type: 'Movie',
    image: {
      medium: 'https://m.media-amazon.com/images/M/MV5BNGYyNzI3MWYtZjliNC00ZjY2LWEwNjYtOGZjZDJjNWQxYjNmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,675,1000_AL_.jpg',
      original: 'https://m.media-amazon.com/images/M/MV5BNGYyNzI3MWYtZjliNC00ZjY2LWEwNjYtOGZjZDJjNWQxYjNmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,675,1000_AL_.jpg'
    },
    summary: 'Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?',
    youtubeId: 'xU47NhruN-Q'
  },
  {
    id: 'anime-2',
    name: 'Weathering With You (Tenki no Ko)',
    genres: ['Anime', 'Romance', 'Fantasy', 'Drama'],
    rating: { average: 8.3 },
    premiered: '2019-07-19',
    language: 'Japanese',
    runtime: 112,
    type: 'Movie',
    image: {
      medium: 'https://m.media-amazon.com/images/M/MV5BNzE4ZDEzNmUtM2I1YS00NDQ0LWI0M2EtZDg0YTY0NmE3YjM5XkEyXkFqcGdeQXVyMTA3OTEyMzE1._V1_SY1000_CR0,0,675,1000_AL_.jpg',
      original: 'https://m.media-amazon.com/images/M/MV5BNzE4ZDEzNmUtM2I1YS00NDQ0LWI0M2EtZDg0YTY0NmE3YjM5XkEyXkFqcGdeQXVyMTA3OTEyMzE1._V1_SY1000_CR0,0,675,1000_AL_.jpg'
    },
    summary: 'A high-school boy who has run away to Tokyo befriends a girl who appears to be able to manipulate the weather.',
    youtubeId: 'QEm4SkXrVQM'
  },
  {
    id: 'anime-3',
    name: 'The Garden of Words (Kotonoha no Niwa)',
    genres: ['Anime', 'Romance', 'Drama'],
    rating: { average: 8.1 },
    premiered: '2013-05-31',
    language: 'Japanese',
    runtime: 46,
    type: 'Movie',
    image: {
      medium: 'https://m.media-amazon.com/images/M/MV5BNWM1NmY3YmYtNjdiOS00NmE2LWE0OWEtNTM0NDc5YjZlOGE2XkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_SY1000_CR0,0,707,1000_AL_.jpg',
      original: 'https://m.media-amazon.com/images/M/MV5BNWM1NmY3YmYtNjdiOS00NmE2LWE0OWEtNTM0NDc5YjZlOGE2XkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_SY1000_CR0,0,707,1000_AL_.jpg'
    },
    summary: 'A 15-year-old boy and a 27-year-old woman find an unexpected friendship in Tokyo during the rainy season through shoe design and poetry.',
    youtubeId: 's2U_KXvxgSI'
  },
  {
    id: 'anime-4',
    name: 'A Silent Voice (Koe no Katachi)',
    genres: ['Anime', 'Drama', 'Romance'],
    rating: { average: 8.8 },
    premiered: '2016-09-17',
    language: 'Japanese',
    runtime: 130,
    type: 'Movie',
    image: {
      medium: 'https://m.media-amazon.com/images/M/MV5BZGRkOGMxYTctZTBjZi00NzI0LWIzNzktNTBhMTRmZmYwZjg0XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,707,1000_AL_.jpg',
      original: 'https://m.media-amazon.com/images/M/MV5BZGRkOGMxYTctZTBjZi00NzI0LWIzNzktNTBhMTRmZmYwZjg0XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,707,1000_AL_.jpg'
    },
    summary: 'A young man is ostracized by his classmates after he bullies a deaf girl to the point where she moves away. Years later, he sets off upon a path for redemption.',
    youtubeId: 'nfKccmkRKd0'
  },
  {
    id: 'anime-5',
    name: '5 Centimeters per Second',
    genres: ['Anime', 'Romance', 'Drama'],
    rating: { average: 7.9 },
    premiered: '2007-03-03',
    language: 'Japanese',
    runtime: 63,
    type: 'Movie',
    image: {
      medium: 'https://m.media-amazon.com/images/M/MV5BZDJhYjI0M2UtMjQ0MC00YjE3LWFiMGYtNzg5ZGY1N2RjODZjXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,707,1000_AL_.jpg',
      original: 'https://m.media-amazon.com/images/M/MV5BZDJhYjI0M2UtMjQ0MC00YjE3LWFiMGYtNzg5ZGY1N2RjODZjXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,707,1000_AL_.jpg'
    },
    summary: 'Takaki and Akari are two close friends who are forced apart by circumstances, exploring their emotional distance over the years across three distinct chapters.',
    youtubeId: 'azQ9g_VfV_Y'
  },
  {
    id: 'anime-6',
    name: 'Suzume (Suzume no Tojimari)',
    genres: ['Anime', 'Adventure', 'Fantasy', 'Drama'],
    rating: { average: 8.5 },
    premiered: '2022-11-11',
    language: 'Japanese',
    runtime: 122,
    type: 'Movie',
    image: {
      medium: 'https://m.media-amazon.com/images/M/MV5BMjEzYjA0MzAtZGRmZi00NmEwLWE1NWMtMGRmZDIyMTE0YzA0XkEyXkFqcGdeQXVyMTIzMDU0NjY5._V1_SY1000_CR0,0,675,1000_AL_.jpg',
      original: 'https://m.media-amazon.com/images/M/MV5BMjEzYjA0MzAtZGRmZi00NmEwLWE1NWMtMGRmZDIyMTE0YzA0XkEyXkFqcGdeQXVyMTIzMDU0NjY5._V1_SY1000_CR0,0,675,1000_AL_.jpg'
    },
    summary: 'A modern action-adventure road story where a 17-year-old girl named Suzume helps a mysterious young man close doors from the other side that are releasing disasters all over Japan.',
    youtubeId: 'fvYtaumDj0M'
  },
  {
    id: 'anime-7',
    name: 'I Want to Eat Your Pancreas',
    genres: ['Anime', 'Drama', 'Romance'],
    rating: { average: 8.6 },
    premiered: '2018-09-01',
    language: 'Japanese',
    runtime: 108,
    type: 'Movie',
    image: {
      medium: 'https://m.media-amazon.com/images/M/MV5BZWQxMjBjNmUtZDE3Mi00OWI5LThhYzEtOGFmOTZjN2NlZTMzXkEyXkFqcGdeQXVyNDg4NjE5OTQ@._V1_SY1000_CR0,0,707,1000_AL_.jpg',
      original: 'https://m.media-amazon.com/images/M/MV5BZWQxMjBjNmUtZDE3Mi00OWI5LThhYzEtOGFmOTZjN2NlZTMzXkEyXkFqcGdeQXVyNDg4NjE5OTQ@._V1_SY1000_CR0,0,707,1000_AL_.jpg'
    },
    summary: 'A high school student finds a diary in a hospital written by his popular classmate who is secretly suffering from a pancreatic terminal illness.',
    youtubeId: '9W9H3Wf_x_M'
  },
  {
    id: 'anime-8',
    name: 'Spirited Away',
    genres: ['Anime', 'Adventure', 'Fantasy', 'Family'],
    rating: { average: 9.0 },
    premiered: '2001-07-20',
    language: 'Japanese',
    runtime: 125,
    type: 'Movie',
    image: {
      medium: 'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,675,1000_AL_.jpg',
      original: 'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,675,1000_AL_.jpg'
    },
    summary: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
    youtubeId: 'ByXuk9QqQkk'
  },
  {
    id: 'anime-9',
    name: "Howl's Moving Castle",
    genres: ['Anime', 'Fantasy', 'Adventure', 'Romance'],
    rating: { average: 8.7 },
    premiered: '2004-11-20',
    language: 'Japanese',
    runtime: 119,
    type: 'Movie',
    image: {
      medium: 'https://m.media-amazon.com/images/M/MV5BNmM4YTFmMmEtOGNiNC00NWIyLWFjMjYtYzJmZDhhZTk0ODRiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY1000_CR0,0,689,1000_AL_.jpg',
      original: 'https://m.media-amazon.com/images/M/MV5BNmM4YTFmMmEtOGNiNC00NWIyLWFjMjYtYzJmZDhhZTk0ODRiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY1000_CR0,0,689,1000_AL_.jpg'
    },
    summary: 'When an unconfident young woman is cursed with an old body by a spiteful witch, her only chance of breaking the spell lies with a self-indulgent yet young wizard.',
    youtubeId: 'ywMqf056ar0'
  }
]

const BACKGROUND_POSTERS = [
  "https://m.media-amazon.com/images/M/MV5BNGYyNzI3MWYtZjliNC00ZjY2LWEwNjYtOGZjZDJjNWQxYjNmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,675,1000_AL_.jpg",
  "https://m.media-amazon.com/images/M/MV5BNzE4ZDEzNmUtM2I1YS00NDQ0LWI0M2EtZDg0YTY0NmE3YjM5XkEyXkFqcGdeQXVyMTA3OTEyMzE1._V1_SY1000_CR0,0,675,1000_AL_.jpg",
  "https://m.media-amazon.com/images/M/MV5BMjEzYjA0MzAtZGRmZi00NmEwLWE1NWMtMGRmZDIyMTE0YzA0XkEyXkFqcGdeQXVyMTIzMDU0NjY5._V1_SY1000_CR0,0,675,1000_AL_.jpg",
  "https://m.media-amazon.com/images/M/MV5BZGRkOGMxYTctZTBjZi00NzI0LWIzNzktNTBhMTRmZmYwZjg0XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,707,1000_AL_.jpg",
  "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,675,1000_AL_.jpg",
  "https://m.media-amazon.com/images/M/MV5BNmM4YTFmMmEtOGNiNC00NWIyLWFjMjYtYzJmZDhhZTk0ODRiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SY1000_CR0,0,689,1000_AL_.jpg"
]

const CATEGORIES = [
  'Home', 'Anime Movie', 'Anime Series', 'Series', 
  'Entertainment', 'Action', 'Romance', 'Horror', 'Adventure', 'Fantasy', 'Family'
]

const MovieCard = ({ show, onClick }) => {
  const posterUrl = show.image?.medium || show.image?.original || 'https://m.media-amazon.com/images/M/MV5BNGYyNzI3MWYtZjliNC00ZjY2LWEwNjYtOGZjZDJjNWQxYjNmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,675,1000_AL_.jpg';
  
  return (
    <div 
      onClick={onClick}
      className="min-w-[200px] max-w-[200px] flex flex-col items-center hover:scale-105 hover:-translate-y-2 hover:z-30 cursor-pointer transition-all duration-300 group flex-shrink-0"
    >
      <div className="relative w-full overflow-hidden rounded-xl shadow-2xl shadow-black/80 border border-zinc-800 group-hover:border-red-600 bg-zinc-900">
        <img 
          src={posterUrl} 
          alt={show.name}
          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="bg-red-600 text-xs px-3 py-1 rounded-full text-white font-bold shadow-lg animate-pulse">
            View Details
          </span>
        </div>
      </div>
      <h2 className="font-bold text-base text-center line-clamp-1 w-full mt-3 text-white group-hover:text-red-500 transition-colors">{show.name}</h2>
      <div className="flex justify-between w-full text-zinc-400 text-xs mt-1 px-2 font-medium">
        <span>{show.premiered ? show.premiered.substring(0, 4) : 'N/A'}</span>
        <span className="text-yellow-500 font-bold">
          {show.rating?.average ? `⭐ ${show.rating.average}` : ''}
        </span>
      </div>
    </div>
  )
}

const AutoFeaturedCarousel = ({ movies, onMovieSelect }) => {
  const scrollRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered || !movies || movies.length === 0) return
    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' })
        }
      }
    }, 2800)
    return () => clearInterval(timer)
  }, [isHovered, movies])

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!movies || movies.length === 0) return null

  return (
    <div className="relative w-full mb-12 group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-black text-white pl-4 border-l-4 border-red-600 uppercase tracking-wide">
          🔥 Featured Spotlight
        </h2>
        <span className="text-xs text-zinc-400 italic pr-2">Auto-Scrolling • Hover to Pause</span>
      </div>

      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-[55%] -translate-y-1/2 z-20 bg-black/80 hover:bg-red-600 text-white rounded-r-xl w-10 h-20 flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-2xl border-y border-r border-zinc-800 text-xl backdrop-blur-sm"
      >❮</button>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-[55%] -translate-y-1/2 z-20 bg-black/80 hover:bg-red-600 text-white rounded-l-xl w-10 h-20 flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-2xl border-y border-l border-zinc-800 text-xl backdrop-blur-sm"
      >❯</button>

      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-5 overflow-x-auto py-3 px-2 scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map(show => (
          <MovieCard key={show.id} show={show} onClick={() => onMovieSelect(show)} />
        ))}
      </div>
    </div>
  )
}

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

    const curatedMatches = CURATED_ANIME_MOVIES.filter(movie => 
      movie.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    try {
      const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      const apiMatches = data.map(item => item.show)
      
      setSearchResults([...curatedMatches, ...apiMatches])
      setActiveCategory('')
    } catch (err) {
      setSearchResults(curatedMatches)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryMovies = (category) => {
    switch(category) {
      case 'Anime Movie':
        return CURATED_ANIME_MOVIES
      case 'Anime Series':
        return allShows.filter(show => show.genres?.includes('Anime'))
      case 'Series':
        return allShows.filter(show => show.genres?.includes('Mystery') || show.genres?.includes('Thriller') || show.genres?.includes('Crime'))
      case 'Entertainment':
        return allShows.filter(show => show.genres?.includes('Comedy') || show.genres?.includes('Reality'))
      default:
        return allShows.filter(show => show.genres?.includes(category))
    }
  }

  const stripHtml = (html) => {
    if (!html) return 'No description available.'
    return html.replace(/<[^>]*>?/gm, '')
  }

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-x-hidden pb-20">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        /* 🌌 HIGH-END CINEMATIC BACKGROUND DRIFT ANIMATION */
        .bg-wall-container {
          position: fixed;
          top: -20vh;
          left: -10vw;
          width: 120vw;
          height: 140vh;
          display: flex;
          gap: 2rem;
          transform: rotate(-8deg) scale(1.15);
          pointer-events: none;
          z-index: 0;
        }
        .scroll-column {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 220px;
          flex-shrink: 0;
        }
        .animate-drift-up {
          animation: driftUp 35s linear infinite;
        }
        .animate-drift-down {
          animation: driftDown 40s linear infinite;
        }
        @keyframes driftUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes driftDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>

      {/* 🌟 IMMERSIVE BACKGROUND GLOW & ANIMATED POSTER WALL */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="bg-wall-container opacity-20 filter blur-[2px]">
          {[...Array(6)].map((_, colIndex) => (
            <div key={colIndex} className={`scroll-column ${colIndex % 2 === 0 ? 'animate-drift-up' : 'animate-drift-down'}`}>
              {[...BACKGROUND_POSTERS, ...BACKGROUND_POSTERS, ...BACKGROUND_POSTERS].map((poster, imgIndex) => (
                <img key={imgIndex} src={poster} alt="bg" className="w-full h-80 rounded-xl object-cover shadow-2xl border border-white/5" />
              ))}
            </div>
          ))}
        </div>
        {/* Multi-layered Vignette Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/50 to-black"></div>
      </div>

      {/* 🌟 NAVIGATION BAR */}
      <nav className="sticky top-0 w-full z-40 bg-black/90 backdrop-blur-xl border-b border-zinc-800/80 px-8 py-5 flex flex-col xl:flex-row justify-between items-center gap-6 shadow-2xl">
        <div className="flex flex-col xl:flex-row items-center gap-8 w-full xl:w-auto">
          <h1 
            onClick={() => { setIsSearching(false); setActiveCategory('Home'); setSearchTerm(''); }}
            className="text-3xl font-extrabold text-red-600 uppercase tracking-widest cursor-pointer drop-shadow-md hover:text-red-500 transition shrink-0"
          >
            Review
          </h1>
          
          <ul className="flex overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 scroll-smooth no-scrollbar gap-5 text-sm font-semibold text-zinc-300 whitespace-nowrap">
            {CATEGORIES.map(category => (
              <li 
                key={category} 
                onClick={() => { setIsSearching(false); setActiveCategory(category); setSearchTerm(''); }}
                className={`cursor-pointer transition hover:text-white ${activeCategory === category && !isSearching ? 'text-white border-b-2 border-red-600 pb-1 font-bold' : ''}`}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 w-full sm:w-auto justify-center shrink-0">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Titles, people, genres..." 
            className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 w-full sm:w-64 text-sm shadow-inner transition"
          />
          <button 
            onClick={handleSearch}
            className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-bold text-white shadow-lg transition"
          >Search</button>
        </div>
      </nav>

      {/* 🌟 MAIN CONTENT CONTAINER (Proper Spacing to Avoid Overlap) */}
      <div className="relative z-10 w-full px-8 mt-8">
        
        {loading && <div className="text-center text-red-500 font-bold text-2xl animate-pulse mt-24">Loading Library...</div>}
        {error && <div className="text-center text-red-400 font-bold mt-24">{error}</div>}

        {!loading && (
          <>
            {/* 🌸 HERO BANNER FOR ANIME MOVIE PAGE */}
            {activeCategory === 'Anime Movie' && !isSearching && (
              <div className="relative w-full h-[380px] rounded-2xl overflow-hidden mb-12 shadow-2xl border border-zinc-800 flex items-center">
                <img 
                  src="https://m.media-amazon.com/images/M/MV5BNGYyNzI3MWYtZjliNC00ZjY2LWEwNjYtOGZjZDJjNWQxYjNmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SY1000_CR0,0,675,1000_AL_.jpg" 
                  alt="Anime Movie Banner" 
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.35]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
                
                <div className="relative z-10 px-8 md:px-16 max-w-2xl">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block shadow-lg">
                    Featured Collection
                  </span>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
                    Masterpiece Anime Movies
                  </h2>
                  <p className="text-zinc-300 text-base md:text-lg mb-6 leading-relaxed">
                    Immerse yourself in breathtaking visual masterpieces, emotional storytelling, and unforgettable cinematic journeys from legendary Japanese animation studios.
                  </p>
                  <button 
                    onClick={() => setSelectedMovie(CURATED_ANIME_MOVIES[0])}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105 flex items-center gap-2"
                  >
                    ▶ Explore Spotlight
                  </button>
                </div>
              </div>
            )}

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
              <div className="flex flex-col gap-2">
                <AutoFeaturedCarousel movies={CURATED_ANIME_MOVIES} onMovieSelect={setSelectedMovie} />

                <MovieRow title="🌸 Masterpiece Anime Movies" movies={CURATED_ANIME_MOVIES} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Intense Mystery Series (Dark, From)" movies={getCategoryMovies('Series')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Anime Series" movies={getCategoryMovies('Anime Series')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Blockbuster Action" movies={getCategoryMovies('Action')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Epic Fantasy & Sci-Fi" movies={getCategoryMovies('Fantasy')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Entertainment & Comedy" movies={getCategoryMovies('Entertainment')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Chilling Horror" movies={getCategoryMovies('Horror')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Romance & Drama" movies={getCategoryMovies('Romance')} onMovieSelect={setSelectedMovie} />
                <MovieRow title="Family Movie Night" movies={getCategoryMovies('Family')} onMovieSelect={setSelectedMovie} />
              </div>
            ) : 
            
            (
              <div>
                {activeCategory !== 'Anime Movie' && (
                  <h2 className="text-3xl font-bold mb-8 pl-4 border-l-4 border-red-600">{activeCategory}</h2>
                )}
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  {getCategoryMovies(activeCategory).map(show => (
                    <MovieCard key={show.id} show={show} onClick={() => setSelectedMovie(show)} />
                  ))}
                  {getCategoryMovies(activeCategory).length === 0 && (
                    <p className="text-zinc-400 text-lg">No titles found in this category.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 🎬 MOVIE DETAILS MODAL */}
      {selectedMovie && !playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-[0_0_50px_rgba(220,38,38,0.2)] text-white">
            <button 
              onClick={() => setSelectedMovie(null)}
              className="absolute top-4 right-4 bg-zinc-900 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center transition font-bold shadow-lg z-10"
            >✕</button>

            <div className="flex flex-col md:flex-row gap-8">
              <img 
                src={selectedMovie.image?.original || selectedMovie.image?.medium} 
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
                  <span className="bg-zinc-800 px-2 py-1 rounded">{selectedMovie.runtime ? `${selectedMovie.runtime} min` : 'N/A'}</span>
                </div>

                <p className="text-zinc-300 text-base leading-relaxed mb-8">
                  {stripHtml(selectedMovie.summary)}
                </p>

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

      {/* 🚀 FULL SCREEN VIDEO PLAYER */}
      {playingVideo && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <button 
            onClick={() => setPlayingVideo(null)}
            className="absolute top-6 right-8 z-50 bg-black/60 hover:bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center transition font-bold text-2xl border border-zinc-700 backdrop-blur-md"
            title="Close Player"
          >✕</button>

          <iframe 
            className="w-full h-full max-w-[1920px] max-h-[1080px] shadow-2xl"
            src={`https://www.youtube.com/embed/${playingVideo.youtubeId || 'dQw4w9WgXcQ'}?autoplay=1`}
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