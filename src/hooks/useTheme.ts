'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Theme } from '@/types';

/**
 * Apply theme to DOM - ensures dark class is properly set/removed
 */
const applyTheme = (theme: Theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Custom hook for managing theme state with localStorage persistence
 * @returns [theme, toggleTheme] - Current theme and toggle function
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);
    
    // Check local storage first
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Fall back to system preference
      setTheme('dark');
      applyTheme('dark');
    } else {
      // Default to light and ensure dark class is removed
      setTheme('light');
      applyTheme('light');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme: Theme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      applyTheme(newTheme);
      return newTheme;
    });
  }, []);

  // Return light theme during SSR to prevent hydration mismatch
  return [mounted ? theme : 'light', toggleTheme] as const;
};
