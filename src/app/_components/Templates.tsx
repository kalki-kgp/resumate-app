'use client';

import { LayoutTemplate, Star, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks';
import type { TemplateCardProps } from '@/types';

const TemplateCard = ({ title, color, delay }: TemplateCardProps) => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div 
      ref={ref}
      className={`group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={`h-80 w-full bg-gradient-to-br ${color} relative p-6`}>
        {/* Abstract Resume Representation */}
        <div className="bg-white/90 dark:bg-slate-900/90 w-full h-full rounded-lg shadow-inner p-4 space-y-3 transform group-hover:scale-[1.02] transition-transform duration-500">
           <div className="flex gap-3 items-center mb-6">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="space-y-2">
                 <div className="w-24 h-3 bg-slate-800 dark:bg-slate-400 rounded"></div>
                 <div className="w-16 h-2 bg-slate-400 dark:bg-slate-600 rounded"></div>
              </div>
           </div>
           <div className="space-y-2">
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded"></div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded"></div>
              <div className="w-2/3 h-2 bg-slate-100 dark:bg-slate-700 rounded"></div>
           </div>
           <div className="mt-8 space-y-4">
              <div className="w-20 h-3 bg-slate-300 dark:bg-slate-500 rounded mb-2"></div>
              <div className="flex gap-2">
                 <div className="w-1 h-8 bg-blue-400 rounded"></div>
                 <div className="flex-1 space-y-2">
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                    <div className="w-3/4 h-2 bg-slate-100 dark:bg-slate-700 rounded"></div>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
           <button className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
             Use Template
           </button>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 p-4 border-t border-slate-100 dark:border-slate-700">
        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{title}</h4>
        <div className="flex items-center gap-1 mt-1">
          <Star size={14} className="text-yellow-400 fill-current" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">4.9/5 from 2k users</span>
        </div>
      </div>
    </div>
  );
};

export const Templates = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section id="templates" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`flex flex-col md:flex-row justify-between items-end mb-16 gap-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
           <div className="max-w-2xl">
              <h2 className="text-base font-bold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3 flex items-center gap-2">
                <LayoutTemplate size={16} />
                Professional Designs
              </h2>
              <p className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                 Stand out with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">award-winning templates</span>
              </p>
           </div>
           <button className="hidden md:flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              View all 20+ templates <ArrowRight size={18} />
           </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <TemplateCard title="Modern Tech" color="from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600" delay={0} />
           <TemplateCard title="Creative Studio" color="from-purple-50 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/40" delay={0.1} />
           <TemplateCard title="Executive Pro" color="from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40" delay={0.2} />
           <TemplateCard title="Minimalist" color="from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700" delay={0.3} />
        </div>
        
        <div className="mt-12 text-center md:hidden">
           <button className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-2">
              View all 20+ templates <ArrowRight size={18} />
           </button>
        </div>
      </div>
    </section>
  );
};
