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
    month: 'short',
    day: 'numeric',
  });

  if (variant === 'featured') {
    return (
      <article className="group relative border border-retro-border/40 bg-retro-surface shadow-retro hover:shadow-retro-hover active:shadow-retro-sm transition-all">
        <Link href={`/posts/${post.slug}`} className="block no-underline">
          <div className="relative aspect-[16/9] border-b border-retro-border/40">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className={`object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity ${post.isLocked ? 'pixelated-blur' : ''}`}
              />
            ) : (
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(201,65,60,0.05)_10px,rgba(201,65,60,0.05)_20px)]" />
            )}
          </div>
          
          <div className="p-6 lg:p-8 bg-retro-surface">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="border border-retro-border/50 text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 text-retro-text hover:bg-retro-text/10">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <h2 className={`text-xl lg:text-2xl font-heading uppercase leading-tight mb-4 text-retro-text group-hover:text-retro-primary transition-colors ${post.isLocked ? 'pixelated-blur' : ''}`}>
              {post.title}
            </h2>
            
            <p className={`text-sm font-mono mb-6 line-clamp-2 text-retro-text/80 leading-relaxed ${post.isLocked ? 'pixelated-blur' : ''}`}>
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between text-xs font-mono border-t border-retro-border/20 pt-4 text-retro-text/50 uppercase tracking-widest">
              <time>{formattedDate}</time>
              <span>[ {post.readTime} ]</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article 
        className="group animate-fade-in border-b border-retro-border/20 last:border-0 hover:bg-retro-surface/50 transition-colors relative"
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
      >
        <Link href={`/posts/${post.slug}`} className="flex gap-4 py-4 no-underline items-start">
          <div className="flex-1 min-w-0">
            <h3 className={`font-heading text-sm text-retro-text group-hover:text-retro-primary truncate uppercase ${post.isLocked ? 'pixelated-blur' : ''}`}>
              {post.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-[10px] font-mono uppercase tracking-widest text-retro-text/50">
              <time>{formattedDate}</time>
              <span>//</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article 
      className="group animate-fade-in opacity-0 h-full flex flex-col"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      <Link href={`/posts/${post.slug}`} className="flex flex-col no-underline h-full border border-retro-border/30 bg-retro-surface/50 hover:bg-retro-surface hover:border-retro-border/60 transition-all shadow-retro-sm hover:shadow-retro relative">
        <div className="flex-1 flex flex-col relative z-10 w-full h-full">
          
          {/* Top section: date and tags to mimic metadata */}
          <div className="flex items-start justify-between flex-wrap gap-2 text-[10px] font-mono tracking-widest uppercase text-retro-text/60 p-5 pb-0">
            <time className="pt-1 whitespace-nowrap">{formattedDate}</time>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                {post.tags.map((tag) => (
                  <span key={tag} className="bg-retro-bg/50 px-1 border border-retro-border/20 lowercase">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Optional cover image strip below metadata */}
          {post.coverImage && (
            <div className="relative h-32 mt-4 mx-5 border-y border-retro-border/20 overflow-hidden shrink-0">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className={`object-cover mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ${post.isLocked ? 'pixelated-blur' : ''}`}
              />
            </div>
          )}

          {/* Content block */}
          <div className="p-5 flex-1 flex flex-col">
            <h2 className={`text-lg font-heading uppercase text-retro-text mb-3 group-hover:text-retro-primary leading-tight ${post.isLocked ? 'pixelated-blur' : ''}`}>
              {post.title}
            </h2>

            <p className={`text-retro-text/70 font-mono text-sm leading-relaxed mb-6 line-clamp-4 flex-1 ${post.isLocked ? 'pixelated-blur' : ''}`}>
              {post.excerpt}
            </p>

            {/* Footer block */}
            <div className="mt-auto pt-4 border-t border-retro-border/20 group-hover:border-retro-primary/30 transition-colors flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
              <span className="text-retro-primary/70 group-hover:text-retro-primary">
                {post.isLocked ? 'Decrypt Content' : 'Extract Log ->'}
              </span>
              <span className="text-retro-text/40">{post.readTime}</span>
            </div>
          </div>
        </div>
        
        {/* Subtle hover background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,65,60,0.05)_0%,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </Link>
    </article>
  );
}
