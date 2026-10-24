'use client';

import { useState, useRef, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllTags, setShowAllTags] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Calculate tag frequencies to display the most useful tags in the primary quick-rail
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts) {
      for (const t of p.tags) {
        counts.set(t, (counts.get(t) || 0) + 1);
      }
    }
    return counts;
  }, [posts]);

  const sortedTags = useMemo(() => {
    return [...allTags].sort((a, b) => {
      const diff = (tagCounts.get(b) || 0) - (tagCounts.get(a) || 0);
      return diff !== 0 ? diff : a.localeCompare(b);
    });
  }, [allTags, tagCounts]);

  const primaryTags = useMemo(() => sortedTags.slice(0, 8), [sortedTags]);
  const remainingTags = useMemo(() => sortedTags.slice(8), [sortedTags]);

  // Filter & sort posts based on activeTag, searchQuery, and sortOption
  const filteredAndSortedPosts = useMemo(() => {
    let result = posts;

    // Filter by tag if selected
    if (activeTag) {
      result = result.filter((p) => p.tags.includes(activeTag));
    }

    // Filter by search query if typed
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort posts
    return [...result].sort((a, b) => {
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
  }, [posts, activeTag, searchQuery, sortOption]);

  // Entrance animation for header and toolbar on initial mount
  useGSAP(
    () => {
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      gsap.from('.archive-header-element', {
        y: 12,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: 'power2.out',
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="scroll-mt-24 pt-4 pb-16 lg:pt-6 lg:pb-24 relative" id="journals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Compact Editorial Header Masthead */}
        <div className="archive-header-element pb-4 mb-5 border-b border-retro-border/25">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-xs font-body text-retro-text/60">
                <span className="w-1.5 h-1.5 bg-retro-primary inline-block" aria-hidden="true" />
                <span>repository index</span>
                <span className="text-retro-border/40 font-body" aria-hidden="true">/</span>
                <span className="font-body text-xs">volume archive</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading text-retro-text tracking-tight leading-tight">
                Journal Archive
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-body text-retro-text/75 max-w-md leading-relaxed md:text-right">
              Chronological log of transmissions, fragmented notes, and personal observations.
            </p>
          </div>
        </div>

        {/* Compact Tag-Filter Rail */}
        <div className="archive-header-element mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-wrap">
            <span className="text-xs font-body text-retro-text/50 mr-1 hidden sm:inline-block">Filter:</span>
            
            {/* All Records Pill */}
            <Link
              href="/journals"
              onClick={() => setSearchQuery('')}
              className={`px-3 py-1 text-xs font-body border transition-colors shadow-retro-sm active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary ${
                !activeTag
                  ? 'bg-retro-primary text-[var(--retro-light)] border-retro-primary font-medium'
                  : 'bg-retro-surface/70 text-retro-text border-retro-border/40 hover:border-retro-primary hover:text-retro-primary hover:bg-retro-surface'
              }`}
            >
              All records
            </Link>

            {/* Primary Top Tags */}
            {primaryTags.map((t) => (
              <Link
                key={t}
                href={`/journals?tag=${encodeURIComponent(t)}`}
                className={`px-2.5 py-1 text-xs font-body border transition-colors shadow-retro-sm active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary ${
                  activeTag === t
                    ? 'bg-retro-primary text-[var(--retro-light)] border-retro-primary font-medium'
                    : 'bg-retro-surface/70 text-retro-text border-retro-border/40 hover:border-retro-primary hover:text-retro-primary hover:bg-retro-surface'
                }`}
              >
                #{t}
              </Link>
            ))}

            {/* If an active tag is from the remaining list, show it prominently here */}
            {activeTag && remainingTags.includes(activeTag) && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-body border border-retro-primary bg-retro-primary text-[var(--retro-light)] shadow-retro-sm font-medium">
                <span>#{activeTag}</span>
                <Link
                  href="/journals"
                  className="ml-0.5 text-[var(--retro-light)]/80 hover:text-[var(--retro-light)] font-mono text-xs focus-visible:outline-1 focus-visible:outline-retro-primary"
                  aria-label="Remove filter"
                >
                  ×
                </Link>
              </div>
            )}

            {/* Expand / Collapse More Tags Toggle */}
            {remainingTags.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAllTags(!showAllTags)}
                className="px-2.5 py-1 text-xs font-body border border-dashed border-retro-border/50 bg-retro-surface/40 hover:bg-retro-surface text-retro-text/75 hover:text-retro-text transition-colors shadow-retro-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary"
                aria-expanded={showAllTags}
              >
                {showAllTags ? 'Fewer tags ↑' : `More tags (${remainingTags.length}) ↓`}
              </button>
            )}
          </div>

          {/* Expandable Drawer of Remaining Tags */}
          {showAllTags && (
            <div className="mt-2.5 p-3.5 border border-retro-border/30 bg-retro-surface/70 shadow-retro-sm flex flex-wrap gap-1.5">
              <span className="text-[11px] font-body text-retro-text/50 w-full mb-1">Additional archive sectors:</span>
              {remainingTags.map((t) => (
                <Link
                  key={t}
                  href={`/journals?tag=${encodeURIComponent(t)}`}
                  className={`px-2 py-0.5 text-xs font-body border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary ${
                    activeTag === t
                      ? 'bg-retro-primary text-[var(--retro-light)] border-retro-primary font-medium'
                      : 'bg-retro-surface text-retro-text/80 border-retro-border/30 hover:border-retro-primary hover:text-retro-primary'
                  }`}
                >
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Archive Command Toolbar */}
        <div className="archive-header-element flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 mb-8 border border-retro-border/30 bg-retro-surface/50 shadow-retro-sm">
          
          {/* Search Field */}
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-retro-text/40 font-body text-xs" aria-hidden="true">
              ⌕
            </span>
            <input
              type="text"
              placeholder="Search archive (title, excerpt, tag)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 bg-retro-surface border border-retro-border/30 text-xs font-body text-retro-text placeholder:text-retro-text/40 focus:border-retro-primary focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary"
              aria-label="Search archive transmissions"
            />
          </div>

          <div className="flex items-center gap-3 justify-between sm:justify-end flex-wrap">
            {/* Active filter reset */}
            {(activeTag || searchQuery) && (
              <Link
                href="/journals"
                onClick={() => setSearchQuery('')}
                className="text-xs font-body text-retro-primary hover:underline underline-offset-2 flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-retro-primary"
              >
                <span>Reset filter</span>
                <span aria-hidden="true">×</span>
              </Link>
            )}

            {/* Total entries indicator */}
            <span className="text-xs text-retro-text/75 bg-retro-surface border border-retro-border/30 px-2.5 py-1">
              <span className="font-mono font-bold text-retro-text">{filteredAndSortedPosts.length}</span>
              <span className="text-retro-text/50 font-body ml-1.5">transmissions</span>
            </span>

            {/* Sort Control */}
            <div className="flex items-center gap-1.5 bg-retro-surface border border-retro-border/30 px-2 py-1">
              <label htmlFor="journal-sort" className="text-xs font-body text-retro-text/60">Sort:</label>
              <select
                id="journal-sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-transparent font-body text-xs text-retro-text outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary"
              >
                <option value="newest">Latest first</option>
                <option value="oldest">Earliest first</option>
                <option value="alphabetical">Alphabetical (A–Z)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Empty State */}
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-retro-border/30 bg-retro-surface/50 shadow-retro-sm">
            <div className="w-12 h-12 mx-auto mb-4 border border-retro-border/60 bg-retro-surface flex items-center justify-center text-retro-primary" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16v16H4z" />
                <path d="M4 10h16" />
                <path d="M10 14h4" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl font-heading text-retro-text mb-2">
              Sector empty
            </h2>
            <p className="text-retro-text/60 font-body text-xs sm:text-sm mb-5 max-w-md mx-auto">
              No memory fragments found matching current query parameters.
            </p>
            <div className="flex justify-center gap-3">
              {(activeTag || searchQuery) && (
                <Link
                  href="/journals"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 border border-retro-border bg-retro-surface text-retro-text font-body text-xs hover:border-retro-primary hover:text-retro-primary transition-colors shadow-retro-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary"
                >
                  Clear all filters
                </Link>
              )}
              <Link
                href="/write"
                className="px-4 py-2 border border-retro-primary bg-retro-primary text-[var(--retro-light)] font-body text-xs hover:bg-retro-text hover:border-retro-text transition-colors shadow-retro-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary"
              >
                Initialize new journal
              </Link>
            </div>
          </div>
        ) : (
          /* Asymmetric Editorial Grid Spread */
          <EditorialArchiveLayout posts={filteredAndSortedPosts} />
        )}

      </div>
    </section>
  );
}

/**
 * Renders the asymmetrical editorial layout for the memory archive.
 * Replaces the uniform 3-column card grid with an undulating editorial magazine broadside:
 * - Lead Folio Feature (wide 8 cols) + Companion Dossier Stack (4 cols)
 * - Two-column wide editorial image/review spreads
 * - Inverted asymmetry (Stack in 4 cols + Feature in 8 cols)
 * - Three-column balanced rhythm
 */
function EditorialArchiveLayout({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 1) {
    return (
      <div className="max-w-4xl mx-auto">
        <PostCard post={posts[0]} variant="lead" index={0} />
      </div>
    );
  }

  if (posts.length === 2) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7">
          <PostCard post={posts[0]} variant="lead" index={0} />
        </div>
        <div className="lg:col-span-5">
          <PostCard post={posts[1]} variant={posts[1].coverImage ? 'wide' : 'editorial'} index={1} />
        </div>
      </div>
    );
  }

  // Lead Section: Post 0 (Lead) + Posts 1 & 2 (Companion Stack)
  const leadPost = posts[0];
  const stackPosts = posts.slice(1, 3);
  const remaining = posts.slice(3);

  // Group remaining posts into rhythmic editorial chapters
  const chunks: Array<{ type: 'pair' | 'inverted-trio' | 'triplet' | 'single'; items: BlogPost[] }> = [];
  let i = 0;
  let cycle = 0;

  while (i < remaining.length) {
    const left = remaining.length - i;
    const mode = cycle % 4;

    if (mode === 0 || mode === 2) {
      if (left >= 2) {
        chunks.push({ type: 'pair', items: remaining.slice(i, i + 2) });
        i += 2;
      } else {
        chunks.push({ type: 'single', items: remaining.slice(i, i + 1) });
        i += 1;
      }
    } else if (mode === 1) {
      if (left >= 3) {
        chunks.push({ type: 'inverted-trio', items: remaining.slice(i, i + 3) });
        i += 3;
      } else if (left === 2) {
        chunks.push({ type: 'pair', items: remaining.slice(i, i + 2) });
        i += 2;
      } else {
        chunks.push({ type: 'single', items: remaining.slice(i, i + 1) });
        i += 1;
      }
    } else {
      if (left >= 3) {
        chunks.push({ type: 'triplet', items: remaining.slice(i, i + 3) });
        i += 3;
      } else if (left === 2) {
        chunks.push({ type: 'pair', items: remaining.slice(i, i + 2) });
        i += 2;
      } else {
        chunks.push({ type: 'single', items: remaining.slice(i, i + 1) });
        i += 1;
      }
    }
    cycle++;
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Chapter 1: The Lead Archival Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8">
          <PostCard post={leadPost} variant="lead" index={0} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          {stackPosts.map((post, idx) => (
            <div key={post.id} className="flex-1">
              <PostCard post={post} variant="stacked" index={idx + 1} />
            </div>
          ))}
        </div>
      </div>

      {/* Subsequent Editorial Chapters with Varied Rhythm */}
      {chunks.map((chunk, chunkIdx) => {
        if (chunk.type === 'pair') {
          return (
            <div key={`chunk-${chunkIdx}`} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {chunk.items.map((post, idx) => (
                <div key={post.id}>
                  <PostCard
                    post={post}
                    variant={post.coverImage ? 'wide' : 'editorial'}
                    index={3 + chunkIdx * 2 + idx}
                  />
                </div>
              ))}
            </div>
          );
        }

        if (chunk.type === 'inverted-trio') {
          const stack = chunk.items.slice(0, 2);
          const major = chunk.items[2];
          return (
            <div key={`chunk-${chunkIdx}`} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
                {stack.map((post, idx) => (
                  <div key={post.id} className="flex-1">
                    <PostCard post={post} variant="stacked" index={idx} />
                  </div>
                ))}
              </div>
              <div className="lg:col-span-7 xl:col-span-8 order-1 lg:order-2">
                <PostCard post={major} variant={major.coverImage ? 'wide' : 'lead'} index={2} />
              </div>
            </div>
          );
        }

        if (chunk.type === 'triplet') {
          return (
            <div key={`chunk-${chunkIdx}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {chunk.items.map((post, idx) => (
                <div key={post.id}>
                  <PostCard post={post} variant="editorial" index={idx} />
                </div>
              ))}
            </div>
          );
        }

        // Single fallback
        return (
          <div key={`chunk-${chunkIdx}`} className="max-w-3xl">
            <PostCard post={chunk.items[0]} variant={chunk.items[0].coverImage ? 'wide' : 'editorial'} index={0} />
          </div>
        );
      })}
    </div>
  );
}
