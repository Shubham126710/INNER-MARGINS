'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TagInput, RichTextEditor, ImageUpload } from '@/components';
import { getAboutContent, saveAboutContent } from '@/actions/about.actions';
import { AboutContent } from '@/lib/types';

export default function AboutPage() {
  const [isEditing, setIsEditing] = useState(false);
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
      const data = await getAboutContent();
      setAbout(data);
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

  const isEmpty = !about.content && !about.profileImage;

  return (
    <div className="min-h-screen bg-retro-bg font-body selection:bg-retro-primary selection:text-white">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-32 overflow-hidden border-b-4 border-retro-border bg-retro-surface">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Back link */}
          <Link 
            href="/"  
            className="inline-flex items-center text-sm font-mono text-retro-text/60 hover:text-retro-text hover:underline uppercase mb-12 decoration-2 underline-offset-4"
          >
            &lt; Return to Main
          </Link>

          {/* Edit Toggle */}
          <div className="flex items-center justify-between mb-8 border-b-4 border-retro-border pb-4">
            <div>
              <span className="bg-retro-text text-retro-surface px-2 py-1 text-xs font-mono uppercase tracking-widest">
                System Info
              </span>
            </div>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={isEditing ? 'btn-primary' : 'btn-secondary'}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Update Profile'}
            </button>
          </div>

          {isEditing ? (
            /* Edit Mode */
            <div className="space-y-8 bg-retro-bg p-8 border-4 border-retro-border shadow-retro">
              {/* Profile Image */}
              <div className="max-w-xs">
                <ImageUpload
                  image={about.profileImage || ''}
                  onChange={(img) => setAbout({ ...about, profileImage: img })}
                  label="Profile Photo"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-heading uppercase text-retro-text mb-2">Title</label>
                <input
                  type="text"
                  value={about.title}
                  onChange={(e) => setAbout({ ...about, title: e.target.value })}
                  className="retro-input"
                  placeholder="About Me"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-heading uppercase text-retro-text mb-2">Subtitle</label>
                <input
                  type="text"
                  value={about.subtitle}
                  onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
                  className="retro-input"
                  placeholder="A brief tagline about yourself"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-heading uppercase text-retro-text mb-2">About Content</label>
                <RichTextEditor
                  content={about.content}
                  onChange={(content) => setAbout({ ...about, content })}
                  placeholder="Tell your story..."
                />
              </div>

              {/* Hobbies */}
              <div className="space-y-4">
                <label className="block text-sm font-heading uppercase text-retro-text border-b-2 border-retro-border pb-1">Hobbies & Interests</label>
                <TagInput
                  tags={about.hobbies}
                  onChange={(hobbies) => setAbout({ ...about, hobbies })}
                  placeholder="Add a hobby (Press Enter)..."
                />
              </div>

              {/* Cancel Button */}
              <div className="flex gap-4 pt-4 border-t-2 border-dashed border-retro-border/50">
                <button
                  onClick={handleSave}
                  className="btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Confirm'}
                </button>
                <button
                  onClick={() => {
                    setAbout(getAboutContent());
                    setIsEditing(false);
                  }}
                  className="px-6 py-3 border-2 border-retro-primary text-retro-primary font-display uppercase hover:bg-retro-border/10"
                >
                  Abort
                </button>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div>
              {isEmpty ? (
                /* Empty State */
                <div className="text-center py-16 border-4 border-dashed border-retro-border/40">
                  <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center grayscale text-6xl">
                    👾
                  </div>
                  <h1 className="text-3xl font-heading uppercase text-retro-text mb-4">
                    Identity Unknown
                  </h1>
                  <p className="text-retro-text/60 font-mono mb-8 max-w-md mx-auto">
                    No profile data found in memory.
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    Initialize Profile
                  </button>
                </div>
              ) : (
                /* Content Display */
                <div className="space-y-8">
                  {/* Profile & Header */}
                  <div className="flex flex-col md:flex-row gap-8 items-start border-b-4 border-retro-border pb-8">
                    {about.profileImage && (
                      <div className="relative w-32 h-32 md:w-40 md:h-40 border-4 border-retro-border flex-shrink-0 shadow-retro">
                        <Image
                          src={about.profileImage}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <h1 className="text-4xl md:text-5xl font-heading uppercase text-retro-text mb-4 leading-none">
                        {about.title}
                      </h1>
                      <p className="text-xl text-retro-text/80 font-mono border-l-4 border-retro-primary pl-4">
                        {about.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div 
                    className="prose-editor font-heading text-retro-text text-lg leading-relaxed tracking-wide"
                    dangerouslySetInnerHTML={{ __html: about.content }}
                  />

                  {/* Hobbies */}
                  {about.hobbies.length > 0 && (
                    <div className="pt-8 border-t-4 border-retro-border">
                      <h3 className="text-sm font-heading font-bold uppercase tracking-wider mb-4 text-retro-text">
                        Character Specs
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {about.hobbies.map((hobby) => (
                          <span 
                            key={hobby}
                            className="bg-retro-bg border-2 border-retro-text px-3 py-1 text-sm font-heading text-retro-text uppercase shadow-retro-sm"
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
      </section>
    </div>
  );
}
