import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login } from '../../store/authSlice';
import Navigation from '../Navigation';

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
  return {
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
    store,
  };
};

describe('Navigation Component', () => {
  test('renders navigation with title', () => {
    renderWithProvider(<Navigation />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /star wars movies/i })).toBeInTheDocument();
  });

  test('shows user information when logged in', () => {
    const initialState = {
      auth: {
        isAuthenticated: true,
        user: { id: '1', username: 'testuser' }
      }
    };
    
    renderWithProvider(<Navigation />, initialState);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log out of the application/i })).toBeInTheDocument();
  });

  test('does not show user information when not logged in', () => {
    const initialState = {
      auth: {
        isAuthenticated: false,
        user: null
      }
    };
    
    renderWithProvider(<Navigation />, initialState);
    
    expect(screen.queryByRole('button', { name: /log out/i })).not.toBeInTheDocument();
  });

  test('handles logout when logout button is clicked', async () => {
    const user = userEvent.setup();
    const initialState = {
      auth: {
        isAuthenticated: true,
        user: { id: '1', username: 'testuser' }
      }
    };
    
    const { store } = renderWithProvider(<Navigation />, initialState);
    
    const logoutButton = screen.getByRole('button', { name: /log out of the application/i });
    await user.click(logoutButton);
    
    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.user).toBe(null);
  });

  test('has proper accessibility attributes', () => {
    const initialState = {
      auth: {
        isAuthenticated: true,
        user: { id: '1', username: 'testuser' }
      }
    };
    
    renderWithProvider(<Navigation />, initialState);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Main navigation');
    
    const userInfo = screen.getByLabelText(/logged in as testuser/i);
    expect(userInfo).toBeInTheDocument();
  });
});

