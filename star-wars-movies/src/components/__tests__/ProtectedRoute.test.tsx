import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import ProtectedRoute from '../ProtectedRoute';

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: initialState,
  });
};

const renderWithProvider = (component: React.ReactElement, initialState = {}) => {
  const store = createTestStore(initialState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute Component', () => {
  test('renders children when user is authenticated', () => {
    const initialState = {
      auth: {
        isAuthenticated: true,
        user: { id: '1', username: 'testuser' }
      }
    };
    
    renderWithProvider(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      initialState
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  test('renders Login component when user is not authenticated', () => {
    const initialState = {
      auth: {
        isAuthenticated: false,
        user: null
      }
    };
    
    renderWithProvider(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      initialState
    );
    
    expect(screen.getByRole('heading', { name: /star wars movies/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  test('switches from Login to protected content when authentication state changes', () => {
    const initialState = {
      auth: {
        isAuthenticated: false,
        user: null
      }
    };
    
    const { rerender } = renderWithProvider(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      initialState
    );
    
    // Initially shows login
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    
    // After authentication
    const authenticatedState = {
      auth: {
        isAuthenticated: true,
        user: { id: '1', username: 'testuser' }
      }
    };
    
    const store = createTestStore(authenticatedState);
    rerender(
      <Provider store={store}>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </Provider>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
  });
});

