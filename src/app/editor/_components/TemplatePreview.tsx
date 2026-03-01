'use client';

import { memo } from 'react';
import type { ResumeData } from '@/types';

interface TemplatePreviewProps {
  template: 'modern' | 'classic' | 'creative' | 'minimal';
  data: ResumeData;
  scale?: number;
}

// Modern Template - Clean with accent bar
export const ModernPreview = memo(({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-white text-slate-800 relative overflow-hidden"
    style={{
      width: 210 * scale + 'mm',
      minHeight: 297 * scale + 'mm',
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
      <div className="text-slate-400 flex flex-wrap gap-1" style={{ fontSize: `${scale * 50}%`, marginTop: `${scale * 8}px` }}>
        <span>{data.personal.email}</span>
        {data.personal.phone && <><span>|</span><span>{data.personal.phone}</span></>}
        {data.personal.location && <><span>|</span><span>{data.personal.location}</span></>}
      </div>
    </div>

    {/* Professional Summary */}
    {data.personal.summary && (
      <div style={{ marginBottom: `${scale * 16}px` }}>
        <div className="text-slate-400 uppercase tracking-widest border-b border-slate-100"
             style={{ fontSize: `${scale * 40}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
          Professional Summary
        </div>
        <div className="text-slate-600" style={{ fontSize: `${scale * 40}%`, lineHeight: 1.6 }}>
          {data.personal.summary}
        </div>
      </div>
    )}

    {/* Content columns */}
    <div className="flex" style={{ gap: `${scale * 16}px` }}>
      {/* Main column - Experience + Projects */}
      <div className="flex-1 min-w-0">
        {/* Experience */}
        {data.experience.length > 0 && (
          <>
            <div className="text-slate-400 uppercase tracking-widest border-b border-slate-100"
                 style={{ fontSize: `${scale * 40}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
              Experience
            </div>
            {data.experience.map((job) => (
              <div key={job.id} style={{ marginBottom: `${scale * 12}px` }}>
                <div className="font-semibold text-slate-800" style={{ fontSize: `${scale * 55}%` }}>{job.role}</div>
                <div className="text-blue-600" style={{ fontSize: `${scale * 45}%` }}>{job.company}</div>
                <div className="text-slate-400" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 2}px` }}>{job.date}</div>
                {job.description && (
                  <div className="text-slate-600" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 4}px`, lineHeight: 1.5 }}>
                    {job.description.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <>
            <div className="text-slate-400 uppercase tracking-widest border-b border-slate-100"
                 style={{ fontSize: `${scale * 40}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px`, marginTop: `${scale * 16}px` }}>
              Projects
            </div>
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: `${scale * 12}px` }}>
                <div className="font-semibold text-slate-800" style={{ fontSize: `${scale * 55}%` }}>{proj.name}</div>
                <div className="text-slate-400" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 2}px` }}>{proj.date}</div>
                {proj.description && (
                  <div className="text-slate-600" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 4}px`, lineHeight: 1.5 }}>
                    {proj.description.split('\n').map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Side column - Skills + Education */}
      <div className="bg-slate-50 rounded" style={{ width: '35%', padding: `${scale * 12}px`, flexShrink: 0 }}>
        {/* Skills */}
        {data.skills.length > 0 && (
          <>
            <div className="text-slate-600 uppercase tracking-widest" style={{ fontSize: `${scale * 40}%`, marginBottom: `${scale * 8}px` }}>
              Skills
            </div>
            <div className="flex flex-wrap" style={{ gap: `${scale * 4}px` }}>
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

        {/* Education */}
        {data.education.length > 0 && (
          <>
            <div className="text-slate-600 uppercase tracking-widest"
                 style={{ fontSize: `${scale * 40}%`, marginBottom: `${scale * 8}px`, marginTop: `${scale * 16}px` }}>
              Education
            </div>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: `${scale * 10}px` }}>
                <div className="font-semibold text-slate-800" style={{ fontSize: `${scale * 45}%` }}>{edu.degree}</div>
                <div className="text-slate-500" style={{ fontSize: `${scale * 35}%` }}>{edu.school}</div>
                {edu.date && <div className="text-slate-400" style={{ fontSize: `${scale * 30}%` }}>{edu.date}</div>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  </div>
));
ModernPreview.displayName = 'ModernPreview';

// Classic Template - Traditional serif style
export const ClassicPreview = memo(({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-white text-slate-900"
    style={{
      width: 210 * scale + 'mm',
      minHeight: 297 * scale + 'mm',
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
        {data.personal.role}
      </div>
      <div className="text-slate-500 flex justify-center flex-wrap gap-1" style={{ fontSize: `${scale * 45}%`, marginTop: `${scale * 4}px` }}>
        <span>{data.personal.email}</span>
        {data.personal.phone && <><span>|</span><span>{data.personal.phone}</span></>}
        {data.personal.location && <><span>|</span><span>{data.personal.location}</span></>}
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <div style={{ marginBottom: `${scale * 16}px` }}>
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
      <div style={{ marginBottom: `${scale * 16}px` }}>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: `${scale * 50}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
          Work Experience
        </div>
        {data.experience.map((job) => (
          <div key={job.id} style={{ marginBottom: `${scale * 12}px` }}>
            <div className="flex justify-between font-bold" style={{ fontSize: `${scale * 45}%` }}>
              <span>{job.company}</span>
              <span>{job.date}</span>
            </div>
            <div className="italic text-slate-600" style={{ fontSize: `${scale * 40}%` }}>{job.role}</div>
            {job.description && (
              <div className="text-slate-700" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 4}px`, lineHeight: 1.5 }}>
                {job.description.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <div style={{ marginBottom: `${scale * 16}px` }}>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: `${scale * 50}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
          Projects
        </div>
        {data.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: `${scale * 12}px` }}>
            <div className="flex justify-between font-bold" style={{ fontSize: `${scale * 45}%` }}>
              <span>{proj.name}</span>
              <span>{proj.date}</span>
            </div>
            {proj.description && (
              <div className="text-slate-700" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 4}px`, lineHeight: 1.5 }}>
                {proj.description.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div style={{ marginBottom: `${scale * 16}px` }}>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: `${scale * 50}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
          Education
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: `${scale * 10}px` }}>
            <div className="flex justify-between font-bold" style={{ fontSize: `${scale * 45}%` }}>
              <span>{edu.degree}</span>
              {edu.date && <span>{edu.date}</span>}
            </div>
            <div className="italic text-slate-600" style={{ fontSize: `${scale * 40}%` }}>{edu.school}</div>
          </div>
        ))}
      </div>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <div>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: `${scale * 50}%`, paddingBottom: `${scale * 4}px`, marginBottom: `${scale * 8}px` }}>
          Skills
        </div>
        <div className="text-slate-700" style={{ fontSize: `${scale * 40}%`, lineHeight: 1.6 }}>
          {data.skills.join(' \u2022 ')}
        </div>
      </div>
    )}
  </div>
));
ClassicPreview.displayName = 'ClassicPreview';

// Creative Template - Bold colors and shapes
export const CreativePreview = memo(({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white relative overflow-hidden"
    style={{
      width: 210 * scale + 'mm',
      minHeight: 297 * scale + 'mm',
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
    <div style={{ marginBottom: `${scale * 20}px` }}>
      <div className="font-black tracking-tight" style={{ fontSize: `${scale * 140}%` }}>
        {data.personal.fullName}
      </div>
      <div className="text-pink-300 font-medium" style={{ fontSize: `${scale * 70}%`, marginTop: `${scale * 4}px` }}>
        {data.personal.role}
      </div>
      <div className="text-purple-300/80 flex flex-wrap gap-1" style={{ fontSize: `${scale * 45}%`, marginTop: `${scale * 6}px` }}>
        <span>{data.personal.email}</span>
        {data.personal.phone && <><span>|</span><span>{data.personal.phone}</span></>}
        {data.personal.location && <><span>|</span><span>{data.personal.location}</span></>}
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <div className="bg-white/10 backdrop-blur rounded-lg"
           style={{ padding: `${scale * 12}px`, marginBottom: `${scale * 16}px` }}>
        <div className="text-purple-200/90" style={{ fontSize: `${scale * 38}%`, lineHeight: 1.6 }}>
          {data.personal.summary}
        </div>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div style={{ marginBottom: `${scale * 16}px` }}>
        <div className="text-pink-300 uppercase tracking-widest font-bold"
             style={{ fontSize: `${scale * 40}%`, marginBottom: `${scale * 8}px` }}>
          Experience
        </div>
        {data.experience.map((job) => (
          <div
            key={job.id}
            className="bg-white/10 backdrop-blur rounded-lg"
            style={{ padding: `${scale * 12}px`, marginBottom: `${scale * 10}px` }}
          >
            <div className="font-bold text-white" style={{ fontSize: `${scale * 50}%` }}>{job.role}</div>
            <div className="text-pink-200" style={{ fontSize: `${scale * 40}%` }}>{job.company}</div>
            <div className="text-purple-300/70" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 2}px` }}>{job.date}</div>
            {job.description && (
              <div className="text-purple-200/80" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 4}px`, lineHeight: 1.5 }}>
                {job.description.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <div style={{ marginBottom: `${scale * 16}px` }}>
        <div className="text-pink-300 uppercase tracking-widest font-bold"
             style={{ fontSize: `${scale * 40}%`, marginBottom: `${scale * 8}px` }}>
          Projects
        </div>
        {data.projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white/10 backdrop-blur rounded-lg"
            style={{ padding: `${scale * 12}px`, marginBottom: `${scale * 10}px` }}
          >
            <div className="font-bold text-white" style={{ fontSize: `${scale * 50}%` }}>{proj.name}</div>
            <div className="text-purple-300/70" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 2}px` }}>{proj.date}</div>
            {proj.description && (
              <div className="text-purple-200/80" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 4}px`, lineHeight: 1.5 }}>
                {proj.description.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div style={{ marginBottom: `${scale * 16}px` }}>
        <div className="text-pink-300 uppercase tracking-widest font-bold"
             style={{ fontSize: `${scale * 40}%`, marginBottom: `${scale * 8}px` }}>
          Education
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: `${scale * 10}px` }}>
            <div className="font-bold text-white" style={{ fontSize: `${scale * 45}%` }}>{edu.degree}</div>
            <div className="text-pink-200" style={{ fontSize: `${scale * 38}%` }}>{edu.school}</div>
            {edu.date && <div className="text-purple-300/70" style={{ fontSize: `${scale * 32}%` }}>{edu.date}</div>}
          </div>
        ))}
      </div>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <div>
        <div className="text-pink-300 uppercase tracking-widest font-bold"
             style={{ fontSize: `${scale * 40}%`, marginBottom: `${scale * 8}px` }}>
          Skills
        </div>
        <div className="flex flex-wrap" style={{ gap: `${scale * 4}px` }}>
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
      </div>
    )}
  </div>
));
CreativePreview.displayName = 'CreativePreview';

// Minimal Template - Clean and spacious
export const MinimalPreview = memo(({ data, scale = 0.15 }: { data: ResumeData; scale?: number }) => (
  <div
    className="bg-white text-slate-800"
    style={{
      width: 210 * scale + 'mm',
      minHeight: 297 * scale + 'mm',
      fontSize: `${scale * 100}%`,
      padding: `${scale * 40}px`
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
      <div className="text-slate-300 flex flex-wrap gap-1" style={{ fontSize: `${scale * 40}%`, marginTop: `${scale * 8}px` }}>
        <span>{data.personal.email}</span>
        {data.personal.phone && <><span>/</span><span>{data.personal.phone}</span></>}
        {data.personal.location && <><span>/</span><span>{data.personal.location}</span></>}
      </div>
    </div>

    {/* Thin divider */}
    <div className="bg-slate-100" style={{ height: '1px', marginBottom: `${scale * 20}px` }} />

    {/* Summary */}
    {data.personal.summary && (
      <div style={{ marginBottom: `${scale * 20}px` }}>
        <div className="text-slate-500" style={{ fontSize: `${scale * 38}%`, lineHeight: 1.7 }}>
          {data.personal.summary}
        </div>
        <div className="bg-slate-100" style={{ height: '1px', marginTop: `${scale * 20}px` }} />
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div style={{ marginBottom: `${scale * 20}px` }}>
        <div className="text-slate-300 uppercase tracking-widest font-medium"
             style={{ fontSize: `${scale * 35}%`, marginBottom: `${scale * 12}px` }}>
          Experience
        </div>
        {data.experience.map((job) => (
          <div key={job.id} style={{ marginBottom: `${scale * 16}px` }}>
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-800" style={{ fontSize: `${scale * 50}%` }}>{job.role}</span>
              <span className="text-slate-300" style={{ fontSize: `${scale * 35}%` }}>{job.date}</span>
            </div>
            <div className="text-slate-400" style={{ fontSize: `${scale * 40}%`, marginTop: `${scale * 2}px` }}>
              {job.company}
            </div>
            {job.description && (
              <div className="text-slate-500" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 4}px`, lineHeight: 1.5 }}>
                {job.description.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Projects */}
    {data.projects.length > 0 && (
      <div style={{ marginBottom: `${scale * 20}px` }}>
        <div className="text-slate-300 uppercase tracking-widest font-medium"
             style={{ fontSize: `${scale * 35}%`, marginBottom: `${scale * 12}px` }}>
          Projects
        </div>
        {data.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: `${scale * 16}px` }}>
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-800" style={{ fontSize: `${scale * 50}%` }}>{proj.name}</span>
              <span className="text-slate-300" style={{ fontSize: `${scale * 35}%` }}>{proj.date}</span>
            </div>
            {proj.description && (
              <div className="text-slate-500" style={{ fontSize: `${scale * 35}%`, marginTop: `${scale * 4}px`, lineHeight: 1.5 }}>
                {proj.description.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Education */}
    {data.education.length > 0 && (
      <div style={{ marginBottom: `${scale * 20}px` }}>
        <div className="text-slate-300 uppercase tracking-widest font-medium"
             style={{ fontSize: `${scale * 35}%`, marginBottom: `${scale * 12}px` }}>
          Education
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: `${scale * 12}px` }}>
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-800" style={{ fontSize: `${scale * 45}%` }}>{edu.degree}</span>
              {edu.date && <span className="text-slate-300" style={{ fontSize: `${scale * 32}%` }}>{edu.date}</span>}
            </div>
            <div className="text-slate-400" style={{ fontSize: `${scale * 38}%` }}>{edu.school}</div>
          </div>
        ))}
      </div>
    )}

    {/* Skills - inline */}
    {data.skills.length > 0 && (
      <div>
        <div className="text-slate-300 uppercase tracking-widest font-medium"
             style={{ fontSize: `${scale * 35}%`, marginBottom: `${scale * 8}px` }}>
          Skills
        </div>
        <div className="text-slate-400" style={{ fontSize: `${scale * 38}%` }}>
          {data.skills.join(' / ')}
        </div>
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
