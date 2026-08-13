'use client';

interface FilterStripProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  className?: string;
}

export function FilterStrip({ label, options, selected, onSelect, className = '' }: FilterStripProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <span className="text-[10px] font-sans uppercase tracking-widest text-muted">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`
                text-[10px] font-mono uppercase tracking-widest px-2 py-1 transition-all duration-300
                ${isSelected 
                  ? 'bg-ink/5 text-accent border-b border-accent font-medium' 
                  : 'text-muted hover:text-ink hover:bg-ink/5 border-b border-transparent'}
              `}
            >
              [ {option} ]
            </button>
          );
        })}
      </div>
    </div>
  );
}
