'use client';

import { useEffect, useState } from 'react';

export function Greeting() {
  const [greeting, setGreeting] = useState('Welcome back, Shubham.');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      setGreeting('good morning, shubham.');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('good afternoon, shubham.');
    } else if (hour >= 17 && hour < 22) {
      setGreeting('good evening, shubham.');
    } else {
      setGreeting('hope your day went well. sweet dreams, shubham.');
    }
  }, []);

  return <span suppressHydrationWarning className="lowercase tracking-widest opacity-80">{greeting}</span>;
}
