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
  { icon: '""', command: 'quote', title: 'Quote' },
  { icon: 'H2', command: 'h2', title: 'Heading 2' },
  { icon: 'H3', command: 'h3', title: 'Heading 3' },
  { icon: '•', command: 'insertUnorderedList', title: 'Bullet List' },
  { icon: '1.', command: 'insertOrderedList', title: 'Numbered List' },
  { icon: '🔗', command: 'link', title: 'Insert Link' },
  { icon: '🖼️', command: 'image', title: 'Insert Image' },
] as const;

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(true);

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
    handleInput(); // Ensure state stays in sync after command
  }, [handleInput]);

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
    if (command === 'quote') {
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
              className="w-8 h-8 flex items-center justify-center border-2 border-transparent hover:border-retro-border hover:bg-retro-text hover:text-retro-surface transition-none text-sm font-mono text-retro-text font-bold"
            >
              {button.icon}
            </button>
          ))}
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setShowToolbar(false)}
            className="text-xs font-mono text-retro-text/60 hover:text-retro-text uppercase"
          >
            [Hide]
          </button>
        </div>
      )}

      {!showToolbar && (
        <button
          type="button"
          onClick={() => setShowToolbar(true)}
          className="w-full p-2 text-xs font-mono text-retro-text/60 hover:text-retro-text bg-retro-bg border-b-4 border-retro-border uppercase"
        >
          [Show toolbar]
        </button>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput} // Ensure final state is captured
        className="prose-editor min-h-[400px] p-6 bg-retro-surface text-retro-text font-body focus:outline-none"
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}
