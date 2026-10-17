'use client';

import { useEffect, useMemo, useState } from 'react';

interface TableOfContentsProps {
  content: string;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

function parseHeadings(html: string): TOCItem[] {
  const headingRegex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  const tocItems: TOCItem[] = [];
  let match;
  let index = 0;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    if (text) {
      tocItems.push({ id: `heading-${index}`, text, level });
      index++;
    }
  }
  return tocItems;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const items = useMemo(() => parseHeadings(content || ''), [content]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2[id], h3[id]');
      let currentId = '';
      
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
          currentId = heading.id;
        }
      });
      
      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className="toc">
      <h4 className="text-xs font-heading font-medium text-retro-text uppercase tracking-wider mb-4 border-b-2 border-retro-border pb-2">
        Index
      </h4>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`toc-link font-mono text-xs uppercase ${item.level === 3 ? 'pl-4' : ''} ${
                activeId === item.id ? 'active' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
