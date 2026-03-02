'use client';

import { memo } from 'react';
import type { ResumeData } from '@/types';

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
