'use client';

import { JobCard } from '../JobCard';
import type { Job } from '@/types';

// Mock data - will be replaced with API data later
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Vercel',
    type: 'Remote',
    match: 98,
    posted: '2 hours ago',
    skills: ['React', 'TypeScript', 'Tailwind'],
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Linear',
    type: 'Hybrid',
    match: 94,
    posted: '5 hours ago',
    skills: ['Figma', 'Design Systems', 'Prototyping'],
  },
  {
    id: '3',
    title: 'Software Engineer II',
    company: 'Netflix',
    type: 'Remote',
    match: 89,
    posted: '1 day ago',
    skills: ['React', 'Node.js', 'GraphQL'],
  },
  {
    id: '4',
    title: 'UX Engineer',
    company: 'Stripe',
    type: 'On-site',
    match: 85,
    posted: '2 days ago',
    skills: ['React', 'CSS', 'Animation'],
  },
];

export const JobsView = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Recommended for You
        </h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
            Remote
          </span>
          <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
            Full-time
          </span>
        </div>
      </div>
      {mockJobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
