'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { NavbarProps } from '@/types';

export const Navbar = ({ onOpenAuth, theme, toggleTheme }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 ${
      scrolled 
        ? 'border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm' 
        : 'border-b border-white/10 dark:border-slate-800/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all group-hover:scale-105">
              R
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">ResuMates</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 transition-all hover:bg-blue-50 dark:hover:bg-slate-800">Features</a>
              <a href="#templates" className="hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 transition-all hover:bg-blue-50 dark:hover:bg-slate-800">Templates</a>
              <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 transition-all hover:bg-blue-50 dark:hover:bg-slate-800">Pricing</a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
             <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
             <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
             <button 
                onClick={() => onOpenAuth('signin')}
                className="text-slate-600 dark:text-slate-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
             >
               Log In
             </button>
             <button 
                onClick={() => onOpenAuth('signup')}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 hover:scale-105 flex items-center gap-2"
             >
               Get Started
               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          <div className="-mr-2 flex items-center gap-3 md:hidden">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <a href="#features" className="block px-3 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">Features</a>
             <a href="#templates" className="block px-3 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">Templates</a>
             <a href="#pricing" className="block px-3 py-3 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 transition-colors">Pricing</a>
             <div className="pt-4 flex flex-col gap-3 px-3">
                <button onClick={() => onOpenAuth('signin')} className="w-full text-center py-3 font-medium text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Log In</button>
                <button onClick={() => onOpenAuth('signup')} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium shadow-lg shadow-blue-500/30">Get Started</button>
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};
