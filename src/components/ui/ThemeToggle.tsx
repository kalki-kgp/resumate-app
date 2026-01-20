'use client';

import { Sun, Moon } from 'lucide-react';
import type { ThemeToggleProps } from '@/types';

export const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => (
  <button
    onClick={toggleTheme}
    className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
    aria-label="Toggle Dark Mode"
  >
    <div className="relative z-10 w-6 h-6">
      <Sun 
        size={24} 
        className={`absolute inset-0 transition-all duration-500 transform ${theme === 'dark' ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} 
      />
      <Moon 
        size={24} 
        className={`absolute inset-0 transition-all duration-500 transform ${theme === 'dark' ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} 
      />
    </div>
  </button>
);
