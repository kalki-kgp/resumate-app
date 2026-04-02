import type { LucideIcon } from 'lucide-react';

export type CreditPackId = 'starter' | 'growth' | 'power';
export type PaymentMethod = 'upi' | 'card' | 'netbanking';
export type PaymentStep =
  | 'method'
  | 'upi_waiting'
  | 'otp'
  | 'netbank_redirect'
  | 'processing'
  | 'success';

export type CreditPack = {
  id: CreditPackId;
  name: string;
  tagline: string;
  price: number;
  credits: number;
  perCredit: number;
  savingsPct?: number;
  badge?: string;
  featured?: boolean;
  icon: LucideIcon;
  perks: string[];
  useCases: string[];
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: { id: string; full_name: string; email: string; created_at: string };
};
