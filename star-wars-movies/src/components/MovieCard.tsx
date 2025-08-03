import React, { memo } from 'react';
import { Film } from '../types/film';

interface MovieCardProps {
  film: Film;
  onMoreInfo: (film: Film) => void;
}

const MovieCard: React.FC<MovieCardProps> = memo(({ film, onMoreInfo }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getMoviePosterUrl = (episodeId: number): string => {
    const posterMap: { [key: number]: string } = {
      1: '/images/phantom-menace.jpg',
      2: '/images/attack-clones.jpg',
      3: '/images/revenge-sith.jpg',
      4: '/images/new-hope.jpg',
      5: '/images/empire-strikes.jpg',
      6: '/images/return-jedi.jpg'
    };
    return posterMap[episodeId] || '/images/new-hope.jpg';
  };

  const handleMoreInfoClick = () => {
    onMoreInfo(film);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMoreInfoClick();
    }
  };

  const handleCardClick = () => {
    onMoreInfo(film);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onMoreInfo(film);
    }
  };

  return (
    <article 
      className="group relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 rounded-lg focus-within:ring-2 focus-within:ring-yellow-400 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 cursor-pointer"
      role="article"
      aria-labelledby={`movie-title-${film.episode_id}`}
      aria-describedby={`movie-description-${film.episode_id}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
    >
      {/* Background overlay for hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
      
      {/* Movie poster background */}
      <div className="relative h-48 overflow-hidden border-b border-gray-700">
        <img 
          src={getMoviePosterUrl(film.episode_id)}
          alt={`${film.title} movie poster`}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        {/* Episode indicator */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1">
          <p className="text-xs text-yellow-400 font-semibold">Episode {film.episode_id}</p>
        </div>
      </div>
      
      <div className="relative z-10 p-6">
        <header className="mb-4">
          <h3 
            id={`movie-title-${film.episode_id}`}
            className="text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300 mb-2"
          >
            {film.title}
          </h3>
          <div className="flex items-center text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
            <svg 
              className="h-4 w-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time dateTime={film.release_date}>
              {formatDate(film.release_date)}
            </time>
          </div>
        </header>
        
        <div className="mb-4">
          <p 
            id={`movie-description-${film.episode_id}`}
            className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300 text-sm leading-relaxed"
          >
            {truncateText(film.opening_crawl.replace(/\r\n/g, ' '), 120)}
          </p>
        </div>
        
        <footer className="flex justify-between items-center pt-2">
          <div className="flex items-center space-x-4 text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            <span aria-label={`Episode ${film.episode_id}`}>
              Ep. {film.episode_id}
            </span>
            <span>•</span>
            <span>{film.characters.length} characters</span>
          </div>
          <button
            className="px-3 py-1 border border-yellow-400/50 text-yellow-400 hover:bg-yellow-400 hover:text-black focus:bg-yellow-400 focus:text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 group-hover:border-yellow-300 rounded-md text-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleMoreInfoClick();
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              handleKeyDown(e);
            }}
            aria-label={`More information about ${film.title}`}
            type="button"
          >
            <svg 
              className="h-4 w-4 inline mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </button>
        </footer>
      </div>
    </article>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;

