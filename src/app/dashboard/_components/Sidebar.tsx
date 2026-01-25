'use client';

import {
  Home,
  FileText,
  Briefcase,
  Layout,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import type { SidebarProps, DashboardView } from '@/types';

interface NavItem {
  id: DashboardView;
  icon: typeof Home;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'overview', icon: Home, label: 'Overview' },
  { id: 'resumes', icon: FileText, label: 'My Resumes' },
  { id: 'jobs', icon: Briefcase, label: 'Job Matches' },
  { id: 'templates', icon: Layout, label: 'Templates' },
];

export const Sidebar = ({
  currentView,
  setView,
  collapsed,
  setCollapsed,
  onLogout,
}: SidebarProps) => {
  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-72'
      } bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-40`}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
            R
          </div>
          {!collapsed && (
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
              ResuMates
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative
              ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
          >
            <item.icon
              size={22}
              className={
                currentView === item.id
                  ? 'animate-bounce-subtle'
                  : 'group-hover:scale-110 transition-transform'
              }
            />
            <span
              className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
                collapsed ? 'opacity-0 w-0' : 'opacity-100'
              }`}
            >
              {item.label}
            </span>
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
          <span
            className={`px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ${
              collapsed ? 'hidden' : ''
            }`}
          >
            Tools
          </span>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Settings size={22} />
            {!collapsed && <span className="font-medium text-sm">Settings</span>}
          </button>
        </div>
      </nav>

      {/* User / Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mb-2"
        >
          <LogOut size={22} />
          {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex justify-center py-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};
