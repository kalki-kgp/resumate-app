'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks';
import {
  ArrowLeft,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  Eye,
  Download,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

// Placeholder sections for the resume editor
const editorSections = [
  {
    id: 'personal',
    title: 'Personal Info',
    icon: User,
    description: 'Name, contact, and professional summary',
    completed: false,
  },
  {
    id: 'experience',
    title: 'Work Experience',
    icon: Briefcase,
    description: 'Your professional work history',
    completed: false,
  },
  {
    id: 'education',
    title: 'Education',
    icon: GraduationCap,
    description: 'Degrees, certifications, and courses',
    completed: false,
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: Wrench,
    description: 'Technical and soft skills',
    completed: false,
  },
  {
    id: 'achievements',
    title: 'Achievements',
    icon: Award,
    description: 'Awards, publications, and projects',
    completed: false,
  },
];

export default function EditorPage() {
  const router = useRouter();
  const [theme] = useTheme();
  const [activeSection, setActiveSection] = useState('personal');
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div
      className={`min-h-screen font-sans ${
        theme === 'dark'
          ? 'dark bg-slate-900 text-white'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Navigation */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            <span className="font-semibold">Untitled Resume</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Eye size={18} />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Sections */}
        <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Sections
            </h2>
            <div className="space-y-2">
              {editorSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
                      ${isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-transparent'}
                    `}
                  >
                    <div
                      className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}
                      `}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          isActive ? 'text-blue-600 dark:text-blue-400' : ''
                        }`}
                      >
                        {section.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {section.description}
                      </p>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`text-slate-400 transition-transform ${
                        isActive ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Assistant Card */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="font-semibold text-purple-700 dark:text-purple-300">
                  AI Assistant
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                Get AI-powered suggestions to improve your resume.
              </p>
              <button className="w-full py-2 px-4 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors">
                Get Suggestions
              </button>
            </div>
          </div>
        </aside>

        {/* Center - Editor Area */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-100 dark:bg-slate-950">
          <div className="max-w-2xl mx-auto">
            {/* Placeholder Content */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 min-h-[600px] relative">
              {/* Onboarding Tooltip */}
              {showTooltip && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 animate-bounce-subtle">
                  <div className="relative">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                      <HelpCircle size={16} />
                      <span className="text-sm font-medium">
                        Start by filling in your personal info
                      </span>
                      <button
                        onClick={() => setShowTooltip(false)}
                        className="ml-2 hover:bg-blue-700 rounded p-0.5"
                      >
                        ×
                      </button>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-600" />
                  </div>
                </div>
              )}

              {/* Section Content Placeholder */}
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6">
                  {editorSections.find((s) => s.id === activeSection)?.icon &&
                    (() => {
                      const Icon = editorSections.find(
                        (s) => s.id === activeSection
                      )!.icon;
                      return (
                        <Icon size={40} className="text-slate-400" />
                      );
                    })()}
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {editorSections.find((s) => s.id === activeSection)?.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  This section is coming soon. The full editor with form fields,
                  drag-and-drop, and AI suggestions will be implemented here.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm">
                  <Wrench size={16} />
                  <span>Editor UI coming soon</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Preview */}
        <aside className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto hidden lg:block">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Live Preview
            </h2>
            {/* Mini Preview */}
            <div className="aspect-[8.5/11] bg-white border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4 overflow-hidden">
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
                <FileText size={32} className="mb-2 opacity-50" />
                <span>Preview will appear here</span>
              </div>
            </div>
          </div>

          {/* Template Selector */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
              Template
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {['Modern', 'Classic', 'Creative', 'Minimal'].map((template) => (
                <button
                  key={template}
                  className="aspect-[8.5/11] rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors flex items-center justify-center text-xs text-slate-500"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
