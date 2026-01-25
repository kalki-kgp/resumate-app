'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks';
import type { ResumeData, TemplateType } from '@/types';
import {
  ArrowLeft,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Download,
  Save,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  Sparkles,
  Palette,
  Type,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  EditorBackground,
  InputGroup,
  InputField,
  TemplatePreview,
  ModernPreview,
  ClassicPreview,
  CreativePreview,
  MinimalPreview,
} from './_components';

// Initial sample data
const INITIAL_DATA: ResumeData = {
  personal: {
    fullName: 'Alex Morgan',
    role: 'Senior Product Designer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 0123-4567',
    location: 'San Francisco, CA',
    summary:
      'Creative and detail-oriented Product Designer with 5+ years of experience in building user-centric digital products. Proficient in UI/UX design, prototyping, and design systems.',
  },
  experience: [
    {
      id: 1,
      role: 'Senior UX Designer',
      company: 'TechFlow Inc.',
      date: '2021 - Present',
      description:
        'Leading the design system initiative and managing a team of 3 designers. Increased user engagement by 40% through a complete dashboard redesign.',
    },
    {
      id: 2,
      role: 'Product Designer',
      company: 'StartUp Hero',
      date: '2018 - 2021',
      description:
        'Collaborated with cross-functional teams to launch 3 major features. Conducted user research and usability testing to iterate on product designs.',
    },
  ],
  education: [
    {
      id: 1,
      degree: 'Master of Design',
      school: 'California College of the Arts',
      date: '2016 - 2018',
    },
  ],
  skills: [
    'Figma',
    'React',
    'Design Systems',
    'Prototyping',
    'User Research',
    'Adobe CC',
  ],
};

const TEMPLATES: { id: TemplateType; name: string; color: string }[] = [
  { id: 'modern', name: 'Modern', color: 'bg-blue-500' },
  { id: 'classic', name: 'Classic', color: 'bg-slate-600' },
  { id: 'creative', name: 'Creative', color: 'bg-purple-500' },
  { id: 'minimal', name: 'Minimal', color: 'bg-slate-300' },
];

