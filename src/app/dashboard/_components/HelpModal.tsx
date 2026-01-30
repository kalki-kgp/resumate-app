'use client';

import { useState } from 'react';
import {
  X,
  Search,
  Book,
  MessageCircle,
  Mail,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  FileText,
  Sparkles,
  Download,
  Palette,
  HelpCircle,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqs = [
  {
    question: 'How do I create a new resume?',
    answer:
      'Click the "New Resume" button in your dashboard, then choose to either upload an existing resume or start from scratch. Our editor will guide you through each section.',
  },
  {
    question: 'What is ATS optimization?',
    answer:
      'ATS (Applicant Tracking System) optimization ensures your resume is formatted correctly to pass through automated resume screening software used by employers. Our AI analyzes your resume and suggests improvements.',
  },
  {
    question: 'Can I export my resume to PDF?',
    answer:
      'Yes! All plans include PDF export. Simply click the "Export" button in the editor and choose your preferred format. Pro users also get access to additional export options.',
  },
  {
    question: 'How does the AI assistant work?',
    answer:
      'Our AI assistant analyzes your resume content and provides suggestions to improve clarity, impact, and ATS compatibility. It can help rewrite bullet points, suggest keywords, and optimize formatting.',
  },
  {
    question: 'Can I use multiple templates?',
    answer:
      'Free users have access to 4 basic templates. Pro users get unlimited access to our entire template library, including premium designs and industry-specific layouts.',
  },
];

const helpCategories = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of creating your first resume',
    icon: Book,
    articles: 5,
  },
  {
    title: 'Resume Editor',
    description: 'Master our powerful resume editing tools',
    icon: FileText,
    articles: 12,
  },
  {
    title: 'AI Features',
    description: 'Get the most out of AI-powered suggestions',
    icon: Sparkles,
    articles: 8,
  },
  {
    title: 'Templates & Design',
    description: 'Customize your resume appearance',
    icon: Palette,
    articles: 6,
  },
  {
    title: 'Export & Sharing',
    description: 'Download and share your resume',
    icon: Download,
    articles: 4,
  },
];

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'help' | 'faq' | 'contact'>('help');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-white/60 dark:border-slate-700/60 shadow-2xl backdrop-blur-xl animate-fade-in-up">
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Help & Support
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {[
              { id: 'help' as const, label: 'Help Center', icon: Book },
              { id: 'faq' as const, label: 'FAQ', icon: HelpCircle },
              { id: 'contact' as const, label: 'Contact Us', icon: MessageCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {activeTab === 'help' && (
            <div className="grid grid-cols-2 gap-4">
              {helpCategories.map((category, i) => {
                const Icon = category.icon;
                return (
                  <button
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                          {category.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {category.description}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                          {category.articles} articles
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="font-medium text-slate-900 dark:text-white pr-4">
                      {faq.question}
                    </span>
                    {expandedFaq === i ? (
                      <ChevronDown size={18} className="text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  <div
                    className={`transition-all duration-200 overflow-hidden ${
                      expandedFaq === i ? 'max-h-40' : 'max-h-0'
                    }`}
                  >
                    <p className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      Live Chat
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Chat with our support team in real-time. Average response
                      time: 2 minutes.
                    </p>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                      Start Chat
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      Email Support
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Send us an email and we&apos;ll get back to you within 24
                      hours.
                    </p>
                    <a
                      href="mailto:support@resumates.com"
                      className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
                    >
                      support@resumates.com
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 flex items-center justify-center flex-shrink-0">
                    <Book size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      Documentation
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Browse our comprehensive documentation and tutorials.
                    </p>
                    <a
                      href="#"
                      className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
                    >
                      View Documentation
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Can&apos;t find what you&apos;re looking for?{' '}
            <button
              onClick={() => setActiveTab('contact')}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Contact us
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
