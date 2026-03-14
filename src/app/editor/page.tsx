'use client';

import { useMemo, useState, useDeferredValue, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Fraunces, DM_Sans } from 'next/font/google';
import type { ResumeData, TemplateType, FillTemplateResponse, SavedResumeResponse } from '@/types';
import { apiRequest, getStoredAccessToken } from '@/lib/api';
import {
  ArrowLeft,
  User,
  Briefcase,
  FolderOpen,
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
  Leaf,
} from 'lucide-react';
import {
  AIWriteAssist,
  InputGroup,
  InputField,
  ModernPreview,
  ClassicPreview,
  CreativePreview,
  MinimalPreview,
  TemplateThumbnail,
} from './_components';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-fraunces',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const EMPTY_RESUME_DATA: ResumeData = {
  personal: {
    fullName: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experience: [],
  projects: [],
  education: [],
  skills: [],
};

const TEMPLATES: { id: TemplateType; name: string; color: string }[] = [
  { id: 'modern', name: 'Modern', color: 'bg-[#c96442]' },
  { id: 'classic', name: 'Classic', color: 'bg-[#2d5a3d]' },
  { id: 'creative', name: 'Creative', color: 'bg-[#8b7355]' },
  { id: 'minimal', name: 'Minimal', color: 'bg-[#cbb8a1]' },
];

const MIN_SIDEBAR_WIDTH = 320;
const MAX_SIDEBAR_WIDTH = 620;
const MIN_MAIN_WIDTH = 420;

export default function EditorTwoPage() {
  return (
    <Suspense fallback={null}>
      <EditorInner />
    </Suspense>
  );
}

function EditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get('resume_id');
  const savedId = searchParams.get('saved_id');
  const [data, setData] = useState<ResumeData>(EMPTY_RESUME_DATA);
  const [loading, setLoading] = useState(!!resumeId || !!savedId);
  const deferredData = useDeferredValue(data);
  const [activeSection, setActiveSection] = useState<string | null>('personal');
  const [zoom, setZoom] = useState(0.75);
  const [template, setTemplate] = useState<TemplateType>('modern');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedResumeId, setSavedResumeId] = useState<string | null>(savedId);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const resizeStateRef = useRef<{ startX: number; startWidth: number } | null>(null);

  // Load from uploaded resume (fill-template)
  useEffect(() => {
    if (!resumeId) return;
    const token = getStoredAccessToken();
    if (!token) return;

    let cancelled = false;

    apiRequest<FillTemplateResponse>(`/api/v1/resumes/${resumeId}/fill-template`, {
      method: 'POST',
      token,
    })
      .then((res) => {
        if (!cancelled && res.data) {
          setData(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [resumeId]);

  // Load from saved resume
  useEffect(() => {
    if (!savedId) return;
    const token = getStoredAccessToken();
    if (!token) return;

    let cancelled = false;

    apiRequest<SavedResumeResponse>(`/api/v1/saved-resumes/${savedId}`, { token })
      .then((res) => {
        if (!cancelled) {
          setData(res.resume_data);
          setTemplate(res.template);
          setSavedResumeId(res.id);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [savedId]);

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

  const updateProject = (
    id: number,
    field: keyof (typeof data.projects)[0],
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const addProject = () => {
    const newId = Math.max(...data.projects.map((p) => p.id), 0) + 1;
    setData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: newId, name: '', description: '', date: '' },
      ],
    }));
  };

  const deleteProject = (id: number) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const handleSave = async () => {
    const token = getStoredAccessToken();
    if (!token) return;

    setSaving(true);
    setSaveStatus('saving');

    try {
      const title = data.personal.fullName
        ? `${data.personal.fullName}${data.personal.role ? ' — ' + data.personal.role : ''}`
        : 'Untitled Resume';

      if (savedResumeId) {
        // Update existing saved resume
        await apiRequest<SavedResumeResponse>(`/api/v1/saved-resumes/${savedResumeId}`, {
          method: 'PUT',
          token,
          body: { title, template, resume_data: data },
        });
      } else {
        // Create new saved resume
        const res = await apiRequest<SavedResumeResponse>('/api/v1/saved-resumes/save', {
          method: 'POST',
          token,
          body: {
            title,
            template,
            resume_data: data,
            source_resume_id: resumeId || null,
          },
        });
        setSavedResumeId(res.id);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('idle');
    } finally {
      setSaving(false);
    }
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

  const clampSidebarWidth = (width: number) => {
    const maxAllowed = Math.max(
      MIN_SIDEBAR_WIDTH,
      Math.min(MAX_SIDEBAR_WIDTH, window.innerWidth - MIN_MAIN_WIDTH)
    );
    return Math.min(maxAllowed, Math.max(MIN_SIDEBAR_WIDTH, width));
  };

  const handleResizeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    resizeStateRef.current = { startX: event.clientX, startWidth: sidebarWidth };
    setIsResizingSidebar(true);
  };

  useEffect(() => {
    if (!isResizingSidebar) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!resizeStateRef.current) return;
      const delta = event.clientX - resizeStateRef.current.startX;
      const nextWidth = clampSidebarWidth(resizeStateRef.current.startWidth + delta);
      setSidebarWidth(nextWidth);
    };

    const stopResizing = () => {
      setIsResizingSidebar(false);
      resizeStateRef.current = null;
    };

    const originalUserSelect = document.body.style.userSelect;
    const originalCursor = document.body.style.cursor;
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResizing);
    window.addEventListener('pointercancel', stopResizing);

    return () => {
      document.body.style.userSelect = originalUserSelect;
      document.body.style.cursor = originalCursor;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopResizing);
      window.removeEventListener('pointercancel', stopResizing);
    };
  }, [isResizingSidebar]);

  useEffect(() => {
    const handleWindowResize = () => {
      setSidebarWidth((current) => clampSidebarWidth(current));
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return (
    <div
      className={`${fraunces.variable} ${dmSans.variable} h-screen flex overflow-hidden bg-[#faf7f2] text-[#2c1810]`}
      style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
    >
      <div className="fixed inset-0 -z-10 bg-[#faf7f2]" />
      <div className="pointer-events-none fixed -left-20 top-20 -z-10 h-72 w-72 rounded-full bg-[#f0e6d8] opacity-55 blur-3xl" />
      <div className="pointer-events-none fixed right-0 top-0 -z-10 h-72 w-72 rounded-full bg-[#c96442] opacity-20 blur-3xl" />

      <aside
        className="flex-shrink-0 flex flex-col h-full bg-[#fffaf4]/95 backdrop-blur-xl border-r border-[#eadfce] z-20"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="h-16 flex items-center gap-3 px-4 border-b border-[#eadfce]">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 -ml-1 rounded-full hover:bg-[#f4ecdf] text-[#8b7355] hover:text-[#2c1810] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Leaf size={20} className="text-[#2d5a3d]" />
            <span className="font-bold" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
              Warm Editor
            </span>
          </div>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                saveStatus === 'saved'
                  ? 'bg-[#2d5a3d] text-white'
                  : 'bg-[#c96442] text-white hover:brightness-110'
              }`}
            >
              {saveStatus === 'saved' ? <Check size={14} /> : <Save size={14} />}
              {saving ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <InputGroup
            title="Personal Details"
            icon={User}
            variant="warm"
            isOpen={activeSection === 'personal'}
            onToggle={() =>
              setActiveSection(activeSection === 'personal' ? null : 'personal')
            }
          >
            <InputField
              variant="warm"
              label="Full Name"
              value={data.personal.fullName}
              onChange={(v) => updatePersonal('fullName', v)}
            />
            <InputField
              variant="warm"
              label="Job Title"
              value={data.personal.role}
              onChange={(v) => updatePersonal('role', v)}
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                variant="warm"
                label="Email"
                value={data.personal.email}
                onChange={(v) => updatePersonal('email', v)}
                type="email"
              />
              <InputField
                variant="warm"
                label="Phone"
                value={data.personal.phone}
                onChange={(v) => updatePersonal('phone', v)}
                type="tel"
              />
            </div>
            <InputField
              variant="warm"
              label="Location"
              value={data.personal.location}
              onChange={(v) => updatePersonal('location', v)}
            />
            <AIWriteAssist
              sectionType="summary"
              label="Professional Summary"
              currentValue={data.personal.summary}
              onValueChange={(v) => updatePersonal('summary', v)}
              context={{
                fullName: data.personal.fullName,
                role: data.personal.role,
                experienceTitles: data.experience.map((e) => e.role).filter(Boolean).join(', '),
              }}
            >
              <textarea
                value={data.personal.summary}
                onChange={(e) => updatePersonal('summary', e.target.value)}
                className="w-full p-3 rounded-2xl bg-white border border-[#eadfce] focus:border-[#c96442] focus:outline-none transition-all text-sm min-h-[100px] resize-y text-[#2c1810]"
              />
            </AIWriteAssist>
          </InputGroup>

          <InputGroup
            title="Work Experience"
            icon={Briefcase}
            variant="warm"
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
                className="p-4 rounded-2xl bg-white border border-[#eadfce] mb-3 relative group"
              >
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#d1bca4]">#{i + 1}</span>
                  {data.experience.length > 1 && (
                    <button
                      onClick={() => deleteExperience(job.id)}
                      className="p-1 rounded text-[#b59e86] hover:text-[#c96442] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <InputField
                    variant="warm"
                    label="Role"
                    value={job.role}
                    onChange={(v) => updateExperience(job.id, 'role', v)}
                  />
                  <InputField
                    variant="warm"
                    label="Company"
                    value={job.company}
                    onChange={(v) => updateExperience(job.id, 'company', v)}
                  />
                  <InputField
                    variant="warm"
                    label="Date Range"
                    value={job.date}
                    onChange={(v) => updateExperience(job.id, 'date', v)}
                    placeholder="e.g. 2020 - Present"
                  />
                  <AIWriteAssist
                    sectionType="experience"
                    label="Description"
                    currentValue={job.description}
                    onValueChange={(v) => updateExperience(job.id, 'description', v)}
                    context={{
                      role: job.role,
                      company: job.company,
                      date: job.date,
                    }}
                  >
                    <textarea
                      value={job.description}
                      onChange={(e) => updateExperience(job.id, 'description', e.target.value)}
                      className="w-full p-3 rounded-2xl bg-white border border-[#eadfce] focus:border-[#c96442] focus:outline-none transition-all text-sm min-h-[100px] resize-y text-[#2c1810]"
                    />
                  </AIWriteAssist>
                </div>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="w-full py-2.5 border border-dashed border-[#d9cbb8] rounded-2xl text-[#8b7355] font-bold text-xs hover:border-[#c96442] hover:text-[#c96442] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Position
            </button>
          </InputGroup>

          <InputGroup
            title="Projects"
            icon={FolderOpen}
            variant="warm"
            isOpen={activeSection === 'projects'}
            onToggle={() =>
              setActiveSection(activeSection === 'projects' ? null : 'projects')
            }
          >
            {data.projects.map((proj, i) => (
              <div
                key={proj.id}
                className="p-4 rounded-2xl bg-white border border-[#eadfce] mb-3 relative group"
              >
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#d1bca4]">#{i + 1}</span>
                  {data.projects.length > 1 && (
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="p-1 rounded text-[#b59e86] hover:text-[#c96442] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <InputField
                    variant="warm"
                    label="Project Name"
                    value={proj.name}
                    onChange={(v) => updateProject(proj.id, 'name', v)}
                  />
                  <InputField
                    variant="warm"
                    label="Date Range"
                    value={proj.date}
                    onChange={(v) => updateProject(proj.id, 'date', v)}
                    placeholder="e.g. Nov 2024 - Dec 2024"
                  />
                  <AIWriteAssist
                    sectionType="project"
                    label="Description"
                    currentValue={proj.description}
                    onValueChange={(v) => updateProject(proj.id, 'description', v)}
                    context={{
                      name: proj.name,
                      date: proj.date,
                    }}
                  >
                    <textarea
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                      className="w-full p-3 rounded-2xl bg-white border border-[#eadfce] focus:border-[#c96442] focus:outline-none transition-all text-sm min-h-[100px] resize-y text-[#2c1810]"
                    />
                  </AIWriteAssist>
                </div>
              </div>
            ))}
            <button
              onClick={addProject}
              className="w-full py-2.5 border border-dashed border-[#d9cbb8] rounded-2xl text-[#8b7355] font-bold text-xs hover:border-[#c96442] hover:text-[#c96442] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Project
            </button>
          </InputGroup>

          <InputGroup
            title="Education"
            icon={GraduationCap}
            variant="warm"
            isOpen={activeSection === 'education'}
            onToggle={() =>
              setActiveSection(activeSection === 'education' ? null : 'education')
            }
          >
            {data.education.map((edu, i) => (
              <div
                key={edu.id}
                className="p-4 rounded-2xl bg-white border border-[#eadfce] mb-3 relative group"
              >
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#d1bca4]">#{i + 1}</span>
                  {data.education.length > 1 && (
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="p-1 rounded text-[#b59e86] hover:text-[#c96442] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <InputField
                    variant="warm"
                    label="Degree"
                    value={edu.degree}
                    onChange={(v) => updateEducation(edu.id, 'degree', v)}
                  />
                  <InputField
                    variant="warm"
                    label="School"
                    value={edu.school}
                    onChange={(v) => updateEducation(edu.id, 'school', v)}
                  />
                  <InputField
                    variant="warm"
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
              className="w-full py-2.5 border border-dashed border-[#d9cbb8] rounded-2xl text-[#8b7355] font-bold text-xs hover:border-[#c96442] hover:text-[#c96442] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add Education
            </button>
          </InputGroup>

          <InputGroup
            title="Skills"
            icon={Wrench}
            variant="warm"
            isOpen={activeSection === 'skills'}
            onToggle={() =>
              setActiveSection(activeSection === 'skills' ? null : 'skills')
            }
          >
            <AIWriteAssist
              sectionType="skills"
              label="Skills"
              currentValue={data.skills.join(', ')}
              onValueChange={(v) =>
                setData({
                  ...data,
                  skills: v.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              context={{
                role: data.personal.role,
                experienceTitles: data.experience.map((e) => e.role).filter(Boolean).join(', '),
              }}
            >
              <textarea
                className="w-full p-3 rounded-2xl bg-white border border-[#eadfce] focus:border-[#c96442] focus:outline-none transition-all text-sm h-32 resize-y text-[#2c1810]"
                value={data.skills.join(', ')}
                onChange={(e) =>
                  setData({
                    ...data,
                    skills: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
              />
              <p className="text-[10px] text-[#8b7355] mt-1 ml-1">Separate skills with commas</p>
            </AIWriteAssist>
          </InputGroup>
        </div>

        <div className="p-4 border-t border-[#eadfce]">
          <div className="p-4 rounded-2xl bg-[#fff1e8] border border-[#f1d7c7]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#c96442]" />
              <span className="font-semibold text-[#c96442]" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
                Writing Coach
              </span>
            </div>
            <p className="text-sm text-[#8b7355]">
              Click the <span className="inline-flex align-middle"><Sparkles size={12} className="text-[#c96442]" /></span> icon on any description field to get AI-powered writing assistance.
            </p>
          </div>
        </div>
      </aside>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize editor sidebar"
        onPointerDown={handleResizeStart}
        className={`hidden lg:block h-full w-1 flex-shrink-0 cursor-col-resize transition-colors ${
          isResizingSidebar ? 'bg-[#c96442]/40' : 'bg-transparent hover:bg-[#c96442]/30'
        }`}
      />

      <main className="flex-1 h-full relative flex flex-col items-center bg-[#f3ece2]/50 overflow-auto pt-20 pb-8">
        {loading && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-[#faf7f2]/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-[#c96442] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-[#8b7355]">Loading resume data...</span>
            </div>
          </div>
        )}
        <div className="absolute top-6 flex items-center gap-2 bg-[#fffaf4]/95 rounded-full px-4 py-2 shadow-lg z-30 border border-[#eadfce]">
          <button
            onClick={() => setZoom(Math.max(0.3, zoom - 0.05))}
            className="p-2 hover:bg-[#f4ecdf] rounded-full text-[#8b7355] hover:text-[#2c1810] transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono font-bold w-12 text-center text-[#8b7355]">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(1.0, zoom + 0.05))}
            className="p-2 hover:bg-[#f4ecdf] rounded-full text-[#8b7355] hover:text-[#2c1810] transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-4 bg-[#eadfce] mx-2" />
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-[#f4ecdf] rounded-lg text-xs font-bold text-[#8b7355] transition-colors"
          >
            <Download size={14} /> Export PDF
          </button>
        </div>

        <div
          className="shadow-2xl rounded-sm overflow-hidden transition-all duration-200"
          style={{ width: `${794 * zoom}px`, height: `${1123 * zoom}px` }}
        >
          <div
            className="bg-white"
            style={{ width: '794px', minHeight: '1123px', transform: `scale(${zoom})`, transformOrigin: 'top left' }}
          >
            <PreviewComponent data={deferredData} />
          </div>
        </div>
      </main>

      <aside
        className={`fixed right-0 top-0 h-full bg-[#2d5a3d] shadow-2xl z-50 transition-all duration-500 ease-in-out border-l border-[#244a33] flex flex-col ${
          drawerOpen ? 'w-80' : 'w-16'
        }`}
      >
        <div className="flex-shrink-0 w-16 h-full absolute left-0 top-0 flex flex-col items-center py-6 bg-[#2d5a3d] border-r border-[#244a33] z-20">
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-all ${
              drawerOpen ? 'bg-[#c96442] text-white' : 'bg-[#244a33] text-[#d0dfd2] hover:text-white'
            }`}
          >
            {drawerOpen ? <ChevronRight size={20} /> : <Palette size={20} />}
          </button>

          <div className="space-y-4 flex flex-col items-center">
            <div className="w-8 h-8 rounded-lg bg-[#244a33] flex items-center justify-center text-[#d0dfd2] hover:text-white cursor-pointer transition-colors" title="Templates">
              <Palette size={18} />
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#244a33] flex items-center justify-center text-[#d0dfd2] hover:text-white cursor-pointer transition-colors" title="Typography">
              <Type size={18} />
            </div>
          </div>
        </div>

        {drawerOpen && (
          <div className="flex-1 ml-16 h-full overflow-y-auto p-6 transition-opacity duration-300 opacity-100">
            <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-fraunces), serif' }}>
              <Sparkles size={18} className="text-[#ffd7c8]" />
              Template Picks
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
                        isSelected ? 'ring-2 ring-[#c96442] ring-offset-2 ring-offset-[#2d5a3d]' : ''
                      }`}
                    >
                      <div className="bg-white rounded-lg overflow-hidden">
                        <TemplateThumbnail template={templateOption.id} />
                      </div>

                      {!isSelected && <div className="absolute inset-0 bg-gradient-to-t from-[#2d5a3d]/80 via-[#2d5a3d]/20 to-transparent" />}

                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#c96442] text-white p-1.5 rounded-full shadow-lg animate-scale-in">
                          <Check size={12} />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 text-center">
                      <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-[#d0dfd2]'}`}>
                        {templateOption.name}
                      </span>
                      {isSelected && <span className="ml-2 text-xs text-[#ffd7c8]">Selected</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-[#244a33] border border-[#1f3f2c] text-center">
              <p className="text-[#d0dfd2] text-sm mb-3">Need custom branded templates?</p>
              <button className="px-4 py-2 bg-[#c96442] text-white text-sm font-semibold rounded-lg hover:brightness-110 transition-all">
                Upgrade
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Hidden full-scale preview for print */}
      <div id="resume-print" className="hidden">
        <PreviewComponent data={deferredData} />
      </div>
    </div>
  );
}
