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
  onLogout: () => void;
}

// User Profile Types
export type PlanType = 'Free' | 'Pro' | 'Enterprise';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string | null;
  memberSince: string;
  plan: PlanType;
  resumesUsed: number;
  resumesLimit: number;
}

export interface UserProfileDropdownProps {
  theme: Theme;
  toggleTheme: () => void;
  onLogout: () => void;
}

// Onboarding Types
export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  action: string;
  completed: boolean;
}

export interface OnboardingWizardProps {
  onComplete: () => void;
  onStepAction: (stepId: number) => void;
}

export interface DevToggleProps {
  isOnboardingComplete: boolean;
  onToggle: () => void;
}

// Editor Types
export interface PersonalInfo {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  date: string;
  description: string;
}

export interface Education {
  id: number;
  degree: string;
  school: string;
  date: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  date: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  skills: string[];
}

export type TemplateType = 'modern' | 'classic' | 'creative' | 'minimal';

// API Response Types for Resume Extraction & Fill
export interface ExtractedDataResponse {
  resume_id: string;
  extracted_data: Record<string, unknown> | null;
}

export interface FillTemplateResponse {
  resume_id: string;
  data: ResumeData;
}
