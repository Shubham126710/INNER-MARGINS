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
    <section className="py-8 lg:py-12" id="journals">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b-4 border-retro-border pb-6 gap-6">
          <div className="flex-1">
            <span className="text-retro-text/60 text-xs font-mono uppercase tracking-widest block mb-2">
              Directory: /journals
            </span>
            <h2 className="text-5xl md:text-7xl font-heading uppercase text-retro-text tracking-tight leading-none">
              Journals
            </h2>

            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2 mt-6">
              <Link
                href="/journals"
                className={`px-3 py-1 text-xs font-mono uppercase border-2 transition-all ${
                  !activeTag
                    ? 'bg-retro-text text-retro-surface border-retro-text'
                    : 'bg-retro-surface text-retro-text border-retro-text hover:bg-retro-text hover:text-retro-surface'
                }`}
              >
                All
              </Link>
              {allTags.map((t) => (
                <Link
                  key={t}
                  href={`/journals?tag=${t}`}
                  className={`px-3 py-1 text-xs font-mono uppercase border-2 transition-all ${
                    activeTag === t
                      ? 'bg-retro-text text-retro-surface border-retro-text'
                      : 'bg-retro-surface text-retro-text border-retro-text hover:bg-retro-text hover:text-retro-surface'
                  }`}
                >
                  #{t}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Sort Control */}
            <div className="flex items-center gap-2 bg-retro-surface border-2 border-retro-border p-1">
              <span className="text-xs font-mono uppercase text-retro-text/60 px-2">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-transparent font-mono text-sm uppercase text-retro-text outline-none cursor-pointer pr-4"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="alphabetical">A-Z</option>
              </select>
            </div>

            <span className="text-retro-text font-mono text-sm bg-retro-surface border-2 border-retro-border px-3 py-1.5 min-w-[100px] text-center">
              COUNT: {sortedPosts.length}
            </span>
          </div>
        </div>

        {sortedPosts.length === 0 ? (
          <div className="text-center py-24 border-4 border-dashed border-retro-border/30 bg-retro-surface">
            <div className="text-6xl mb-6 grayscale">💾</div>
            <h3 className="text-2xl font-heading uppercase text-retro-text/40 mb-4">
              No Data Found
            </h3>
            <p className="text-retro-text/60 font-mono mb-8 max-w-md mx-auto">
              Initialize database by creating your first entry.
            </p>
            <Link href="/write" className="btn-primary no-underline">
              Initialize
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
