'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  image: string;
  onChange: (image: string) => void;
  label?: string;
}

export default function ImageUpload({ image, onChange, label }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile]);

  return (
    <div>
      {label && (
      <label className="block text-xs font-sans font-medium uppercase tracking-widest text-muted mb-2">
        {label}
      </label>
      )}
      
      {image ? (
        <div className="relative aspect-[2/1] border border-ink/10 group">
          <Image
            src={image}
            alt="Cover"
            fill
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-4 bg-white/90 border-t border-ink/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleClick}
              className="text-xs font-sans uppercase tracking-widest hover:text-ink text-muted transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-xs font-sans uppercase tracking-widest hover:text-red-500 text-muted transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`aspect-[2/1] border transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 bg-transparent ${
            isDragging
              ? 'border-ink bg-ink/5'
              : 'border-ink/20 hover:border-ink/50'
          }`}
        >
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-muted font-sans text-xs uppercase tracking-widest">
            Select Image
          </p>
        </div>
      )}
    </div>
  );
}
