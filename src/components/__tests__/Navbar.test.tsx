import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';

// Mock the usePathname hook
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Navbar Component', () => {
  it('renders the logo with correct text', () => {
    render(<Navbar />);
    const logo = screen.getByText('Yoga Life');
    expect(logo).toBeInTheDocument();
  });

  it('renders all navigation links on desktop', () => {
    render(<Navbar />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<Navbar />);
    
    // Mobile menu should be closed by default
    const mobileMenuButton = screen.getByRole('button');
    
    // Menu starts hidden
    expect(screen.queryByText('Home', { selector: '.md\\:hidden .block' })).not.toBeInTheDocument();
    
    // Open menu
    fireEvent.click(mobileMenuButton);
    
    // Menu should now be visible
    expect(screen.getByText('Home', { selector: '.md\\:hidden .block' })).toBeInTheDocument();
    
    // Close menu
    fireEvent.click(mobileMenuButton);
    
    // Menu should be hidden again
    expect(screen.queryByText('Home', { selector: '.md\\:hidden .block' })).not.toBeInTheDocument();
  });

  it('highlights the current page correctly', () => {
    // Update the mock for usePathname to return the About page
    jest.spyOn(require('next/navigation'), 'usePathname').mockReturnValue('/about');
    
    render(<Navbar />);
    
    // The "About" link should have the text-blue-600 and font-medium classes
    const aboutLink = screen.getAllByText('About')[0]; // Get desktop version
    expect(aboutLink).toHaveClass('text-blue-600');
    expect(aboutLink).toHaveClass('font-medium');
    
    // Other links should not have these classes
    const homeLink = screen.getAllByText('Home')[0]; // Get desktop version
    expect(homeLink).not.toHaveClass('text-blue-600');
    expect(homeLink).not.toHaveClass('font-medium');
  });
}); 