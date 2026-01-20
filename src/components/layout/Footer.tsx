'use client';

export const Footer = () => (
  <footer className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 relative z-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
        <div className="col-span-2 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">R</div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">ResuMates</span>
          </div>
          <p className="text-base text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            Building the next generation of career tools for the modern workforce. 
            Empowering professionals to land their dream jobs.
          </p>
          <div className="flex gap-3">
            {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
              <a key={social} href="#" className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-110">
                <span className="text-sm font-bold">{social[0]}</span>
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-5 text-sm uppercase tracking-wide">Product</h4>
          <ul className="space-y-3 text-base text-slate-600 dark:text-slate-400">
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Download</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Changelog</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-5 text-sm uppercase tracking-wide">Resources</h4>
          <ul className="space-y-3 text-base text-slate-600 dark:text-slate-400">
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Templates</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Community</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white mb-5 text-sm uppercase tracking-wide">Company</h4>
          <ul className="space-y-3 text-base text-slate-600 dark:text-slate-400">
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</a></li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-500 dark:text-slate-400 text-sm">
          © 2024 ResuMates Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
          <span>Made with</span>
          <span className="text-red-500 animate-pulse">♥</span>
          <span>for job seekers</span>
        </div>
      </div>
    </div>
  </footer>
);
