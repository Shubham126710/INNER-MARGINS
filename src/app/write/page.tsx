'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RichTextEditor, TagInput, ImageUpload } from '@/components';
import { savePost, getPostById, deletePost, getPosts } from '@/actions/post.actions';
import { BlogPost } from '@/lib/types';

function Editor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function loadData() {
      if (editId) {
        const post = await getPostById(editId);
        if (post) {
          setTitle(post.title);
          setExcerpt(post.excerpt);
          setContent(post.content);
          setCoverImage(post.coverImage || '');
          setTags(post.tags);
          setIsFeatured(post.isFeatured);
          setIsPublished(post.isPublished);
        }
      }
      const posts = await getPosts();
      setAllPosts(posts);
    }
    loadData();
  }, [editId]);

  const handleSave = async (publish: boolean = true) => {
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!content.trim()) {
      alert('Please write some content');
      return;
    }

    setIsSaving(true);
    
    try {
      const post = await savePost({
        id: editId || undefined,
        title: title.trim(),
        excerpt: excerpt.trim() || content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        content,
        coverImage,
        tags,
        isFeatured,
        isPublished: publish,
      });

      router.push(`/posts/${post.slug}`);
    } catch {
      alert('Failed to save post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
      const updatedPosts = await getPosts();
      setAllPosts(updatedPosts);
      
      if (editId === id) {
        setTitle('');
        setExcerpt('');
        setContent('');
        setCoverImage('');
        setTags([]);
        setIsFeatured(false);
        router.push('/write');
      }
    }
  };

  const handleEdit = (post: BlogPost) => {
    router.push(`/write?edit=${post.id}`);
    setShowManage(false);
  };

  const resetForm = () => {
    setTitle('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setTags([]);
    setIsFeatured(false);
    setIsPublished(true);
    router.push('/write');
  };

  return (
    <div className="min-h-screen py-12 bg-retro-bg font-body selection:bg-retro-primary selection:text-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b-4 border-retro-border">
          <div>
            <Link 
              href="/" 
              className="text-retro-text/60 hover:text-retro-text font-mono text-sm no-underline inline-flex items-center gap-2 mb-4 hover:underline uppercase"
            >
              &lt; Back to journal
            </Link>
            <h1 className="text-2xl sm:text-3xl font-heading uppercase text-retro-text">
              {editId ? 'Edit Entry' : 'Write New Entry'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {editId && (
              <button
                onClick={resetForm}
                className="btn-secondary text-xs"
              >
                New Entry
              </button>
            )}
            <button
              onClick={() => setShowManage(!showManage)}
              className="btn-secondary text-xs"
            >
              {showManage ? '[ Close ]' : '[ Manage Posts ]'}
            </button>
          </div>
        </div>

        {/* Post Management Panel */}
        {showManage && (
          <div className="card p-6 mb-8 bg-retro-surface">
            <h3 className="text-lg font-heading uppercase text-retro-text mb-4">Manage Posts</h3>
            {allPosts.length === 0 ? (
              <p className="text-retro-text/60 font-mono">No posts yet. Start writing!</p>
            ) : (
              <div className="space-y-2">
                {allPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 bg-retro-bg border-2 border-retro-border"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-retro-text font-heading uppercase truncate">{post.title}</h4>
                      <div className="flex items-center gap-3 mt-1 font-mono text-xs">
                        <span className="text-retro-text/60">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        {post.isFeatured && (
                          <span className="bg-retro-primary text-retro-surface px-1">FEATURED</span>
                        )}
                        {!post.isPublished && (
                          <span className="bg-retro-border/20 text-retro-text px-1">DRAFT</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(post)}
                        className="px-2 py-1 text-xs border border-retro-text text-retro-text hover:bg-retro-text hover:text-retro-surface uppercase font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-2 py-1 text-xs border border-retro-primary text-retro-primary hover:bg-retro-primary hover:text-retro-surface uppercase font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Editor Form */}
        <div className="space-y-6">
          {/* Cover Image */}
          <ImageUpload
            image={coverImage}
            onChange={setCoverImage}
            label="Cover Image (optional)"
          />

          {/* Title */}
          <div>
            <label className="block text-sm font-heading uppercase text-retro-text mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ENTER TITLE..."
              className="w-full text-xl sm:text-2xl lg:text-3xl font-heading bg-retro-surface border-4 border-retro-border p-3 sm:p-4 outline-none text-retro-text placeholder-retro-text/40 focus:shadow-retro transition-shadow"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-heading uppercase text-retro-text mb-2">
              Excerpt (Auto-Generated if Empty)
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A brief summary..."
              rows={2}
              className="retro-input resize-none font-mono text-sm"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-heading uppercase text-retro-text mb-2">
              Tags
            </label>
            <TagInput
              tags={tags}
              onChange={setTags}
              placeholder="ADD TAGS..."
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-heading uppercase text-retro-text mb-2">
              Content
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="START WRITING..."
            />
          </div>

          {/* Options */}
          <div className="flex flex-wrap items-center gap-6 py-4 border-t-4 border-retro-border border-dashed">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-6 h-6 border-2 border-retro-text rounded-none focus:ring-0 checked:bg-retro-text checked:text-retro-surface appearance-none"
              />
              <span className="text-retro-text font-heading uppercase text-sm">
                Feature this post
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t-4 border-retro-border">
            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="btn-primary disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : editId ? 'Update & Publish' : 'Publish Entry'}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="btn-secondary disabled:opacity-50"
            >
              Save as Draft
            </button>
            <Link href="/" className="text-retro-text/60 hover:text-retro-text hover:underline no-underline ml-auto font-mono text-sm uppercase">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-retro-bg">
        <div className="font-heading text-xl uppercase animate-pulse text-retro-text">Loading Editor...</div>
      </div>
    }>
      <Editor />
    </Suspense>
  );
}
