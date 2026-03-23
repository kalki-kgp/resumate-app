'use client';

import {
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  LogOut,
  Mail,
  Search,
  Settings,
} from 'lucide-react';
import { sidebarPrimaryItems, sidebarAiItems } from './constants';
import { formatJoinDate } from './utils';
import type { DashboardSection } from './dashboard-types';

export type DashboardSidebarProps = {
  activeSection: DashboardSection;
  profileFullName: string;
  profileEmail: string;
  profileCreatedAt: string | null;
  isProfilePopupOpen: boolean;
  onSetActiveSection: (section: DashboardSection) => void;
  onToggleProfilePopup: () => void;
  onSignOut: () => void;
  profilePopupRef: React.RefObject<HTMLDivElement | null>;
};

export const DashboardSidebar = ({
  activeSection,
  profileFullName,
  profileEmail,
  profileCreatedAt,
  isProfilePopupOpen,
  onSetActiveSection,
  onToggleProfilePopup,
  onSignOut,
  profilePopupRef,
}: DashboardSidebarProps) => (
  <aside data-tour="dashboard-sidebar" className="flex h-full w-full max-w-[270px] flex-col rounded-[28px] border border-[#e3e5e8] bg-[#f7f7f8] p-4 shadow-[0_10px_30px_rgba(26,31,44,0.06)]">
    <div className="relative mb-4" ref={profilePopupRef}>
      <button
        type="button"
        onClick={onToggleProfilePopup}
        className="flex w-full items-center gap-2 rounded-2xl border border-[#e3e5e8] bg-white px-3 py-3 text-left"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#ffbe86] via-[#ff9a38] to-[#ff7b33] text-xs font-bold text-white">
          {profileFullName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#1d2026]">{profileFullName}</p>
          <p className="text-xs text-[#8b8f98]">Free Plan</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-[#9298a3] transition-transform ${isProfilePopupOpen ? 'rotate-180' : ''}`} />
      </button>

      {isProfilePopupOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-50">
          <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/45 p-3 backdrop-blur-xl shadow-[0_18px_45px_rgba(20,24,33,0.24)]">
            <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-[#ff9a38]/30 blur-2xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-[#64bf42]/20 blur-2xl" />
            <div className="relative space-y-3">
              <div className="rounded-xl border border-white/70 bg-white/55 p-3">
                <p className="truncate text-sm font-semibold text-[#1f2430]">{profileFullName}</p>
                <p className="mt-1 flex items-center gap-1.5 truncate text-[11px] text-[#5c6271]">
                  <Mail className="h-3 w-3 text-[#7d8390]" />
                  {profileEmail}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#5c6271]">
                  <CalendarDays className="h-3 w-3 text-[#7d8390]" />
                  Joined {formatJoinDate(profileCreatedAt)}
                </p>
              </div>

              <div className="rounded-xl border border-white/70 bg-gradient-to-br from-white/65 via-[#fff8ef]/55 to-[#fff0e4]/60 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8c5d39]">Plan</p>
                    <p className="text-sm font-semibold text-[#2f3542]">Free Plan</p>
                  </div>
                  <span className="rounded-full bg-[#ff9a38] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                    Active
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-[11px] text-[#5f6675]">
                  <p className="flex items-center gap-1.5"><BadgeCheck className="h-3 w-3 text-[#2d8b46]" /> Multi-resume dashboard</p>
                  <p className="flex items-center gap-1.5"><BadgeCheck className="h-3 w-3 text-[#2d8b46]" /> ATS analysis</p>
                  <p className="flex items-center gap-1.5"><BadgeCheck className="h-3 w-3 text-[#2d8b46]" /> Template library</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onToggleProfilePopup();
                  void onSignOut();
                }}
                className="w-full rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-xs font-semibold text-[#394150] hover:bg-white/75"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#e3e5e8] bg-white px-3 py-2 text-[#8a8f97]">
      <Search className="h-4 w-4" />
      <span className="text-xs">Search anything</span>
    </div>

    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
      <div className="space-y-1">
        {sidebarPrimaryItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSetActiveSection(item.key)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm ${
              activeSection === item.key
                ? 'bg-[#eceff3] font-semibold text-[#272c35]'
                : 'text-[#535a66] hover:bg-[#eceff3]'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9aa0aa]">AI Features</p>
        <div className="mt-2 space-y-1">
          {sidebarAiItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onSetActiveSection(item.key)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${
                activeSection === item.key
                  ? 'bg-[#eceff3] font-semibold text-[#272c35]'
                  : 'text-[#535a66] hover:bg-[#eceff3]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
              {item.badge && (
                <span className="rounded-full bg-[#ff9a38] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-4 space-y-1 border-t border-[#e7eaee] pt-3">
      <button
        type="button"
        onClick={() => onSetActiveSection('faq')}
        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm ${
          activeSection === 'faq'
            ? 'bg-[#eceff3] font-semibold text-[#272c35]'
            : 'text-[#535a66] hover:bg-[#eceff3]'
        }`}
      >
        <CircleHelp className="h-4 w-4" />
        FAQ
      </button>
      <button
        type="button"
        onClick={() => onSetActiveSection('settings')}
        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm ${
          activeSection === 'settings'
            ? 'bg-[#eceff3] font-semibold text-[#272c35]'
            : 'text-[#535a66] hover:bg-[#eceff3]'
        }`}
      >
        <Settings className="h-4 w-4" />
        Settings
      </button>
      <button
        type="button"
        onClick={() => void onSignOut()}
        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-[#535a66] hover:bg-[#eceff3]"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </div>
  </aside>
);
