'use client';

import { useState } from 'react';
import { BlogPost } from '@/lib/types';
import PinLock from './PinLock';
import PostView from './PostView';

interface LockedPostViewProps {
  post: BlogPost;
}

export default function LockedPostView({ post }: LockedPostViewProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-retro-bg flex flex-col font-body selection:bg-retro-primary selection:text-white">
        <PinLock onUnlock={() => setIsUnlocked(true)} />
      </div>
    );
  }

  return <PostView post={post} />;
}
