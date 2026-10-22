'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    gsap.globalTimeline.timeScale(100);
  }

  gsap.defaults({
    ease: 'power3.out',
    duration: 0.8,
  });
}

export { gsap, ScrollTrigger, useGSAP };
