'use client';

import { useRef, useState, useCallback, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

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

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput(); // Ensure state stays in sync after command
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = `<img src="${event.target?.result}" alt="Uploaded image" class="max-w-full rounded-none my-8" />`;
          document.execCommand('insertHTML', false, img);
          handleInput();
        };
        reader.readAsDataURL(file);
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

  const toolbarButtons = [
    { icon: 'B', command: 'bold', title: 'Bold' },
    { icon: 'I', command: 'italic', title: 'Italic' },
    { icon: 'U', command: 'underline', title: 'Underline' },
    { icon: '""', command: 'quote', title: 'Quote', action: insertBlockquote },
    { icon: 'H2', command: 'h2', title: 'Heading 2', action: () => insertHeading(2) },
    { icon: 'H3', command: 'h3', title: 'Heading 3', action: () => insertHeading(3) },
    { icon: '•', command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: '1.', command: 'insertOrderedList', title: 'Numbered List' },
    { icon: '🔗', command: 'link', title: 'Insert Link' },
    { icon: '🖼️', command: 'image', title: 'Insert Image', action: handleImageUpload },
  ];

  const handleToolbarClick = (button: typeof toolbarButtons[0]) => {
    if (button.action) {
      button.action();
    } else if (button.command === 'link') {
      const url = prompt('Enter URL:');
      if (url) {
        execCommand('createLink', url);
        handleInput();
      }
    } else {
      execCommand(button.command);
      handleInput();
    }
  };

  return (
    <div className="border border-ink/20 bg-transparent">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-ink/5 border-b border-ink/20">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleToolbarClick(button)}
              title={button.title}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-ink hover:text-white transition-colors text-sm font-sans font-medium text-ink"
            >
              {button.icon}
            </button>
          ))}
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setShowToolbar(false)}
            className="text-xs font-sans tracking-widest text-muted hover:text-ink uppercase px-2"
          >
            Hide
          </button>
        </div>
      )}

      {!showToolbar && (
        <button
          type="button"
          onClick={() => setShowToolbar(true)}
          className="w-full p-2 text-xs font-sans tracking-widest text-muted hover:text-ink bg-ink/5 border-b border-ink/20 uppercase"
        >
          Show toolbar
        </button>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput} // Ensure final state is captured
        className="prose-editor min-h-[400px] p-6 lg:p-8 bg-transparent text-ink focus:outline-none"
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}
