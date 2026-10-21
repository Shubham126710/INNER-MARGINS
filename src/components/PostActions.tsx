'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/actions/post.actions';

interface PostActionsProps {
  postId: string;
}

export default function PostActions({ postId }: PostActionsProps) {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Initiate destructive protocol? This cannot be undone.')) {
      setIsDeleting(true);
      try {
        await deletePost(postId);
        router.push('/journals');
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
        className="px-3 py-1 font-mono text-[10px] tracking-widest uppercase text-retro-text/70 transition-colors border border-transparent hover:border-retro-border/40 hover:bg-retro-surface hover:text-retro-text disabled:opacity-50"
      >
        [ Options ]
      </button>

      {showActions && (
        <div className="absolute right-0 mt-2 w-48 bg-retro-surface/90 backdrop-blur-sm border border-retro-border/30 shadow-retro-sm z-30 flex flex-col p-1">
          <Link
            href={`/write?edit=${postId}`}
            className="px-4 py-3 text-[10px] font-mono tracking-widest uppercase text-retro-text hover:bg-retro-bg hover:text-retro-primary no-underline transition-colors"
          >
            Edit Fragment
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-3 text-[10px] font-mono tracking-widest uppercase text-retro-primary opacity-80 hover:opacity-100 hover:bg-retro-bg text-left transition-colors disabled:opacity-40"
          >
            {isDeleting ? 'Purging...' : 'Purge Log'}
          </button>
        </div>
      )}
    </div>
  );
}
