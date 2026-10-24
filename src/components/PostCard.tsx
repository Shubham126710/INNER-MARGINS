import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/types';
import { cleanExcerpt } from '@/lib/utils';

interface PostCardProps {
  post: BlogPost;
  index?: number;
  variant?: 'default' | 'featured' | 'compact' | 'lead' | 'stacked' | 'wide' | 'editorial';
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (variant === 'lead') {
    return (
      <article className="group h-full flex flex-col">
        <Link
          href={`/posts/${post.slug}`}
          className="flex flex-col no-underline h-full border-2 border-retro-border bg-retro-surface shadow-retro hover:shadow-retro-hover hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transform-none relative overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-95"
        >
          {/* Folio Docket Top Rail */}
          <div className="flex items-center justify-between px-5 py-3 border-b-2 border-retro-border/20 bg-retro-surface/80 text-xs font-body text-retro-text/75">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-retro-primary inline-block animate-pulse motion-reduce:animate-none" aria-hidden="true" />
              <time className="font-mono text-xs">{formattedDate}</time>
            </div>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 border border-retro-border/30 bg-retro-bg/50 text-[11px] font-body text-retro-text/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Optional Cover Image */}
          {post.coverImage && (
            <div className="relative aspect-[16/9] border-b-2 border-retro-border/20 overflow-hidden bg-retro-bg/40">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className={`object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity duration-300 ${
                  post.isLocked ? 'pixelated-blur' : ''
                }`}
              />
            </div>
          )}

          {/* Lead Content */}
          <div className="p-6 lg:p-8 flex-1 flex flex-col">
            <h2
              className={`text-xl sm:text-2xl lg:text-3xl font-heading text-retro-text group-hover:text-retro-primary transition-colors leading-snug mb-3.5 break-words ${
                post.isLocked ? 'pixelated-blur' : ''
              }`}
            >
              {post.title}
            </h2>

            <p
              className={`font-body text-xs sm:text-sm text-retro-text/85 leading-relaxed line-clamp-4 mb-6 flex-1 ${
                post.isLocked ? 'pixelated-blur' : ''
              }`}
            >
              {cleanExcerpt(post.excerpt)}
            </p>

            <div className="mt-auto pt-4 border-t border-dashed border-retro-border/30 flex items-center justify-between text-xs font-body text-retro-primary">
              <span className="inline-flex items-center gap-1.5 group-hover:translate-x-1 transition-transform duration-150 motion-reduce:transform-none font-medium">
                <span>{post.isLocked ? 'Decrypt record' : 'Read transmission'}</span>
                <span aria-hidden="true">→</span>
              </span>
              <div className="flex items-center gap-2 text-retro-text/60 font-mono text-xs">
                <span>{post.readTime}</span>
                <span className="text-retro-border/40 font-body" aria-hidden="true">/</span>
                <span>#{post.id.slice(-4).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'stacked') {
    return (
      <article className="group h-full flex flex-col">
        <Link
          href={`/posts/${post.slug}`}
          className="flex flex-col justify-between no-underline h-full border-2 border-retro-border bg-retro-surface/80 hover:bg-retro-surface shadow-retro-sm hover:shadow-retro hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transform-none p-5 relative overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-95"
        >
          <div>
            <div className="flex items-center justify-between text-xs font-body text-retro-text/70 mb-2.5">
              <time className="font-mono text-xs">{formattedDate}</time>
              {post.tags.length > 0 && (
                <span className="px-1.5 py-0.5 border border-retro-border/30 bg-retro-bg/50 text-[11px] font-body text-retro-text/80">
                  #{post.tags[0]}
                </span>
              )}
            </div>

            <h3
              className={`font-heading text-base sm:text-lg text-retro-text group-hover:text-retro-primary transition-colors leading-snug mb-2.5 line-clamp-2 ${
                post.isLocked ? 'pixelated-blur' : ''
              }`}
            >
              {post.title}
            </h3>

            <p
              className={`font-body text-xs text-retro-text/80 leading-relaxed line-clamp-2 mb-4 ${
                post.isLocked ? 'pixelated-blur' : ''
              }`}
            >
              {cleanExcerpt(post.excerpt)}
            </p>
          </div>

          <div className="pt-3 border-t border-dashed border-retro-border/30 flex items-center justify-between text-xs font-body text-retro-primary">
            <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-150 motion-reduce:transform-none font-medium">
              <span>Open log</span>
              <span aria-hidden="true">→</span>
            </span>
            <span className="font-mono text-xs text-retro-text/60">{post.readTime}</span>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'wide') {
    return (
      <article className="group h-full flex flex-col">
        <Link
          href={`/posts/${post.slug}`}
          className="flex flex-col md:flex-row no-underline h-full border-2 border-retro-border bg-retro-surface shadow-retro-sm hover:shadow-retro hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transform-none relative overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-95"
        >
          {post.coverImage ? (
            <div className="relative md:w-5/12 min-h-[180px] border-b-2 md:border-b-0 md:border-r-2 border-retro-border/30 overflow-hidden bg-retro-bg/40">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className={`object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity duration-300 ${
                  post.isLocked ? 'pixelated-blur' : ''
                }`}
              />
            </div>
          ) : null}

          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-body text-retro-text/70 mb-2.5">
                <time className="font-mono text-xs">{formattedDate}</time>
                {post.tags.length > 0 && (
                  <span className="px-1.5 py-0.5 border border-retro-border/30 bg-retro-bg/50 text-[11px] font-body text-retro-text/80">
                    #{post.tags[0]}
                  </span>
                )}
              </div>

              <h2
                className={`font-heading text-lg sm:text-xl text-retro-text group-hover:text-retro-primary transition-colors leading-snug mb-3 ${
                  post.isLocked ? 'pixelated-blur' : ''
                }`}
              >
                {post.title}
              </h2>

              <p
                className={`font-body text-xs sm:text-[13px] text-retro-text/80 leading-relaxed line-clamp-3 mb-4 ${
                  post.isLocked ? 'pixelated-blur' : ''
                }`}
              >
                {cleanExcerpt(post.excerpt)}
              </p>
            </div>

            <div className="pt-3 border-t border-dashed border-retro-border/30 flex items-center justify-between text-xs font-body text-retro-primary">
              <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-150 motion-reduce:transform-none font-medium">
                <span>Read transmission</span>
                <span aria-hidden="true">→</span>
              </span>
              <span className="font-mono text-xs text-retro-text/60">{post.readTime}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className="group relative border border-retro-border/40 bg-retro-surface shadow-retro hover:shadow-retro-hover hover:-translate-y-1 active:shadow-retro-sm transition-transform duration-200 motion-reduce:transform-none">
        <Link href={`/posts/${post.slug}`} className="block no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-95">
          <div className="relative aspect-[16/9] border-b border-retro-border/40 overflow-hidden bg-retro-bg/30">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className={`object-cover mix-blend-multiply opacity-85 group-hover:opacity-100 transition-opacity duration-300 ${
                  post.isLocked ? 'pixelated-blur' : ''
                }`}
              />
            ) : (
              <div className="absolute inset-0 bg-retro-surface/60" />
            )}
          </div>

          <div className="p-6 lg:p-8 bg-retro-surface">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-retro-border/50 text-xs font-body px-2 py-0.5 text-retro-text hover:bg-retro-text hover:text-retro-surface transition-colors shadow-retro-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h2
              className={`text-xl lg:text-2xl font-heading leading-tight mb-4 text-retro-text group-hover:text-retro-primary transition-colors ${
                post.isLocked ? 'pixelated-blur' : ''
              }`}
            >
              {post.title}
            </h2>

            <p
              className={`text-sm font-body mb-6 line-clamp-2 text-retro-text/80 leading-relaxed ${
                post.isLocked ? 'pixelated-blur' : ''
              }`}
            >
              {cleanExcerpt(post.excerpt)}
            </p>

            <div className="flex items-center justify-between text-xs font-body border-t border-retro-border/20 pt-4 text-retro-text/70">
              <time className="font-mono text-xs">{formattedDate}</time>
              <span className="group-hover:text-retro-primary transition-colors font-mono">{post.readTime}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group border-b border-retro-border/20 last:border-0 hover:bg-retro-surface/50 transition-colors relative">
        <Link href={`/posts/${post.slug}`} className="flex gap-4 py-4 no-underline items-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-90">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-heading text-sm text-retro-text group-hover:text-retro-primary truncate transition-colors ${
                post.isLocked ? 'pixelated-blur' : ''
              }`}
            >
              {post.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-xs font-body text-retro-text/60">
              <time className="font-mono text-xs">{formattedDate}</time>
              <span className="font-body" aria-hidden="true">/</span>
              <span className="font-mono text-xs">{post.readTime}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group h-full flex flex-col">
      <Link
        href={`/posts/${post.slug}`}
        className="flex flex-col no-underline h-full border-2 border-retro-border bg-retro-surface/75 hover:bg-retro-surface hover:-translate-y-0.5 transition-transform duration-200 motion-reduce:transform-none shadow-retro-sm hover:shadow-retro relative overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary active:opacity-95"
      >
        {/* Top section: date and tags to mimic metadata */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-retro-border/20 bg-retro-surface/50 text-xs font-body text-retro-text/70">
          <time className="font-mono text-xs">{formattedDate}</time>
          {post.tags.length > 0 && (
            <span className="bg-retro-bg/60 px-1.5 py-0.5 border border-retro-border/20 text-[11px] font-body text-retro-text/80">
              #{post.tags[0]}
            </span>
          )}
        </div>

        {/* Optional cover image strip below metadata */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] border-b border-retro-border/20 overflow-hidden bg-retro-bg/30">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className={`object-cover mix-blend-multiply opacity-85 group-hover:opacity-100 transition-opacity duration-300 ${
                post.isLocked ? 'pixelated-blur' : ''
              }`}
            />
          </div>
        )}

        {/* Content block */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <h2
              className={`text-base sm:text-lg font-heading text-retro-text mb-2.5 group-hover:text-retro-primary leading-tight transition-colors line-clamp-2 ${
                post.isLocked ? 'pixelated-blur' : ''
              }`}
            >
              {post.title}
            </h2>

            <p
              className={`text-retro-text/80 font-body text-xs sm:text-[13px] leading-relaxed mb-4 line-clamp-3 ${
                post.isLocked ? 'pixelated-blur' : ''
              }`}
            >
              {cleanExcerpt(post.excerpt)}
            </p>
          </div>

          {/* Footer block */}
          <div className="pt-3 border-t border-retro-border/20 flex justify-between items-center text-xs font-body text-retro-primary">
            <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-150 motion-reduce:transform-none font-medium">
              <span>{post.isLocked ? 'Decrypt log' : 'Read log'}</span>
              <span aria-hidden="true">→</span>
            </span>
            <span className="text-retro-text/60 font-mono text-xs">{post.readTime}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
