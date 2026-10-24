'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { gsap, useGSAP } from '@/lib/gsap';
import { BlogPost } from '@/lib/types';
import PostCard from './PostCard';

interface JournalSectionProps {
  posts: BlogPost[];
  allTags: string[];
  activeTag?: string;
}

type SortOption = 'newest' | 'oldest' | 'alphabetical';

export default function JournalSection({ posts, allTags, activeTag: propActiveTag }: JournalSectionProps) {
  const searchParams = useSearchParams();
  const activeTag = propActiveTag !== undefined ? propActiveTag : (searchParams?.get('tag') || undefined);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredPosts = activeTag 
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  // Sort posts based on selection
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  // Archive header entrance
  useGSAP(
    () => {
      gsap.from('.archive-header-element', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
    },
    { scope: sectionRef }
  );

  // Staggered card reveal on filter/sort change
  useGSAP(
    () => {
      if (!gridRef.current) return;
      gsap.fromTo(
        '.journal-grid-item',
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    },
    { scope: gridRef, dependencies: [activeTag, sortOption] }
  );

  return (
    <section ref={sectionRef} className="py-8 lg:py-12 relative" id="journals">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none" aria-hidden="true">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="2" y="2" width="2" height="2" />
          <rect x="6" y="2" width="2" height="2" />
          <rect x="2" y="6" width="2" height="2" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-retro-border/30 pb-6 gap-6 relative">
          <div className="flex-1">
            <h2 className="archive-header-element text-3xl sm:text-5xl md:text-6xl font-heading text-retro-text tracking-tight leading-none mb-3 break-words">
              Journal Archive
            </h2>
            <p className="archive-header-element text-retro-text/70 text-sm font-body max-w-lg mb-2">
              Chronological log of transmissions, fragmented notes, and personal observations.
            </p>
            <span className="archive-header-element text-retro-text/60 text-xs font-mono block">
              /journals{activeTag ? `?tag=${activeTag}` : ''}
            </span>

            {/* Tag Filters */}
            <div className="archive-header-element flex flex-wrap gap-2 mt-6">
              <Link
                href="/journals"
                className={`px-3 py-1.5 text-xs font-body border transition-colors shadow-retro-sm active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary ${
                  !activeTag
                    ? 'bg-retro-text text-retro-surface border-retro-text'
                    : 'bg-retro-surface text-retro-text border-retro-border/50 hover:border-retro-primary hover:text-retro-primary'
                }`}
              >
                All sectors
              </Link>
              {allTags.map((t) => (
                <Link
                  key={t}
                  href={`/journals?tag=${t}`}
                  className={`px-3 py-1.5 text-xs font-body border transition-colors shadow-retro-sm active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary ${
                    activeTag === t
                      ? 'bg-retro-text text-retro-surface border-retro-text'
                      : 'bg-retro-surface text-retro-text border-retro-border/50 hover:border-retro-primary hover:text-retro-primary'
                  }`}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>

          <div className="archive-header-element flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Sort Control */}
            <div className="flex items-center gap-2 bg-retro-surface border border-retro-border/30 p-1.5 shadow-retro-sm focus-within:border-retro-primary/50 transition-colors">
              <label htmlFor="journal-sort" className="text-xs font-body text-retro-text/70 px-2">Sort:</label>
              <select
                id="journal-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-transparent font-body text-xs text-retro-text outline-none cursor-pointer pr-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="newest">Latest first</option>
                <option value="oldest">Earliest first</option>
                <option value="alphabetical">Alphabetical (A–Z)</option>
              </select>
            </div>

            <span className="text-retro-text font-body text-xs bg-retro-surface shadow-retro-sm border border-retro-border/30 px-3 py-2 min-w-[100px] text-center">
              Entries: <span className="font-mono">{sortedPosts.length.toString().padStart(2, '0')}</span>
            </span>
          </div>
        </div>

        {sortedPosts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-retro-border/30 bg-retro-surface/50 shadow-retro-sm">
            <div className="w-12 h-12 mx-auto mb-4 border border-retro-border/60 bg-retro-surface flex items-center justify-center text-retro-primary" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16v16H4z" />
                <path d="M4 10h16" />
                <path d="M10 14h4" />
              </svg>
            </div>
            <h3 className="text-xl font-heading text-retro-text mb-2">
              Sector empty
            </h3>
            <p className="text-retro-text/60 font-body text-sm mb-6 max-w-md mx-auto">
              No memory fragments found matching current parameters.
            </p>
            <Link
              href="/write"
              className="px-5 py-2.5 border border-retro-primary bg-retro-primary text-retro-surface font-body text-xs hover:bg-retro-text hover:border-retro-text transition-colors inline-block shadow-retro-sm active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary"
            >
              Initialize new journal
            </Link>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post, index) => (
              <div key={post.id} className="journal-grid-item">
                <PostCard post={post} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
