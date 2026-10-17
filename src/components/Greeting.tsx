'use client';

import { useSyncExternalStore } from 'react';

function getHourGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 12) {
    return 'good morning, shubham.';
  }
  if (hour >= 12 && hour < 17) {
    return 'good afternoon, shubham.';
  }
  if (hour >= 17 && hour < 22) {
    return 'good evening, shubham.';
  }
  return 'hope your day went well. sweet dreams, shubham.';
}

const emptySubscribe = () => () => {};

export function Greeting() {
  const greeting = useSyncExternalStore(
    emptySubscribe,
    getHourGreeting,
    () => 'Welcome back, Shubham.'
  );

  return <span suppressHydrationWarning className="lowercase tracking-widest opacity-80">{greeting}</span>;
}
