'use client';

import { useSyncExternalStore, useCallback } from 'react';
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

// Module-level state for theme store
let currentTheme: Theme = 'light';
let listeners: Array<() => void> = [];
let isInitialized = false;

const themeStore = {
  getSnapshot: (): Theme => currentTheme,
  getServerSnapshot: (): Theme => 'light', // SSR fallback
  subscribe: (listener: () => void): (() => void) => {
    listeners.push(listener);

    // Initialize theme on first subscription (client-side only)
    if (!isInitialized && typeof window !== 'undefined') {
      isInitialized = true;
      const savedTheme = localStorage.getItem('theme') as Theme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

      if (initialTheme !== currentTheme) {
        currentTheme = initialTheme;
        applyTheme(initialTheme);
      }
    }

    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  setTheme: (theme: Theme) => {
    currentTheme = theme;
    localStorage.setItem('theme', theme);
    applyTheme(theme);
    listeners.forEach((listener) => listener());
  },
};

/**
 * Custom hook for managing theme state with localStorage persistence
 * Uses useSyncExternalStore for hydration-safe state management
 * @returns [theme, toggleTheme] - Current theme and toggle function
 */
export const useTheme = () => {
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot
  );

  const toggleTheme = useCallback(() => {
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    themeStore.setTheme(newTheme);
  }, []);

  return [theme, toggleTheme] as const;
};
