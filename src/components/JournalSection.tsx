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
    <section className="py-16 lg:py-24" id="journals">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="mb-16 border-b border-ink/10 pb-12 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-display tracking-tight text-ink mb-4">
            Archive
          </h1>
          <p className="text-lg font-sans text-muted max-w-xl">
            {posts.length} pieces of evidence that I was here.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Sidebar / Filters */}
          <aside className="lg:w-48 shrink-0">
            <div className="sticky top-28">
              <h2 className="text-xs font-sans font-medium uppercase tracking-widest text-ink mb-6 border-b border-ink/10 pb-2">
                Filter by Tag
              </h2>
              <div className="flex flex-col gap-3">
                <Link
                  href="/journals"
                  className={`text-xs font-sans tracking-wide transition-colors ${
                    !activeTag ? 'text-ink font-medium' : 'text-muted hover:text-ink'
                  }`}
                >
                  All Entries
                </Link>
                {allTags.map((t) => (
                  <Link
                    key={t}
                    href={`/journals?tag=${t}`}
                    className={`text-xs font-sans tracking-wide transition-colors ${
                      activeTag === t ? 'text-ink font-medium' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {t}
                  </Link>
                ))}
              </div>

              <div className="mt-12">
                <h2 className="text-xs font-sans font-medium uppercase tracking-widest text-ink mb-6 border-b border-ink/10 pb-2">
                  Sort
                </h2>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-transparent font-sans text-xs text-muted hover:text-ink outline-none cursor-pointer w-full transition-colors"
                >
                  <option value="newest">Latest First</option>
                  <option value="oldest">Earliest First</option>
                  <option value="alphabetical">Alpha [A-Z]</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {sortedPosts.length === 0 ? (
              <div className="py-24 text-center border border-ink/10 bg-ink/5">
                <p className="text-muted font-sans text-lg">
                  No entries found for this tag.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {sortedPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} variant="compact" />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
