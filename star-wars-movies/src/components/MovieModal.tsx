import React, { memo } from 'react';
import { Film } from '../types/film';

interface MovieModalProps {
  film: Film | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = memo(({ film, isOpen, onClose }) => {
  if (!isOpen || !film) return null;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${film.episode_id}`}
      aria-describedby={`modal-description-${film.episode_id}`}
    >
      <div className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <header className="flex justify-between items-start mb-6">
            <div>
              <h2 
                id={`modal-title-${film.episode_id}`}
                className="text-2xl font-bold text-yellow-400 mb-2"
              >
                {film.title}
              </h2>
              <div className="flex items-center text-gray-300 space-x-4">
                <span>Episode {film.episode_id}</span>
                <span>•</span>
                <time dateTime={film.release_date}>
                  {formatDate(film.release_date)}
                </time>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md p-2 transition-colors"
              aria-label="Close movie details"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">Opening Crawl</h3>
              <div 
                id={`modal-description-${film.episode_id}`}
                className="text-gray-300 leading-relaxed whitespace-pre-line bg-gray-800/30 p-4 rounded-md border border-gray-700"
              >
                {film.opening_crawl.replace(/\r\n/g, '\n')}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Production Details</h3>
                <div className="space-y-2 text-gray-300">
                  <div>
                    <span className="font-medium text-gray-200">Director:</span> {film.director}
                  </div>
                  <div>
                    <span className="font-medium text-gray-200">Producer:</span> {film.producer}
                  </div>
                  <div>
                    <span className="font-medium text-gray-200">Release Date:</span> {formatDate(film.release_date)}
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Statistics</h3>
                <div className="space-y-2 text-gray-300">
                  <div>
                    <span className="font-medium text-gray-200">Characters:</span> {film.characters.length}
                  </div>
                  <div>
                    <span className="font-medium text-gray-200">Planets:</span> {film.planets.length}
                  </div>
                  <div>
                    <span className="font-medium text-gray-200">Starships:</span> {film.starships.length}
                  </div>
                  <div>
                    <span className="font-medium text-gray-200">Vehicles:</span> {film.vehicles.length}
                  </div>
                  <div>
                    <span className="font-medium text-gray-200">Species:</span> {film.species.length}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <footer className="mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 focus:bg-yellow-700 text-black font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Close
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
});

MovieModal.displayName = 'MovieModal';

export default MovieModal;

