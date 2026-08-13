import React from 'react';

interface FrontMatterProps {
  items: string[];
  className?: string;
  vertical?: boolean;
}

export function FrontMatter({ items, className = '', vertical = false }: FrontMatterProps) {
  return (
    <div className={`flex ${vertical ? 'flex-col gap-1' : 'items-center gap-4'} font-sans text-[10px] uppercase tracking-widest text-muted ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span>{item}</span>
          {!vertical && index < items.length - 1 && <span className="text-ink/30">/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
