'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TagInput, RichTextEditor, ImageUpload, LoadingScreen, PinLock } from '@/components';
import { Marginalia, FrontMatter } from '@/components/Editorial';
import { getAboutContent, saveAboutContent } from '@/actions/about.actions';
import { AboutContent } from '@/lib/types';

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [about, setAbout] = useState<AboutContent>({
    title: 'About Me',
    subtitle: 'The writer behind the words',
    content: '',
    profileImage: '',
    hobbies: [],
  });

  useEffect(() => {
    async function load() {
      const startTime = Date.now();
      try {
        const data = await getAboutContent();
        setAbout(data);
      } finally {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 800) {
          await new Promise(resolve => setTimeout(resolve, 800 - elapsedTime));
        }
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await saveAboutContent(about);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 500);
  };

  const handleAuth = () => {
    setShowAuth(true);
  };

  const handleUnlock = () => {
    setShowAuth(false);
    setIsEditing(true);
  };

  if (isLoading) {
    return (
      <div 
        className="fixed inset-0 min-h-[100dvh] w-screen flex items-center justify-center bg-paper" 
        style={{ zIndex: 9999 }}
      >
        <LoadingScreen />
      </div>
    );
  }

  const isEmpty = !about.content && !about.profileImage;

  if (showAuth) {
    return (
      <div className="min-h-screen bg-paper flex flex-col font-sans text-ink">
        <div className="max-w-4xl mx-auto w-full px-6 pt-16 relative z-20"> 
          <button 
             onClick={() => setShowAuth(false)}
             className="text-muted hover:text-ink mb-4 uppercase font-sans text-xs tracking-widest transition-colors"
          >
             ← Cancel
          </button>
        </div>
        <PinLock onUnlock={handleUnlock} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink pb-32">
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 lg:pt-24">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-ink/20 pb-8 gap-8">
            <div>
              <div className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted mb-4 flex gap-4 items-center">
                 <span>THE PUBLICATION</span>
                 <span className="text-accent/50">•</span>
                 <span>PROFILE</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-display tracking-tight text-ink uppercase leading-none">
                {isEditing ? 'Edit Profile' : (about.title || 'About Me')}
              </h1>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : handleAuth()}
              className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted hover:text-ink transition-colors pb-1 border-b border-transparent hover:border-ink"
              disabled={isSaving}
            >
              {isSaving ? 'SAVING...' : isEditing ? 'SAVE CHANGES' : 'AUTHORIZE EDIT'}
            </button>
        </div>

        <div className="animate-fade-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            
            {isEditing ? (
            /* Edit Mode */
            <div className="space-y-12 max-w-5xl mx-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                <div className="group">
                  <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-muted mb-4 border-b border-ink/20 pb-2">Portrait</label>
                  <div className="aspect-[3/4] max-w-[300px] border border-ink/20 bg-ink/5 p-1">
                    <ImageUpload
                      image={about.profileImage || ''}
                      onChange={(img) => setAbout({ ...about, profileImage: img })}
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="group border-b border-ink/20 pb-4 focus-within:border-ink transition-colors">
                    <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-muted mb-4">Heading</label>
                    <input
                      type="text"
                      value={about.title}
                      onChange={(e) => setAbout({ ...about, title: e.target.value })}
                      className="w-full bg-transparent outline-none font-display text-4xl lg:text-5xl text-ink uppercase"
                      placeholder="e.g. About Me"
                    />
                  </div>

                  <div className="group border-b border-ink/20 pb-4 focus-within:border-ink transition-colors">
                    <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-muted mb-4">Subheading</label>
                    <input
                      type="text"
                      value={about.subtitle}
                      onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
                      className="w-full bg-transparent outline-none font-sans text-xl text-ink"
                      placeholder="e.g. The writer behind the words"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-muted mb-4 border-b border-ink/20 pb-2">Interests & Tags</label>
                    <div className="bg-transparent pt-2">
                      <TagInput
                        tags={about.hobbies}
                        onChange={(hobbies) => setAbout({ ...about, hobbies })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="group border-t-2 border-ink pt-12">
                <label className="block text-[10px] font-sans font-medium uppercase tracking-widest text-muted mb-8">Content</label>
                <div className="bg-paper min-h-[400px]">
                  <RichTextEditor
                    content={about.content}
                    onChange={(content) => setAbout({ ...about, content })}
                    placeholder="Write your story..."
                  />
                </div>
              </div>
            </div>
            ) : (
                /* View Mode */
                <div className="relative">
                {isEmpty ? (
                    <div className="text-center py-24 border border-ink/10 bg-ink/5 max-w-4xl mx-auto">
                        <p className="text-muted font-sans text-lg mb-8 max-w-md mx-auto">
                            No profile information has been provided yet.
                        </p>
                        <button
                            onClick={() => handleAuth()}
                            className="px-8 py-3 bg-ink text-paper font-sans text-xs uppercase tracking-widest hover:bg-ink/90 transition-colors"
                        >
                            Set up Profile
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                        {/* Main Content (Order 1 on Mobile, Right Column on Desktop) */}
                        <div className="lg:col-span-9 lg:col-start-4 w-full order-1 lg:order-2 max-w-[750px]">
                            {about.subtitle && (
                                <p className="text-2xl lg:text-3xl font-sans text-ink/80 mb-12 lg:mb-16 max-w-2xl leading-snug">
                                    {about.subtitle}
                                </p>
                            )}

                            <div 
                                className="prose-editor"
                                dangerouslySetInnerHTML={{ __html: about.content }}
                            />
                        </div>

                        {/* Marginalia Sidebar (Order 2 on Mobile, Left Column on Desktop) */}
                        <div className="lg:col-span-3 lg:col-start-1 w-full order-2 lg:order-1">
                           <div className="lg:sticky lg:top-28 space-y-12">
                              {about.profileImage && (
                                <div className="relative aspect-[3/4] w-full bg-ink/5 grayscale hover:grayscale-0 transition-all duration-700 max-w-[300px] lg:max-w-none">
                                    <Image
                                      src={about.profileImage}
                                      alt="Profile"
                                      fill
                                      className="object-cover mix-blend-multiply"
                                    />
                                </div>
                              )}
                              
                              <Marginalia title="INTERESTS">
                                 {about.hobbies.length > 0 ? (
                                     <ul className="space-y-2 mt-4">
                                      {about.hobbies.map((hobby, idx) => (
                                        <li key={hobby} className="text-[10px] font-mono uppercase tracking-widest text-ink flex items-baseline gap-3">
                                           <span className="text-accent/50">{String(idx + 1).padStart(2, '0')}</span>
                                           <span>{hobby}</span>
                                        </li>
                                      ))}
                                     </ul>
                                 ) : (
                                   <p className="text-sm text-muted">No index data available.</p>
                                 )}
                              </Marginalia>
                           </div>
                        </div>
                    </div>
                )}
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
