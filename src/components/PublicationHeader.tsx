'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePublicationMeta } from '@/hooks/usePublicationMeta';

export default function PublicationHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  
  const { location, weather, isLoading: metaLoading } = usePublicationMeta();

  // Mode A: Index page gets the full masthead. Mode B: Other pages start compact.
  const isModeA = pathname === '/';

  useEffect(() => {
    setMounted(true);
    
    const updateTime = () => {
      const now = new Date();
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      setTimeStr(`${timeFormatter.format(now)} IST`);
      setDateStr(dateFormatter.format(now).toUpperCase());
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000 * 60);
    
    let scrolled = false;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY > 120 && !scrolled) {
            scrolled = true;
            setIsScrolled(true);
          } else if (currentScrollY < 40 && scrolled) {
            scrolled = false;
            setIsScrolled(false);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };
    
    if (isModeA) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      // Initial check in case they load scrolled down
      handleScroll();
    } else {
      setIsScrolled(true); // Always collapsed in Mode B
    }
    
    return () => {
      clearInterval(timeInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isModeA]);

  const navLinks = [
    { href: '/', label: 'Index' },
    { href: '/journals', label: 'Archive' },
    { href: '/analysis', label: 'Analysis' },
    { href: '/about', label: 'About' },
    { href: '/write', label: 'Desk' },
  ];

  // In Mode B, it is ALWAYS isScrolled=true visually.
  const displayCompact = !isModeA || isScrolled;

  return (
    <header className={`w-full bg-paper/95 backdrop-blur-md sticky top-0 z-50 border-b-4 border-ink font-sans text-ink transition-all duration-500 ease-in-out ${displayCompact ? 'py-3' : 'pt-8 pb-4'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Full Masthead (Visible only in Mode A when at top) */}
        {isModeA && (
          <div 
            className={`transition-all duration-500 ease-in-out overflow-hidden origin-top ${
              displayCompact ? 'max-h-0 opacity-0 -translate-y-4' : 'max-h-[500px] opacity-100 translate-y-0'
            }`}
          >
            {/* Top Metadata Strip */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-ink/20 pb-4 mb-8 text-[10px] uppercase tracking-widest text-ink gap-4">
              <div className="flex flex-col gap-1">
                <span>{mounted ? dateStr : 'LOADING DATE...'}</span>
                <span className="text-muted">{mounted ? timeStr : '--:-- IST'}</span>
              </div>

              <div className="flex flex-col items-start md:items-center gap-1">
                <span>VOL. III · EDITION 08</span>
                <span className="text-muted">CHANDIGARH / INDIA (BASE)</span>
              </div>

              <div className="flex flex-col items-start md:items-end gap-1">
                <span>{metaLoading ? 'ACQUIRING SIGNAL...' : location}</span>
                <span className="text-muted">{metaLoading ? 'WEATHER · —' : weather}</span>
              </div>
            </div>

            {/* The Masthead */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block text-ink hover:text-ink/80 transition-colors no-underline focus:outline-none w-full">
                <h1 
                  className="font-display tracking-tight uppercase leading-[0.8] mb-4 break-words"
                  style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }}
                >
                  Inner Margins
                </h1>
              </Link>
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted">
                A Personal Archive
              </p>
            </div>
          </div>
        )}

        {/* Navigation / Compact Header */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col md:flex-row items-center justify-between ${
          displayCompact ? 'py-1' : 'border-t border-b border-ink py-3 justify-center'
        }`}>
          
          {/* Compact Branding (Visible only when scrolled or in Mode B) */}
          <div className={`transition-all duration-500 ease-in-out overflow-hidden flex-shrink-0 ${
            displayCompact ? 'max-w-[300px] opacity-100 mr-8 mb-4 md:mb-0' : 'max-w-0 opacity-0 mr-0 mb-0'
          }`}>
            <Link href="/" className="flex items-center gap-4 text-ink hover:text-ink/80 transition-colors no-underline whitespace-nowrap focus:outline-none">
              <h1 className="text-2xl font-display tracking-tight uppercase leading-none mt-1">
                Inner Margins
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-muted hidden lg:inline">
                VOL. III
              </span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="w-full md:w-auto overflow-x-hidden">
            <ul className={`flex flex-wrap items-center gap-4 md:gap-8 ${displayCompact ? 'justify-start' : 'justify-center md:gap-16'}`}>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href} className="flex-shrink-0">
                    <Link
                      href={link.href}
                      className={`block text-[10px] lg:text-[11px] font-sans uppercase tracking-[0.2em] transition-colors no-underline pb-1 outline-none ${
                        isActive 
                          ? 'text-accent border-b border-accent font-medium' 
                          : 'text-ink hover:text-accent border-b border-transparent focus-visible:text-accent focus-visible:border-accent'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

      </div>
    </header>
  );
}
