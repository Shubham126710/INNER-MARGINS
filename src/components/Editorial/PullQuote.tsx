import React from 'react';

interface PullQuoteProps {
  children: React.ReactNode;
  attribution?: string;
  className?: string;
}

export function PullQuote({ children, attribution, className = '' }: PullQuoteProps) {
  return (
    <aside className={`my-12 py-8 border-y border-ink/20 text-center ${className}`}>
      <blockquote className="font-display text-2xl md:text-3xl leading-snug text-ink mb-4">
        “{children}”
      </blockquote>
      {attribution && (
        <p className="font-sans text-xs uppercase tracking-widest text-muted">
          — {attribution}
        </p>
      )}
    </aside>
  );
}
