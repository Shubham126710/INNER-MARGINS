'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';
import PostCard from './PostCard';
import { Marginalia } from './Editorial';

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
        <div className="mb-16 border-b border-ink/20 pb-12">
          <h1 className="text-6xl md:text-8xl font-display tracking-tight text-ink leading-none mb-6">
            Index
          </h1>
          <p className="text-xl font-sans text-muted max-w-xl">
            {posts.length} pieces of evidence that I was here.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* Sidebar / Filters */}
          <div className="lg:w-48 shrink-0">
            <div className="sticky top-28 space-y-12">
              <Marginalia title="Filter By">
                <Link
                  href="/journals"
                  className={`text-xs uppercase tracking-widest transition-colors ${
                    !activeTag ? 'text-ink font-medium' : 'text-muted hover:text-ink'
                  }`}
                >
                  All Entries
                </Link>
                {allTags.map((t) => (
                  <Link
                    key={t}
                    href={`/journals?tag=${t}`}
                    className={`text-xs uppercase tracking-widest transition-colors ${
                      activeTag === t ? 'text-ink font-medium' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {t}
                  </Link>
                ))}
              </Marginalia>

              <Marginalia title="Sort Options">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-transparent font-sans text-xs uppercase tracking-widest text-muted hover:text-ink outline-none cursor-pointer w-full transition-colors border-b border-ink/10 pb-1"
                >
                  <option value="newest">Latest First</option>
                  <option value="oldest">Earliest First</option>
                  <option value="alphabetical">Alpha [A-Z]</option>
                </select>
              </Marginalia>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 border-t-2 border-ink pt-2">
            {sortedPosts.length === 0 ? (
              <div className="py-24 text-center border-b border-ink/20">
                <p className="text-muted font-sans text-lg">
                  No entries found for this tag.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {sortedPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} variant="archive-index" />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
