'use client';

import { useEffect, useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { TableOfContents, LoadingScreen, PinLock, CommentSection } from '@/components';
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
      <div className="min-h-screen flex items-center justify-center bg-paper fixed inset-0 z-50">
        <LoadingScreen />
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  if (post.isLocked && !isUnlocked) {
    return (
      <div className="min-h-screen bg-paper flex flex-col font-sans text-ink">
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
    if (confirm('Are you sure you want to delete this entry?')) {
      await deletePost(post.id);
      router.push('/journals');
    }
  };

  const processContent = (html: string) => {
    let headingIndex = 0;
    return html.replace(/<(h[23])([^>]*)>/g, (match, tag, attrs) => {
      const id = `heading-${headingIndex++}`;
      return `<${tag}${attrs} id="${id}">`;
    });
  };

  const processedContent = processContent(post.content);

  return (
    <article className="min-h-screen bg-paper font-sans text-ink pb-24 relative overflow-hidden">
      
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <Link 
          href="/journals" 
          className="inline-flex items-center text-xs text-muted hover:text-ink font-sans tracking-widest uppercase transition-colors mb-12"
        >
          ← Back to Archive
        </Link>
        
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted">
              <time>{formattedDate}</time>
              <span>·</span>
              <span>{post.readTime}</span>
              {post.tags.length > 0 && (
                <>
                  <span>·</span>
                  <span className="text-ink">{post.tags[0]}</span>
                </>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="text-xs font-mono uppercase tracking-widest text-muted hover:text-ink transition-colors"
              >
                Options
              </button>
              
              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-paper border border-ink/10 shadow-sm z-30 flex flex-col p-1">
                  <Link
                    href={`/write?edit=${post.id}`}
                    className="px-4 py-2 text-xs font-sans text-ink hover:bg-ink/5 transition-colors"
                  >
                    Edit Entry
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-xs font-sans text-red-600 hover:bg-ink/5 text-left transition-colors"
                  >
                    Delete Entry
                  </button>
                </div>
              )}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display tracking-tight text-ink leading-tight mb-8">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg md:text-xl font-sans text-muted leading-relaxed max-w-2xl">
              {post.excerpt}
            </p>
          )}
        </header>
      </div>

      {post.coverImage && (
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 mb-16">
          <div className="relative aspect-[21/9] bg-ink/5 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover mix-blend-multiply"
              priority
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-20">
        <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-16">
          
          {/* Main Content */}
          <div className="relative">
             <div 
                className="prose-editor mb-16"
                dangerouslySetInnerHTML={{ __html: processedContent }}
             />
          </div>
          
          {/* Sidebar with TOC */}
          <aside className="hidden lg:block relative">
            <div className="sticky top-28">
              <TableOfContents content={post.content} />
            </div>
          </aside>
        </div>

        {/* Comment Section */}
        <div className="border-t border-ink/10 pt-16 mt-8">
            <CommentSection postId={post.id} />
        </div>
      </div>
    </article>
  );
}
