'use client';

import { Star } from 'lucide-react';
import { useScrollAnimation } from '@/hooks';

export const Testimonials = () => {
  const [ref, isVisible] = useScrollAnimation();
  
  const testimonials = [
    { 
      name: "Sarah Jenkins", 
      role: "Product Manager @ Google", 
      text: "The AI suggestions were surprisingly accurate. I rewrote my entire history in 20 minutes and landed 3 interviews in a week." 
    },
    { 
      name: "David Chen", 
      role: "Software Engineer @ Meta", 
      text: "Finally, a resume builder that understands developer skills. The ATS checker is a lifesaver – passed every screening." 
    },
    { 
      name: "Maya Patel", 
      role: "UX Designer @ Airbnb", 
      text: "The templates are modern and elegant. Recruiters actually complimented my resume layout during interviews!" 
    }
  ];

  const brands = ['Google', 'Spotify', 'Airbnb', 'Netflix', 'Meta', 'Apple'];
  
  return (
    <section className="py-32 relative z-10 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-slate-900/50">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div ref={ref} className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}>
             <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 leading-tight">
               Trusted by professionals at <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">top companies</span>
             </h2>
             <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
               Over 50,000 users have secured interviews at Google, Amazon, and startups worldwide using ResuMates.
             </p>
             <div className="flex flex-wrap gap-4">
               {brands.map((brand, i) => (
                 <span 
                   key={brand} 
                   className={`px-5 py-3 bg-white/70 dark:bg-slate-800/70 rounded-xl font-bold text-slate-400 dark:text-slate-500 border-2 border-white/60 dark:border-slate-700/60 backdrop-blur-sm hover:border-blue-200 dark:hover:border-blue-800 hover:text-slate-600 dark:hover:text-slate-300 transition-all cursor-pointer hover:scale-105 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                   style={{ animationDelay: `${i * 0.1}s` }}
                 >
                   {brand}
                 </span>
               ))}
             </div>
           </div>
           
           <div className="grid gap-6">
             {testimonials.map((t, i) => (
               <div 
                 key={i} 
                 className={`p-8 rounded-3xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-white dark:border-slate-700 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                 style={{ animationDelay: `${0.2 + i * 0.1}s` }}
               >
                 <div className="flex gap-1 text-yellow-400 mb-4">
                   {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                 </div>
                 <p className="text-slate-700 dark:text-slate-300 mb-6 font-medium text-lg leading-relaxed">&quot;{t.text}&quot;</p>
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                     {t.name[0]}
                   </div>
                   <div>
                     <div className="text-base font-bold text-slate-900 dark:text-white">{t.name}</div>
                     <div className="text-sm text-slate-500 dark:text-slate-400">{t.role}</div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
    </section>
  );
};
