'use client';

import { useMemo, useState, useDeferredValue } from 'react';
import { useRouter } from 'next/navigation';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';
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
  Crown,
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

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-source-sans',
  display: 'swap',
});

const INITIAL_DATA: ResumeData = {
  personal: {
    fullName: 'Alexandra Chen',
    role: 'VP Product Strategy',
    email: 'alexandra.chen@example.com',
    phone: '+1 (555) 0188-9021',
    location: 'New York, NY',
    summary:
      'Product leader with a record of scaling cross-functional organizations and delivering durable growth through strategic product bets and operating discipline.',
  },
  experience: [
    {
      id: 1,
      role: 'Vice President, Product Strategy',
      company: 'Notion',
      date: '2021 - Present',
      description:
        'Directed portfolio strategy across enterprise products and drove +$18M ARR growth through focused execution and clear operating rituals.',
    },
    {
      id: 2,
      role: 'Director of Product',
      company: 'Stripe',
      date: '2017 - 2021',
      description:
        'Built product and platform alignment that reduced delivery cycle time by 24% while improving customer retention.',
    },
  ],
  education: [
    {
      id: 1,
      degree: 'MBA, Strategy',
      school: 'Columbia Business School',
      date: '2014 - 2016',
    },
  ],
  skills: [
    'Product Strategy',
    'Portfolio Leadership',
    'Executive Communication',
    'Growth',
    'Platform',
    'Operational Excellence',
  ],
};

const TEMPLATES: { id: TemplateType; name: string; color: string }[] = [
  { id: 'modern', name: 'Modern', color: 'bg-[#c9a84c]' },
  { id: 'classic', name: 'Classic', color: 'bg-[#111111]' },
  { id: 'creative', name: 'Creative', color: 'bg-[#9a8451]' },
  { id: 'minimal', name: 'Minimal', color: 'bg-[#b9aa84]' },
];

