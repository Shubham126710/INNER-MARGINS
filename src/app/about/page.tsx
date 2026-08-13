'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { TagInput, RichTextEditor, ImageUpload, LoadingScreen, PinLock } from '@/components';
import { getAboutContent, saveAboutContent } from '@/actions/about.actions';
import { AboutContent } from '@/lib/types';

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [about, setAbout] = useState<AboutContent>({
    title: 'Editor\'s Note',
    subtitle: 'The writer behind the archive',
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
    <div className="min-h-screen bg-paper font-sans text-ink">
      <main className="max-w-4xl mx-auto px-6 lg:px-12 py-24">
        
        <div className="flex items-center justify-end mb-12">
            <button
              onClick={() => isEditing ? handleSave() : handleAuth()}
              className="text-xs font-sans font-medium uppercase tracking-widest text-muted hover:text-ink transition-colors"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
        </div>

        <div className="animate-fade-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            
            {isEditing ? (
            /* Edit Mode */
            <div className="space-y-12 bg-white border border-ink/10 p-8 lg:p-12 shadow-sm">
              <h2 className="text-2xl font-display text-ink mb-8 border-b border-ink/10 pb-4">Edit Profile</h2>

              <div className="group">
                <label className="block text-xs font-sans uppercase tracking-widest text-muted mb-2">Portrait</label>
                <div className="max-w-[240px] border border-ink/20 bg-ink/5 p-1">
                  <ImageUpload
                    image={about.profileImage || ''}
                    onChange={(img) => setAbout({ ...about, profileImage: img })}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-sans uppercase tracking-widest text-muted mb-2">Heading</label>
                <input
                  type="text"
                  value={about.title}
                  onChange={(e) => setAbout({ ...about, title: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border border-ink/20 focus:border-ink/50 focus:outline-none transition-colors font-display text-2xl text-ink"
                  placeholder="e.g. Editor's Note"
                />
              </div>

              <div className="group">
                <label className="block text-xs font-sans uppercase tracking-widest text-muted mb-2">Subheading</label>
                <input
                  type="text"
                  value={about.subtitle}
                  onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border border-ink/20 focus:border-ink/50 focus:outline-none transition-colors font-sans text-base text-ink"
                  placeholder="e.g. The writer behind the archive"
                />
              </div>

              <div className="group">
                <label className="block text-xs font-sans uppercase tracking-widest text-muted mb-2">Content</label>
                <div className="border border-ink/20 focus-within:border-ink/50 transition-colors">
                  <RichTextEditor
                    content={about.content}
                    onChange={(content) => setAbout({ ...about, content })}
                    placeholder="Write your story..."
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-sans uppercase tracking-widest text-muted mb-2">Interests & Tags</label>
                <div className="bg-transparent border border-ink/20 focus-within:border-ink/50 transition-colors p-2">
                  <TagInput
                    tags={about.hobbies}
                    onChange={(hobbies) => setAbout({ ...about, hobbies })}
                  />
                </div>
              </div>
            </div>
            ) : (
                /* View Mode */
                <div className="relative">
                {isEmpty ? (
                    <div className="text-center py-24 border border-ink/10 bg-ink/5">
                        <p className="text-muted font-sans text-lg mb-8 max-w-md mx-auto">
                            No profile information has been provided yet.
                        </p>
                        <button
                            onClick={() => handleAuth()}
                            className="btn-primary"
                        >
                            Set up Profile
                        </button>
                    </div>
                ) : (
                    <div>
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
                            {about.profileImage && (
                            <div className="relative w-48 h-64 md:w-64 md:h-80 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-700">
                                <Image
                                src={about.profileImage}
                                alt="Profile"
                                fill
                                className="object-cover"
                                />
                            </div>
                            )}
                            
                            <div className="flex-1 pt-4">
                                <h1 className="text-5xl lg:text-7xl font-display tracking-tight text-ink mb-6 leading-none">
                                    {about.title}
                                </h1>
                                {about.subtitle && (
                                    <p className="text-xl font-sans text-muted italic">
                                        {about.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="lg:pl-76">
                            <div 
                                className="prose-editor"
                                dangerouslySetInnerHTML={{ __html: about.content }}
                            />

                            {/* Hobbies / Specs */}
                            {about.hobbies.length > 0 && (
                                <div className="pt-12 mt-12 border-t border-ink/10">
                                    <h3 className="text-xs font-sans font-medium uppercase tracking-widest text-muted mb-6">
                                        Interests
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {about.hobbies.map((hobby) => (
                                        <span 
                                            key={hobby}
                                            className="px-3 py-1.5 text-xs font-sans tracking-wide text-ink bg-ink/5 border border-ink/10"
                                        >
                                            {hobby}
                                        </span>
                                        ))}
                                    </div>
                                </div>
                            )}
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
