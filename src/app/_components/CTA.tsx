'use client';

import { Zap, ArrowRight, ChevronRight, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks';
import type { CTAProps } from '@/types';

export const CTA = ({ onOpenAuth }: CTAProps) => {
  const [ref, isVisible] = useScrollAnimation();
  
  return (
    <section className="py-32 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[2.5rem] p-10 md:p-20 text-center text-white shadow-2xl relative overflow-hidden ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* Animated Background Elements */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-5 rounded-full animate-pulse-slow" style={{animationDelay: '0.5s'}}></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm mb-8">
              <Zap size={16} />
              <span>Limited Time Offer</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Ready to build your <br />dream career?
            </h2>
            <p className="text-blue-100 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
              Join thousands of job seekers who are getting hired faster. 
              Try it for free today, no credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <button 
                onClick={() => onOpenAuth('signup')}
                className="group bg-white text-blue-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-white/30 hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>Get Started for Free</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                 onClick={() => onOpenAuth('signin')}
                 className="px-10 py-5 rounded-full font-bold text-lg text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all flex items-center justify-center gap-2"
              >
                <span>View Pricing</span>
                <ChevronRight size={18} />
              </button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
