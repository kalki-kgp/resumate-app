'use client';

import { Sparkles, ArrowRight, CheckCircle, Shield, TrendingUp, Users, Zap, ChevronRight } from 'lucide-react';
import type { HeroProps } from '@/types';

export const Hero = ({ onOpenAuth }: HeroProps) => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-8 animate-bounce-subtle hover:scale-105 transition-transform cursor-pointer">
          <Sparkles size={16} className="animate-pulse" />
          <span>v2.0 is now live with AI Writer</span>
          <ChevronRight size={14} />
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-tight animate-fade-in-up">
          Craft the resume that <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient">
            gets you hired.
          </span>
        </h1>
        
        <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          Our AI-powered desktop app builds ATS-friendly resumes in minutes. 
          Stop wrestling with formatting and start interviewing.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <button 
            onClick={() => onOpenAuth('signup')}
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-full text-lg font-semibold shadow-2xl shadow-blue-500/40 hover:shadow-blue-600/50 hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            <span>Download for Mac/Windows</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => onOpenAuth('signin')}
            className="group px-10 py-5 rounded-full text-lg font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
          >
            <span>View Web Demo</span>
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
          </button>
        </div>

        {/* Enhanced Hero Image */}
        <div className="relative max-w-6xl mx-auto mt-16 perspective-1000 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-3xl -z-10 animate-pulse-slow"></div>
          <div className="relative rounded-3xl bg-white/50 dark:bg-slate-800/50 border-2 border-white/60 dark:border-slate-700 shadow-2xl backdrop-blur-xl p-4 md:p-8 transform hover:scale-[1.02] transition-all duration-700 ease-out group">
             {/* Window Controls */}
             <div className="flex items-center gap-4 mb-6 border-b border-slate-200/50 dark:border-slate-700/50 pb-4">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400 group-hover:bg-red-500 transition-colors"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-400 group-hover:bg-yellow-500 transition-colors"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400 group-hover:bg-green-500 transition-colors"></div>
                </div>
                <div className="h-2 w-48 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-full"></div>
             </div>
             
             <div className="grid grid-cols-12 gap-6 text-left">
                {/* Sidebar */}
                <div className="col-span-12 md:col-span-4 space-y-4">
                   <div className="h-32 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-200 dark:hover:border-blue-800 transition-all hover:shadow-lg group/card">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl mb-3 flex items-center justify-center group-hover/card:scale-110 transition-transform">
                         <Users className="text-blue-600 dark:text-blue-400" size={20}/>
                      </div>
                      <div className="h-2 w-24 bg-slate-300 dark:bg-slate-600 rounded-full mb-2 animate-pulse"></div>
                      <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
                   </div>
                   <div className="h-32 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-lg group/card">
                       <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl mb-3 flex items-center justify-center group-hover/card:scale-110 transition-transform">
                         <Sparkles className="text-indigo-600 dark:text-indigo-400" size={20}/>
                      </div>
                      <div className="h-2 w-24 bg-slate-300 dark:bg-slate-600 rounded-full mb-2 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                   </div>
                   <div className="h-32 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 hover:border-purple-200 dark:hover:border-purple-800 transition-all hover:shadow-lg group/card">
                       <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl mb-3 flex items-center justify-center group-hover/card:scale-110 transition-transform">
                         <Zap className="text-purple-600 dark:text-purple-400" size={20}/>
                      </div>
                      <div className="h-2 w-24 bg-slate-300 dark:bg-slate-600 rounded-full mb-2 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      <div className="h-2 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                   </div>
                </div>

                {/* Main Content */}
                <div className="col-span-12 md:col-span-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border-2 border-slate-100 dark:border-slate-800 p-6 sm:p-10 hover:shadow-2xl transition-shadow">
                   <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="h-7 w-52 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-600 dark:to-slate-500 rounded-lg mb-3"></div>
                        <div className="h-4 w-40 bg-gradient-to-r from-blue-500 to-indigo-500 rounded"></div>
                      </div>
                      <div className="h-20 w-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700"></div>
                   </div>
                   <div className="space-y-3 mb-10">
                      <div className="h-2.5 w-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-full"></div>
                      <div className="h-2.5 w-full bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-full"></div>
                      <div className="h-2.5 w-4/5 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 rounded-full"></div>
                   </div>
                   <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-36 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-600 dark:to-slate-500 rounded"></div>
                        <div className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded text-xs">
                          <Sparkles size={10} className="inline text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      {[1,2,3].map(i => (
                         <div key={i} className="flex gap-4 group/item hover:bg-slate-50 dark:hover:bg-slate-800 p-3 -mx-3 rounded-lg transition-colors">
                            <div className="w-1.5 h-full bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full group-hover/item:from-blue-500 group-hover/item:to-indigo-500 transition-colors"></div>
                            <div className="flex-1 space-y-2">
                               <div className="h-3.5 w-44 bg-slate-800 dark:bg-slate-500 rounded"></div>
                               <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded"></div>
                               <div className="h-2 w-5/6 bg-slate-50 dark:bg-slate-800 rounded"></div>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          {/* Floating Stats */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4 flex-wrap justify-center px-4">
            {[
              { icon: CheckCircle, text: "ATS Optimized", color: "green" },
              { icon: Shield, text: "100% Private", color: "blue" },
              { icon: TrendingUp, text: "50K+ Users", color: "purple" }
            ].map((stat, i) => (
              <div key={i} className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-${stat.color}-100 dark:border-slate-700 animate-fade-in-up hover:scale-105 transition-transform cursor-pointer`} style={{animationDelay: `${0.4 + i * 0.1}s`}}>
                <stat.icon size={16} className={`text-${stat.color}-600 dark:text-${stat.color}-400`} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stat.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
