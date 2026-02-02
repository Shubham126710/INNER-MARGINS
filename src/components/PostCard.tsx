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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (variant === 'featured') {
    return (
      <article className="group relative border-4 border-retro-border bg-retro-surface shadow-retro-lg hover:shadow-retro hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
        <Link href={`/posts/${post.slug}`} className="block no-underline">
          <div className="relative aspect-[16/9] border-b-4 border-retro-border">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-retro-bg" />
            )}
            {/* Scanline overlay optional */}
          </div>
          
          <div className="p-6 lg:p-8 bg-retro-surface">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="tag text-retro-text border-retro-text hover:bg-retro-text hover:text-retro-surface">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <h2 className="text-2xl lg:text-3xl font-heading uppercase leading-tight mb-4 text-retro-text group-hover:text-retro-primary transition-colors">
              {post.title}
            </h2>
            
            <p className="text-base font-mono mb-6 line-clamp-2 text-retro-text/90">
              {post.excerpt}
            </p>
            
            <div className="flex items-center gap-4 text-sm font-mono border-t-2 border-retro-border pt-4 text-retro-text/80">
              <time>{formattedDate}</time>
              <span>//</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article 
        className="group animate-fade-in border-b-2 border-retro-border last:border-0 hover:bg-retro-bg transition-colors"
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
      >
        <Link href={`/posts/${post.slug}`} className="flex gap-4 p-4 no-underline items-start">
          {post.coverImage && (
            <div className="relative w-24 h-24 flex-shrink-0 border-2 border-retro-border">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-lg text-retro-text group-hover:text-retro-primary truncate uppercase">
              {post.title}
            </h3>
            <p className="text-sm font-mono mt-2 line-clamp-2 text-retro-text/80">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs font-mono uppercase text-retro-text/60">
              <time>{formattedDate}</time>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article 
      className="group animate-fade-in"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
    >
      <Link href={`/posts/${post.slug}`} className="block no-underline">
        <div className="card h-full flex flex-col bg-retro-surface border-retro-border hover:shadow-retro">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative aspect-[2/1] border-b-4 border-retro-border">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="p-6 flex-1 flex flex-col">
            {/* Tags & Date */}
            <div className="flex items-center gap-3 mb-4 flex-wrap text-xs font-mono">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="tag text-retro-text border-retro-border hover:bg-retro-text hover:text-retro-surface">
                  {tag}
                </span>
              ))}
              <span className="text-retro-text/40">|</span>
              <time className="uppercase text-retro-text/60">
                {formattedDate}
              </time>
            </div>

            {/* Title */}
            <h2 className="text-xl font-heading uppercase text-retro-text mb-3 group-hover:text-retro-primary">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-retro-text/80 font-mono text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
              {post.excerpt}
            </p>

            {/* Read more */}
            <div className="mt-auto pt-4 border-t-2 border-dashed border-retro-border/50 group-hover:border-retro-border transition-colors">
              <span className="inline-flex items-center text-xs font-heading uppercase text-retro-text hover:bg-retro-text hover:text-retro-surface px-2 py-1 -ml-2 transition-colors">
                [ Read Post ]
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
