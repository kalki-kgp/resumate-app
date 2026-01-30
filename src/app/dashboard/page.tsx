'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/hooks';
import type { DashboardView, Resume } from '@/types';
import {
  Sidebar,
  DashboardTopbar,
  ExtractContentModal,
  DevToggle,
  ProfileModal,
  SettingsModal,
  BillingModal,
  HelpModal,
} from './_components';
import type { UserProfile } from '@/types';

// Lazy load heavy components
const DashboardBackground = dynamic(
  () => import('./_components/DashboardBackground').then(mod => ({ default: mod.DashboardBackground })),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 -z-10 bg-slate-50 dark:bg-slate-900" />
  }
);

const OnboardingWizard = dynamic(
  () => import('./_components/OnboardingWizard').then(mod => ({ default: mod.OnboardingWizard }))
);

const OverviewView = dynamic(() => import('./_components/views/OverviewView').then(mod => ({ default: mod.OverviewView })));
const ResumesView = dynamic(() => import('./_components/views/ResumesView').then(mod => ({ default: mod.ResumesView })));
const JobsView = dynamic(() => import('./_components/views/JobsView').then(mod => ({ default: mod.JobsView })));
const TemplatesView = dynamic(() => import('./_components/views/TemplatesView').then(mod => ({ default: mod.TemplatesView })));

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

  // Modal states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

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

  // Onboarding state - will be replaced with API/auth state later
  // When backend is ready, this should come from user profile/database
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

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

  // Onboarding handlers
  const handleOnboardingComplete = useCallback(() => {
    setIsOnboardingComplete(true);
    // TODO: Save to backend when available
    // api.updateUserProfile({ onboardingComplete: true });
  }, []);

  const handleOnboardingStepAction = useCallback((stepId: number) => {
    // Handle each step's action
    // These will trigger actual actions when backend is ready
    switch (stepId) {
      case 1:
        // Upload Resume - could open extract modal
        console.log('Step 1: Upload Resume action');
        break;
      case 2:
        // AI Analysis
        console.log('Step 2: AI Analysis action');
        break;
      case 3:
        // Find Jobs
        console.log('Step 3: Find Jobs action');
        break;
      case 4:
        // Apply & Track
        console.log('Step 4: Apply & Track action');
        break;
    }
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

      {/* Dev Toggle - Remove in production */}
      <DevToggle
        isOnboardingComplete={isOnboardingComplete}
        onToggle={() => setIsOnboardingComplete(!isOnboardingComplete)}
      />

      {/* Conditional Rendering: Onboarding vs Dashboard */}
      {!isOnboardingComplete ? (
        // Onboarding Wizard (Full Screen)
        <div className="flex-1 relative z-10">
          <OnboardingWizard
            onComplete={handleOnboardingComplete}
            onStepAction={handleOnboardingStepAction}
          />
        </div>
      ) : (
        // Main Dashboard
        <>
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
              onLogout={handleLogout}
              onOpenProfile={() => setIsProfileOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenBilling={() => setIsBillingOpen(true)}
              onOpenHelp={() => setIsHelpOpen(true)}
            />

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-8">{renderView()}</div>
          </div>
        </>
      )}

      {/* Modals */}
      <ExtractContentModal
        isOpen={isExtractOpen}
        onClose={() => setIsExtractOpen(false)}
        onComplete={handleExtractionComplete}
      />
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={mockUser}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <BillingModal
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
        currentPlan={mockUser.plan}
      />
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
