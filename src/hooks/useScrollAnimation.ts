'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for triggering animations when element enters viewport
 * @returns [ref, isVisible] - Ref to attach to element and visibility state
 */
export const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return [ref, isVisible] as const;
};
