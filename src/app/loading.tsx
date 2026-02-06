import { LoadingScreen } from '@/components';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-retro-primary z-[9999] fixed inset-0">
      <LoadingScreen />
    </div>
  );
}
