'use client';

import { useEffect, useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { TableOfContents, LoadingScreen, PinLock } from '@/components';
import { getPostBySlug, deletePost } from '@/actions/post.actions';
import { BlogPost } from '@/lib/types';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PostPage({ params }: PostPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    async function load() {
      const foundPost = await getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
      }
      setIsLoading(false);
    }
    load();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-retro-primary font-mono fixed inset-0 z-50">
        <LoadingScreen />
      </div>
    );
  }

  if (!post) {
    notFound();
  }
if (post.isLocked && !isUnlocked) {
    return (
      <div className="min-h-screen bg-retro-bg flex flex-col font-body selection:bg-retro-primary selection:text-white">
        <PinLock onUnlock={() => setIsUnlocked(true)} />
      </div>
    );
  }

  
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(post.id);
      router.push('/');
    }
  };

  // Process content to add IDs to headings for TOC
  const processContent = (html: string) => {
    let headingIndex = 0;
    return html.replace(/<(h[23])([^>]*)>/g, (match, tag, attrs) => {
      const id = `heading-${headingIndex++}`;
      return `<${tag}${attrs} id="${id}">`;
    });
  };

  const processedContent = processContent(post.content);

  return (
    <article className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-white pb-20">
      {/* Hero Section with Cover Image */}
      {post.coverImage && (
        <div className="relative h-[40vh] border-b-4 border-retro-border bg-retro-surface">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12">
        {/* Back link & Actions */}
        <div className={`flex items-center justify-between pt-4 pb-4 md:pt-8 md:pb-8`}>
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-retro-text/60 hover:text-retro-text hover:underline font-mono uppercase no-underline group"
          >
            &lt; Back to journal
          </Link>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="px-2 font-mono text-sm text-retro-text hover:bg-retro-text hover:text-retro-surface border-2 border-transparent hover:border-retro-border transition-none uppercase"
            >
              [ Options ]
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-retro-surface border-4 border-retro-border shadow-retro z-20">
                <Link
                  href={`/write?edit=${post.id}`}
                  className="flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase text-retro-text hover:bg-retro-bg no-underline"
                >
                  Edit post
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase text-retro-primary hover:bg-retro-bg w-full text-left"
                >
                  Delete post
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Header */}
        <header className="mb-12 border-b-4 border-retro-border pb-8">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-retro-primary text-retro-surface text-xs font-mono border-2 border-retro-border uppercase shadow-[2px_2px_0_0_#C9413C]">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading text-retro-text mb-6 leading-tight uppercase">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-xs font-mono text-retro-text/60 uppercase">
            <time>{formattedDate}</time>
            <span className="text-retro-text">/</span>
            <span>{post.readTime}</span>
            {post.isFeatured && (
              <>
                <span className="text-retro-text">/</span>
                <span className="bg-retro-text text-retro-surface px-1 border border-retro-text">Featured</span>
              </>
            )}
          </div>
        </header>

        {/* Content with optional TOC */}
        <div className="lg:grid lg:grid-cols-[1fr_250px] lg:gap-16">
          {/* Main Content */}
          <div 
            className="prose-editor mb-16 font-body text-lg leading-relaxed text-retro-text text-justify"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
          
          {/* Sidebar with TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents content={post.content} />
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="py-12 border-t-4 border-retro-border border-dashed">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="btn-secondary text-sm"
            >
              &lt; Back to journal
            </Link>
            
            <Link
              href={`/write?edit=${post.id}`}
              className="btn-primary text-sm"
            >
              Edit this post
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
