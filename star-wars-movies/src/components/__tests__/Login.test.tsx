import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../store/authSlice';
import Login from '../Login';

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

const renderWithProvider = (component: React.ReactElement) => {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
    store,
  };
};

describe('Login Component', () => {
  test('renders login form with all required elements', () => {
    renderWithProvider(<Login />);
    
    expect(screen.getByRole('heading', { name: /star wars movies/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login to the galaxy/i })).toBeInTheDocument();
  });

  test('allows user to enter username and password', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'testpass');
    
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('testpass');
  });

  test('login button is disabled when fields are empty', () => {
    renderWithProvider(<Login />);
    
    const loginButton = screen.getByRole('button', { name: /login to the galaxy/i });
    expect(loginButton).toBeDisabled();
  });

  test('login button is enabled when both fields have values', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login to the galaxy/i });
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'testpass');
    
    expect(loginButton).toBeEnabled();
  });

  test('password toggle eye appears when password is entered', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Login />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Initially, no toggle button should be visible
    expect(screen.queryByLabelText(/show password/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/hide password/i)).not.toBeInTheDocument();
    
    // Type password
    await user.type(passwordInput, 'testpass');
    
    // Toggle button should now be visible
    expect(screen.getByLabelText(/show password/i)).toBeInTheDocument();
  });

  test('password toggle functionality works correctly', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Login />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Type password
    await user.type(passwordInput, 'testpass');
    
    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle to show password
    const toggleButton = screen.getByLabelText(/show password/i);
    await user.click(toggleButton);
    
    // Password should now be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/hide password/i)).toBeInTheDocument();
    
    // Click toggle again to hide password
    const hideButton = screen.getByLabelText(/hide password/i);
    await user.click(hideButton);
    
    // Password should be hidden again
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText(/show password/i)).toBeInTheDocument();
  });

  test('submits form and dispatches login action', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProvider(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login to the galaxy/i });
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'testpass');
    await user.click(loginButton);
    
    await waitFor(() => {
      const state = store.getState();
      expect(state.auth.isAuthenticated).toBe(true);
      expect(state.auth.user?.username).toBe('testuser');
    });
  });

  test('has proper accessibility attributes', () => {
    renderWithProvider(<Login />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(usernameInput).toHaveAttribute('aria-describedby', 'username-help');
    expect(passwordInput).toHaveAttribute('aria-describedby', 'password-help');
    expect(usernameInput).toHaveAttribute('autoComplete', 'username');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
  });
});

