'use client';

import { Search, Sun, Moon } from 'lucide-react';
import type { DashboardTopbarProps } from '@/types';

export const DashboardTopbar = ({
  currentView,
  theme,
  toggleTheme,
}: DashboardTopbarProps) => {
  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold capitalize">
          {currentView.replace('-', ' ')}
        </h1>
        {currentView === 'overview' && (
          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
            Pro Plan
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            className="pl-10 pr-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
            placeholder="Search..."
          />
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
          JD
        </div>
      </div>
    </header>
  );
};
