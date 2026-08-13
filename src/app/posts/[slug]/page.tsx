'use client';

import { useEffect, useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LoadingScreen, PinLock, CommentSection } from '@/components';
import { Marginalia, FrontMatter } from '@/components/Editorial';
import { getPostBySlug, deletePost, getPublishedPosts } from '@/actions/post.actions';
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
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    async function load() {
      const foundPost = await getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        const allPosts = await getPublishedPosts();
        // find index and get prev/next or just related
        const currentIndex = allPosts.findIndex(p => p.id === foundPost.id);
        const related = [];
        if (currentIndex > 0) related.push(allPosts[currentIndex - 1]);
        if (currentIndex < allPosts.length - 1) related.push(allPosts[currentIndex + 1]);
        setRelatedPosts(related);
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
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await deletePost(post.id);
      router.push('/journals');
    }
  };

  const processContent = (html: string) => {
    // Basic drop cap processing for first paragraph if it's just text
    let processed = html;
    if (processed.startsWith('<p>')) {
       // Only add drop cap if the first character is a letter, and not an image or strong tag
       const contentMatch = processed.match(/<p>([A-Za-z])/);
       if (contentMatch) {
         processed = processed.replace(/<p>([A-Za-z])/, '<p><span class="drop-cap">$1</span>');
       }
    }
    // Blockquotes become PullQuotes in styling (handled via CSS in globals.css or prose-editor)
    return processed;
  };

  const processedContent = processContent(post.content);

  return (
    <article className="min-h-screen bg-paper font-sans text-ink pb-24 relative overflow-hidden">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="flex items-center justify-between mb-16">
          <Link 
            href="/journals" 
            className="text-[10px] font-sans font-medium uppercase tracking-widest text-muted hover:text-ink transition-colors flex items-center gap-2"
          >
            <span>←</span> BACK TO ARCHIVE
          </Link>
          <FrontMatter items={[formattedDate, ...post.tags.slice(0, 1)]} />
        </div>
        
        <header className="mb-12 max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-display tracking-tight text-ink leading-[1] mb-8">
            {post.title}
          </h1>

          <div className="w-full h-[1px] bg-ink/20 my-12"></div>

          {post.excerpt && (
            <p className="text-xl md:text-2xl font-sans text-ink/80 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
          )}
        </header>
      </div>

      {post.coverImage && (
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 mb-16">
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

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
          
          {/* Sidebar Marginalia */}
          <div className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-28 space-y-12">
              <Marginalia title="About this entry">
                <p>PUBLISHED<br/><span className="text-ink">{formattedDate}</span></p>
                <p>READ TIME<br/><span className="text-ink">{post.readTime}</span></p>
                <div className="pt-4 border-t border-ink/10 relative">
                   <button
                    onClick={() => setShowActions(!showActions)}
                    className="text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors"
                  >
                    Options
                  </button>
                  {showActions && (
                    <div className="absolute left-0 mt-2 w-48 bg-paper border border-ink/10 shadow-sm z-30 flex flex-col p-1">
                      <Link href={`/write?edit=${post.id}`} className="px-4 py-2 text-xs text-ink hover:bg-ink/5 transition-colors">
                        Edit Entry
                      </Link>
                      <button onClick={handleDelete} className="px-4 py-2 text-xs text-red-600 hover:bg-ink/5 text-left transition-colors">
                        Delete Entry
                      </button>
                    </div>
                  )}
                </div>
              </Marginalia>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9 max-w-3xl">
             <div 
                className="prose-editor mb-24"
                dangerouslySetInnerHTML={{ __html: processedContent }}
             />
             
             {/* Article Footer */}
             <footer className="border-t border-ink/20 pt-12">
                <div className="font-display text-4xl mb-8">End of entry.</div>
                
                {relatedPosts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {relatedPosts.map(rp => (
                      <Link key={rp.id} href={`/posts/${rp.slug}`} className="group block border-t border-ink/10 pt-4">
                        <div className="text-[10px] font-sans uppercase tracking-widest text-muted mb-2">
                          {new Date(rp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <h4 className="font-display text-2xl group-hover:text-ink/70 transition-colors">{rp.title}</h4>
                      </Link>
                    ))}
                  </div>
                )}
                
                <Link href="/journals" className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-ink hover:text-muted transition-colors">
                  <span>←</span> Back to Archive
                </Link>
             </footer>

             {/* Comment Section */}
             <div className="mt-8">
                 <CommentSection postId={post.id} />
             </div>
          </div>
          
        </div>
      </div>
    </article>
  );
}
