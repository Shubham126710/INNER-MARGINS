'use client';

import { useEffect, useState } from 'react';

export function Greeting() {
  const [greeting, setGreeting] = useState('Welcome back, Shubham.');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning, Shubham.');
    } else if (hour < 18) {
      setGreeting('Good afternoon, Shubham.');
    } else if (hour < 22) {
      setGreeting('Good evening, Shubham.');
    } else {
      setGreeting('Have a great night, Shubham.');
    }
  }, []);

  return <span suppressHydrationWarning className="lowercase tracking-widest opacity-80">{greeting}</span>;
}
