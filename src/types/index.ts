// Global TypeScript types and interfaces

export type Theme = 'light' | 'dark';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export interface NavbarProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  theme: Theme;
  toggleTheme: () => void;
}

export interface HeroProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export interface CTAProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

export interface ThemeToggleProps {
  theme: Theme;
  toggleTheme: () => void;
}

export interface FeatureCardProps {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  description: string;
  delay: number;
  index: number;
}

export interface TemplateCardProps {
  title: string;
  color: string;
  delay: number;
}

export interface PricingCardProps {
  tier: string;
  price: string;
  features: string[];
  recommended?: boolean;
  delay: number;
}

export interface ThreeBackgroundProps {
  theme: Theme;
}

// Dashboard Types
export type DashboardView = 'overview' | 'resumes' | 'jobs' | 'templates';

export interface Resume {
  id: string;
  title: string;
  atsScore: number;
  updatedAt: string;
  status: 'Draft' | 'Analyzed' | 'Published';
}

export interface Job {
  id: string;
  title: string;
  company: string;
  type: 'Remote' | 'Hybrid' | 'On-site';
  match: number;
  posted: string;
  skills: string[];
}

export interface SidebarProps {
  currentView: DashboardView;
  setView: (view: DashboardView) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

export interface ResumeCardProps {
  resume: Resume;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export interface JobCardProps {
  job: Job;
}

export interface ATSScoreProps {
  score: number;
}

export interface ExtractContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export interface DashboardTopbarProps {
  currentView: DashboardView;
  theme: Theme;
  toggleTheme: () => void;
}
