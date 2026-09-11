'use client';

import { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { savePost, getPostById } from '@/actions/post.actions';
import { TagInput, ImageUpload, PinLock } from '@/components';
import { LoadingScreen } from '@/components';

// Dynamically import TipTap Editor to avoid SSR errors
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-[400px] border border-retro-border/30 bg-retro-surface/50 p-4 animate-pulse flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-retro-text/50">Warming up editor grid...</div>
});

function WriteForm() {
  const router = useRouter();
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
            content: post.content,
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
      router.push('/journals');
      router.refresh();
    } catch (error: any) {
      console.error('Failed to encode transmission:', error);
      alert(`Failed to transmit journal: ${error.message || 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-retro-surface">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-12 py-8 md:py-12 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
        
        <header className="mb-10 text-center relative border-b border-retro-border/20 pb-8 hover:bg-retro-surface/20 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <rect x="2" y="2" width="4" height="4" />
               <rect x="18" y="2" width="4" height="4" />
               <rect x="2" y="18" width="4" height="4" />
               <rect x="18" y="18" width="4" height="4" />
            </svg>
          </div>

          <div className="inline-flex items-center gap-2 border border-retro-border/40 bg-retro-text/10 text-retro-text text-[10px] uppercase font-mono tracking-widest px-3 py-1 mb-4 shadow-retro-sm">
            <div className="w-2 h-2 bg-retro-primary animate-pulse"></div>
            <span>New Transmission</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-heading uppercase text-retro-text mb-4">
            Upload To Archive
          </h1>
          <p className="font-mono text-xs uppercase tracking-widest text-retro-text/60">
            Write. Record. Execute.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 bg-retro-surface/30 p-6 lg:p-10 border border-retro-border/30 shadow-retro-sm relative">
          
          <div className="space-y-6">
            <div className="group">
              <label htmlFor="title" className="block text-xs font-mono uppercase tracking-widest text-retro-text/70 mb-2 group-focus-within:text-retro-primary transition-colors">
                Transmission Subject *
              </label>
              <input
                type="text"
                id="title"
                required
                className="w-full px-4 py-3 bg-retro-bg/50 border border-retro-border/30 focus:border-retro-primary focus:bg-retro-surface focus:outline-none transition-all font-heading text-lg lg:text-xl text-retro-text placeholder:text-retro-text/20"
                placeholder="GIVE IT A NAME"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="group">
                <label className="block text-xs font-mono uppercase tracking-widest text-retro-text/70 mb-2 group-focus-within:text-retro-primary transition-colors">
                  Visual Context (Optional)
                </label>
                <div className="flex-1 w-full bg-retro-bg/50">
                   <ImageUpload
                      image={formData.coverImage}
                      onChange={(url) => setFormData({ ...formData, coverImage: url })}
                    />
                </div>
              </div>

               <div className="group h-full flex flex-col">
                <label htmlFor="excerpt" className="block text-xs font-mono uppercase tracking-widest text-retro-text/70 mb-2 group-focus-within:text-retro-primary transition-colors">
                  Fragment Summary (Optional)
                </label>
                <textarea
                  id="excerpt"
                  rows={4}
                  className="w-full h-full px-4 py-3 bg-retro-bg/50 border border-retro-border/30 focus:border-retro-primary focus:bg-retro-surface focus:outline-none transition-all font-mono text-sm text-retro-text placeholder:text-retro-text/20 resize-none"
                  placeholder="BRIEF OVERVIEW OF THIS RECORD..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>
            </div>

            <div className="group">
               <label className="block text-xs font-mono uppercase tracking-widest text-retro-text/70 mb-2 group-focus-within:text-retro-primary transition-colors">
                Metadata Tags
              </label>
              <div className="bg-retro-bg/50 border border-retro-border/30 focus-within:border-retro-primary focus-within:bg-retro-surface transition-all p-1">
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
                  <label htmlFor="isLocked" className="text-xs font-mono uppercase tracking-widest text-retro-text cursor-pointer select-none">
                    Lock with Protocol
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    title="Feature Entry"
                    className="w-4 h-4 accent-retro-primary cursor-pointer border-retro-border/50 bg-retro-bg"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <label htmlFor="isFeatured" className="text-xs font-mono uppercase tracking-widest text-retro-text cursor-pointer select-none">
                    Feature Entry
                  </label>
                </div>
            </div>
            
            <div className="group mt-8">
              <label className="block text-xs font-mono uppercase tracking-widest text-retro-text/70 mb-2 group-focus-within:text-retro-primary transition-colors">
                Main Corpus *
              </label>
              <div className="border border-retro-border/30 focus-within:border-retro-primary bg-retro-surface/50 transition-all font-mono">
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-retro-border/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-retro-text/40">
              [ All operations logged ]
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto px-8 py-4 bg-retro-text text-retro-surface font-heading uppercase text-sm tracking-widest hover:bg-retro-primary transition-colors shadow-retro hover:shadow-retro-hover active:translate-y-0 active:shadow-retro-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Transmitting...' : 'Upload Journal To Archive'}
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
