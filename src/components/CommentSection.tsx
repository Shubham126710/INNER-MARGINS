'use client';

import { useState, useEffect } from 'react';
import { getCommentsAction, addCommentAction } from '@/actions/comment.actions';

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
  postId: string;
}

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchComments() {
      const fetchedComments = await getCommentsAction(postId);
      setComments(fetchedComments as Comment[]);
    }
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      setError('Name and comment are required.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    const res = await addCommentAction(postId, author, content);
    if (res.error) {
      setError(res.error);
    } else if (res.success && res.comment) {
      setComments([res.comment as Comment, ...comments]);
      setAuthor('');
      setContent('');
    }
    setIsSubmitting(false);
  };

  return (
    <section className="mt-24 border-t border-ink/10 pt-16 font-sans text-ink max-w-3xl">
      <h3 className="text-xl font-display mb-12">Letters to the Editor ({comments.length})</h3>

      <div className="mb-16">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && <p className="text-red-600 font-sans text-sm">{error}</p>}
          <div className="flex flex-col gap-2">
            <label htmlFor="author" className="font-sans text-xs font-medium uppercase tracking-widest text-muted">Name</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border-b border-ink/20 bg-transparent py-3 font-sans text-ink focus:outline-none focus:border-ink/50 transition-colors placeholder:text-muted/50"
              placeholder="Your name"
            />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="content" className="font-sans text-xs font-medium uppercase tracking-widest text-muted">Message</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border border-ink/20 bg-transparent p-4 font-sans text-ink focus:outline-none focus:border-ink/50 transition-colors placeholder:text-muted/50 min-h-[160px] resize-y"
              placeholder="Leave a comment..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary self-start disabled:opacity-50 mt-4"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-12">
        {comments.map((comment) => (
          <div key={comment.id} className="pb-8 border-b border-ink/10 last:border-0">
            <div className="flex items-baseline justify-between mb-4">
              <span className="font-sans font-medium text-ink">{comment.author}</span>
              <span className="font-sans text-xs text-muted uppercase tracking-widest">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="font-sans text-lg leading-relaxed whitespace-pre-wrap text-ink/90">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="font-sans text-muted italic text-lg">No letters yet. Be the first to share your thoughts.</p>
        )}
      </div>
    </section>
  );
}