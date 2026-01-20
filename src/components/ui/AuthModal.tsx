'use client';

import { useEffect, useState } from 'react';
import { X, Users, Mail, Lock, Github } from 'lucide-react';
import type { AuthModalProps } from '@/types';

export const AuthModal = ({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) => {
  const [mode, setMode] = useState(initialMode);
  
  useEffect(() => { setMode(initialMode); }, [initialMode, isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Darkened Backdrop with strong blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Liquid Glass Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-white dark:border-slate-700 shadow-2xl backdrop-blur-3xl animate-fade-in-up transform transition-all ring-1 ring-white/60 dark:ring-slate-700/60">
        
        {/* Light Source Highlight */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/60 to-transparent dark:from-white/10 pointer-events-none z-10" />

        {/* Animated "Liquid" Blobs behind the glass content */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
           <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-500/40 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
           <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-500/40 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
           <div className="absolute top-[40%] left-[30%] w-32 h-32 bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-2xl animate-pulse-slow" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Modal Header */}
        <div className="relative p-8 pb-0 z-20">
          <div className="flex justify-between items-center mb-6">
            <div className="grid grid-cols-1 grid-rows-1">
              <h3 
                className={`text-2xl font-bold text-slate-900 dark:text-white drop-shadow-sm col-start-1 row-start-1 transition-all duration-500 ease-out ${mode === 'signin' ? 'opacity-100 translate-x-0 blur-none' : 'opacity-0 -translate-x-8 blur-sm pointer-events-none'}`}
              >
                Welcome Back
              </h3>
              <h3 
                className={`text-2xl font-bold text-slate-900 dark:text-white drop-shadow-sm col-start-1 row-start-1 transition-all duration-500 ease-out ${mode === 'signup' ? 'opacity-100 translate-x-0 blur-none' : 'opacity-0 translate-x-8 blur-sm pointer-events-none'}`}
              >
                Create Account
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/40 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Toggle Tabs */}
          <div className="flex p-1.5 bg-white/30 dark:bg-slate-800/50 border border-white/40 dark:border-slate-600 rounded-xl mb-8 shadow-inner relative isolate">
            {/* Animated Slider Background */}
            <div 
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-700 shadow-lg rounded-lg transition-all duration-300 ease-out -z-10 ${mode === 'signin' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`} 
            />
            <button 
              onClick={() => setMode('signin')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors duration-300 ${mode === 'signin' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-colors duration-300 ${mode === 'signup' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 pt-0 relative z-20">
           
           {/* Expanding Full Name Field */}
           <div className={`transition-all duration-300 ease-in-out overflow-hidden ${mode === 'signup' ? 'max-h-24 opacity-100 mb-5' : 'max-h-0 opacity-0 mb-0'}`}>
             <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide ml-1 drop-shadow-sm">Full Name</label>
               <div className="relative group">
                 <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" size={18} />
                 <input type="text" className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/40 dark:bg-slate-800/50 border border-white/50 dark:border-slate-600 focus:bg-white/80 dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-slate-900 dark:text-white shadow-sm" placeholder="John Doe" />
               </div>
             </div>
           </div>
          
          <div className="space-y-1.5 mb-5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide ml-1 drop-shadow-sm">Email Address</label>
            <div className="relative group">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" size={18} />
               <input type="email" className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/40 dark:bg-slate-800/50 border border-white/50 dark:border-slate-600 focus:bg-white/80 dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium text-slate-900 dark:text-white shadow-sm" placeholder="john@example.com" />
            </div>
          </div>
          
          <div className="space-y-1.5 mb-5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide drop-shadow-sm">Password</label>
              <a href="#" className={`text-xs text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-all duration-300 ${mode === 'signin' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>Forgot Password?</a>
            </div>
            <div className="relative group">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors" size={18} />
               <input type="password" className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/40 dark:bg-slate-800/50 border border-white/50 dark:border-slate-600 focus:bg-white/80 dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all font-medium text-slate-900 dark:text-white shadow-sm" placeholder="••••••••" />
            </div>
          </div>

          <button className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 border border-white/20 relative overflow-hidden">
            <span className={`block transition-all duration-300 transform ${mode === 'signin' ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0 absolute inset-0 flex items-center justify-center'}`}>Sign In</span>
            <span className={`block transition-all duration-300 transform ${mode === 'signup' ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 absolute inset-0 flex items-center justify-center'}`}>Create Account</span>
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-500/20 dark:border-slate-400/20"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="px-2 text-slate-600 dark:text-slate-400 font-bold bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded">Or continue with</span></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pb-2">
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all group">
              <div className="w-5 h-5 rounded-full bg-slate-800 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-[10px] group-hover:scale-110 transition-transform">G</div>
              <span className="text-sm font-bold text-slate-800 dark:text-white">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all group">
              <Github size={18} className="text-slate-800 dark:text-white group-hover:scale-110 transition-transform"/>
              <span className="text-sm font-bold text-slate-800 dark:text-white">Github</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
