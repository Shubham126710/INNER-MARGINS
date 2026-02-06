import { LoadingScreen } from '@/components';

export default function Loading() {
  return (
    <div 
      className="fixed inset-0 min-h-[100dvh] w-screen flex items-center justify-center bg-retro-primary" 
      style={{ zIndex: 9999 }}
    >
      <LoadingScreen />
    </div>
  );
}
