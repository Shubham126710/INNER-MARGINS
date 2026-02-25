'use client';

import { useRouter } from 'next/navigation';
import { deletePost } from '@/actions/post.actions';

export default function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the post
    e.stopPropagation(); // Prevent event bubbling
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center text-xs font-heading uppercase text-retro-primary hover:bg-retro-primary hover:text-retro-surface px-2 py-1 transition-colors ml-auto"
    >
      [ Delete ]
    </button>
  );
}
