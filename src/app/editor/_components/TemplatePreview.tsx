'use client';

import type { ResumeData } from '@/types';

interface TemplatePreviewProps {
  template: 'modern' | 'classic' | 'creative' | 'minimal';
  data: ResumeData;
  scale?: number;
}

// Modern Template - Clean with accent bar
export const ModernPreview = ({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-white text-slate-800 relative overflow-hidden"
    style={{
      width: 210 * scale + 'mm',
      height: 297 * scale + 'mm',
      fontSize: `${scale * 100}%`,
      padding: `${scale * 32}px`
    }}
  >
    {/* Top accent bar */}
    <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" style={{ height: `${scale * 8}px` }} />
    <div className="absolute top-0 left-0 w-8 h-8 bg-blue-500 rounded-br-full" style={{ width: `${scale * 60}px`, height: `${scale * 60}px` }} />

    {/* Header */}
    <div style={{ marginTop: `${scale * 8}px`, marginBottom: `${scale * 16}px` }}>
      <div className="font-bold text-slate-900 uppercase tracking-tight" style={{ fontSize: `${scale * 140}%` }}>
        {data.personal.fullName}
      </div>
      <div className="text-blue-600 font-medium" style={{ fontSize: `${scale * 80}%`, marginTop: `${scale * 4}px` }}>
        {data.personal.role}
      </div>
      <div className="text-slate-400 flex gap-1" style={{ fontSize: `${scale * 50}%`, marginTop: `${scale * 8}px` }}>
        <span>{data.personal.email}</span>
        <span>|</span>
        <span>{data.personal.phone}</span>
      </div>
    </div>

    {/* Content columns */}
    <div className="flex gap-2" style={{ gap: `${scale * 16}px` }}>
      {/* Main column */}
      <div className="flex-1">
        <div className="text-slate-400 uppercase tracking-widest border-b border-slate-100"
             style={{ fontSize: `${scale * 40}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
          Experience
        </div>
        {data.experience.slice(0, 2).map((job) => (
          <div key={job.id} style={{ marginBottom: `${scale * 12}px` }}>
            <div className="font-semibold text-slate-800" style={{ fontSize: `${scale * 55}%` }}>{job.role}</div>
            <div className="text-blue-600" style={{ fontSize: `${scale * 45}%` }}>{job.company}</div>
            <div className="text-slate-400" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 2}px` }}>{job.date}</div>
          </div>
        ))}
      </div>

      {/* Side column */}
      <div className="bg-slate-50 rounded" style={{ width: '35%', padding: `${scale * 12}px` }}>
        <div className="text-slate-600 uppercase tracking-widest" style={{ fontSize: `${scale * 40}%`, marginBottom: `${scale * 8}px` }}>
          Skills
        </div>
        <div className="flex flex-wrap" style={{ gap: `${scale * 4}px` }}>
          {data.skills.slice(0, 4).map((skill, i) => (
            <span
              key={i}
              className="bg-white border border-slate-200 text-slate-600 rounded"
              style={{ fontSize: `${scale * 35}%`, padding: `${scale * 3}px ${scale * 6}px` }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Classic Template - Traditional serif style
export const ClassicPreview = ({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-white text-slate-900"
    style={{
      width: 210 * scale + 'mm',
      height: 297 * scale + 'mm',
      fontSize: `${scale * 100}%`,
      padding: `${scale * 40}px`,
      fontFamily: 'Georgia, serif'
    }}
  >
    {/* Header - centered */}
    <div className="text-center border-b-2 border-slate-900" style={{ paddingBottom: `${scale * 16}px`, marginBottom: `${scale * 20}px` }}>
      <div className="font-bold uppercase tracking-widest" style={{ fontSize: `${scale * 120}%` }}>
        {data.personal.fullName}
      </div>
      <div className="text-slate-600 italic" style={{ fontSize: `${scale * 60}%`, marginTop: `${scale * 6}px` }}>
        {data.personal.role} | {data.personal.email}
      </div>
    </div>

    {/* Summary */}
    <div style={{ marginBottom: `${scale * 16}px` }}>
      <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: `${scale * 50}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 6}px` }}>
        Professional Summary
      </div>
      <div className="text-slate-700 leading-relaxed" style={{ fontSize: `${scale * 40}%` }}>
        {data.personal.summary.slice(0, 80)}...
      </div>
    </div>

    {/* Experience */}
    <div>
      <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: `${scale * 50}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
        Work Experience
      </div>
      {data.experience.slice(0, 2).map((job) => (
        <div key={job.id} style={{ marginBottom: `${scale * 10}px` }}>
          <div className="flex justify-between font-bold" style={{ fontSize: `${scale * 45}%` }}>
            <span>{job.company}</span>
            <span>{job.date}</span>
          </div>
          <div className="italic text-slate-600" style={{ fontSize: `${scale * 40}%` }}>{job.role}</div>
        </div>
      ))}
    </div>
  </div>
);

// Creative Template - Bold colors and shapes
export const CreativePreview = ({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white relative overflow-hidden"
    style={{
      width: 210 * scale + 'mm',
      height: 297 * scale + 'mm',
      fontSize: `${scale * 100}%`,
      padding: `${scale * 32}px`
    }}
  >
    {/* Decorative shapes */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/30 rounded-full blur-xl"
         style={{ width: `${scale * 100}px`, height: `${scale * 100}px`, top: `${scale * -20}px`, right: `${scale * -20}px` }} />
    <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/30 rounded-full blur-xl"
         style={{ width: `${scale * 80}px`, height: `${scale * 80}px`, bottom: `${scale * -10}px`, left: `${scale * -10}px` }} />

    {/* Header */}
    <div style={{ marginBottom: `${scale * 24}px` }}>
      <div className="font-black tracking-tight" style={{ fontSize: `${scale * 140}%` }}>
        {data.personal.fullName}
      </div>
      <div className="text-pink-300 font-medium" style={{ fontSize: `${scale * 70}%`, marginTop: `${scale * 4}px` }}>
        {data.personal.role}
      </div>
    </div>

    {/* Content */}
    <div className="space-y-3" style={{ gap: `${scale * 16}px` }}>
      {/* Experience cards */}
      {data.experience.slice(0, 2).map((job) => (
        <div
          key={job.id}
          className="bg-white/10 backdrop-blur rounded-lg"
          style={{ padding: `${scale * 12}px`, marginBottom: `${scale * 10}px` }}
        >
          <div className="font-bold text-white" style={{ fontSize: `${scale * 50}%` }}>{job.role}</div>
          <div className="text-pink-200" style={{ fontSize: `${scale * 40}%` }}>{job.company}</div>
        </div>
      ))}

      {/* Skills */}
      <div className="flex flex-wrap" style={{ gap: `${scale * 4}px`, marginTop: `${scale * 12}px` }}>
        {data.skills.slice(0, 3).map((skill, i) => (
          <span
            key={i}
            className="bg-pink-500/30 text-pink-100 rounded-full"
            style={{ fontSize: `${scale * 35}%`, padding: `${scale * 3}px ${scale * 8}px` }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Minimal Template - Clean and spacious
export const MinimalPreview = ({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-white text-slate-800"
    style={{
      width: 210 * scale + 'mm',
      height: 297 * scale + 'mm',
      fontSize: `${scale * 100}%`,
      padding: `${scale * 40}px`
    }}
  >
    {/* Header - minimal */}
    <div style={{ marginBottom: `${scale * 32}px` }}>
      <div className="font-light tracking-wide text-slate-900" style={{ fontSize: `${scale * 130}%` }}>
        {data.personal.fullName}
      </div>
      <div className="text-slate-400 font-light" style={{ fontSize: `${scale * 60}%`, marginTop: `${scale * 6}px` }}>
        {data.personal.role}
      </div>
      <div className="text-slate-300" style={{ fontSize: `${scale * 40}%`, marginTop: `${scale * 8}px` }}>
        {data.personal.email} / {data.personal.location}
      </div>
    </div>

    {/* Thin divider */}
    <div className="bg-slate-100" style={{ height: '1px', marginBottom: `${scale * 24}px` }} />

    {/* Experience - minimal */}
    {data.experience.slice(0, 2).map((job) => (
      <div key={job.id} style={{ marginBottom: `${scale * 16}px` }}>
        <div className="flex justify-between items-baseline">
          <span className="font-medium text-slate-800" style={{ fontSize: `${scale * 50}%` }}>{job.role}</span>
          <span className="text-slate-300" style={{ fontSize: `${scale * 35}%` }}>{job.date}</span>
        </div>
        <div className="text-slate-400" style={{ fontSize: `${scale * 40}%`, marginTop: `${scale * 2}px` }}>
          {job.company}
        </div>
      </div>
    ))}

    {/* Skills - inline */}
    <div className="text-slate-300" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 20}px` }}>
      {data.skills.slice(0, 5).join(' / ')}
    </div>
  </div>
);

// Main preview selector component
export const TemplatePreview = ({ template, data, scale = 0.15 }: TemplatePreviewProps) => {
  switch (template) {
    case 'modern':
      return <ModernPreview data={data} scale={scale} />;
    case 'classic':
      return <ClassicPreview data={data} scale={scale} />;
    case 'creative':
      return <CreativePreview data={data} scale={scale} />;
    case 'minimal':
      return <MinimalPreview data={data} scale={scale} />;
    default:
      return <ModernPreview data={data} scale={scale} />;
  }
};
