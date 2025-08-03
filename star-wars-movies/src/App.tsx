import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Navigation from './components/Navigation';
import Movies from './components/Movies';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const App: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="App">
      {isAuthenticated && <Navigation />}
      <ProtectedRoute>
        <Movies />
      </ProtectedRoute>
    </div>
  );
};

export default App;

