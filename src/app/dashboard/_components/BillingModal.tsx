'use client';

import { useState } from 'react';
import {
  X,
  CreditCard,
  Check,
  Crown,
  Sparkles,
  Zap,
  FileText,
  Users,
  BarChart3,
  Shield,
} from 'lucide-react';
import type { PlanType } from '@/types';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanType;
}

const plans = [
  {
    id: 'Free' as PlanType,
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '5 resumes',
      'Basic templates',
      'PDF export',
      'ATS optimization',
    ],
    icon: FileText,
    color: 'slate',
  },
  {
    id: 'Pro' as PlanType,
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For serious job seekers',
    features: [
      'Unlimited resumes',
      'Premium templates',
      'AI-powered suggestions',
      'Priority support',
      'Custom branding',
      'Analytics dashboard',
    ],
    icon: Zap,
    color: 'blue',
    popular: true,
  },
  {
    id: 'Enterprise' as PlanType,
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Team management',
      'API access',
      'SSO integration',
      'Dedicated support',
      'Custom integrations',
    ],
    icon: Users,
    color: 'purple',
  },
];

export const BillingModal = ({
  isOpen,
  onClose,
  currentPlan,
}: BillingModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(currentPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-slate-700/60 shadow-2xl backdrop-blur-xl animate-fade-in-up">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Billing & Plans
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Manage your subscription and billing information
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Current Plan Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  <Crown size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Current Plan
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {currentPlan} Plan
                  </p>
                </div>
              </div>
              {currentPlan === 'Free' && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                  <Sparkles size={14} />
                  Upgrade available
                </div>
              )}
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span
              className={`text-sm font-medium ${
                billingCycle === 'monthly'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === 'monthly' ? 'yearly' : 'monthly'
                )
              }
              className="relative w-14 h-7 rounded-full bg-blue-600 transition-colors"
            >
              <div
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0.5'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span
                className={`text-sm font-medium ${
                  billingCycle === 'yearly'
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Yearly
              </span>
              <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold">
                Save 20%
              </span>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-3 gap-4">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;
              const isCurrent = currentPlan === plan.id;
              const yearlyPrice =
                plan.price !== '$0'
                  ? `$${Math.round(parseInt(plan.price.slice(1)) * 12 * 0.8)}`
                  : '$0';

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold">
                      Most Popular
                    </div>
                  )}

                  {isCurrent && (
                    <div className="absolute top-3 right-3">
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      plan.color === 'blue'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                        : plan.color === 'purple'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {plan.description}
                  </p>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                      {billingCycle === 'yearly' ? yearlyPrice : plan.price}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {billingCycle === 'yearly' && plan.price !== '$0'
                        ? '/year'
                        : plan.period}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <Check size={16} className="text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Payment Method */}
          {currentPlan !== 'Free' && (
            <div className="mt-8 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Payment Method
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <CreditCard
                      size={20}
                      className="text-slate-500 dark:text-slate-400"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      •••• •••• •••• 4242
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Expires 12/25
                    </p>
                  </div>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  Update
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Shield size={14} />
            Secure payment powered by Stripe
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
            >
              Cancel
            </button>
            {selectedPlan !== currentPlan && (
              <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all">
                {plans.findIndex((p) => p.id === selectedPlan) >
                plans.findIndex((p) => p.id === currentPlan)
                  ? 'Upgrade Plan'
                  : 'Downgrade Plan'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
