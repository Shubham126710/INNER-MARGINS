'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
        className="fixed inset-0 min-h-[100dvh] w-screen flex items-center justify-center bg-retro-primary" 
        style={{ zIndex: 9999 }}
      >
        <LoadingScreen />
      </div>
    );
  }

  const isEmpty = !about.content && !about.profileImage;

  if (showAuth) {
    return (
      <div className="min-h-screen bg-retro-bg flex flex-col font-body selection:bg-retro-primary selection:text-white">
        <div className="p-4 relative z-20"> 
          <button 
             onClick={() => setShowAuth(false)}
             className="text-retro-text/60 hover:text-retro-text mb-4 uppercase font-mono text-[10px] tracking-widest inline-flex items-center gap-2"
          >
             <span className="opacity-50">&lt;</span> Abort Protocol
          </button>
        </div>
        <PinLock onUnlock={handleUnlock} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden border-b border-retro-border/30 bg-retro-bg">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,65,60,0.05)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
          <div className="animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="inline-flex items-center gap-2 border border-retro-border/40 bg-retro-surface/80 text-retro-text text-[10px] uppercase font-mono tracking-widest px-3 py-1 mb-8 shadow-retro-sm">
              <div className="w-2 h-2 bg-retro-primary opacity-50"></div>
              <span>Profile Identity</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading uppercase text-retro-text mb-6 tracking-tight animate-fade-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            User Entity
          </h1>
          
          <div className="animate-fade-in opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
             <p className="text-sm md:text-base text-retro-text/80 font-mono max-w-xl mx-auto leading-relaxed uppercase tracking-wide">
              The writer behind the machine.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-6 lg:px-12 py-12 md:py-16 relative">
      <div className="flex items-center justify-end mb-8">
            <button
              onClick={() => isEditing ? handleSave() : handleAuth()}
              className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase transition-colors shadow-retro-sm active:translate-y-0 disabled:opacity-50 ${
                isEditing ? 'bg-retro-text text-retro-surface border border-retro-text hover:bg-retro-primary hover:border-retro-primary focus:outline-none' : 'bg-retro-surface/50 text-retro-text border border-retro-border/30 hover:bg-retro-surface focus:outline-none focus:border-retro-primary/50'
              }`}
              disabled={isSaving}
            >
              {isSaving ? 'Synchronizing...' : isEditing ? 'Save Configuration' : 'Update Profile'}
            </button>
        </div>

        <div className="animate-fade-in opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
          
          <div className="border border-retro-border/30 bg-retro-surface/50 p-6 lg:p-10 shadow-retro-sm relative mb-12">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="2" height="2" />
                    <rect x="6" y="2" width="2" height="2" />
                    <rect x="2" y="6" width="2" height="2" />
                </svg>
             </div>
            
            {isEditing ? (
            /* Edit Mode */
            <div className="space-y-8 relative z-10">
              {/* Profile Image */}
              <div className="max-w-[200px] border border-retro-border/30 p-2 bg-retro-bg/50">
                <ImageUpload
                  image={about.profileImage || ''}
                  onChange={(img) => setAbout({ ...about, profileImage: img })}
                  label="Visual Entity (Photo)"
                />
              </div>

              {/* Title */}
              <div className="group">
                <label className="block text-xs font-mono uppercase tracking-widest text-retro-text/70 mb-2 group-focus-within:text-retro-primary transition-colors">Designation / Name</label>
                <input
                  type="text"
                  value={about.title}
                  onChange={(e) => setAbout({ ...about, title: e.target.value })}
                  className="w-full px-4 py-3 bg-retro-bg/50 border border-retro-border/30 focus:border-retro-primary focus:bg-retro-surface focus:outline-none transition-all font-heading text-lg text-retro-text placeholder:text-retro-text/20"
                  placeholder="Primary Identifier"
                />
              </div>

              {/* Subtitle */}
              <div className="group">
                <label className="block text-xs font-mono uppercase tracking-widest text-retro-text/70 mb-2 group-focus-within:text-retro-primary transition-colors">Tagline / Role</label>
                <input
                  type="text"
                  value={about.subtitle}
                  onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-retro-bg/50 border border-retro-border/30 focus:border-retro-primary focus:bg-retro-surface focus:outline-none transition-all font-mono text-sm text-retro-text placeholder:text-retro-text/20"
                  placeholder="Secondary context parameters"
                />
              </div>

              {/* Content */}
              <div className="group">
                <label className="block text-xs font-mono uppercase tracking-widest text-retro-text/70 mb-2 group-focus-within:text-retro-primary transition-colors">Core Memory File</label>
                <div className="border border-retro-border/30 focus-within:border-retro-primary bg-retro-surface/50 transition-all font-mono">
                  <RichTextEditor
                    content={about.content}
                    onChange={(content) => setAbout({ ...about, content })}
                    placeholder="Provide full narrative..."
                  />
                </div>
              </div>

              {/* Hobbies */}
              <div className="group">
                <label className="block text-xs font-mono uppercase tracking-widest text-retro-text/70 mb-2 group-focus-within:text-retro-primary transition-colors">Character Specs (Hobbies & Interests)</label>
                <div className="bg-retro-bg/50 border border-retro-border/30 focus-within:border-retro-primary focus-within:bg-retro-surface transition-all p-1">
                  <TagInput
                    tags={about.hobbies}
                    onChange={(hobbies) => setAbout({ ...about, hobbies })}
                    placeholder="Add specification..."
                  />
                </div>
              </div>
            </div>
            ) : (
                /* View Mode */
                <div className="relative z-10">
                {isEmpty ? (
                    <div className="text-center py-16 border border-dashed border-retro-border/30">
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center opacity-20">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                           <rect x="2" y="2" width="2" height="2" />
                           <rect x="6" y="2" width="2" height="2" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-heading uppercase text-retro-text/60 mb-2">
                        Identity Unknown
                    </h1>
                    <p className="text-retro-text/40 font-mono text-[10px] uppercase tracking-widest mb-8 max-w-md mx-auto">
                        No profile data found in local memory.
                    </p>
                    <button
                        onClick={() => handleAuth()}
                        className="px-6 py-3 border border-retro-primary text-retro-primary font-mono text-[10px] tracking-widest uppercase hover:bg-retro-primary hover:text-retro-surface transition-colors inline-block"
                    >
                        Initialize Profile
                    </button>
                    </div>
                ) : (
                    <div className="space-y-12">
                    {/* Profile Header */}
                    <div className="flex flex-col sm:flex-row gap-8 items-start border-b border-retro-border/20 pb-12">
                        {about.profileImage && (
                        <div className="relative w-32 h-32 md:w-40 md:h-40 border border-retro-border/40 flex-shrink-0 bg-transparent p-1">
                            <div className="relative w-full h-full border border-retro-border/20">
                                <Image
                                src={about.profileImage}
                                alt="Profile"
                                fill
                                className="object-cover"
                                style={{ imageRendering: 'pixelated' }}
                                />
                            </div>
                        </div>
                        )}
                        <div className="flex-1 pt-2">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading uppercase text-retro-text mb-4 leading-none tracking-tight">
                            {about.title}
                        </h1>
                        <p className="text-sm text-retro-text/80 font-mono border-l border-retro-primary/50 pl-4 uppercase tracking-widest">
                            {about.subtitle}
                        </p>
                        </div>
                    </div>

                    {/* Editor Content Display */}
                    <div 
                        className="prose-editor font-mono text-retro-text/80 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: about.content }}
                    />

                    {/* Hobbies / Specs */}
                    {about.hobbies.length > 0 && (
                        <div className="pt-10 border-t border-dashed border-retro-border/30">
                        <h3 className="text-[10px] font-mono tracking-widest uppercase mb-6 text-retro-text/50">
                            Loaded Specifications
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {about.hobbies.map((hobby) => (
                            <span 
                                key={hobby}
                                className="bg-retro-surface/50 border border-retro-border/30 px-3 py-1.5 text-[10px] font-mono font-bold tracking-wider text-retro-text uppercase"
                            >
                                {hobby}
                            </span>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>
                )}
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