export default function EditorThreePage() {
  const router = useRouter();
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const deferredData = useDeferredValue(data);
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [zoom, setZoom] = useState(0.75);
  const [template, setTemplate] = useState<TemplateType>('classic');
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
      className={`${playfair.variable} ${sourceSans.variable} h-screen flex overflow-hidden bg-[#fafafa] text-[#111111]`}
      style={{ fontFamily: 'var(--font-source-sans), sans-serif' }}
    >
      <div className="fixed inset-0 -z-10 bg-[#fafafa]" />
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(#111111 1px, transparent 1px), linear-gradient(90deg, #111111 1px, transparent 1px)',
          backgroundSize: '68px 68px',
        }}
      />

      <aside className="w-[380px] flex-shrink-0 flex flex-col h-full bg-[#fcfaf6]/98 backdrop-blur-xl border-r border-[#e5e5e5] z-20">
        <div className="h-16 flex items-center gap-3 px-4 border-b border-[#e5e5e5]">
          <button
            onClick={() => router.push('/dashboard/3')}
            className="p-2 -ml-1 rounded-full hover:bg-[#f2eee5] text-[#777777] hover:text-[#111111] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Crown size={20} className="text-[#c9a84c]" />
            <span className="font-bold" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              Editorial Editor
            </span>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] text-white rounded-none text-xs font-semibold hover:opacity-90 transition-all disabled:opacity-50"
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
            variant="editorial"
            isOpen={activeSection === 'personal'}
            onToggle={() =>
              setActiveSection(activeSection === 'personal' ? null : 'personal')
            }
          >
            <InputField
              variant="editorial"
              label="Full Name"
              value={data.personal.fullName}
              onChange={(v) => updatePersonal('fullName', v)}
            />
            <InputField
              variant="editorial"
              label="Job Title"
              value={data.personal.role}
              onChange={(v) => updatePersonal('role', v)}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                variant="editorial"
                label="Email"
                value={data.personal.email}
                onChange={(v) => updatePersonal('email', v)}
                type="email"
              />
              <InputField
                variant="editorial"
                label="Phone"
                value={data.personal.phone}
                onChange={(v) => updatePersonal('phone', v)}
                type="tel"
              />
            </div>
            <InputField
              variant="editorial"
              label="Location"
              value={data.personal.location}
              onChange={(v) => updatePersonal('location', v)}
            />
            <InputField
              variant="editorial"
              label="Professional Summary"
              value={data.personal.summary}
              onChange={(v) => updatePersonal('summary', v)}
              multiline
            />
          </InputGroup>

          <InputGroup
            title="Work Experience"
            icon={Briefcase}
            variant="editorial"
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
                className="p-4 bg-white border border-[#e5e5e5] mb-3 relative group"
              >
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#b5b5b5]">#{i + 1}</span>
                  {data.experience.length > 1 && (
                    <button
                      onClick={() => deleteExperience(job.id)}
                      className="p-1 rounded text-[#9a9a9a] hover:text-[#111111] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <InputField
                    variant="editorial"
                    label="Role"
                    value={job.role}
                    onChange={(v) => updateExperience(job.id, 'role', v)}
                  />
                  <InputField
                    variant="editorial"
                    label="Company"
                    value={job.company}
                    onChange={(v) => updateExperience(job.id, 'company', v)}
                  />
                  <InputField
                    variant="editorial"
                    label="Date Range"
                    value={job.date}
                    onChange={(v) => updateExperience(job.id, 'date', v)}
                    placeholder="e.g. 2020 - Present"
                  />
                  <InputField
                    variant="editorial"
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
              className="w-full py-2.5 border border-dashed border-[#dfdfdf] text-[#777777] font-semibold text-xs hover:border-[#c9a84c] hover:text-[#111111] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Position
            </button>
          </InputGroup>

          <InputGroup
            title="Education"
            icon={GraduationCap}
            variant="editorial"
            isOpen={activeSection === 'education'}
            onToggle={() =>
              setActiveSection(activeSection === 'education' ? null : 'education')
            }
          >
            {data.education.map((edu, i) => (
              <div
                key={edu.id}
                className="p-4 bg-white border border-[#e5e5e5] mb-3 relative group"
              >
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#b5b5b5]">#{i + 1}</span>
                  {data.education.length > 1 && (
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="p-1 rounded text-[#9a9a9a] hover:text-[#111111] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <InputField
                    variant="editorial"
                    label="Degree"
                    value={edu.degree}
                    onChange={(v) => updateEducation(edu.id, 'degree', v)}
                  />
                  <InputField
                    variant="editorial"
                    label="School"
                    value={edu.school}
                    onChange={(v) => updateEducation(edu.id, 'school', v)}
                  />
                  <InputField
                    variant="editorial"
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
              className="w-full py-2.5 border border-dashed border-[#dfdfdf] text-[#777777] font-semibold text-xs hover:border-[#c9a84c] hover:text-[#111111] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Education
            </button>
          </InputGroup>

          <InputGroup
            title="Skills"
            icon={Wrench}
            variant="editorial"
            isOpen={activeSection === 'skills'}
            onToggle={() =>
              setActiveSection(activeSection === 'skills' ? null : 'skills')
            }
          >
            <textarea
              className="w-full p-3 bg-white border border-[#dfdfdf] focus:border-[#c9a84c] focus:outline-none transition-all text-sm h-32 resize-y text-[#111111]"
              value={data.skills.join(', ')}
              onChange={(e) =>
                setData({
                  ...data,
                  skills: e.target.value.split(',').map((s) => s.trim()),
                })
              }
            />
            <p className="text-[10px] text-[#777777] mt-1 ml-1">Separate skills with commas</p>
          </InputGroup>
        </div>

        <div className="p-4 border-t border-[#e5e5e5]">
          <div className="p-4 bg-[#fff9eb] border border-[#eadfbf]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#9a8451]" />
              <span className="font-semibold text-[#9a8451]" style={{ fontFamily: 'var(--font-playfair), serif' }}>
                Editorial Notes
              </span>
            </div>
            <p className="text-sm text-[#666666] mb-3">Polish clarity and strategic language before exporting.</p>
            <button className="w-full py-2 px-4 bg-[#111111] text-white text-sm font-semibold hover:opacity-90 transition-colors">
              Generate Notes
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 h-full relative flex flex-col items-center bg-[#f4f2ed]/70 overflow-auto pt-20 pb-8">
        <div className="absolute top-6 flex items-center gap-2 bg-[#ffffff]/95 px-4 py-2 shadow-lg z-30 border border-[#e5e5e5]">
          <button
            onClick={() => setZoom(Math.max(0.35, zoom - 0.05))}
            className="p-2 hover:bg-[#f2eee5] text-[#777777] hover:text-[#111111] transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono font-bold w-12 text-center text-[#777777]">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(0.85, zoom + 0.05))}
            className="p-2 hover:bg-[#f2eee5] text-[#777777] hover:text-[#111111] transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-4 bg-[#e5e5e5] mx-2" />
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#f2eee5] text-xs font-semibold text-[#777777] transition-colors uppercase tracking-[0.14em]">
            <Download size={14} /> Export PDF
          </button>
        </div>

        <div className="bg-white shadow-2xl rounded-sm overflow-hidden transition-all duration-200">
          <PreviewComponent data={deferredData} scale={zoom} />
        </div>
      </main>

      <aside
        className={`fixed right-0 top-0 h-full bg-[#111111] shadow-2xl z-50 transition-all duration-500 ease-in-out border-l border-[#2a2a2a] flex flex-col ${
          drawerOpen ? 'w-80' : 'w-16'
        }`}
      >
        <div className="flex-shrink-0 w-16 h-full absolute left-0 top-0 flex flex-col items-center py-6 bg-[#111111] border-r border-[#2a2a2a] z-20">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`w-10 h-10 rounded-none flex items-center justify-center mb-6 transition-all ${
              drawerOpen ? 'bg-[#c9a84c] text-[#111111]' : 'bg-[#1c1c1c] text-[#888] hover:text-white'
            }`}
          >
            {drawerOpen ? <ChevronRight size={20} /> : <Palette size={20} />}
          </button>

          <div className="space-y-4 flex flex-col items-center">
            <div className="w-8 h-8 bg-[#1c1c1c] flex items-center justify-center text-[#888] hover:text-[#c9a84c] cursor-pointer transition-colors" title="Templates">
              <Palette size={18} />
            </div>
            <div className="w-8 h-8 bg-[#1c1c1c] flex items-center justify-center text-[#888] hover:text-[#c9a84c] cursor-pointer transition-colors" title="Typography">
              <Type size={18} />
            </div>
          </div>
        </div>

        {drawerOpen && (
          <div className="flex-1 ml-16 h-full overflow-y-auto p-6 transition-opacity duration-300 opacity-100">
            <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-playfair), serif' }}>
              <Sparkles size={18} className="text-[#c9a84c]" />
              Template Editions
            </h2>

            <div className="space-y-6">
              {TEMPLATES.map((templateOption) => {
                const isSelected = template === templateOption.id;

                return (
                  <div
                    key={templateOption.id}
                    onClick={() => setTemplate(templateOption.id)}
                    className={`relative cursor-pointer transition-all duration-500 ${
                      isSelected ? 'scale-100 z-10' : 'scale-90 opacity-45 hover:opacity-75'
                    }`}
                  >
                    <div
                      className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                        isSelected ? 'ring-2 ring-[#c9a84c] ring-offset-2 ring-offset-[#111111]' : ''
                      }`}
                    >
                      <div className="bg-white rounded-lg overflow-hidden">
                        <TemplatePreview template={templateOption.id} data={deferredData} scale={0.12} />
                      </div>

                      {!isSelected && <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-[#111111]/20 to-transparent" />}

                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#c9a84c] text-[#111111] p-1.5 rounded-full shadow-lg animate-scale-in">
                          <Check size={12} />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-center">
                      <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-[#888]'}`}>
                        {templateOption.name}
                      </span>
                      {isSelected && <span className="ml-2 text-xs text-[#c9a84c]">Selected</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 bg-[#1c1c1c] border border-[#2a2a2a] text-center">
              <p className="text-[#a7a7a7] text-sm mb-3">Want private brand templates?</p>
              <button className="px-4 py-2 bg-[#c9a84c] text-[#111111] text-sm font-semibold hover:brightness-105 transition-all">
                Upgrade
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
