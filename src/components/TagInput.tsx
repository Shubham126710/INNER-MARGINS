'use client';

import { useState, useCallback } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ tags, onChange, placeholder = 'Add a tag...' }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInput('');
  }, [tags, onChange]);

  const removeTag = useCallback((tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  }, [tags, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-retro-surface border-2 border-retro-border min-h-[48px] shadow-retro-sm focus-within:shadow-retro transition-shadow">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-1 bg-retro-text text-retro-surface border border-retro-text text-xs font-mono uppercase"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-1 text-retro-surface/60 hover:text-retro-surface"
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-retro-text placeholder-retro-border/40 text-sm font-mono"
      />
    </div>
  );
}
