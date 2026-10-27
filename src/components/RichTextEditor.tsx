'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { compressImageFile } from '@/lib/image-compressor';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const TOOLBAR_BUTTONS = [
  { icon: 'B', command: 'bold', title: 'Bold' },
  { icon: 'I', command: 'italic', title: 'Italic' },
  { icon: 'U', command: 'underline', title: 'Underline' },
  { icon: 'Tx', command: 'clearFormat', title: 'Clear formatting' },
  { icon: '""', command: 'quote', title: 'Quote' },
  { icon: 'H2', command: 'h2', title: 'Heading 2' },
  { icon: 'H3', command: 'h3', title: 'Heading 3' },
  { icon: '•', command: 'insertUnorderedList', title: 'Bullet list' },
  { icon: '1.', command: 'insertOrderedList', title: 'Numbered list' },
  { icon: 'Link', command: 'link', title: 'Insert link' },
  { icon: 'Img', command: 'image', title: 'Insert image' },
] as const;

/**
 * Sanitizes rich clipboard HTML by stripping foreign font-family, font-size,
 * colors, background styles, and non-semantic wrapper tags.
 */
function sanitizePastedHtml(rawHtml: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    // Remove scripts, styles, and metadata
    const blockedTags = doc.querySelectorAll('script, style, meta, link, title, svg, form, input, button');
    blockedTags.forEach((el) => el.remove());

    const cleanNode = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        // Strip foreign fonts, styles, classes, and colors
        el.removeAttribute('style');
        el.removeAttribute('class');
        el.removeAttribute('id');
        el.removeAttribute('face');
        el.removeAttribute('color');
        el.removeAttribute('size');
        el.removeAttribute('align');
        el.removeAttribute('dir');

        // Recursively clean children first
        Array.from(el.childNodes).forEach(cleanNode);

        // Allowed semantic formatting tags
        const allowedTags = [
          'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'b', 'strong', 'i', 'em', 'u', 's', 'strike',
          'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img'
        ];

        if (!allowedTags.includes(tagName)) {
          // Unwrap: replace tag with its children
          const parent = el.parentNode;
          if (parent) {
            while (el.firstChild) {
              parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
          }
        } else if (tagName === 'a') {
          const href = el.getAttribute('href');
          if (href && !/^(https?:\/\/|mailto:|\/)/i.test(href)) {
            el.removeAttribute('href');
          }
        }
      }
    };

    Array.from(doc.body.childNodes).forEach(cleanNode);
    return doc.body.innerHTML;
  } catch {
    return '';
  }
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(true);
  const [pasteAsPlainText, setPasteAsPlainText] = useState(true);

  useEffect(() => {
    if (editorRef.current) {
      // Only update content if it's different and we're not currently typing (focused)
      // This prevents cursor jumping issues
      if (document.activeElement !== editorRef.current && editorRef.current.innerHTML !== content) {
        editorRef.current.innerHTML = content;
      }
      // If content is empty and editor is empty, ensure it stays empty
      if (!content && editorRef.current.innerHTML === '<br>') {
        editorRef.current.innerHTML = '';
      }
    }
  }, [content]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const clearFormatting = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Remove inline styles and font elements within the selection
    document.execCommand('removeFormat', false, undefined);
    document.execCommand('unlink', false, undefined);

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const parentEl = container.nodeType === Node.ELEMENT_NODE ? (container as HTMLElement) : container.parentElement;

    if (parentEl && editorRef.current && editorRef.current.contains(parentEl)) {
      if (parentEl !== editorRef.current && parentEl.hasAttribute('style')) {
        parentEl.removeAttribute('style');
      }
      const styledElements = parentEl.querySelectorAll('[style], font');
      styledElements.forEach((el) => {
        el.removeAttribute('style');
        if (el.tagName.toLowerCase() === 'font') {
          const text = el.textContent || '';
          el.replaceWith(document.createTextNode(text));
        }
      });
    }

    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (pasteAsPlainText) {
      const plainText = e.clipboardData.getData('text/plain');
      if (!plainText) return;

      const inserted = document.execCommand('insertText', false, plainText);
      if (!inserted) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const textNode = document.createTextNode(plainText);
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    } else {
      const html = e.clipboardData.getData('text/html');
      if (html) {
        const sanitized = sanitizePastedHtml(html);
        if (sanitized) {
          document.execCommand('insertHTML', false, sanitized);
        } else {
          const plainText = e.clipboardData.getData('text/plain');
          if (plainText) {
            document.execCommand('insertText', false, plainText);
          }
        }
      } else {
        const plainText = e.clipboardData.getData('text/plain');
        if (plainText) {
          document.execCommand('insertText', false, plainText);
        }
      }
    }

    handleInput();
  }, [pasteAsPlainText, handleInput]);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const compressedSrc = await compressImageFile(file, 1000, 1000, 0.8);
          const img = `<img src="${compressedSrc}" alt="Uploaded image" class="max-w-full rounded-lg my-4" />`;
          document.execCommand('insertHTML', false, img);
          handleInput();
        } catch (err) {
          console.error('Failed to compress image:', err);
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = `<img src="${event.target?.result}" alt="Uploaded image" class="max-w-full rounded-lg my-4" />`;
            document.execCommand('insertHTML', false, img);
            handleInput();
          };
          reader.readAsDataURL(file);
        }
      }
    };
    input.click();
  }, [handleInput]);

  const insertHeading = useCallback((level: number) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString() || 'Heading';
      const heading = document.createElement(`h${level}`);
      heading.textContent = text;
      range.deleteContents();
      range.insertNode(heading);
      handleInput();
    }
  }, [handleInput]);

  const insertBlockquote = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString() || 'Your quote here...';
      const blockquote = document.createElement('blockquote');
      blockquote.textContent = text;
      range.deleteContents();
      range.insertNode(blockquote);
      handleInput();
    }
  }, [handleInput]);

  const handleToolbarClick = (command: string) => {
    if (command === 'clearFormat') {
      clearFormatting();
    } else if (command === 'quote') {
      insertBlockquote();
    } else if (command === 'h2') {
      insertHeading(2);
    } else if (command === 'h3') {
      insertHeading(3);
    } else if (command === 'image') {
      handleImageUpload();
    } else if (command === 'link') {
      const url = prompt('Enter URL:');
      if (url) {
        execCommand('createLink', url);
        handleInput();
      }
    } else {
      execCommand(command);
      handleInput();
    }
  };

  return (
    <div className="border-4 border-retro-border bg-retro-surface">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-retro-bg border-b-4 border-retro-border">
          {TOOLBAR_BUTTONS.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleToolbarClick(button.command)}
              title={button.title}
              className="px-2 h-8 flex items-center justify-center border-2 border-transparent hover:border-retro-border hover:bg-retro-text hover:text-retro-surface transition-colors duration-150 text-xs font-mono text-retro-text font-bold active:translate-y-px focus-visible:outline-1 focus-visible:outline-retro-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {button.icon}
            </button>
          ))}

          <div className="h-5 w-px bg-retro-border/40 mx-1 hidden sm:block" aria-hidden="true" />

          {/* Paste Mode Toggle */}
          <button
            type="button"
            onClick={() => setPasteAsPlainText(!pasteAsPlainText)}
            title={pasteAsPlainText ? 'Paste mode: Plain text (click for sanitized rich text)' : 'Paste mode: Sanitized rich text (click for plain text)'}
            className={`px-2.5 h-8 flex items-center gap-1.5 border-2 text-xs font-body transition-colors duration-150 active:translate-y-px focus-visible:outline-1 focus-visible:outline-retro-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              pasteAsPlainText
                ? 'border-retro-border bg-retro-primary text-[var(--retro-light)] shadow-retro-sm'
                : 'border-retro-border/40 bg-retro-surface text-retro-text hover:border-retro-border'
            }`}
          >
            <span className="text-[11px] text-inherit opacity-85">paste:</span>
            <span className="font-medium">{pasteAsPlainText ? 'plain text' : 'formatted'}</span>
          </button>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setShowToolbar(false)}
            className="text-xs font-body text-retro-text/70 hover:text-retro-text active:translate-y-px focus-visible:outline-1 focus-visible:outline-retro-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Hide toolbar
          </button>
        </div>
      )}

      {!showToolbar && (
        <button
          type="button"
          onClick={() => setShowToolbar(true)}
          className="w-full p-2 text-xs font-body text-retro-text/70 hover:text-retro-text bg-retro-bg border-b-4 border-retro-border active:translate-y-px focus-visible:outline-1 focus-visible:outline-retro-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Show toolbar
        </button>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        className="prose-editor min-h-[400px] p-6 bg-retro-surface text-retro-text font-body focus:outline-none"
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}
