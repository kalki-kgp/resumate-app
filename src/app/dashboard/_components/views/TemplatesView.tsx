'use client';

import { LayoutTemplate } from 'lucide-react';

export const TemplatesView = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400">
      <LayoutTemplate size={64} className="mb-4 opacity-50" />
      <h3 className="text-xl font-bold">Template Gallery</h3>
      <p>Coming soon...</p>
    </div>
  );
};
