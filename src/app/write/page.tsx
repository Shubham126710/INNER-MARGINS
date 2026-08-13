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
  loading: () => <div className="h-[400px] bg-ink/5 p-4 animate-pulse flex items-center justify-center font-sans text-sm text-muted">Loading Editor...</div>
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
      console.error('Failed to save entry:', error);
      alert(`Failed to save entry: ${error.message || 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-24 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
        
        <header className="mb-16 border-b border-ink/10 pb-8">
          <h1 className="text-4xl lg:text-5xl font-display tracking-tight text-ink mb-4">
            Editor's Desk
          </h1>
          <p className="font-sans text-sm text-muted">
            {editId ? 'Editing existing entry.' : 'Drafting a new entry.'}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          <div className="space-y-8">
            <div className="group">
              <label htmlFor="title" className="block text-xs font-sans font-medium uppercase tracking-widest text-muted mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                required
                className="w-full px-4 py-3 bg-transparent border border-ink/20 focus:border-ink/50 focus:outline-none transition-colors font-display text-2xl lg:text-3xl text-ink placeholder:text-muted/50"
                placeholder="The unwritten thought..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="group">
                <label className="block text-xs font-sans font-medium uppercase tracking-widest text-muted mb-2">
                  Cover Image (Optional)
                </label>
                <div className="flex-1 w-full border border-ink/20 bg-ink/5 p-1">
                   <ImageUpload
                      image={formData.coverImage}
                      onChange={(url) => setFormData({ ...formData, coverImage: url })}
                    />
                </div>
              </div>

               <div className="group h-full flex flex-col">
                <label htmlFor="excerpt" className="block text-xs font-sans font-medium uppercase tracking-widest text-muted mb-2">
                  Excerpt (Optional)
                </label>
                <textarea
                  id="excerpt"
                  rows={4}
                  className="w-full h-full px-4 py-3 bg-transparent border border-ink/20 focus:border-ink/50 focus:outline-none transition-colors font-sans text-base text-ink placeholder:text-muted/50 resize-none"
                  placeholder="A brief summary..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
              </div>
            </div>

            <div className="group">
               <label className="block text-xs font-sans font-medium uppercase tracking-widest text-muted mb-2">
                Tags
              </label>
              <div className="bg-transparent border border-ink/20 focus-within:border-ink/50 transition-colors p-2">
                 <TagInput
                    tags={formData.tags}
                    onChange={(tags) => setFormData({ ...formData, tags })}
                  />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 p-6 border border-ink/10 bg-ink/5">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isLocked"
                    className="w-4 h-4 accent-ink cursor-pointer"
                    checked={formData.isLocked}
                    onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
                  />
                  <label htmlFor="isLocked" className="text-sm font-sans text-ink cursor-pointer select-none">
                    Lock Entry (Requires Pin)
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    className="w-4 h-4 accent-ink cursor-pointer"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <label htmlFor="isFeatured" className="text-sm font-sans text-ink cursor-pointer select-none">
                    Feature Entry
                  </label>
                </div>
            </div>
            
            <div className="group mt-12 border-t border-ink/10 pt-12">
              <label className="block text-xs font-sans font-medium uppercase tracking-widest text-muted mb-4">
                Body *
              </label>
              <div className="border border-ink/20 focus-within:border-ink/50 transition-colors bg-white">
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-ink/10 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Entry'}
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
