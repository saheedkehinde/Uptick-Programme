import React, { useState, useEffect, useMemo, memo } from 'react';
import { Film } from '../types/film';
import { fetchFilms } from '../services/api';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';
import SearchBar from './SearchBar';

const Movies: React.FC = memo(() => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadFilms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchFilms();
        // Sort films by episode_id for chronological order
        const sortedFilms = response.results.sort((a, b) => a.episode_id - b.episode_id);
        setFilms(sortedFilms);
      } catch (err) {
        setError('Failed to load Star Wars films. Please try again later.');
        console.error('Error loading films:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFilms();
  }, []);

  // Memoize the filtered films to prevent unnecessary re-renders
  const filteredFilms = useMemo(() => {
    if (!searchTerm.trim()) return films;
    
    const term = searchTerm.toLowerCase();
    return films.filter(film => 
      film.title.toLowerCase().includes(term) ||
      film.director.toLowerCase().includes(term) ||
      film.opening_crawl.toLowerCase().includes(term) ||
      film.episode_id.toString().includes(term)
    );
  }, [films, searchTerm]);

  const handleMoreInfo = (film: Film) => {
    setSelectedFilm(film);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFilm(null);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"
            aria-hidden="true"
          ></div>
          <p className="text-gray-300 text-lg">Loading the galaxy...</p>
          <span className="sr-only">Loading Star Wars movies</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div 
          className="max-w-md bg-red-900/20 border border-red-500/50 rounded-lg p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center">
            <svg 
              className="h-4 w-4 text-red-400 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4">
            Star Wars Movies
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Explore the epic saga that changed cinema forever. From a galaxy far, far away...
          </p>
          
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            placeholder="Search by title, director, or episode..."
          />
        </header>

        {filteredFilms.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No movies found</h3>
              <p className="text-gray-400">
                No movies match your search for "{searchTerm}". Try a different search term.
              </p>
            </div>
          </div>
        )}

        {filteredFilms.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-400">
                {searchTerm ? `Found ${filteredFilms.length} movie${filteredFilms.length !== 1 ? 's' : ''}` : `${filteredFilms.length} movies`}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-yellow-400 hover:text-yellow-300 text-sm underline focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                >
                  Clear search
                </button>
              )}
            </div>

            <section 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto"
              aria-label="Star Wars movies collection"
            >
              {filteredFilms.map((film) => (
                <MovieCard 
                  key={film.url} 
                  film={film} 
                  onMoreInfo={handleMoreInfo}
                />
              ))}
            </section>
          </>
        )}

        {films.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies found in the galaxy.</p>
          </div>
        )}
      </div>

      <MovieModal 
        film={selectedFilm}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
});

Movies.displayName = 'Movies';

export default Movies;

