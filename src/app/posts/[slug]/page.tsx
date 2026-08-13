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

    const stripHtml = (html: string) => {
      if (!html) return '';
      return html.replace(/<[^>]*>?/gm, '');
    };

    const cleanExcerpt = stripHtml(post.excerpt || '');

    return (
      <article className="min-h-screen bg-paper font-sans text-ink pb-32 relative overflow-hidden">
        
        {/* Article Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
          <Link 
            href="/journals" 
            className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted hover:text-ink transition-colors flex items-center gap-2 mb-16 inline-flex"
          >
            <span>←</span> BACK TO ARCHIVE
          </Link>
          
          <header className="mb-12 grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-6 lg:gap-y-0 items-start">
             {/* Title */}
             <div className="lg:col-span-9 lg:col-start-1 lg:row-start-1 flex flex-col">
                <h1 className="font-display tracking-tight text-ink leading-[0.9] lg:mb-6 uppercase break-words" style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}>
                  {post.title}
                </h1>
             </div>
             
             {/* Metadata */}
             <div className="lg:col-span-3 lg:col-start-10 lg:row-start-1 lg:row-span-2 flex flex-col border-t border-b py-4 lg:py-0 lg:border-t-0 lg:border-b-0 lg:border-l lg:pl-6 border-ink/10 relative h-full">
               <div className="hidden lg:block absolute -left-[1px] top-0 w-[2px] h-12 bg-accent opacity-70"></div>
               <div className="flex flex-row lg:flex-col gap-4 lg:gap-2 font-sans text-[10px] uppercase tracking-[0.2em] text-muted flex-wrap">
                 <span className="text-ink">{formattedDate}</span>
                 {post.tags.length > 0 && <span>{post.tags[0]}</span>}
                 <span>{post.readTime}</span>
                 <div className="w-[40px] h-[1px] bg-ink/10 my-4 hidden lg:block"></div>
                 <span className="text-accent/70 hidden lg:block">ENTRY {post.id.slice(-4).toUpperCase()}</span>
               </div>
             </div>

             {/* Excerpt */}
             <div className="lg:col-span-9 lg:col-start-1 lg:row-start-2 flex flex-col mt-4 lg:mt-0">
                {cleanExcerpt && (
                  <p className="font-sans text-ink/80 leading-relaxed max-w-3xl" style={{ fontSize: 'clamp(1.1rem, 2vw, 2rem)' }}>
                    {cleanExcerpt}
                  </p>
                )}
                <div className="w-full h-[1px] bg-ink/10 mt-8 lg:mt-12 hidden lg:block"></div>
             </div>
          </header>
        </div>

      {post.coverImage && (
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 mb-24">
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

      {/* Grid Layout for Content & Marginalia */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* Sidebar Marginalia */}
          <div className="lg:col-span-3 order-last lg:order-first">
            <div className="sticky top-28 space-y-12 border-t-2 border-ink lg:border-t-0 pt-8 lg:pt-0">
              <Marginalia title="ABOUT THIS ENTRY">
                <div className="space-y-6">
                  <div>
                    <span className="block text-[10px] text-muted mb-1 font-sans uppercase tracking-[0.2em]">CONTEXT</span>
                    <span className="text-sm font-sans text-ink">A private record from the Inner Margins archive.</span>
                  </div>
                  
                  <div className="pt-8 border-t border-ink/20">
                    <button
                      onClick={() => setShowActions(!showActions)}
                      className="text-[10px] uppercase tracking-widest text-muted hover:text-ink transition-colors"
                    >
                      OPTIONS ▾
                    </button>
                    {showActions && (
                      <div className="mt-4 flex flex-col gap-2">
                        <Link href={`/write?edit=${post.id}`} className="text-xs font-sans text-ink hover:text-accent transition-colors">
                          Edit Entry
                        </Link>
                        <button onClick={handleDelete} className="text-xs font-sans text-red-700 hover:text-red-900 text-left transition-colors">
                          Delete Entry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Marginalia>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9 max-w-[750px] w-full">
             <div 
                className="prose-editor mb-32"
                dangerouslySetInnerHTML={{ __html: processedContent }}
             />
             
             {/* Article Footer */}
             <footer className="border-t-2 border-ink pt-16">
                <div className="font-display text-5xl mb-12 uppercase tracking-tight text-ink">END OF ENTRY</div>
                
                {relatedPosts.length > 0 && (
                  <div className="mb-24">
                    <div className="text-[10px] font-sans uppercase tracking-widest text-muted mb-8 border-b border-ink/20 pb-2">
                      RELATED ENTRIES
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      {relatedPosts.map(rp => (
                        <Link key={rp.id} href={`/posts/${rp.slug}`} className="group block">
                          <div className="text-[10px] font-sans uppercase tracking-widest text-muted mb-3">
                            {new Date(rp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <h4 className="font-display text-3xl group-hover:text-accent transition-colors leading-[1.1]">{rp.title}</h4>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
             </footer>

             {/* Comment Section */}
             <div className="mt-16 border-t border-ink/20 pt-16">
                 <CommentSection postId={post.id} />
             </div>
          </div>
          
        </div>
      </div>
    </article>
  );
}
