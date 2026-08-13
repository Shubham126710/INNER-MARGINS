'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function ElectronNavigation() {
  const router = useRouter();

  useEffect(() => {
    // Check if we are running in the Electron environment with our preload script
    if (typeof window !== 'undefined' && (window as any).electronAPI?.onNavigate) {
      (window as any).electronAPI.onNavigate((path: string) => {
        router.push(path);
      });
    }
  }, [router]);

  return null;
}
