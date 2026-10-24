'use client';

import { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { savePost, getPostById } from '@/actions/post.actions';
import { TagInput, ImageUpload, PinLock } from '@/components';
import { LoadingScreen } from '@/components';

// Dynamically import TipTap Editor to avoid SSR errors
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-[400px] border border-retro-border/30 bg-retro-surface/50 p-4 animate-pulse motion-reduce:animate-none flex items-center justify-center font-body text-xs text-retro-text/60">Warming up editor grid…</div>
});

function WriteForm() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: [] as string[],
    isLocked: false,
    isFeatured: false,
  });

  useEffect(() => {
    if (editId) {
      getPostById(editId).then((post) => {
        if (post) {
          setFormData({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content || '',
            coverImage: post.coverImage || '',
            category: '',
            tags: post.tags || [],
            isLocked: post.isLocked || false,
            isFeatured: post.isFeatured || false,
          });
        }
      });
    }
  }, [editId]);

  if (!isAuthenticated) {
     return <PinLock onUnlock={() => setIsAuthenticated(true)} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (!formData.title || !formData.content) {
        alert('Title and content are required.');
        setIsSubmitting(false);
        return;
      }

      await savePost({ ...formData, isPublished: true });
      window.location.href = '/journals';
    } catch (error: unknown) {
      console.error('Failed to encode transmission:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to transmit journal: ${message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-retro-surface">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-12 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
        
        <header className="mb-10 text-center relative border-b border-retro-border/20 pb-8 hover:bg-retro-surface/20 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
               <rect x="2" y="2" width="4" height="4" />
               <rect x="18" y="2" width="4" height="4" />
               <rect x="2" y="18" width="4" height="4" />
               <rect x="18" y="18" width="4" height="4" />
            </svg>
          </div>

          <h1 className="text-3xl lg:text-4xl font-heading text-retro-text mb-3">
            Upload to Archive
          </h1>
          <p className="font-body text-xs text-retro-text/70">
            Write, record, and preserve into persistent memory.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 bg-retro-surface/30 p-6 lg:p-10 border border-retro-border/30 shadow-retro-sm relative">
          
          <div className="space-y-6">
            <div className="group">
              <label htmlFor="title" className="block text-xs font-body font-medium text-retro-text/80 mb-2 group-focus-within:text-retro-primary transition-colors">
                Transmission subject *
              </label>
              <input
                type="text"
                id="title"
                required
                className="w-full px-4 py-3 bg-retro-bg/50 border border-retro-border/30 focus:border-retro-primary focus:bg-retro-surface focus:outline-none transition-colors font-heading text-lg lg:text-xl text-retro-text placeholder:text-retro-text/30"
                placeholder="Give your journal a title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="group">
                <label className="block text-xs font-body font-medium text-retro-text/80 mb-2 group-focus-within:text-retro-primary transition-colors">
                  Visual context (optional)
                </label>
                <div className="flex-1 w-full bg-retro-bg/50">
                   <ImageUpload
                      image={formData.coverImage}
                      onChange={(url) => setFormData({ ...formData, coverImage: url })}
                    />
                </div>
              </div>

               <div className="group h-full flex flex-col">
                <label htmlFor="excerpt" className="block text-xs font-body font-medium text-retro-text/80 mb-2 group-focus-within:text-retro-primary transition-colors">
                  Fragment summary (optional)
                </label>
                <textarea
                  id="excerpt"
                  rows={4}
                  className="w-full h-full px-4 py-3 bg-retro-bg/50 border border-retro-border/30 focus:border-retro-primary focus:bg-retro-surface focus:outline-none transition-colors font-body text-sm text-retro-text placeholder:text-retro-text/30 resize-none"
                  placeholder="Brief overview of this record…"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>
            </div>

            <div className="group">
               <label className="block text-xs font-body font-medium text-retro-text/80 mb-2 group-focus-within:text-retro-primary transition-colors">
                Metadata tags
              </label>
              <div className="bg-retro-bg/50 border border-retro-border/30 focus-within:border-retro-primary focus-within:bg-retro-surface transition-colors p-1">
                 <TagInput
                    tags={formData.tags}
                    onChange={(tags) => setFormData({ ...formData, tags })}
                  />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-retro-border/20 bg-retro-text/5">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isLocked"
                    title="Lock Journal"
                    className="w-4 h-4 accent-retro-primary cursor-pointer border-retro-border/50 bg-retro-bg"
                    checked={formData.isLocked}
                    onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
                  />
                  <label htmlFor="isLocked" className="text-xs font-body text-retro-text cursor-pointer select-none">
                    Lock with protocol
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    title="Feature entry"
                    className="w-4 h-4 accent-retro-primary cursor-pointer border-retro-border/50 bg-retro-bg"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <label htmlFor="isFeatured" className="text-xs font-body text-retro-text cursor-pointer select-none">
                    Feature entry
                  </label>
                </div>
            </div>
            
            <div className="group mt-8">
              <label className="block text-xs font-body font-medium text-retro-text/80 mb-2 group-focus-within:text-retro-primary transition-colors">
                Main corpus *
              </label>
              <div className="border border-retro-border/30 focus-within:border-retro-primary bg-retro-surface/50 transition-colors font-body">
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-retro-border/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="font-body text-xs text-retro-text/50">
              All operations logged
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-retro-text text-retro-surface font-heading text-sm hover:bg-retro-primary transition-colors shadow-retro hover:shadow-retro-hover active:translate-y-px active:shadow-retro-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Transmitting…' : 'Upload journal to archive'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function WritePage() {
   return (
      <Suspense fallback={<LoadingScreen />}>
         <WriteForm />
      </Suspense>
   );
}
