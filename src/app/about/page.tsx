'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { TagInput, RichTextEditor, ImageUpload, LoadingScreen, PinLock } from '@/components';
import { getAboutContent, saveAboutContent } from '@/actions/about.actions';
import { AboutContent } from '@/lib/types';
import { gsap, useGSAP } from '@/lib/gsap';
import Magnetic from '@/components/Magnetic';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
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
          await new Promise((resolve) => setTimeout(resolve, 800 - elapsedTime));
        }
        setIsLoading(false);
      }
    }
    load();
  }, []);

  useGSAP(
    () => {
      if (isLoading) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.about-dossier', {
        y: 25,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
      })
        .from(
          '.about-dossier-header',
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.4'
        )
        .from(
          '.about-dossier-body',
          {
            y: 15,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.3'
        );
    },
    { scope: containerRef, dependencies: [isLoading] }
  );

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
      <div className="min-h-screen bg-retro-bg flex flex-col font-body selection:bg-retro-primary selection:text-retro-surface">
        <div className="p-4 relative z-20"> 
          <button 
             onClick={() => setShowAuth(false)}
             className="text-retro-text/70 hover:text-retro-text mb-4 font-body text-xs inline-flex items-center gap-2 transition-colors active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary cursor-pointer disabled:opacity-50"
          >
             <span className="opacity-50" aria-hidden="true">&lt;</span> Return to profile
          </button>
        </div>
        <PinLock onUnlock={handleUnlock} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-retro-surface py-10 md:py-16">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="about-dossier border-2 border-retro-border/40 bg-retro-surface/75 p-6 sm:p-10 lg:p-12 shadow-retro relative overflow-hidden">
          
          {/* Subtle decorative grid stamp */}
          <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="2" y="2" width="2" height="2" />
              <rect x="6" y="2" width="2" height="2" />
              <rect x="2" y="6" width="2" height="2" />
            </svg>
          </div>

          {/* Action Bar (Aligned seamlessly inside dossier) */}
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-retro-border/20 gap-4">
            <div className="flex items-center gap-2 text-xs font-body text-retro-text/70">
              <div className="w-2 h-2 rounded-none bg-retro-primary animate-pulse motion-reduce:animate-none" />
              <span>Entity Dossier</span>
              <span className="text-retro-border/40" aria-hidden="true">·</span>
              <span className="font-body text-xs">Profile active</span>
            </div>

            <Magnetic strength={0.2}>
              <button
                onClick={() => (isEditing ? handleSave() : handleAuth())}
                className={`px-4 py-2 text-xs font-body transition-colors shadow-retro-sm active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary disabled:opacity-50 cursor-pointer ${
                  isEditing
                    ? 'bg-retro-text text-retro-surface border border-retro-text hover:bg-retro-primary hover:border-retro-primary'
                    : 'bg-retro-surface text-retro-text border border-retro-border/50 hover:bg-retro-bg hover:border-retro-primary'
                }`}
                disabled={isSaving}
              >
                {isSaving ? 'Synchronizing…' : isEditing ? 'Save configuration' : 'Update profile'}
              </button>
            </Magnetic>
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
                <label className="block text-xs font-body font-medium text-retro-text/80 mb-2 group-focus-within:text-retro-primary transition-colors">
                  Designation / Name
                </label>
                <input
                  type="text"
                  value={about.title}
                  onChange={(e) => setAbout({ ...about, title: e.target.value })}
                  className="w-full px-4 py-3 bg-retro-bg/50 border border-retro-border/30 focus:border-retro-primary focus:bg-retro-surface focus:outline-none transition-colors font-heading text-lg text-retro-text placeholder:text-retro-text/30"
                  placeholder="Primary Identifier"
                />
              </div>

              {/* Subtitle */}
              <div className="group">
                <label className="block text-xs font-body font-medium text-retro-text/80 mb-2 group-focus-within:text-retro-primary transition-colors">
                  Tagline / Role
                </label>
                <input
                  type="text"
                  value={about.subtitle}
                  onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-retro-bg/50 border border-retro-border/30 focus:border-retro-primary focus:bg-retro-surface focus:outline-none transition-colors font-body text-sm text-retro-text placeholder:text-retro-text/30"
                  placeholder="Secondary context parameters"
                />
              </div>

              {/* Content */}
              <div className="group">
                <label className="block text-xs font-body font-medium text-retro-text/80 mb-2 group-focus-within:text-retro-primary transition-colors">
                  Core Memory File
                </label>
                <div className="border border-retro-border/30 focus-within:border-retro-primary bg-retro-surface/50 transition-colors font-body">
                  <RichTextEditor
                    content={about.content}
                    onChange={(content) => setAbout({ ...about, content })}
                    placeholder="Provide full narrative…"
                  />
                </div>
              </div>

              {/* Hobbies */}
              <div className="group">
                <label className="block text-xs font-body font-medium text-retro-text/80 mb-2 group-focus-within:text-retro-primary transition-colors">
                  Character Specs (Hobbies & Interests)
                </label>
                <div className="bg-retro-bg/50 border border-retro-border/30 focus-within:border-retro-primary focus-within:bg-retro-surface transition-colors p-1">
                  <TagInput
                    tags={about.hobbies}
                    onChange={(hobbies) => setAbout({ ...about, hobbies })}
                    placeholder="Add specification…"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="relative z-10">
              {isEmpty ? (
                <div className="text-center py-16 border border-dashed border-retro-border/30">
                  <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center opacity-20" aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <rect x="2" y="2" width="2" height="2" />
                      <rect x="6" y="2" width="2" height="2" />
                      <rect x="2" y="6" width="2" height="2" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-heading text-retro-text/80 mb-2">
                    Identity Unknown
                  </h2>
                  <p className="text-retro-text/60 font-body text-sm mb-8 max-w-md mx-auto">
                    No profile data found in local memory.
                  </p>
                  <button
                    onClick={() => handleAuth()}
                    className="px-6 py-3 border border-retro-primary text-retro-primary font-body text-xs hover:bg-retro-primary hover:text-retro-surface transition-colors inline-block cursor-pointer shadow-retro-sm active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-retro-primary disabled:opacity-50"
                  >
                    Initialize Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-10">
                  {/* Profile Header (Single authoritative H1) */}
                  <div className="about-dossier-header flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                    {about.profileImage && (
                      <div className="relative w-28 h-28 sm:w-36 sm:h-36 border-2 border-retro-border/50 flex-shrink-0 bg-transparent p-1 shadow-retro-sm">
                        <div className="relative w-full h-full border border-retro-border/30 overflow-hidden">
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
                    <div className="flex-1 min-w-0">
                      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading text-retro-text mb-3 leading-[1.05] tracking-tight">
                        {about.title}
                      </h1>
                      <p className="text-sm sm:text-base text-retro-text/80 font-body border-l-2 border-retro-primary pl-4 py-0.5 leading-relaxed">
                        {about.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Editor Content Display */}
                  <div
                    className="about-dossier-body prose-editor font-body text-retro-text/90 text-sm sm:text-base leading-relaxed pt-2 border-t border-retro-border/20"
                    dangerouslySetInnerHTML={{ __html: about.content }}
                  />

                  {/* Hobbies / Specs */}
                  {about.hobbies.length > 0 && (
                    <div className="pt-8 border-t border-dashed border-retro-border/30">
                      <h3 className="text-xs font-body mb-3 text-retro-text/60">
                        Loaded specifications
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {about.hobbies.map((hobby) => (
                          <span
                            key={hobby}
                            className="bg-retro-surface/50 border border-retro-border/30 px-3 py-1.5 text-xs font-body text-retro-text shadow-retro-sm"
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
      </main>
    </div>
  );
}
