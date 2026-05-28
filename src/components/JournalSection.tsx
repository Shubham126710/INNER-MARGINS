'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';
import PostCard from './PostCard';

interface JournalSectionProps {
  posts: BlogPost[];
  allTags: string[];
  activeTag?: string;
}

type SortOption = 'newest' | 'oldest' | 'alphabetical';

export default function JournalSection({ posts, allTags, activeTag }: JournalSectionProps) {
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Sort posts based on selection
  const sortedPosts = [...posts].sort((a, b) => {
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

  return (
    <section className="py-8 lg:py-12 relative" id="journals">
       <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="2" width="2" height="2" />
            <rect x="6" y="2" width="2" height="2" />
            <rect x="2" y="6" width="2" height="2" />
          </svg>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-retro-border/30 pb-6 gap-6">
          <div className="flex-1 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-2 border border-retro-border/40 bg-retro-surface/80 text-retro-text text-[10px] uppercase font-mono tracking-widest px-3 py-1 mb-6 shadow-retro-sm">
              <div className="w-2 h-2 bg-retro-primary opacity-50"></div>
              <span>Directory Access</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading uppercase text-retro-text tracking-tight leading-none mb-2">
              Journal Archive
            </h2>
            <span className="text-retro-text/60 text-xs font-mono uppercase tracking-widest block">
              Path: /journals{activeTag ? `?tag=${activeTag}` : ''}
            </span>

            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2 mt-8">
              <Link
                href="/journals"
                className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-all ${
                  !activeTag
                    ? 'bg-retro-text text-retro-surface border-retro-text'
                    : 'bg-retro-surface text-retro-text border-retro-border/50 hover:border-retro-primary hover:text-retro-primary'
                }`}
              >
                [ All Sectors ]
              </Link>
              {allTags.map((t) => (
                <Link
                  key={t}
                  href={`/journals?tag=${t}`}
                  className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border transition-all ${
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

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center animate-fade-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            {/* Sort Control */}
            <div className="flex items-center gap-2 bg-retro-surface border border-retro-border/30 p-1 shadow-retro-sm focus-within:border-retro-primary/50 transition-colors">
              <span className="text-[10px] font-mono uppercase tracking-widest text-retro-text/60 px-2">Order:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-transparent font-mono text-[10px] tracking-widest uppercase text-retro-text outline-none cursor-pointer pr-4"
              >
                <option value="newest">Latest First</option>
                <option value="oldest">Earliest First</option>
                <option value="alphabetical">Alpha [A-Z]</option>
              </select>
            </div>

            <span className="text-retro-text font-mono text-[10px] uppercase tracking-widest bg-retro-surface shadow-retro-sm border border-retro-border/30 px-3 py-2 min-w-[100px] text-center">
              Journals: {sortedPosts.length.toString().padStart(4, '0')}
            </span>
          </div>
        </div>

        {sortedPosts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-retro-border/30 bg-retro-surface/50 shadow-retro-sm animate-fade-in opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            <div className="text-4xl mb-6 opacity-20">🗄️</div>
            <h3 className="text-xl font-heading uppercase text-retro-text/60 mb-2">
              Sector Empty
            </h3>
            <p className="text-retro-text/40 font-mono text-[10px] uppercase tracking-widest mb-8 max-w-md mx-auto">
              No memory fragments found matching current parameters.
            </p>
            <Link href="/write" className="px-6 py-3 border border-retro-primary text-retro-primary font-mono text-[10px] tracking-widest uppercase hover:bg-retro-primary hover:text-retro-surface transition-colors inline-block">
              Initialize First Journal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post, index) => (
              <div key={post.id} className="animate-fade-in opacity-0" style={{ animationDelay: `${(index % 12) * 100}ms`, animationFillMode: 'forwards' }}>
                <PostCard post={post} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
