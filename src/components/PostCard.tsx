import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';
import { FrontMatter } from './Editorial';

interface PostCardProps {
  post: BlogPost;
  index?: number;
  variant?: 'cover-feature' | 'editorial-large' | 'editorial-medium' | 'editorial-small' | 'archive-index' | 'default' | 'compact' | 'featured';
}

export default function PostCard({ post, index = 0, variant = 'editorial-medium' }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
  };

  const cleanExcerpt = stripHtml(post.excerpt || '');

  if (variant === 'cover-feature' || variant === 'featured') {
    return (
      <article className="group relative border-y border-ink/20 py-12 mb-12 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
        <Link href={`/posts/${post.slug}`} className="block no-underline">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Text Content */}
            <div className={`col-span-1 ${post.coverImage ? 'lg:col-span-6' : 'lg:col-span-12'} flex flex-col justify-center`}>
              <FrontMatter items={[formattedDate, ...(post.tags.slice(0,1))]} className="mb-8" />
              
              <h2 className={`text-5xl lg:text-7xl font-display tracking-tight leading-[1.05] mb-8 text-ink group-hover:text-ink/70 transition-colors ${post.isLocked ? 'blur-sm' : ''}`}>
                {post.title}
              </h2>
              
              <p className={`text-lg lg:text-xl font-sans leading-relaxed text-muted line-clamp-4 mb-8 max-w-xl ${post.isLocked ? 'blur-sm' : ''}`}>
                {cleanExcerpt}
              </p>
              
              <div className="text-xs font-sans font-medium uppercase tracking-widest text-ink group-hover:text-ink/70 transition-colors flex items-center gap-2">
                {post.isLocked ? 'Decrypt Entry' : 'Read The Story'}
                <span className="text-lg leading-none transition-transform group-hover:translate-x-2">→</span>
              </div>
            </div>

            {/* Optional Image */}
            {post.coverImage && (
              <div className="col-span-1 lg:col-span-6 relative aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-ink/5">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className={`object-cover transition-transform duration-1000 group-hover:scale-105 ${post.isLocked ? 'blur-md' : 'mix-blend-multiply grayscale group-hover:grayscale-0'}`}
                />
              </div>
            )}
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'editorial-large') {
    return (
      <article className="group flex flex-col h-full animate-fade-in opacity-0" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}>
        <Link href={`/posts/${post.slug}`} className="block no-underline flex-1 flex flex-col">
          <FrontMatter items={[formattedDate]} className="mb-4" />
          <h2 className={`text-4xl lg:text-5xl font-display tracking-tight leading-[1.1] mb-4 text-ink group-hover:text-ink/70 transition-colors ${post.isLocked ? 'blur-sm' : ''}`}>
            {post.title}
          </h2>
          <p className={`text-base font-sans text-muted line-clamp-3 mb-6 ${post.isLocked ? 'blur-sm' : ''}`}>
            {cleanExcerpt}
          </p>
        </Link>
      </article>
    );
  }
  
  if (variant === 'editorial-small' || variant === 'default') {
    return (
      <article className="group flex flex-col h-full border-t border-ink/20 pt-6 animate-fade-in opacity-0" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}>
        <Link href={`/posts/${post.slug}`} className="block no-underline flex-1 flex flex-col">
          <h3 className={`text-xl lg:text-2xl font-display tracking-tight leading-[1.2] mb-3 text-ink group-hover:text-ink/70 transition-colors ${post.isLocked ? 'blur-sm' : ''}`}>
            {post.title}
          </h3>
          <p className={`text-sm font-sans text-muted line-clamp-2 mb-4 flex-1 ${post.isLocked ? 'blur-sm' : ''}`}>
            {cleanExcerpt}
          </p>
          <FrontMatter items={[formattedDate]} className="mt-auto pt-4 border-t border-ink/10" />
        </Link>
      </article>
    );
  }

  if (variant === 'archive-index' || variant === 'compact') {
    return (
      <article 
        className="group animate-fade-in py-6 border-b border-ink/20 last:border-0 relative transition-colors duration-300 hover:bg-surface/50"
        style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-0 bg-accent opacity-0 group-hover:opacity-100 group-hover:w-[3px] transition-all duration-300"></div>
        <Link href={`/posts/${post.slug}`} className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 no-underline px-4 lg:px-6">
          <div className="flex items-center gap-4 text-[10px] font-sans uppercase tracking-widest text-muted shrink-0 md:w-32 pt-2 group-hover:text-ink transition-colors">
            <time>{formattedDate}</time>
          </div>
          
          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-4 lg:col-span-3">
               <h3 className={`font-display text-2xl tracking-tight text-ink group-hover:text-accent transition-colors ${post.isLocked ? 'blur-sm' : ''}`}>
                 {post.title}
               </h3>
            </div>
            <div className="md:col-span-8 lg:col-span-7">
               {cleanExcerpt && (
                 <p className={`text-sm font-sans text-muted line-clamp-2 max-w-2xl ${post.isLocked ? 'blur-sm' : ''}`}>
                   {cleanExcerpt}
                 </p>
               )}
            </div>
            <div className="hidden lg:block lg:col-span-2 text-right">
               {post.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-1">
                     {tag}
                  </span>
               ))}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // fallback for any other variant is editorial-medium
  return (
    <article className="group flex flex-col h-full animate-fade-in opacity-0" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}>
      <Link href={`/posts/${post.slug}`} className="block no-underline flex-1 flex flex-col">
        {post.coverImage && (
          <div className="relative aspect-[4/3] w-full mb-6 overflow-hidden bg-ink/5">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className={`object-cover transition-transform duration-700 group-hover:scale-105 ${post.isLocked ? 'blur-md' : 'mix-blend-multiply grayscale group-hover:grayscale-0'}`}
            />
          </div>
        )}
        <FrontMatter items={[formattedDate]} className="mb-4" />
        <h2 className={`text-2xl lg:text-3xl font-display tracking-tight leading-[1.2] mb-3 text-ink group-hover:text-ink/70 transition-colors ${post.isLocked ? 'blur-sm' : ''}`}>
          {post.title}
        </h2>
        <p className={`text-base font-sans text-muted line-clamp-3 ${post.isLocked ? 'blur-sm' : ''}`}>
          {cleanExcerpt}
        </p>
      </Link>
    </article>
  );
}
