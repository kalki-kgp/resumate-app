'use client';

import { CreditCard, Check } from 'lucide-react';
import { useScrollAnimation } from '@/hooks';
import type { PricingCardProps } from '@/types';

const PricingCard = ({ tier, price, features, recommended, delay }: PricingCardProps) => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div 
      ref={ref}
      className={`relative p-8 rounded-3xl border-2 transition-all duration-500 hover:-translate-y-2 ${
        recommended 
          ? 'bg-white dark:bg-slate-800 border-blue-600 dark:border-blue-500 shadow-2xl scale-105 z-10' 
          : 'bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-slate-700/60 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600 shadow-lg'
      } ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {recommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{tier}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${price}</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">/month</span>
        </div>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
            <Check size={18} className={`shrink-0 ${recommended ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all shadow-lg ${
        recommended 
          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30' 
          : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
      }`}>
        Choose {tier}
      </button>
    </div>
  );
};

export const Pricing = () => {
  const [ref, isVisible] = useScrollAnimation();
  
  return (
    <section id="pricing" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div ref={ref} className={`text-center mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
           <h2 className="text-base font-bold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3 flex items-center justify-center gap-2">
             <CreditCard size={16} />
             Flexible Pricing
           </h2>
           <p className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
             Invest in your career
           </p>
           <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
             Start for free, upgrade when you land the interview.
           </p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            <PricingCard 
              tier="Free" 
              price="0" 
              features={["1 Resume Template", "Basic AI Writer (5 uses/mo)", "PDF Export (Watermarked)", "Community Support"]}
              delay={0}
            />
            <PricingCard 
              tier="Pro" 
              price="12" 
              features={["All Premium Templates", "Unlimited AI Writer", "ATS Score Checker", "Cover Letter Builder", "Priority Support"]}
              recommended={true}
              delay={0.1}
            />
            <PricingCard 
              tier="Lifetime" 
              price="149" 
              features={["One-time payment", "Everything in Pro", "LinkedIn Profile Review", "Interview Prep Guide", "Private Networking Group"]}
              delay={0.2}
            />
         </div>
      </div>
    </section>
  );
};
