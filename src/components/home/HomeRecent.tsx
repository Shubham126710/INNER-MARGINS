'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { gsap, useGSAP } from '@/lib/gsap';
import PostCard from '@/components/PostCard';
import { BlogPost } from '@/lib/types';

interface HomeRecentProps {
  posts: BlogPost[];
}

export default function HomeRecent({ posts }: HomeRecentProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('.recent-header', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });

      gsap.from('.recent-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.recent-grid',
          start: 'top 85%',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 relative bg-retro-surface/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="recent-header flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4 border-b border-retro-border/20 pb-6">
          <div>
            <span className="text-retro-text/50 text-[10px] font-mono uppercase tracking-widest">
              Local Storage
            </span>
            <h2 className="text-2xl lg:text-3xl font-heading uppercase text-retro-text mt-3">
              Recent Journals
            </h2>
          </div>
          <Link
            href="/journals"
            className="text-xs font-mono uppercase text-retro-text hover:text-retro-primary hover:bg-retro-text/10 px-2 py-1 transition-colors no-underline"
          >
            [ Access Archive ]
          </Link>
        </div>

        <div className="recent-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post, index) => (
            <div key={post.id} className="recent-card">
              <PostCard post={post} index={index} />
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-16 border border-dashed border-retro-border/40 bg-retro-bg/50">
            <p className="text-retro-text/50 font-mono text-sm uppercase tracking-widest">
              System memory empty. Awaiting input...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
