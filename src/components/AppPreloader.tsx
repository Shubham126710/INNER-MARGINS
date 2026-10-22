'use client';

import { useState } from 'react';
import LoadingScreen from './LoadingScreen';

export default function AppPreloader() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return <LoadingScreen onComplete={() => setShow(false)} isPreloader />;
}
