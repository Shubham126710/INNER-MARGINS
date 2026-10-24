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
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="featured-header flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-heading uppercase text-retro-text">
              Highlighted Transmissions
            </h2>
            <p className="text-xs text-retro-text/60 font-body mt-1">
              Priority archival entries &amp; featured fragments
            </p>
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
