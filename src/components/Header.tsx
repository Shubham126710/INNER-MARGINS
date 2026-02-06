'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/analysis', label: 'Analysis' },
    { href: '/write', label: 'Write', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-retro-surface border-b-4 border-retro-border">
      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-3 no-underline decoration-transparent"
          >
            <div className="relative">
              <span className="text-xl md:text-2xl font-display uppercase tracking-tighter text-retro-text hover:text-retro-primary">
                Inner Margins
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-code uppercase tracking-wide transition-none no-underline hover:bg-retro-text hover:text-retro-surface px-2 py-1 ${
                  link.highlight
                    ? 'btn-primary'
                    : pathname === link.href
                    ? 'bg-retro-text text-retro-surface'
                    : 'text-retro-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-retro-text hover:bg-retro-text hover:text-retro-surface"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t-4 border-retro-border border-dashed bg-retro-surface">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 px-2 text-sm font-mono uppercase transition-colors no-underline border-l-4 ${
                  link.highlight
                    ? 'border-retro-primary bg-retro-bg text-retro-text'
                    : pathname === link.href
                    ? 'border-retro-border bg-retro-bg text-retro-text'
                    : 'border-transparent text-retro-text/60 hover:text-retro-text hover:border-retro-border'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
