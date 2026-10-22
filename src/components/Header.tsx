'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Magnetic from './Magnetic';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/journals', label: 'Journals' },
    { href: '/analysis', label: 'Analysis' },
    { href: '/write', label: 'New Transmission', highlight: true },
  ];

  useGSAP(
    () => {
      // Entrance animation for header
      gsap.from('.header-nav-item', {
        y: -15,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      });
      gsap.from('.header-logo', {
        x: -20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      });
    },
    { scope: headerRef }
  );

  useGSAP(
    () => {
      if (isMenuOpen && mobileMenuRef.current) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo(
          '.mobile-nav-item',
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out', delay: 0.05 }
        );
      }
    },
    [isMenuOpen]
  );

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-retro-surface/95 backdrop-blur-md border-b-4 border-retro-border transition-colors"
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="header-logo group flex items-center gap-3 no-underline decoration-transparent"
          >
            <div className="relative">
              <span className="text-xl md:text-2xl font-display uppercase tracking-tighter text-retro-text hover:text-retro-primary transition-colors">
                Inner Margins
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const content = (
                <Link
                  href={link.href}
                  className={`text-[10px] md:text-sm font-mono uppercase tracking-widest no-underline transition-all duration-200 px-3 py-1.5 ${
                    link.highlight
                      ? 'border-2 border-retro-border bg-retro-surface text-retro-text hover:bg-retro-primary hover:text-retro-surface shadow-retro-sm hover:shadow-retro'
                      : isActive
                      ? 'bg-retro-text text-retro-surface shadow-retro-sm'
                      : 'text-retro-text hover:bg-retro-text/10'
                  }`}
                >
                  {link.label}
                </Link>
              );

              return (
                <div key={link.href} className="header-nav-item">
                  {link.highlight ? (
                    <Magnetic strength={0.2}>{content}</Magnetic>
                  ) : (
                    content
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-retro-text hover:bg-retro-text hover:text-retro-surface transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation Menu"
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
          <div
            ref={mobileMenuRef}
            className="absolute top-full left-0 w-full md:hidden border-b-4 border-retro-border bg-retro-surface shadow-retro z-50"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mobile-nav-item block py-3 px-4 text-sm font-mono uppercase transition-colors no-underline border-2 ${
                    pathname === link.href
                      ? 'border-retro-border bg-retro-bg text-retro-text shadow-retro-sm'
                      : 'border-transparent hover:border-retro-border hover:bg-retro-bg/50 text-retro-text'
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
