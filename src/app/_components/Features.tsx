'use client';

import { Sparkles, FileText, Users, ChevronRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks';
import type { FeatureCardProps } from '@/types';

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => {
  const [ref, isVisible] = useScrollAnimation();
  
  return (
    <div 
      ref={ref}
      className={`group p-8 rounded-3xl bg-white/70 dark:bg-slate-800/70 border-2 border-white/60 dark:border-slate-700/60 backdrop-blur-md hover:bg-white dark:hover:bg-slate-800 hover:border-blue-100 dark:hover:border-blue-800 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-3 cursor-pointer ${
        isVisible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-blue-500/30">
        <Icon size={32} />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
        {description}
      </p>
      <div className="mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Learn more</span>
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export const Features = () => {
  const [ref, isVisible] = useScrollAnimation();
  
  return (
    <section id="features" className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-20 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-base font-bold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3 flex items-center justify-center gap-2">
            <Sparkles size={16} />
            Capabilities
          </h2>
          <p className="mt-2 text-4xl md:text-5xl leading-tight font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            Everything you need to land the job
          </p>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Powered by cutting-edge AI and designed for modern job seekers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Sparkles}
            title="AI Writer Assistant"
            description="Generate compelling professional summaries and bullet points tailored to your role with a single click using our fine-tuned LLM."
            delay={0}
            index={0}
          />
          <FeatureCard 
            icon={FileText}
            title="ATS Optimization"
            description="Our real-time checker ensures your resume parses perfectly by Applicant Tracking Systems used by 99% of Fortune 500s."
            delay={0.1}
            index={1}
          />
          <FeatureCard 
            icon={Users}
            title="Recruiter Matching"
            description="Connect directly with hiring managers looking for your specific skill set through our integrated networking dashboard."
            delay={0.2}
            index={2}
          />
        </div>
      </div>
    </section>
  );
};
