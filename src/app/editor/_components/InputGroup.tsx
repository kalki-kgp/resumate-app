'use client';

import { LucideIcon, ChevronDown, ChevronRight } from 'lucide-react';

interface InputGroupProps {
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'warm' | 'editorial';
}

export const InputGroup = ({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
  variant = 'default',
}: InputGroupProps) => (
  <div
    className={`mb-4 backdrop-blur-md overflow-hidden transition-all duration-300 ${
      variant === 'dark'
        ? 'rounded-2xl bg-[#0b111a]/95 border border-[#1e2736]'
        : variant === 'warm'
          ? 'rounded-[22px] bg-[#fffaf4] border border-[#eadfce] shadow-sm'
          : variant === 'editorial'
            ? 'bg-[#fcfaf6] border border-[#e5e5e5]'
            : 'rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-white dark:border-slate-700 shadow-sm'
    }`}
  >
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-4 transition-colors ${
        variant === 'dark'
          ? 'text-[#e2e8f0] hover:bg-[#101827]'
          : variant === 'warm'
            ? 'text-[#2c1810] hover:bg-[#fff3e8]'
            : variant === 'editorial'
              ? 'text-[#111111] hover:bg-[#f7f5f1]'
              : 'text-slate-700 dark:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
      }`}
    >
      <div className="flex items-center gap-3 font-bold">
        <div
          className={`p-2 rounded-lg transition-colors ${
            isOpen
              ? variant === 'dark'
                ? 'bg-[#00e5a0]/15 text-[#00e5a0]'
                : variant === 'warm'
                  ? 'bg-[#ffe7d8] text-[#c96442]'
                  : variant === 'editorial'
                    ? 'bg-[#fff4cf] text-[#9a8451]'
                    : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
              : variant === 'dark'
                ? 'bg-[#0f172a] text-[#64748b]'
                : variant === 'warm'
                  ? 'bg-[#f4ecdf] text-[#8b7355]'
                  : variant === 'editorial'
                    ? 'bg-[#f0ece2] text-[#777777]'
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
