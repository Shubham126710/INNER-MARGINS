'use client';

import { useState } from 'react';
import { BlogPost } from '@/lib/types';
import { unlockLockedPost } from '@/actions/auth.actions';
import PinLock from './PinLock';
import PostView from './PostView';

interface LockedPostViewProps {
  slug: string;
}

export default function LockedPostView({ slug }: LockedPostViewProps) {
  const [unlockedPost, setUnlockedPost] = useState<BlogPost | null>(null);

  const handleUnlockPin = async (pin: string): Promise<boolean> => {
    try {
      const res = await unlockLockedPost(slug, pin);
      if (res.success && res.post) {
        setUnlockedPost(res.post);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  if (!unlockedPost) {
    return (
      <div className="min-h-screen bg-retro-bg flex flex-col font-body selection:bg-retro-primary selection:text-white">
        <PinLock onUnlockPin={handleUnlockPin} />
      </div>
    );
  }

  return <PostView post={unlockedPost} />;
}
