'use client';

import { useEffect, useRef, useState } from 'react';

type EntryCallback = (entry: IntersectionObserverEntry) => void;

let sharedObserver: IntersectionObserver | null = null;
const entryCallbacks = new Map<Element, EntryCallback>();

const getSharedObserver = () => {
  if (sharedObserver) return sharedObserver;

  sharedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const callback = entryCallbacks.get(entry.target);
        if (callback) callback(entry);
      });
    },
    { threshold: 0.1 }
  );

  return sharedObserver;
};

/**
 * Custom hook for triggering animations when element enters viewport
 * @returns [ref, isVisible] - Ref to attach to element and visibility state
 */
export const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = getSharedObserver();

    const handleEntry = (entry: IntersectionObserverEntry) => {
      if (!entry.isIntersecting) return;
      setIsVisible(true);
      observer.unobserve(entry.target);
      entryCallbacks.delete(entry.target);
    };

    entryCallbacks.set(currentRef, handleEntry);
    observer.observe(currentRef);

    return () => {
      if (!currentRef) return;
      observer.unobserve(currentRef);
      entryCallbacks.delete(currentRef);
    };
  }, []);

  return [ref, isVisible] as const;
};
