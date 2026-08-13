import React from 'react';

interface MarginaliaProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Marginalia({ title, children, className = '' }: MarginaliaProps) {
  return (
    <aside className={`flex flex-col ${className}`}>
      <h2 className="text-[10px] font-sans font-medium uppercase tracking-widest text-ink mb-6 border-b border-ink/20 pb-2">
        {title}
      </h2>
      <div className="flex flex-col gap-3 font-sans text-sm">
        {children}
      </div>
    </aside>
  );
}
