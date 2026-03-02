import type { ResumeData } from '@/types';

export const SAMPLE_DATA: ResumeData = {
  personal: {
    fullName: 'Sarah Chen',
    role: 'Senior Software Engineer',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary:
      'Experienced software engineer with 8+ years building scalable web applications and distributed systems. Passionate about clean architecture and developer experience.',
  },
  experience: [
    {
      id: 1,
      role: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      date: '2021 - Present',
      description:
        'Led development of microservices architecture serving 2M+ users.\nReduced API latency by 40% through caching strategies.',
    },
    {
      id: 2,
      role: 'Software Engineer',
      company: 'StartupXYZ',
      date: '2018 - 2021',
      description:
        'Built real-time data pipeline processing 500K events daily.\nMentored 3 junior engineers and led code review process.',
    },
  ],
  projects: [
    {
      id: 1,
      name: 'Open Source CLI Tool',
      description: 'Developer productivity tool with 2K+ GitHub stars.',
      date: '2023',
    },
  ],
  education: [
    {
      id: 1,
      degree: 'B.S. Computer Science',
      school: 'Stanford University',
      date: '2014 - 2018',
    },
  ],
  skills: ['TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'PostgreSQL'],
};
