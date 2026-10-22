'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';
import { gsap, useGSAP } from '@/lib/gsap';
import TableOfContents from './TableOfContents';
import CommentSection from './CommentSection';
import PostActions from './PostActions';

interface PostViewProps {
  post: BlogPost;
}

function processContent(html: string) {
  let headingIndex = 0;
  return html.replace(/<(h[23])([^>]*)>/g, (match, tag, attrs) => {
    const id = `heading-${headingIndex++}`;
    return `<${tag}${attrs} id="${id}">`;
  });
}

export default function PostView({ post }: PostViewProps) {
  const containerRef = useRef<HTMLElement>(null);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const formattedTime = new Date(post.createdAt).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const processedContent = processContent(post.content || '');

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (post.coverImage) {
        tl.from('.post-cover-image', {
          scale: 1.08,
          opacity: 0,
          duration: 0.9,
          ease: 'power2.out',
        });
      }

      tl.from(
        '.post-top-nav',
        {
          y: -15,
          opacity: 0,
          duration: 0.5,
        },
        '-=0.4'
      )
        .from(
          '.post-header-badge',
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.3'
        )
        .from(
          '.post-title',
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: 'expo.out',
          },
          '-=0.3'
        )
        .from(
          '.post-meta',
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
            stagger: 0.08,
          },
          '-=0.3'
        )
        .from(
          '.post-main-content',
          {
            y: 25,
            opacity: 0,
            duration: 0.7,
          },
          '-=0.2'
        )
        .from(
          '.post-sidebar',
          {
            x: 20,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.4'
        );
    },
    { scope: containerRef }
  );

  return (
    <article
      ref={containerRef}
      className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-retro-surface pb-20 relative overflow-hidden"
    >
      {/* Absolute Noise and Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,65,60,0.02)_0%,transparent_80%)] pointer-events-none" />

      {/* Hero Section with Cover Image */}
      {post.coverImage && (
        <div className="relative h-[32vh] border-b border-retro-border/30 bg-retro-surface/50 overflow-hidden group">
          <div className="absolute inset-0 z-10 bg-retro-bg/40 mix-blend-color" />
          <div className="absolute inset-0 z-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none" />
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="post-cover-image object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000 grayscale group-hover:grayscale-0"
            priority
          />
          <div className="absolute bottom-4 right-4 z-20 font-mono text-[10px] tracking-widest uppercase text-retro-surface bg-retro-text/80 px-2 py-1 backdrop-blur-sm shadow-retro-sm">
            [ VISUAL CONTEXT MOUNTED ]
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 relative z-20">
        {/* Back link & Actions */}
        <div className="post-top-nav flex items-center justify-between pt-6 pb-6 border-b border-dashed border-retro-border/20 mb-8">
          <Link
            href="/journals"
            className="inline-flex items-center text-[10px] text-retro-text/60 hover:text-retro-text font-mono tracking-widest uppercase no-underline transition-colors"
          >
            <span className="mr-2 opacity-50">&lt;</span> Return to Archive
          </Link>

          <PostActions postId={post.id} />
        </div>

        {/* Header */}
        <header className="mb-12 border-b border-retro-border/30 pb-12 relative">
          <div className="absolute top-0 right-0 p-2 opacity-30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <rect x="2" y="2" width="2" height="2" />
              <rect x="6" y="2" width="2" height="2" />
            </svg>
          </div>

          <div className="post-header-badge inline-flex items-center gap-2 border border-retro-border/40 bg-retro-surface/50 text-retro-text text-[10px] uppercase font-mono tracking-widest px-3 py-1 mb-8 shadow-retro-sm">
            <div className="w-2 h-2 rounded-none bg-retro-primary animate-pulse" />
            <span>Transmission Log</span>
          </div>

          <h1 className="post-title text-4xl md:text-5xl lg:text-7xl font-heading text-retro-text mb-6 leading-tight uppercase tracking-tight">
            {post.title}
          </h1>

          <div className="post-meta flex flex-wrap items-center gap-y-4 gap-x-6 text-[10px] font-mono text-retro-text/60 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="text-retro-primary">DATE:</span> {formattedDate}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-retro-primary">TIME:</span> {formattedTime}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-retro-primary">DUR:</span> {post.readTime}
            </div>

            {post.isFeatured && (
              <span className="bg-retro-text/10 text-retro-text px-2 py-1 border border-retro-border/30 shadow-retro-sm">
                [ Pinned Sequence ]
              </span>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <div className="h-[1px] flex-1 bg-retro-border/20 border-dashed border-t mr-4" />
                <div className="flex flex-wrap gap-2 justify-end">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-widest italic text-retro-text/70 opacity-80"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content with optional TOC */}
        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-16">
          {/* Main Content */}
          <div className="post-main-content relative">
            <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-retro-border/20 border-dashed border-l hidden lg:block" />
            <div
              className="prose-editor mb-16 font-mono text-sm leading-relaxed text-retro-text/90 tracking-wide"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>

          {/* Sidebar with TOC */}
          <aside className="post-sidebar hidden lg:block relative">
            <div className="sticky top-24 pl-6 border-l border-dashed border-retro-border/20 mt-2">
              <TableOfContents content={post.content || ''} />
            </div>
          </aside>
        </div>

        {/* Comment Section */}
        <div className="border-t border-retro-border/30 pt-16">
          <CommentSection postId={post.id} />
        </div>
      </div>
    </article>
  );
}
