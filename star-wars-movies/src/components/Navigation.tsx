import React, { memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { RootState } from '../store';

const Navigation: React.FC = memo(() => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLogout();
    }
  };

  return (
    <nav 
      className="bg-black/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-yellow-400">
              <span className="sr-only">Star Wars Movies - </span>
              Star Wars Movies
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <div 
                className="flex items-center space-x-2 text-gray-300"
                aria-label={`Logged in as ${user.username}`}
              >
                <svg 
                  className="h-5 w-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                onKeyDown={handleKeyDown}
                aria-label="Log out of the application"
                className="px-3 py-1 border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800 focus:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md text-sm transition-colors duration-200"
                type="button"
              >
                <svg 
                  className="h-4 w-4 inline mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;

