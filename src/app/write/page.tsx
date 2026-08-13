'use client';

import { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { savePost, getPostById } from '@/actions/post.actions';
import { TagInput, ImageUpload, PinLock } from '@/components';
import { LoadingScreen } from '@/components';
import { FrontMatter } from '@/components/Editorial';

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
    <div className="min-h-screen bg-surface font-sans text-ink">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-16 lg:py-24 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
        
        <header className="mb-16 border-b border-ink/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-4 flex gap-4 items-center">
               <span>INTERNAL</span>
               <span className="text-accent/50">•</span>
               <span>CMS</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display tracking-tight text-ink uppercase leading-none">
              Editor's Desk
            </h1>
          </div>
          <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted text-left md:text-right">
            <p>{editId ? 'EDITING EXISTING ENTRY' : 'DRAFTING NEW ENTRY'}</p>
            <p className="mt-1">SAVE TO ARCHIVE WHEN READY</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* Top Metadata Row */}
          <div className="space-y-12">
            
            {/* Title */}
            <div className="group border-b border-ink/20 pb-4 focus-within:border-ink transition-colors">
              <label htmlFor="title" className="block text-[10px] font-sans font-medium uppercase tracking-widest text-muted mb-4">
                Headline (Required)
              </label>
              <input
                type="text"
                id="title"
                required
                className="w-full bg-transparent outline-none font-display text-4xl lg:text-6xl text-ink placeholder:text-muted/30"
                placeholder="The unwritten thought..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
               {/* Cover Image */}
               <div className="lg:col-span-5 group">
                <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-muted mb-4 border-b border-ink/20 pb-2">
                  Cover Image (Optional)
                </label>
                <div className="aspect-[4/3] w-full border border-ink/20 bg-ink/5 p-1">
                   <ImageUpload
                      image={formData.coverImage}
                      onChange={(url) => setFormData({ ...formData, coverImage: url })}
                    />
                </div>
              </div>

               {/* Excerpt and Tags */}
               <div className="lg:col-span-7 flex flex-col gap-12">
                  <div className="group flex-1">
                    <label htmlFor="excerpt" className="block text-[10px] font-sans font-medium uppercase tracking-widest text-muted mb-4 border-b border-ink/20 pb-2">
                      Dek / Subtitle (Optional)
                    </label>
                    <textarea
                      id="excerpt"
                      rows={4}
                      className="w-full h-32 bg-transparent outline-none font-sans text-xl text-ink placeholder:text-muted/30 resize-none pt-2"
                      placeholder="A brief summary or subtitle..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-muted mb-4 border-b border-ink/20 pb-2">
                      Index Tags
                    </label>
                    <div className="bg-transparent pt-2">
                       <TagInput
                          tags={formData.tags}
                          onChange={(tags) => setFormData({ ...formData, tags })}
                        />
                    </div>
                  </div>
               </div>
            </div>

            {/* Editor Body */}
            <div className="group border-t-2 border-ink pt-12">
              <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-muted mb-8">
                Article Body (Required)
              </label>
              <div className="bg-paper min-h-[600px]">
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>
            </div>
            
            {/* Options */}
            <div className="flex flex-col sm:flex-row gap-8 py-8 border-y border-ink/20">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isLocked"
                    className="w-4 h-4 accent-ink cursor-pointer border-ink/20"
                    checked={formData.isLocked}
                    onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
                  />
                  <label htmlFor="isLocked" className="text-xs font-sans uppercase tracking-widest text-ink cursor-pointer select-none">
                    Lock Entry (Requires Pin)
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    className="w-4 h-4 accent-ink cursor-pointer border-ink/20"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <label htmlFor="isFeatured" className="text-xs font-sans uppercase tracking-widest text-ink cursor-pointer select-none">
                    Feature Entry
                  </label>
                </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 bg-ink text-paper font-sans text-xs uppercase tracking-widest hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'SAVING...' : 'PUBLISH ENTRY'}
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
