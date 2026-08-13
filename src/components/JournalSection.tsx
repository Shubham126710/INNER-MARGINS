'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { BlogPost } from '@/lib/types';
import PostCard from './PostCard';
import { FilterStrip } from './Editorial';

interface JournalSectionProps {
  posts: BlogPost[];
  allTags: string[];
  activeTag?: string;
}

type SortOption = 'Latest' | 'Oldest' | 'Alpha [A-Z]';

export default function JournalSection({ posts, allTags, activeTag }: JournalSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sortOption, setSortOption] = useState<SortOption>('Latest');

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortOption) {
      case 'Latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'Oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'Alpha [A-Z]':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleTagSelect = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag === 'ALL ENTRIES') {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="py-16 lg:py-24" id="journals">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="mb-16 border-b border-ink/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-4 flex gap-4 items-center">
               <span>THE PUBLICATION</span>
               <span className="text-accent/50">•</span>
               <span>INDEX</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display tracking-tight text-ink uppercase leading-none">
              The Archive
            </h1>
          </div>
          <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted text-left md:text-right">
            <p>{posts.length} PIECES OF EVIDENCE THAT I WAS HERE.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Sidebar / Filters */}
          <div className="lg:col-span-3 space-y-12 sticky top-24">
             <FilterStrip 
               label="FILTER BY" 
               options={['ALL ENTRIES', ...allTags]} 
               selected={activeTag || 'ALL ENTRIES'} 
               onSelect={handleTagSelect} 
             />

             <FilterStrip 
               label="SORT BY" 
               options={['Latest', 'Oldest', 'Alpha [A-Z]']} 
               selected={sortOption} 
               onSelect={(opt) => setSortOption(opt as SortOption)} 
             />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 border-t-2 border-ink lg:border-t-0 pt-8 lg:pt-0">
            {sortedPosts.length === 0 ? (
              <div className="py-24 text-center border-b border-ink/20">
                <p className="text-muted font-sans text-lg">
                  No entries found.
                </p>
              </div>
            ) : (
              <div className="flex flex-col border-t-2 border-ink pt-2">
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
