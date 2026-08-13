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
                {post.excerpt}
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
            {post.excerpt}
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
            {post.excerpt}
          </p>
          <FrontMatter items={[formattedDate]} className="mt-auto pt-4 border-t border-ink/10" />
        </Link>
      </article>
    );
  }

  if (variant === 'archive-index' || variant === 'compact') {
    return (
      <article 
        className="group animate-fade-in py-6 border-b border-ink/20 last:border-0 relative"
        style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
      >
        <Link href={`/posts/${post.slug}`} className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-8 no-underline">
          <div className="flex items-center gap-4 text-xs font-sans font-medium uppercase tracking-widest text-muted shrink-0 md:w-32">
            <time>{formattedDate}</time>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-display text-2xl tracking-tight text-ink group-hover:text-ink/70 transition-colors ${post.isLocked ? 'blur-sm' : ''}`}>
              {post.title}
            </h3>
            {post.excerpt && (
              <p className={`text-sm font-sans text-muted mt-2 line-clamp-2 md:line-clamp-1 max-w-3xl ${post.isLocked ? 'blur-sm' : ''}`}>
                {post.excerpt}
              </p>
            )}
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
          {post.excerpt}
        </p>
      </Link>
    </article>
  );
}
