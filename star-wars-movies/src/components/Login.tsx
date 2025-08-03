import React, { useState, memo } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

const Login: React.FC = memo(() => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim() && password.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        dispatch(login({
          id: Date.now().toString(),
          username: username.trim()
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <main className="w-full max-w-md mx-4 bg-black/40 backdrop-blur-md border border-gray-700 rounded-lg p-6">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            Star Wars Movies
          </h1>
          <p className="text-gray-300">
            Enter your credentials to access the galaxy
          </p>
        </header>
        
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label 
              htmlFor="username" 
              className="text-gray-200 text-sm font-medium block"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoComplete="username"
              aria-describedby="username-help"
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            />
            <div id="username-help" className="sr-only">
              Enter your username to log in to the Star Wars movies application
            </div>
          </div>
          
          <div className="space-y-2">
            <label 
              htmlFor="password" 
              className="text-gray-200 text-sm font-medium block"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                aria-describedby="password-help"
                className="w-full px-3 py-2 pr-10 bg-gray-800/50 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
              />
              {password && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-yellow-400 focus:text-yellow-400 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              )}
            </div>
            <div id="password-help" className="sr-only">
              Enter your password to log in to the Star Wars movies application
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={!username.trim() || !password.trim() || isSubmitting}
            aria-describedby="login-button-help"
            className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {isSubmitting ? 'Logging in...' : 'Login to the Galaxy'}
          </button>
          <div id="login-button-help" className="sr-only">
            Click to log in with your username and password
          </div>
        </form>
      </main>
    </div>
  );
});

Login.displayName = 'Login';

export default Login;

