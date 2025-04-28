/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../login/page';

// Create a mock for the router
const routerPushMock = jest.fn();

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: routerPushMock,
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return '/login';
  },
  useSearchParams() {
    return new URLSearchParams();
  }
}));

// Mock localStorage with proper typing
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = String(value);
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch function
global.fetch = jest.fn();

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    
    // Reset the router push mock
    routerPushMock.mockReset();
  });

  it('renders the login form correctly', () => {
    render(<LoginPage />);
    
    // Check for heading
    expect(screen.getByText('Log In to Your Account')).toBeInTheDocument();
    
    // Check for form fields
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    
    // Check for links
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('shows validation errors for missing fields', async () => {
    render(<LoginPage />);
    
    // Submit form without entering data
    const submitButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitButton);
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('handles successful login and redirects to dashboard', async () => {
    // Mock fetch response for successful login
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        message: 'Login successful',
        user: {
          email: 'test@example.com',
          name: 'Test User',
          role: 'user'
        }
      })
    });
    
    render(<LoginPage />);
    
    // Fill in form
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    const form = screen.getByRole('button', { name: /log in/i }).closest('form');
    fireEvent.submit(form!); // Use non-null assertion as we know the form exists
    
    // Check for API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
    });
    
    // Check for redirect to dashboard
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith('/dashboard');
    });
    
    // Check localStorage was set
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'demoUser',
      expect.any(String)
    );
  });

  it('handles failed login attempt', async () => {
    // Mock fetch response for failed login
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
        error: 'Invalid email or password'
      })
    });
    
    render(<LoginPage />);
    
    // Fill in form
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    // Submit form
    const form = screen.getByRole('button', { name: /log in/i }).closest('form');
    fireEvent.submit(form!);
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  it('redirects to admin dashboard for admin users', async () => {
    // Mock fetch response for admin login
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        message: 'Login successful',
        user: {
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin'
        }
      })
    });
    
    render(<LoginPage />);
    
    // Fill in form with admin credentials
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    
    // Submit form
    const form = screen.getByRole('button', { name: /log in/i }).closest('form');
    fireEvent.submit(form!);
    
    // Check for redirect to admin dashboard
    await waitFor(() => {
      expect(routerPushMock).toHaveBeenCalledWith('/admin');
    });
    
    // Check localStorage was set with admin flag
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'demoUser',
      expect.any(String)
    );
  });

  it('allows auto-fill of demo credentials', () => {
    render(<LoginPage />);
    
    // Click "Use demo account" button
    const demoButton = screen.getByText('Use demo account');
    fireEvent.click(demoButton);
    
    // Check if form fields were populated
    const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    
    expect(emailInput.value).toBe('demo@example.com');
    expect(passwordInput.value).toBe('password123');
  });
}); 