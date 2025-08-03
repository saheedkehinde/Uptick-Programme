import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Login from './Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

