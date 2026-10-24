'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deletePost } from '@/actions/post.actions';

interface PostActionsProps {
  postId: string;
}

export default function PostActions({ postId }: PostActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Initiate destructive protocol? This cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deletePost(postId);
        window.location.href = '/journals';
      } catch (err) {
        console.error('Failed to delete post', err);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowActions(!showActions)}
        disabled={isDeleting}
        className="px-3 py-1 font-body text-xs text-retro-text/75 transition-colors border border-retro-border/30 bg-retro-surface/50 hover:border-retro-border/60 hover:bg-retro-surface hover:text-retro-text disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-retro-primary cursor-pointer shadow-retro-sm"
      >
        Options
      </button>

      {showActions && (
        <div className="absolute right-0 mt-2 w-48 bg-retro-surface/95 backdrop-blur-sm border border-retro-border/40 shadow-retro z-30 flex flex-col p-1">
          <Link
            href={`/write?edit=${postId}`}
            className="px-3 py-2 text-xs font-body text-retro-text hover:bg-retro-bg hover:text-retro-primary no-underline transition-colors active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-retro-primary"
          >
            Edit fragment
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-3 py-2 text-xs font-body text-retro-primary hover:bg-retro-bg text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-retro-primary cursor-pointer"
          >
            {isDeleting ? 'Purging…' : 'Purge log'}
          </button>
        </div>
      )}
    </div>
  );
}
