'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-card shadow-md py-4 px-6 sticky top-0 z-50 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary transition-all duration-300 hover:scale-105">
          Yoga Life
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-card-foreground transition-transform duration-300 hover:scale-110 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8">
          <NavLink href="/" current={pathname === '/'}>
            Home
          </NavLink>
          <NavLink href="/about" current={pathname === '/about'}>
            About
          </NavLink>
          <NavLink href="/pricing" current={pathname === '/pricing'}>
            Pricing
          </NavLink>
          <NavLink href="/login" current={pathname === '/login'}>
            Login
          </NavLink>
          <NavLink href="/signup" current={pathname === '/signup'}>
            Signup
          </NavLink>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-muted-foreground/30 animate-slideInUp">
          <div className="flex flex-col space-y-4">
            <MobileNavLink href="/" current={pathname === '/'}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/about" current={pathname === '/about'}>
              About
            </MobileNavLink>
            <MobileNavLink href="/pricing" current={pathname === '/pricing'}>
              Pricing
            </MobileNavLink>
            <MobileNavLink href="/login" current={pathname === '/login'}>
              Login
            </MobileNavLink>
            <MobileNavLink href="/signup" current={pathname === '/signup'}>
              Signup
            </MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`${
        current
          ? 'text-primary font-medium'
          : 'text-card-foreground hover:text-primary'
      } transition-all duration-300 hover:scale-105 relative group`}
    >
      {children}
      <span className={`absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 ${current ? 'w-full' : 'group-hover:w-full'}`}></span>
    </Link>
  );
}

function MobileNavLink({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`${
        current
          ? 'text-primary font-medium'
          : 'text-card-foreground hover:text-primary'
      } block transition-all duration-300 hover:translate-x-2`}
    >
      {children}
    </Link>
  );
} 