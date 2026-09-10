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
    <section className="mt-16 border-t-4 border-retro-border pt-12 font-body text-retro-text">
      <h3 className="text-2xl font-heading uppercase text-retro-text mb-8">Comments ({comments.length})</h3>

      <div className="mb-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && <p className="text-retro-primary font-mono text-sm uppercase">{error}</p>}
          <div className="flex flex-col gap-2">
            <label htmlFor="author" className="font-mono text-sm uppercase text-retro-text/80">Name</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border-2 border-retro-border bg-retro-bg p-3 font-mono text-retro-text focus:outline-none focus:border-retro-primary focus:ring-1 focus:ring-retro-primary placeholder-retro-text/30 uppercase text-sm"
              placeholder="YOUR NAME"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="content" className="font-mono text-sm uppercase text-retro-text/80">Comment</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border-2 border-retro-border bg-retro-bg p-3 font-body text-retro-text focus:outline-none focus:border-retro-primary focus:ring-1 focus:ring-retro-primary placeholder-retro-text/30 min-h-[120px]"
              placeholder="Leave a comment..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary self-start disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-8">
        {comments.map((comment) => (
          <div key={comment.id} className="border-l-4 border-retro-primary pl-6 py-2">
            <div className="flex items-center gap-4 mb-2">
              <span className="font-mono font-bold text-retro-primary uppercase">{comment.author}</span>
              <span className="font-mono text-xs text-retro-text/60">
                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="font-body text-lg leading-relaxed whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="font-mono text-retro-text/60 italic uppercase text-sm">No comments yet. Be the first to share your thoughts.</p>
        )}
      </div>
    </section>
  );
}