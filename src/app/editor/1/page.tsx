'use client';

import { useMemo, useState, useDeferredValue } from 'react';
import { useRouter } from 'next/navigation';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import type { ResumeData, TemplateType } from '@/types';
import {
  ArrowLeft,
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
  Terminal,
} from 'lucide-react';
import {
  InputGroup,
  InputField,
  TemplatePreview,
  ModernPreview,
  ClassicPreview,
  CreativePreview,
  MinimalPreview,
} from '../_components';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains',
});

const INITIAL_DATA: ResumeData = {
  personal: {
    fullName: 'Alex Morgan',
    role: 'Senior Frontend Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 0123-4567',
    location: 'San Francisco, CA',
    summary:
      'Frontend engineer with 7+ years shipping production interfaces, scaling design systems, and improving product velocity with measurable outcomes.',
  },
  experience: [
    {
      id: 1,
      role: 'Staff Frontend Engineer',
      company: 'TechFlow Inc.',
      date: '2022 - Present',
      description:
        'Owned design system migration and reduced UI inconsistencies by 41%, accelerating cross-team release cycles.',
    },
    {
      id: 2,
      role: 'Senior Product Engineer',
      company: 'StartUp Hero',
      date: '2019 - 2022',
      description:
        'Built collaboration features that increased weekly active teams by 28% and improved onboarding conversion.',
    },
  ],
  education: [
    {
      id: 1,
      degree: 'B.S. in Computer Science',
      school: 'University of Washington',
      date: '2013 - 2017',
    },
  ],
  skills: [
    'React',
    'TypeScript',
    'Next.js',
    'Design Systems',
    'Accessibility',
    'Performance',
  ],
};

const TEMPLATES: { id: TemplateType; name: string; color: string }[] = [
  { id: 'modern', name: 'Modern', color: 'bg-[#00e5a0]' },
  { id: 'classic', name: 'Classic', color: 'bg-[#3b82f6]' },
  { id: 'creative', name: 'Creative', color: 'bg-[#22d3ee]' },
  { id: 'minimal', name: 'Minimal', color: 'bg-[#64748b]' },
];