export default function EditorPage() {
  const router = useRouter();
  const [theme] = useTheme();
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [zoom, setZoom] = useState(0.7);
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update personal info
  const updatePersonal = (
    field: keyof typeof data.personal,
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  // Update experience
  const updateExperience = (
    id: number,
    field: keyof (typeof data.experience)[0],
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((job) =>
        job.id === id ? { ...job, [field]: value } : job
      ),
    }));
  };

  // Add experience
  const addExperience = () => {
    const newId = Math.max(...data.experience.map((e) => e.id), 0) + 1;
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: newId,
          role: '',
          company: '',
          date: '',
          description: '',
        },
      ],
    }));
  };

  // Delete experience
  const deleteExperience = (id: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((job) => job.id !== id),
    }));
  };

  // Update education
  const updateEducation = (
    id: number,
    field: keyof (typeof data.education)[0],
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  // Add education
  const addEducation = () => {
    const newId = Math.max(...data.education.map((e) => e.id), 0) + 1;
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: newId,
          degree: '',
          school: '',
          date: '',
        },
      ],
    }));
  };

  // Delete education
  const deleteEducation = (id: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    // TODO: Save to backend
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  // Render the selected template preview at full scale
  const renderLivePreview = () => {
    const PreviewComponent = {
      modern: ModernPreview,
      classic: ClassicPreview,
      creative: CreativePreview,
      minimal: MinimalPreview,
    }[template];

    return <PreviewComponent data={data} scale={0.45} />;
  };

  return (
    <div
      className={`h-screen flex overflow-hidden font-sans ${
        theme === 'dark'
          ? 'dark bg-slate-900 text-white'
          : 'bg-slate-100 text-slate-900'
      }`}
    >
      <EditorBackground theme={theme} />

      {/* Left Sidebar - Input Forms */}
      <aside className="w-[380px] flex-shrink-0 flex flex-col h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-r border-white/50 dark:border-slate-800 z-20">
        {/* Header */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/50 dark:border-slate-800">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 -ml-1 rounded-full hover:bg-white/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            <span className="font-bold text-slate-800 dark:text-white">
              Resume Editor
            </span>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {saving ? (
                <span className="animate-spin">
                  <Save size={14} />
                </span>
              ) : (
                <Save size={14} />
              )}
              Save
            </button>
          </div>
        </div>

        {/* Scrollable Form Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Personal Info */}
          <InputGroup
            title="Personal Details"
            icon={User}
            isOpen={activeSection === 'personal'}
            onToggle={() =>
              setActiveSection(
                activeSection === 'personal' ? null : 'personal'
              )
            }
          >
            <InputField
              label="Full Name"
              value={data.personal.fullName}
              onChange={(v) => updatePersonal('fullName', v)}
            />
            <InputField
              label="Job Title"
              value={data.personal.role}
              onChange={(v) => updatePersonal('role', v)}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Email"
                value={data.personal.email}
                onChange={(v) => updatePersonal('email', v)}
                type="email"
              />
              <InputField
                label="Phone"
                value={data.personal.phone}
                onChange={(v) => updatePersonal('phone', v)}
                type="tel"
              />
            </div>
            <InputField
              label="Location"
              value={data.personal.location}
              onChange={(v) => updatePersonal('location', v)}
            />
            <InputField
              label="Professional Summary"
              value={data.personal.summary}
              onChange={(v) => updatePersonal('summary', v)}
              multiline
            />
          </InputGroup>

          {/* Experience */}
          <InputGroup
            title="Work Experience"
            icon={Briefcase}
            isOpen={activeSection === 'experience'}
            onToggle={() =>
              setActiveSection(
                activeSection === 'experience' ? null : 'experience'
              )
            }
          >
            {data.experience.map((job, i) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-3 relative group"
              >
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300 dark:text-slate-600">
                    #{i + 1}
                  </span>
                  {data.experience.length > 1 && (
                    <button
                      onClick={() => deleteExperience(job.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <InputField
                    label="Role"
                    value={job.role}
                    onChange={(v) => updateExperience(job.id, 'role', v)}
                  />
                  <InputField
                    label="Company"
                    value={job.company}
                    onChange={(v) => updateExperience(job.id, 'company', v)}
                  />
                  <InputField
                    label="Date Range"
                    value={job.date}
                    onChange={(v) => updateExperience(job.id, 'date', v)}
                    placeholder="e.g. 2020 - Present"
                  />
                  <InputField
                    label="Description"
                    value={job.description}
                    onChange={(v) => updateExperience(job.id, 'description', v)}
                    multiline
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 font-bold text-xs hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Position
            </button>
          </InputGroup>

          {/* Education */}
          <InputGroup
            title="Education"
            icon={GraduationCap}
            isOpen={activeSection === 'education'}
            onToggle={() =>
              setActiveSection(
                activeSection === 'education' ? null : 'education'
              )
            }
          >
            {data.education.map((edu, i) => (
              <div
                key={edu.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-3 relative group"
              >
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300 dark:text-slate-600">
                    #{i + 1}
                  </span>
                  {data.education.length > 1 && (
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <InputField
                    label="Degree"
                    value={edu.degree}
                    onChange={(v) => updateEducation(edu.id, 'degree', v)}
                  />
                  <InputField
                    label="School"
                    value={edu.school}
                    onChange={(v) => updateEducation(edu.id, 'school', v)}
                  />
                  <InputField
                    label="Date Range"
                    value={edu.date}
                    onChange={(v) => updateEducation(edu.id, 'date', v)}
                    placeholder="e.g. 2016 - 2020"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 font-bold text-xs hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Education
            </button>
          </InputGroup>

          {/* Skills */}
          <InputGroup
            title="Skills"
            icon={Wrench}
            isOpen={activeSection === 'skills'}
            onToggle={() =>
              setActiveSection(activeSection === 'skills' ? null : 'skills')
            }
          >
            <textarea
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all text-sm h-32 resize-y text-slate-800 dark:text-slate-200"
              value={data.skills.join(', ')}
              onChange={(e) =>
                setData({
                  ...data,
                  skills: e.target.value.split(',').map((s) => s.trim()),
                })
              }
            />
            <p className="text-[10px] text-slate-400 mt-1 ml-1">
              Separate skills with commas
            </p>
          </InputGroup>
        </div>

        {/* AI Assistant Card */}
        <div className="p-4 border-t border-white/50 dark:border-slate-800">
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-purple-700 dark:text-purple-300">
                AI Assistant
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Get AI-powered suggestions to improve your content.
            </p>
            <button className="w-full py-2 px-4 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors">
              Get Suggestions
            </button>
          </div>
        </div>
      </aside>

      {/* Center - Live Preview */}
      <main className="flex-1 h-full relative flex flex-col items-center justify-center bg-slate-200/50 dark:bg-slate-950/50 overflow-hidden">
        {/* Toolbar */}
        <div className="absolute top-6 flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full px-4 py-2 shadow-lg z-30 border border-white/50 dark:border-slate-700">
          <button
            onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400 transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono font-bold w-12 text-center text-slate-600 dark:text-slate-400">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(1.2, zoom + 0.1))}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-400 transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-2" />
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors">
            <Download size={14} /> Export PDF
          </button>
        </div>

        {/* Paper Container */}
        <div
          className="bg-white shadow-2xl transition-transform duration-200 ease-out origin-center rounded-sm overflow-hidden"
          style={{
            transform: `scale(${zoom})`,
          }}
        >
          {renderLivePreview()}
        </div>
      </main>

      {/* Right Sidebar - Template Drawer */}
      <aside
        className={`fixed right-0 top-0 h-full bg-slate-900 shadow-2xl z-50 transition-all duration-500 ease-in-out border-l border-slate-700 flex flex-col ${
          drawerOpen ? 'w-80' : 'w-16'
        }`}
      >
        {/* Icon Strip */}
        <div className="flex-shrink-0 w-16 h-full absolute left-0 top-0 flex flex-col items-center py-6 bg-slate-900 border-r border-slate-800 z-20">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-all ${
              drawerOpen
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {drawerOpen ? <ChevronRight size={20} /> : <Palette size={20} />}
          </button>

          <div className="space-y-4 flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-400 cursor-pointer transition-colors"
              title="Templates"
            >
              <Palette size={18} />
            </div>
            <div
              className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-blue-400 cursor-pointer transition-colors"
              title="Typography"
            >
              <Type size={18} />
            </div>
          </div>
        </div>

        {/* Drawer Content */}
        <div
          className={`flex-1 ml-16 h-full overflow-y-auto p-6 transition-opacity duration-300 ${
            drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <Sparkles size={18} className="text-yellow-400" />
            Templates
          </h2>

          {/* Template Cards - Vertical Carousel */}
          <div className="space-y-6">
            {TEMPLATES.map((t) => {
              const isSelected = template === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`relative cursor-pointer transition-all duration-500 ${
                    isSelected
                      ? 'scale-100 z-10'
                      : 'scale-90 opacity-40 hover:opacity-70'
                  }`}
                >
                  {/* Preview Container */}
                  <div
                    className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900'
                        : ''
                    }`}
                  >
                    {/* Actual Mini Preview */}
                    <div className="bg-white rounded-lg overflow-hidden">
                      <TemplatePreview template={t.id} data={data} scale={0.12} />
                    </div>

                    {/* Gradient Overlay for non-selected */}
                    {!isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    )}

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white p-1.5 rounded-full shadow-lg animate-scale-in">
                        <Check size={12} />
                      </div>
                    )}
                  </div>

                  {/* Template Name */}
                  <div className="mt-3 text-center">
                    <span
                      className={`text-sm font-medium transition-colors ${
                        isSelected ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {t.name}
                    </span>
                    {isSelected && (
                      <span className="ml-2 text-xs text-blue-400">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* More Templates CTA */}
          <div className="mt-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
            <p className="text-slate-400 text-sm mb-3">
              Want more templates?
            </p>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
