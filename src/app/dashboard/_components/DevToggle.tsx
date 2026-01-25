'use client';

import { useState } from 'react';
import { Code2, ChevronDown, ChevronUp, ToggleLeft, ToggleRight } from 'lucide-react';

interface DevToggleProps {
  isOnboardingComplete: boolean;
  onToggle: () => void;
}

export const DevToggle = ({ isOnboardingComplete, onToggle }: DevToggleProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-24 left-4 z-[100]">
      <div
        className={`
          bg-amber-500 dark:bg-amber-600 text-white rounded-lg shadow-lg
          transition-all duration-300 overflow-hidden
          ${isExpanded ? 'w-64' : 'w-12'}
        `}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 flex items-center gap-3 hover:bg-amber-600 dark:hover:bg-amber-700 transition-colors"
        >
          <Code2 size={18} className="flex-shrink-0" />
          {isExpanded && (
            <>
              <span className="flex-1 text-left text-sm font-semibold">Dev Mode</span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </>
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-3 pb-3 space-y-3 animate-fade-in">
            <div className="text-xs text-amber-100 border-t border-amber-400/30 pt-3">
              Toggle onboarding state for testing
            </div>

            {/* Onboarding Toggle */}
            <button
              onClick={onToggle}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-800 transition-colors"
            >
              <span className="text-sm">Onboarding Complete</span>
              {isOnboardingComplete ? (
                <ToggleRight size={24} className="text-green-300" />
              ) : (
                <ToggleLeft size={24} className="text-amber-200" />
              )}
            </button>

            {/* Current State */}
            <div className="text-xs text-center py-1 px-2 rounded bg-amber-600/50 dark:bg-amber-800/50">
              Showing: {isOnboardingComplete ? 'Dashboard' : 'Onboarding'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
