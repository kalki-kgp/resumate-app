import {
  LayoutGrid,
  FolderOpen,
  FileText,
  Mail,
  Target,
  Sparkles,
  Compass,
  Bot,
  WandSparkles,
} from 'lucide-react';
import type { ResumeData, TemplateType } from '@/types';
import type { DashboardSection, ExampleJob, OnboardingStep } from './dashboard-types';

export const defaultOnboardingSteps: OnboardingStep[] = [
  {
    index: 0,
    title: 'Upload Resume',
    description: 'Import your existing resume for AI-powered optimization',
    action: 'Upload Resume',
  },
  {
    index: 1,
    title: 'AI Analysis',
    description: 'Get instant ATS score and AI-powered improvement suggestions',
    action: 'Analyze Resume',
  },
  {
    index: 2,
    title: 'Find Jobs',
    description: 'Discover jobs that match your skills and experience',
    action: 'Browse Jobs',
  },
  {
    index: 3,
    title: 'Apply & Track',
    description: 'Apply with tailored resumes and track your applications',
    action: 'Start Applying',
  },
];

export const exampleJobs: ExampleJob[] = [
  { id: 'j1', title: 'Senior Product Designer', company: 'Notion', match: 93, type: 'Remote' },
  { id: 'j2', title: 'Design Systems Lead', company: 'Airbnb', match: 89, type: 'Hybrid' },
  { id: 'j3', title: 'Principal UX Designer', company: 'Stripe', match: 86, type: 'Remote' },
];

export const templateCards: { id: TemplateType; name: string; tone: string }[] = [
  { id: 'modern', name: 'Modern', tone: 'Balanced hierarchy for product and tech roles.' },
  { id: 'classic', name: 'Classic', tone: 'Sharper structure for leadership and consulting applications.' },
  { id: 'creative', name: 'Creative', tone: 'Expressive style for design and brand-facing positions.' },
  { id: 'minimal', name: 'Minimal', tone: 'Compact high-signal format for recruiter scans.' },
];

export const templatePreviewData: ResumeData = {
  personal: {
    fullName: 'Alex Morgan',
    role: 'Senior Product Designer',
    email: 'alex@resumate.ai',
    phone: '+1 (555) 908-1102',
    location: 'San Francisco, CA',
    summary: 'Product designer focused on shipping user-centered, measurable outcomes.',
  },
  experience: [
    {
      id: 1,
      role: 'Senior Product Designer',
      company: 'Figma',
      date: '2021 - Present',
      description: 'Led onboarding redesign and improved activation metrics by 24%.',
    },
    {
      id: 2,
      role: 'Product Designer',
      company: 'Notion',
      date: '2018 - 2021',
      description: 'Built design systems and workflow features for distributed teams.',
    },
  ],
  projects: [],
  education: [
    {
      id: 1,
      degree: 'B.S. in HCI',
      school: 'UC San Diego',
      date: '2014 - 2018',
    },
  ],
  skills: ['Figma', 'Product Strategy', 'UX Research', 'Design Systems', 'Prototyping'],
};

export const sidebarPrimaryItems = [
  { key: 'overview' as const, label: 'Overview', icon: LayoutGrid },
  { key: 'resumes' as const, label: 'My Resumes', icon: FolderOpen },
  { key: 'cover-letters' as const, label: 'Cover Letters', icon: Mail },
  { key: 'templates' as const, label: 'Templates Library', icon: FileText },
  { key: 'analytics' as const, label: 'Analytics', icon: Target },
];

export const sidebarAiItems: { key: DashboardSection; label: string; icon: typeof Sparkles; badge?: string }[] = [
  { key: 'ai-insights', label: 'AI Insights', icon: Sparkles },
  { key: 'job-match', label: 'Job Match', icon: Compass },
  { key: 'ai-assistant', label: 'AI Assistant', icon: Bot },
  { key: 'ai-experiments', label: 'AI Experiments', icon: WandSparkles, badge: 'Beta' },
];

export const getSectionHeading = (
  section: DashboardSection,
  displayName: string
): { title: string; subtitle: string } => {
  const headings: Record<DashboardSection, { title: string; subtitle: string }> = {
    overview: {
      title: `Good Morning, ${displayName || 'there'}!`,
      subtitle: "A new day, a new opportunity. Let's create something amazing together.",
    },
    resumes: {
      title: 'My Resumes',
      subtitle: 'Browse uploaded resumes, analysis status, and select one to inspect.',
    },
    'cover-letters': {
      title: 'Cover Letters',
      subtitle: 'View and manage your saved cover letters.',
    },
    templates: {
      title: 'Templates Library',
      subtitle: 'Pick a visual direction and continue in the editor.',
    },
    analytics: {
      title: 'Analytics',
      subtitle: 'Track ATS quality, section health, and high-impact fixes.',
    },
    'ai-insights': {
      title: 'AI Insights',
      subtitle: 'Strengths, gaps, and actionable suggestions from analysis.',
    },
    'job-match': {
      title: 'Job Match',
      subtitle: 'Role alignment suggestions generated from your selected resume.',
    },
    'ai-assistant': {
      title: 'AI Assistant',
      subtitle: 'Use guided prompts and rewritten bullets to speed up edits.',
    },
    'ai-experiments': {
      title: 'AI Experiments',
      subtitle: 'Preview beta workflows and advanced optimization tools.',
    },
    faq: {
      title: 'FAQ',
      subtitle: 'Quick answers for common resume and ATS questions.',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage preferences for dashboard behavior and AI output.',
    },
  };
  return headings[section];
};
