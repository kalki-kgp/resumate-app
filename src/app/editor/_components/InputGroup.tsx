'use client';

import { LucideIcon, ChevronDown, ChevronRight } from 'lucide-react';

interface InputGroupProps {
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const InputGroup = ({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: InputGroupProps) => (
  <div className="mb-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl border border-white dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-colors"
    >
      <div className="flex items-center gap-3 font-bold">
        <div
          className={`p-2 rounded-lg transition-colors ${
            isOpen
              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}
        >
          <Icon size={18} />
        </div>
        {title}
      </div>
      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
    </button>

    <div
      className={`transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="p-4 pt-0 space-y-4">{children}</div>
    </div>
  </div>
);
