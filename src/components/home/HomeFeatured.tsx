'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import PostCard from '@/components/PostCard';
import { BlogPost } from '@/lib/types';

interface HomeFeaturedProps {
  posts: BlogPost[];
}

export default function HomeFeatured({ posts }: HomeFeaturedProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('.featured-header', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });

      gsap.from('.featured-card', {
        y: 45,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.featured-grid',
          start: 'top 85%',
        },
      });
    },
    { scope: sectionRef }
  );

  if (posts.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 border-b border-retro-border/30 bg-retro-bg relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,207,203,0.1)_2px,transparent_2px),linear-gradient(90deg,rgba(244,207,203,0.1)_2px,transparent_2px)] bg-[length:32px_32px] pointer-events-none opacity-50" />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="featured-header flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-block bg-retro-text/10 text-retro-text px-2 py-1 text-[10px] font-mono uppercase tracking-widest border border-retro-border/20">
              Priority Memory
            </span>
            <h2 className="text-2xl lg:text-3xl font-heading uppercase text-retro-text mt-4">
              Highlighted Transmissions
            </h2>
          </div>
        </div>

        <div className="featured-grid grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.slice(0, 2).map((post, index) => (
            <div key={post.id} className="featured-card">
              <PostCard post={post} index={index} variant="featured" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
