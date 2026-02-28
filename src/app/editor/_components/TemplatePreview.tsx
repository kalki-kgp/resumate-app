'use client';

import { memo } from 'react';
import type { ResumeData } from '@/types';

interface TemplatePreviewProps {
  template: 'modern' | 'classic' | 'creative' | 'minimal';
  data: ResumeData;
  scale?: number;
}

// Modern Template - Two-column: left (header, summary, experience), right sidebar (skills, education)
export const ModernPreview = memo(({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-white text-slate-800 relative overflow-hidden"
    style={{
      width: 210 * scale + 'mm',
      height: 297 * scale + 'mm',
      fontSize: `${scale * 100}%`,
      padding: `${scale * 32}px`,
      overflow: 'hidden',
    }}
  >
    {/* Top accent bar */}
    <div className="absolute top-0 left-0 w-full bg-blue-600" style={{ height: `${scale * 8}px` }} />
    <div className="absolute top-0 left-0 bg-blue-500 rounded-br-full" style={{ width: `${scale * 60}px`, height: `${scale * 60}px` }} />

    {/* Header */}
    <div style={{ marginTop: `${scale * 8}px`, marginBottom: `${scale * 12}px` }}>
      <div className="font-bold text-slate-900 uppercase tracking-tight" style={{ fontSize: `${scale * 140}%` }}>
        {data.personal.fullName}
      </div>
      <div className="text-blue-600 font-medium" style={{ fontSize: `${scale * 80}%`, marginTop: `${scale * 4}px` }}>
        {data.personal.role}
      </div>
      <div className="text-slate-400 flex flex-wrap gap-1" style={{ fontSize: `${scale * 50}%`, marginTop: `${scale * 6}px` }}>
        {data.personal.email && <span>{data.personal.email}</span>}
        {data.personal.email && data.personal.phone && <span>|</span>}
        {data.personal.phone && <span>{data.personal.phone}</span>}
        {data.personal.location && <span>| {data.personal.location}</span>}
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <div style={{ marginBottom: `${scale * 12}px` }}>
        <div className="text-slate-700 leading-relaxed" style={{ fontSize: `${scale * 42}%` }}>
          {data.personal.summary}
        </div>
      </div>
    )}

    {/* Content columns */}
    <div className="flex" style={{ gap: `${scale * 16}px` }}>
      {/* Main column - Experience */}
      <div className="flex-1" style={{ minWidth: 0 }}>
        {data.experience.length > 0 && (
          <>
            <div className="text-slate-400 uppercase tracking-widest border-b border-slate-100"
                 style={{ fontSize: `${scale * 40}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
              Experience
            </div>
            {data.experience.map((job) => (
              <div key={job.id} style={{ marginBottom: `${scale * 10}px` }}>
                <div className="font-semibold text-slate-800" style={{ fontSize: `${scale * 55}%` }}>{job.role}</div>
                <div className="text-blue-600" style={{ fontSize: `${scale * 45}%` }}>{job.company}</div>
                <div className="text-slate-400" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 2}px` }}>{job.date}</div>
                {job.description && (
                  <div className="text-slate-600 leading-snug" style={{ fontSize: `${scale * 38}%`, marginTop: `${scale * 3}px`, whiteSpace: 'pre-line' }}>
                    {job.description}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Side column - Skills, Education, Projects */}
      <div className="bg-slate-50 rounded flex-shrink-0" style={{ width: '35%', padding: `${scale * 12}px` }}>
        {data.skills.length > 0 && (
          <>
            <div className="text-slate-600 uppercase tracking-widest" style={{ fontSize: `${scale * 40}%`, marginBottom: `${scale * 8}px` }}>
              Skills
            </div>
            <div className="flex flex-wrap" style={{ gap: `${scale * 4}px`, marginBottom: `${scale * 12}px` }}>
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-white border border-slate-200 text-slate-600 rounded"
                  style={{ fontSize: `${scale * 35}%`, padding: `${scale * 3}px ${scale * 6}px` }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}

        {data.education.length > 0 && (
          <>
            <div className="text-slate-600 uppercase tracking-widest" style={{ fontSize: `${scale * 40}%`, marginBottom: `${scale * 8}px` }}>
              Education
            </div>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: `${scale * 8}px` }}>
                <div className="font-semibold text-slate-800" style={{ fontSize: `${scale * 42}%` }}>{edu.degree}</div>
                <div className="text-slate-500" style={{ fontSize: `${scale * 38}%` }}>{edu.school}</div>
                {edu.date && <div className="text-slate-400" style={{ fontSize: `${scale * 34}%` }}>{edu.date}</div>}
              </div>
            ))}
          </>
        )}

        {data.projects.length > 0 && (
          <>
            <div className="text-slate-600 uppercase tracking-widest" style={{ fontSize: `${scale * 40}%`, marginTop: `${scale * 12}px`, marginBottom: `${scale * 8}px` }}>
              Projects
            </div>
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: `${scale * 8}px` }}>
                <div className="font-semibold text-slate-800" style={{ fontSize: `${scale * 42}%` }}>{proj.name}</div>
                {proj.date && <div className="text-slate-400" style={{ fontSize: `${scale * 34}%` }}>{proj.date}</div>}
                {proj.description && (
                  <div className="text-slate-500 leading-snug" style={{ fontSize: `${scale * 36}%`, marginTop: `${scale * 2}px`, whiteSpace: 'pre-line' }}>
                    {proj.description}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  </div>
));
ModernPreview.displayName = 'ModernPreview';

// Classic Template - Single-column serif, centered header, full content
export const ClassicPreview = memo(({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-white text-slate-900"
    style={{
      width: 210 * scale + 'mm',
      height: 297 * scale + 'mm',
      fontSize: `${scale * 100}%`,
      padding: `${scale * 40}px`,
      fontFamily: 'Georgia, serif',
      overflow: 'hidden',
    }}
  >
    {/* Header - centered */}
    <div className="text-center border-b-2 border-slate-900" style={{ paddingBottom: `${scale * 14}px`, marginBottom: `${scale * 16}px` }}>
      <div className="font-bold uppercase tracking-widest" style={{ fontSize: `${scale * 120}%` }}>
        {data.personal.fullName}
      </div>
      <div className="text-slate-600 italic" style={{ fontSize: `${scale * 60}%`, marginTop: `${scale * 6}px` }}>
        {[data.personal.role, data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join(' | ')}
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <div style={{ marginBottom: `${scale * 14}px` }}>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: `${scale * 50}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 6}px` }}>
          Professional Summary
        </div>
        <div className="text-slate-700 leading-relaxed" style={{ fontSize: `${scale * 40}%` }}>
          {data.personal.summary}
        </div>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div style={{ marginBottom: `${scale * 14}px` }}>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: `${scale * 50}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
          Work Experience
        </div>
        {data.experience.map((job) => (
          <div key={job.id} style={{ marginBottom: `${scale * 10}px` }}>
            <div className="flex justify-between font-bold" style={{ fontSize: `${scale * 45}%` }}>
              <span>{job.company}</span>
              <span>{job.date}</span>
            </div>
            <div className="italic text-slate-600" style={{ fontSize: `${scale * 40}%` }}>{job.role}</div>
            {job.description && (
              <div className="text-slate-600 leading-snug" style={{ fontSize: `${scale * 38}%`, marginTop: `${scale * 3}px`, whiteSpace: 'pre-line' }}>
                {job.description}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <div style={{ marginBottom: `${scale * 14}px` }}>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: `${scale * 50}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
          Projects
        </div>
        {data.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: `${scale * 10}px` }}>
            <div className="flex justify-between font-bold" style={{ fontSize: `${scale * 45}%` }}>
              <span>{proj.name}</span>
              {proj.date && <span>{proj.date}</span>}
            </div>
            {proj.description && (
              <div className="text-slate-600 leading-snug" style={{ fontSize: `${scale * 38}%`, marginTop: `${scale * 3}px`, whiteSpace: 'pre-line' }}>
                {proj.description}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div style={{ marginBottom: `${scale * 14}px` }}>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: `${scale * 50}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
          Education
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: `${scale * 8}px` }}>
            <div className="flex justify-between font-bold" style={{ fontSize: `${scale * 45}%` }}>
              <span>{edu.school}</span>
              {edu.date && <span>{edu.date}</span>}
            </div>
            <div className="italic text-slate-600" style={{ fontSize: `${scale * 40}%` }}>{edu.degree}</div>
          </div>
        ))}
      </div>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <div>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: `${scale * 50}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 6}px` }}>
          Skills
        </div>
        <div className="text-slate-700" style={{ fontSize: `${scale * 40}%` }}>
          {data.skills.join(' \u2022 ')}
        </div>
      </div>
    )}
  </div>
));
ClassicPreview.displayName = 'ClassicPreview';

// Creative Template - Dark gradient, bold typography, experience cards, skill pills
export const CreativePreview = memo(({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white relative overflow-hidden"
    style={{
      width: 210 * scale + 'mm',
      height: 297 * scale + 'mm',
      fontSize: `${scale * 100}%`,
      padding: `${scale * 32}px`,
      overflow: 'hidden',
    }}
  >
    {/* Decorative shapes */}
    <div className="absolute bg-pink-500/30 rounded-full blur-xl"
         style={{ width: `${scale * 100}px`, height: `${scale * 100}px`, top: `${scale * -20}px`, right: `${scale * -20}px` }} />
    <div className="absolute bg-blue-500/30 rounded-full blur-xl"
         style={{ width: `${scale * 80}px`, height: `${scale * 80}px`, bottom: `${scale * -10}px`, left: `${scale * -10}px` }} />

    {/* Header */}
    <div style={{ marginBottom: `${scale * 16}px` }}>
      <div className="font-black tracking-tight" style={{ fontSize: `${scale * 140}%` }}>
        {data.personal.fullName}
      </div>
      <div className="text-pink-300 font-medium" style={{ fontSize: `${scale * 70}%`, marginTop: `${scale * 4}px` }}>
        {data.personal.role}
      </div>
      <div className="text-purple-300/70 flex flex-wrap gap-1" style={{ fontSize: `${scale * 42}%`, marginTop: `${scale * 6}px` }}>
        {data.personal.email && <span>{data.personal.email}</span>}
        {data.personal.phone && <span>| {data.personal.phone}</span>}
        {data.personal.location && <span>| {data.personal.location}</span>}
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <div className="text-purple-200/80 leading-relaxed" style={{ fontSize: `${scale * 40}%`, marginBottom: `${scale * 14}px` }}>
        {data.personal.summary}
      </div>
    )}

    {/* Experience cards */}
    {data.experience.length > 0 && (
      <div style={{ marginBottom: `${scale * 12}px` }}>
        {data.experience.map((job) => (
          <div
            key={job.id}
            className="bg-white/10 backdrop-blur rounded-lg"
            style={{ padding: `${scale * 10}px`, marginBottom: `${scale * 8}px` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-white" style={{ fontSize: `${scale * 50}%` }}>{job.role}</div>
                <div className="text-pink-200" style={{ fontSize: `${scale * 40}%` }}>{job.company}</div>
              </div>
              <div className="text-purple-300/60" style={{ fontSize: `${scale * 34}%` }}>{job.date}</div>
            </div>
            {job.description && (
              <div className="text-purple-200/70 leading-snug" style={{ fontSize: `${scale * 36}%`, marginTop: `${scale * 4}px`, whiteSpace: 'pre-line' }}>
                {job.description}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <div style={{ marginBottom: `${scale * 12}px` }}>
        <div className="text-purple-300/60 uppercase tracking-widest" style={{ fontSize: `${scale * 38}%`, marginBottom: `${scale * 6}px` }}>
          Projects
        </div>
        {data.projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white/10 backdrop-blur rounded-lg"
            style={{ padding: `${scale * 8}px`, marginBottom: `${scale * 6}px` }}
          >
            <div className="flex justify-between items-start">
              <div className="font-bold text-white" style={{ fontSize: `${scale * 46}%` }}>{proj.name}</div>
              {proj.date && <div className="text-purple-300/60" style={{ fontSize: `${scale * 34}%` }}>{proj.date}</div>}
            </div>
            {proj.description && (
              <div className="text-purple-200/70 leading-snug" style={{ fontSize: `${scale * 36}%`, marginTop: `${scale * 3}px`, whiteSpace: 'pre-line' }}>
                {proj.description}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div style={{ marginBottom: `${scale * 12}px` }}>
        <div className="text-purple-300/60 uppercase tracking-widest" style={{ fontSize: `${scale * 38}%`, marginBottom: `${scale * 6}px` }}>
          Education
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: `${scale * 6}px` }}>
            <div className="font-semibold text-white" style={{ fontSize: `${scale * 42}%` }}>{edu.degree}</div>
            <div className="text-pink-200/70" style={{ fontSize: `${scale * 38}%` }}>
              {edu.school}{edu.date ? ` \u2022 ${edu.date}` : ''}
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <div className="flex flex-wrap" style={{ gap: `${scale * 4}px`, marginTop: `${scale * 8}px` }}>
        {data.skills.map((skill, i) => (
          <span
            key={i}
            className="bg-pink-500/30 text-pink-100 rounded-full"
            style={{ fontSize: `${scale * 35}%`, padding: `${scale * 3}px ${scale * 8}px` }}
          >
            {skill}
          </span>
        ))}
      </div>
    )}
  </div>
));
CreativePreview.displayName = 'CreativePreview';

// Minimal Template - Clean whitespace, thin dividers, all sections
export const MinimalPreview = memo(({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-white text-slate-800"
    style={{
      width: 210 * scale + 'mm',
      height: 297 * scale + 'mm',
      fontSize: `${scale * 100}%`,
      padding: `${scale * 40}px`,
      overflow: 'hidden',
    }}
  >
    {/* Header - minimal */}
    <div style={{ marginBottom: `${scale * 24}px` }}>
      <div className="font-light tracking-wide text-slate-900" style={{ fontSize: `${scale * 130}%` }}>
        {data.personal.fullName}
      </div>
      <div className="text-slate-400 font-light" style={{ fontSize: `${scale * 60}%`, marginTop: `${scale * 6}px` }}>
        {data.personal.role}
      </div>
      <div className="text-slate-300" style={{ fontSize: `${scale * 40}%`, marginTop: `${scale * 8}px` }}>
        {[data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join(' / ')}
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <>
        <div className="bg-slate-100" style={{ height: '1px', marginBottom: `${scale * 14}px` }} />
        <div className="text-slate-500 leading-relaxed" style={{ fontSize: `${scale * 40}%`, marginBottom: `${scale * 16}px` }}>
          {data.personal.summary}
        </div>
      </>
    )}

    {/* Thin divider */}
    <div className="bg-slate-100" style={{ height: '1px', marginBottom: `${scale * 16}px` }} />

    {/* Experience */}
    {data.experience.length > 0 && (
      <div style={{ marginBottom: `${scale * 16}px` }}>
        {data.experience.map((job) => (
          <div key={job.id} style={{ marginBottom: `${scale * 12}px` }}>
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-800" style={{ fontSize: `${scale * 50}%` }}>{job.role}</span>
              <span className="text-slate-300" style={{ fontSize: `${scale * 35}%` }}>{job.date}</span>
            </div>
            <div className="text-slate-400" style={{ fontSize: `${scale * 40}%`, marginTop: `${scale * 2}px` }}>
              {job.company}
            </div>
            {job.description && (
              <div className="text-slate-500 leading-snug" style={{ fontSize: `${scale * 36}%`, marginTop: `${scale * 3}px`, whiteSpace: 'pre-line' }}>
                {job.description}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <div style={{ marginBottom: `${scale * 16}px` }}>
        <div className="text-slate-300 uppercase tracking-widest" style={{ fontSize: `${scale * 36}%`, marginBottom: `${scale * 8}px` }}>
          Projects
        </div>
        {data.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: `${scale * 10}px` }}>
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-800" style={{ fontSize: `${scale * 48}%` }}>{proj.name}</span>
              {proj.date && <span className="text-slate-300" style={{ fontSize: `${scale * 35}%` }}>{proj.date}</span>}
            </div>
            {proj.description && (
              <div className="text-slate-500 leading-snug" style={{ fontSize: `${scale * 36}%`, marginTop: `${scale * 3}px`, whiteSpace: 'pre-line' }}>
                {proj.description}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div style={{ marginBottom: `${scale * 16}px` }}>
        <div className="text-slate-300 uppercase tracking-widest" style={{ fontSize: `${scale * 36}%`, marginBottom: `${scale * 8}px` }}>
          Education
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: `${scale * 8}px` }}>
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-700" style={{ fontSize: `${scale * 44}%` }}>{edu.degree}</span>
              {edu.date && <span className="text-slate-300" style={{ fontSize: `${scale * 34}%` }}>{edu.date}</span>}
            </div>
            <div className="text-slate-400" style={{ fontSize: `${scale * 38}%` }}>{edu.school}</div>
          </div>
        ))}
      </div>
    )}

    {/* Skills - inline */}
    {data.skills.length > 0 && (
      <div className="text-slate-300" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 12}px` }}>
        {data.skills.join(' / ')}
      </div>
    )}
  </div>
));
MinimalPreview.displayName = 'MinimalPreview';

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
