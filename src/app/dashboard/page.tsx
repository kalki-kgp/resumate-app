'use client';

import { useState, useCallback } from 'react';
import { useTheme } from '@/hooks';
import type { DashboardView, Resume } from '@/types';
import {
  DashboardBackground,
  Sidebar,
  DashboardTopbar,
  ExtractContentModal,
  OverviewView,
  ResumesView,
  JobsView,
  TemplatesView,
} from './_components';

// Mock data - will be replaced with API data later
const mockResumes: Resume[] = [
  {
    id: '1',
    title: 'Software Engineer Resume',
    atsScore: 85,
    updatedAt: '1/20/2026',
    status: 'Analyzed',
  },
  {
    id: '2',
    title: 'Product Manager CV',
    atsScore: 72,
    updatedAt: '1/18/2026',
    status: 'Draft',
  },
  {
    id: '3',
    title: 'Frontend Developer',
    atsScore: 45,
    updatedAt: '1/15/2026',
    status: 'Draft',
  },
];

export default function DashboardPage() {
  const [theme, toggleTheme] = useTheme();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>(mockResumes);
  const [isExtractOpen, setIsExtractOpen] = useState(false);
  const [loading] = useState(false);

  const handleCreateNew = useCallback(() => {
    const newResume: Resume = {
      id: `${Date.now()}`,
      title: 'Untitled Resume',
      atsScore: 15,
      updatedAt: new Date().toLocaleDateString(),
      status: 'Draft',
    };
    setResumes((prev) => [newResume, ...prev]);
    setCurrentView('resumes');
  }, []);

  const handleExtractionComplete = useCallback(() => {
    const importedResume: Resume = {
      id: `${Date.now()}`,
      title: 'Imported Resume (AI Optimized)',
      atsScore: Math.floor(Math.random() * 20) + 75,
      updatedAt: new Date().toLocaleDateString(),
      status: 'Analyzed',
    };
    setResumes((prev) => [importedResume, ...prev]);
    setCurrentView('resumes');
  }, []);

  const handleDeleteResume = useCallback((id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleEditResume = useCallback((id: string) => {
    // TODO: Navigate to resume editor
    console.log('Edit resume:', id);
  }, []);

  const handleLogout = useCallback(() => {
    // TODO: Implement logout
    window.location.href = '/';
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return (
          <OverviewView
            resumes={resumes}
            loading={loading}
            onExtractOpen={() => setIsExtractOpen(true)}
            onCreateNew={handleCreateNew}
            onDeleteResume={handleDeleteResume}
            onEditResume={handleEditResume}
          />
        );
      case 'resumes':
        return (
          <ResumesView
            resumes={resumes}
            loading={loading}
            onExtractOpen={() => setIsExtractOpen(true)}
            onCreateNew={handleCreateNew}
            onDeleteResume={handleDeleteResume}
            onEditResume={handleEditResume}
          />
        );
      case 'jobs':
        return <JobsView />;
      case 'templates':
        return <TemplatesView />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`h-screen flex overflow-hidden font-sans ${
        theme === 'dark'
          ? 'dark bg-slate-900 text-white'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      <DashboardBackground theme={theme} />

      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setView={setCurrentView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        {/* Topbar */}
        <DashboardTopbar
          currentView={currentView}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8">{renderView()}</div>
      </div>

      {/* Modals */}
      <ExtractContentModal
        isOpen={isExtractOpen}
        onClose={() => setIsExtractOpen(false)}
        onComplete={handleExtractionComplete}
      />
    </div>
  );
}
