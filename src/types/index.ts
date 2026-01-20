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
