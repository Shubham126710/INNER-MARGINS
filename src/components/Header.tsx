'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Index' },
    { href: '/journals', label: 'Archive' },
    { href: '/analysis', label: 'Analysis' },
    { href: '/about', label: 'About' },
    { href: '/write', label: 'Write', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-ink/10 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="group flex items-center gap-3 no-underline decoration-transparent"
          >
            <div className="relative">
              <span className="text-xl md:text-2xl font-display tracking-tight text-ink">
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
                className={`text-xs font-sans uppercase tracking-widest transition-colors no-underline ${
                  link.highlight
                    ? 'text-ink hover:opacity-70 font-medium'
                    : pathname === link.href
                    ? 'text-ink font-medium'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-ink hover:opacity-70"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full md:hidden border-b border-ink/10 bg-paper shadow-sm z-50">
            <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm font-sans uppercase tracking-widest transition-colors no-underline ${
                  pathname === link.href
                    ? 'text-ink font-medium'
                    : 'text-muted hover:text-ink'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
