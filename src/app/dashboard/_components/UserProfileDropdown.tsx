'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  User,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  Crown,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import type { UserProfileDropdownProps, UserProfile } from '@/types';

// Mock user data - will be replaced with API data later
const mockUser: UserProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: null,
  memberSince: 'January 2026',
  plan: 'Free',
  resumesUsed: 3,
  resumesLimit: 5,
};

export const UserProfileDropdown = ({
  theme,
  toggleTheme,
  onLogout,
}: UserProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const usagePercentage = (mockUser.resumesUsed / mockUser.resumesLimit) * 100;
  const isPro = mockUser.plan !== 'Free';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        aria-label="Open user menu"
        aria-expanded={isOpen}
      >
        {mockUser.avatar ? (
          <Image
            src={mockUser.avatar}
            alt={mockUser.name}
            width={40}
            height={40}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          getInitials(mockUser.name)
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 animate-fade-in-up z-50 overflow-hidden">
          {/* User Info Section */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {mockUser.avatar ? (
                  <Image
                    src={mockUser.avatar}
                    alt={mockUser.name}
                    width={48}
                    height={48}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(mockUser.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                  {mockUser.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {mockUser.email}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Member since {mockUser.memberSince}
                </p>
              </div>
            </div>
          </div>

          {/* Plan Info Section */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown
                  size={16}
                  className={
                    isPro
                      ? 'text-amber-500'
                      : 'text-slate-400 dark:text-slate-500'
                  }
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {mockUser.plan} Plan
                </span>
              </div>
              {!isPro && (
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105">
                  <Sparkles size={12} />
                  Upgrade
                </button>
              )}
            </div>

            {/* Usage Stats */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Resumes used
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {mockUser.resumesUsed}/{mockUser.resumesLimit}
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    usagePercentage >= 80
                      ? 'bg-gradient-to-r from-orange-500 to-red-500'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              {usagePercentage >= 80 && !isPro && (
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  Running low on resumes. Upgrade for unlimited access.
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to profile
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <User
                size={18}
                className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              />
              <span className="flex-1">View Profile</span>
              <ChevronRight
                size={16}
                className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors"
              />
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to settings
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <Settings
                size={18}
                className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              />
              <span className="flex-1">Account Settings</span>
              <ChevronRight
                size={16}
                className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors"
              />
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to billing
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <CreditCard
                size={18}
                className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              />
              <span className="flex-1">Billing</span>
              <ChevronRight
                size={16}
                className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors"
              />
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // TODO: Open help
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <HelpCircle
                size={18}
                className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              />
              <span className="flex-1">Help & Support</span>
              <ChevronRight
                size={16}
                className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors"
              />
            </button>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center justify-between">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors group"
                aria-label="Toggle theme"
              >
                <div className="relative w-5 h-5">
                  <Sun
                    size={20}
                    className={`absolute inset-0 transition-all duration-300 transform ${
                      theme === 'dark'
                        ? 'rotate-90 opacity-0 scale-50'
                        : 'rotate-0 opacity-100 scale-100'
                    } text-amber-500`}
                  />
                  <Moon
                    size={20}
                    className={`absolute inset-0 transition-all duration-300 transform ${
                      theme === 'dark'
                        ? 'rotate-0 opacity-100 scale-100'
                        : '-rotate-90 opacity-0 scale-50'
                    } text-blue-400`}
                  />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
