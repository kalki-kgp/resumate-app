'use client';

import { memo } from 'react';
import type { ResumeData } from '@/types';

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
