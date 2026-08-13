import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';

interface PostCardProps {
  post: BlogPost;
  index?: number;
  variant?: 'default' | 'featured' | 'compact';
}

export default function PostCard({ post, index = 0, variant = 'default' }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (variant === 'featured') {
    return (
      <article className="group relative border-b border-ink/10 pb-12 mb-12 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
        <Link href={`/posts/${post.slug}`} className="block no-underline">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Text Content */}
            <div className={`col-span-1 ${post.coverImage ? 'lg:col-span-5' : 'lg:col-span-12'} flex flex-col justify-center`}>
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-muted mb-6">
                <time>{formattedDate}</time>
                {post.tags[0] && (
                  <>
                    <span>·</span>
                    <span className="text-ink">{post.tags[0]}</span>
                  </>
                )}
              </div>
              
              <h2 className={`text-4xl lg:text-6xl font-display tracking-tight leading-[1.1] mb-6 text-ink group-hover:text-ink/70 transition-colors ${post.isLocked ? 'blur-sm' : ''}`}>
                {post.title}
              </h2>
              
              <p className={`text-base lg:text-lg font-sans leading-relaxed text-muted line-clamp-3 mb-8 max-w-xl ${post.isLocked ? 'blur-sm' : ''}`}>
                {post.excerpt}
              </p>
              
              <div className="text-xs font-sans font-medium uppercase tracking-widest text-ink group-hover:text-ink/70 transition-colors flex items-center gap-2">
                {post.isLocked ? 'Decrypt Entry' : 'Read Entry'}
                <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>

            {/* Optional Image */}
            {post.coverImage && (
              <div className="col-span-1 lg:col-span-7 relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-ink/5">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className={`object-cover transition-transform duration-700 group-hover:scale-105 ${post.isLocked ? 'blur-md' : 'mix-blend-multiply'}`}
                />
              </div>
            )}
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article 
        className="group animate-fade-in py-6 border-b border-ink/10 last:border-0 relative"
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
      >
        <Link href={`/posts/${post.slug}`} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-6 no-underline">
          <div className="flex items-center gap-4 text-xs font-mono uppercase tracking-widest text-muted shrink-0 sm:w-32">
            <time>{new Date(post.createdAt).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', month: 'short', day: 'numeric', year: 'numeric' })}</time>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-display text-2xl tracking-tight text-ink group-hover:text-ink/70 transition-colors ${post.isLocked ? 'blur-sm' : ''}`}>
              {post.title}
            </h3>
            {post.excerpt && (
              <p className={`text-sm font-sans text-muted mt-2 line-clamp-2 sm:line-clamp-1 max-w-2xl ${post.isLocked ? 'blur-sm' : ''}`}>
                {post.excerpt}
              </p>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="hidden sm:flex text-[10px] font-mono uppercase tracking-widest text-ink shrink-0">
               {post.tags.slice(0, 2).join(' · ')}
            </div>
          )}
        </Link>
      </article>
    );
  }

  return (
    <article 
      className="group animate-fade-in opacity-0 h-full flex flex-col"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      <Link href={`/posts/${post.slug}`} className="flex flex-col no-underline h-full border-b border-ink/10 pb-6 group-hover:border-ink/30 transition-colors">
        
        {post.coverImage && (
          <div className="relative aspect-[4/3] w-full mb-6 overflow-hidden bg-ink/5">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className={`object-cover transition-transform duration-700 group-hover:scale-105 ${post.isLocked ? 'blur-md' : 'mix-blend-multiply'}`}
            />
          </div>
        )}

        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted mb-3">
            <time>{formattedDate}</time>
            {post.tags[0] && (
              <>
                <span>·</span>
                <span className="text-ink">{post.tags[0]}</span>
              </>
            )}
          </div>
          
          <h2 className={`text-2xl font-display tracking-tight text-ink mb-3 group-hover:text-ink/70 leading-tight ${post.isLocked ? 'blur-sm' : ''}`}>
            {post.title}
          </h2>

          <p className={`font-sans text-sm leading-relaxed text-muted line-clamp-3 mb-6 flex-1 ${post.isLocked ? 'blur-sm' : ''}`}>
            {post.excerpt}
          </p>

          <div className="mt-auto text-xs font-sans font-medium uppercase tracking-widest text-ink/70 group-hover:text-ink transition-colors flex items-center gap-1">
            {post.isLocked ? 'Locked' : 'Read'} <span className="transition-transform group-hover:translate-x-1">→</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