export default function EditorOnePage() {
  const router = useRouter();
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const deferredData = useDeferredValue(data);
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [zoom, setZoom] = useState(0.75);
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const updatePersonal = (field: keyof typeof data.personal, value: string) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

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

  const deleteExperience = (id: number) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((job) => job.id !== id),
    }));
  };

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

  const deleteEducation = (id: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSaving(false);
  };

  const PreviewComponent = useMemo(
    () =>
      ({
        modern: ModernPreview,
        classic: ClassicPreview,
        creative: CreativePreview,
        minimal: MinimalPreview,
      })[template],
    [template]
  );

  return (
    <div
      className={`${outfit.variable} ${jetbrains.variable} dark h-screen flex overflow-hidden bg-[#06080f] text-[#e2e8f0]`}
      style={{ fontFamily: 'var(--font-outfit)' }}
    >
      <div className="fixed inset-0 -z-10 bg-[#06080f]" />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <aside className="w-[380px] flex-shrink-0 flex flex-col h-full bg-[#0b111a]/90 backdrop-blur-xl border-r border-[#1e2736] z-20">
        <div className="h-16 flex items-center gap-3 px-4 border-b border-[#1e2736]">
          <button
            onClick={() => router.push('/dashboard/1')}
            className="p-2 -ml-1 rounded-full hover:bg-[#111827] text-[#64748b] hover:text-[#e2e8f0] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Terminal size={20} className="text-[#00e5a0]" />
            <span className="font-bold text-[#e2e8f0]">Command Editor</span>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#00e5a0] text-[#06080f] rounded-lg text-xs font-bold hover:bg-[#00cc8e] transition-all disabled:opacity-50"
            >
              <Save size={14} />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <InputGroup
            title="Personal Details"
            icon={User}
            variant="dark"
            isOpen={activeSection === 'personal'}
            onToggle={() =>
              setActiveSection(activeSection === 'personal' ? null : 'personal')
            }
          >
            <InputField
              variant="dark"
              label="Full Name"
              value={data.personal.fullName}
              onChange={(v) => updatePersonal('fullName', v)}
            />
            <InputField
              variant="dark"
              label="Job Title"
              value={data.personal.role}
              onChange={(v) => updatePersonal('role', v)}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                variant="dark"
                label="Email"
                value={data.personal.email}
                onChange={(v) => updatePersonal('email', v)}
                type="email"
              />
              <InputField
                variant="dark"
                label="Phone"
                value={data.personal.phone}
                onChange={(v) => updatePersonal('phone', v)}
                type="tel"
              />
            </div>
            <InputField
              variant="dark"
              label="Location"
              value={data.personal.location}
              onChange={(v) => updatePersonal('location', v)}
            />
            <InputField
              variant="dark"
              label="Professional Summary"
              value={data.personal.summary}
              onChange={(v) => updatePersonal('summary', v)}
              multiline
            />
          </InputGroup>

          <InputGroup
            title="Work Experience"
            icon={Briefcase}
            variant="dark"
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
                className="p-4 rounded-xl bg-[#06080f] border border-[#1e2736] mb-3 relative group"
              >
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#334155]">#{i + 1}</span>
                  {data.experience.length > 1 && (
                    <button
                      onClick={() => deleteExperience(job.id)}
                      className="p-1 rounded text-[#64748b] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <InputField
                    variant="dark"
                    label="Role"
                    value={job.role}
                    onChange={(v) => updateExperience(job.id, 'role', v)}
                  />
                  <InputField
                    variant="dark"
                    label="Company"
                    value={job.company}
                    onChange={(v) => updateExperience(job.id, 'company', v)}
                  />
                  <InputField
                    variant="dark"
                    label="Date Range"
                    value={job.date}
                    onChange={(v) => updateExperience(job.id, 'date', v)}
                    placeholder="e.g. 2020 - Present"
                  />
                  <InputField
                    variant="dark"
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
              className="w-full py-2.5 border border-dashed border-[#1e2736] rounded-xl text-[#64748b] font-bold text-xs hover:border-[#00e5a0]/50 hover:text-[#00e5a0] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Position
            </button>
          </InputGroup>

          <InputGroup
            title="Education"
            icon={GraduationCap}
            variant="dark"
            isOpen={activeSection === 'education'}
            onToggle={() =>
              setActiveSection(activeSection === 'education' ? null : 'education')
            }
          >
            {data.education.map((edu, i) => (
              <div
                key={edu.id}
                className="p-4 rounded-xl bg-[#06080f] border border-[#1e2736] mb-3 relative group"
              >
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#334155]">#{i + 1}</span>
                  {data.education.length > 1 && (
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="p-1 rounded text-[#64748b] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <InputField
                    variant="dark"
                    label="Degree"
                    value={edu.degree}
                    onChange={(v) => updateEducation(edu.id, 'degree', v)}
                  />
                  <InputField
                    variant="dark"
                    label="School"
                    value={edu.school}
                    onChange={(v) => updateEducation(edu.id, 'school', v)}
                  />
                  <InputField
                    variant="dark"
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
              className="w-full py-2.5 border border-dashed border-[#1e2736] rounded-xl text-[#64748b] font-bold text-xs hover:border-[#00e5a0]/50 hover:text-[#00e5a0] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Education
            </button>
          </InputGroup>

          <InputGroup
            title="Skills"
            icon={Wrench}
            variant="dark"
            isOpen={activeSection === 'skills'}
            onToggle={() =>
              setActiveSection(activeSection === 'skills' ? null : 'skills')
            }
          >
            <textarea
              className="w-full p-3 rounded-xl bg-[#06080f] border border-[#1e2736] focus:border-[#00e5a0]/60 focus:outline-none transition-all text-sm h-32 resize-y text-[#e2e8f0]"
              value={data.skills.join(', ')}
              onChange={(e) =>
                setData({
                  ...data,
                  skills: e.target.value.split(',').map((s) => s.trim()),
                })
              }
            />
            <p className="text-[10px] text-[#64748b] mt-1 ml-1">Separate skills with commas</p>
          </InputGroup>
        </div>

        <div className="p-4 border-t border-[#1e2736]">
          <div className="p-4 rounded-xl bg-[#00e5a0]/10 border border-[#00e5a0]/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#00e5a0]" />
              <span className="font-semibold text-[#00e5a0]">AI Optimizer</span>
            </div>
            <p className="text-sm text-[#94a3b8] mb-3">Tune bullets for ATS and recruiter clarity.</p>
            <button className="w-full py-2 px-4 rounded-lg bg-[#00e5a0] text-[#06080f] text-sm font-semibold hover:bg-[#00cc8e] transition-colors">
              Optimize Content
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 h-full relative flex flex-col items-center bg-[#0f172a]/60 overflow-auto pt-20 pb-8">
        <div className="absolute top-6 flex items-center gap-2 bg-[#0b111a]/90 rounded-full px-4 py-2 shadow-lg z-30 border border-[#1e2736]">
          <button
            onClick={() => setZoom(Math.max(0.35, zoom - 0.05))}
            className="p-2 hover:bg-[#111827] rounded-full text-[#64748b] hover:text-[#e2e8f0] transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono font-bold w-12 text-center text-[#94a3b8]">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(0.85, zoom + 0.05))}
            className="p-2 hover:bg-[#111827] rounded-full text-[#64748b] hover:text-[#e2e8f0] transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-4 bg-[#1e2736] mx-2" />
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#111827] rounded-lg text-xs font-bold text-[#94a3b8] transition-colors">
            <Download size={14} /> Export PDF
          </button>
        </div>

        <div className="bg-white shadow-2xl rounded-sm overflow-hidden transition-all duration-200">
          <PreviewComponent data={deferredData} scale={zoom} />
        </div>
      </main>

      <aside
        className={`fixed right-0 top-0 h-full bg-[#020617] shadow-2xl z-50 transition-all duration-500 ease-in-out border-l border-[#1e2736] flex flex-col ${
          drawerOpen ? 'w-80' : 'w-16'
        }`}
      >
        <div className="flex-shrink-0 w-16 h-full absolute left-0 top-0 flex flex-col items-center py-6 bg-[#020617] border-r border-[#1e2736] z-20">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-all ${
              drawerOpen ? 'bg-[#00e5a0] text-[#06080f]' : 'bg-[#111827] text-[#64748b] hover:text-[#e2e8f0]'
            }`}
          >
            {drawerOpen ? <ChevronRight size={20} /> : <Palette size={20} />}
          </button>

          <div className="space-y-4 flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center text-[#64748b] hover:text-[#00e5a0] cursor-pointer transition-colors" title="Templates">
              <Palette size={18} />
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#111827] flex items-center justify-center text-[#64748b] hover:text-[#00e5a0] cursor-pointer transition-colors" title="Typography">
              <Type size={18} />
            </div>
          </div>
        </div>

        {drawerOpen && (
          <div className="flex-1 ml-16 h-full overflow-y-auto p-6 transition-opacity duration-300 opacity-100">
            <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Sparkles size={18} className="text-[#00e5a0]" />
              Template Matrix
            </h2>

            <div className="space-y-6">
              {TEMPLATES.map((templateOption) => {
                const isSelected = template === templateOption.id;

                return (
                  <div
                    key={templateOption.id}
                    onClick={() => setTemplate(templateOption.id)}
                    className={`relative cursor-pointer transition-all duration-500 ${
                      isSelected ? 'scale-100 z-10' : 'scale-90 opacity-40 hover:opacity-70'
                    }`}
                  >
                    <div
                      className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                        isSelected ? 'ring-2 ring-[#00e5a0] ring-offset-2 ring-offset-[#020617]' : ''
                      }`}
                    >
                      <div className="bg-white rounded-lg overflow-hidden">
                        <TemplatePreview template={templateOption.id} data={deferredData} scale={0.12} />
                      </div>

                      {!isSelected && <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-[#020617]/20 to-transparent" />}

                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#00e5a0] text-[#06080f] p-1.5 rounded-full shadow-lg animate-scale-in">
                          <Check size={12} />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-center">
                      <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-[#64748b]'}`}>
                        {templateOption.name}
                      </span>
                      {isSelected && <span className="ml-2 text-xs text-[#00e5a0]">Selected</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-[#111827] border border-[#1e2736] text-center">
              <p className="text-[#94a3b8] text-sm mb-3">Need advanced exports?</p>
              <button className="px-4 py-2 bg-[#00e5a0] text-[#06080f] text-sm font-semibold rounded-lg hover:bg-[#00cc8e] transition-all">
                Unlock Pro
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
