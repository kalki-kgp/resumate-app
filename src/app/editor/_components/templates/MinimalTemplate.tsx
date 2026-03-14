'use client';

import { memo } from 'react';
import type { ResumeData } from '@/types';

export const MinimalPreview = memo(({ data }: { data: ResumeData }) => (
  <div
    className="bg-white text-slate-800"
    style={{ width: '794px', minHeight: '1123px', padding: '48px', fontSize: '11px' }}
  >
    {/* Header - minimal */}
    <div style={{ marginBottom: '28px' }}>
      <div className="font-light tracking-wide text-slate-900" style={{ fontSize: '24px' }}>
        {data.personal.fullName}
      </div>
      <div className="text-slate-400 font-light" style={{ fontSize: '13px', marginTop: '6px' }}>
        {data.personal.role}
      </div>
      <div className="text-slate-300 flex flex-wrap gap-1" style={{ fontSize: '10px', marginTop: '8px' }}>
        <span>{data.personal.email}</span>
        {data.personal.phone && <><span>/</span><span>{data.personal.phone}</span></>}
        {data.personal.location && <><span>/</span><span>{data.personal.location}</span></>}
      </div>
    </div>

    {/* Thin divider */}
    <div className="bg-slate-100" style={{ height: '1px', marginBottom: '24px' }} />

    {/* Summary */}
    {data.personal.summary && (
      <div style={{ marginBottom: '24px' }}>
        <div className="text-slate-500" style={{ fontSize: '11px', lineHeight: 1.7 }}>
          {data.personal.summary}
        </div>
        <div className="bg-slate-100" style={{ height: '1px', marginTop: '24px' }} />
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div style={{ marginBottom: '24px' }}>
        <div className="text-slate-300 uppercase tracking-widest font-medium"
             style={{ fontSize: '10px', marginBottom: '14px' }}>
          Experience
        </div>
        {data.experience.map((job) => (
          <div key={job.id} style={{ marginBottom: '18px' }}>
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-800" style={{ fontSize: '13px' }}>{job.role}</span>
              <span className="text-slate-300" style={{ fontSize: '10px' }}>{job.date}</span>
            </div>
            <div className="text-slate-400" style={{ fontSize: '11px', marginTop: '2px' }}>
              {job.company}
            </div>
            {job.description && (
              <div className="text-slate-500" style={{ fontSize: '10px', marginTop: '6px', lineHeight: 1.5 }}>
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
      <div style={{ marginBottom: '24px' }}>
        <div className="text-slate-300 uppercase tracking-widest font-medium"
             style={{ fontSize: '10px', marginBottom: '14px' }}>
          Projects
        </div>
        {data.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: '18px' }}>
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-800" style={{ fontSize: '13px' }}>{proj.name}</span>
              <span className="text-slate-300" style={{ fontSize: '10px' }}>{proj.date}</span>
            </div>
            {proj.description && (
              <div className="text-slate-500" style={{ fontSize: '10px', marginTop: '6px', lineHeight: 1.5 }}>
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
      <div style={{ marginBottom: '24px' }}>
        <div className="text-slate-300 uppercase tracking-widest font-medium"
             style={{ fontSize: '10px', marginBottom: '14px' }}>
          Education
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: '14px' }}>
            <div className="flex justify-between items-baseline">
              <span className="font-medium text-slate-800" style={{ fontSize: '12px' }}>{edu.degree}</span>
              {edu.date && <span className="text-slate-300" style={{ fontSize: '9px' }}>{edu.date}</span>}
            </div>
            <div className="text-slate-400" style={{ fontSize: '10px' }}>{edu.school}</div>
          </div>
        ))}
      </div>
    )}

    {/* Skills - inline */}
    {data.skills.length > 0 && (
      <div>
        <div className="text-slate-300 uppercase tracking-widest font-medium"
             style={{ fontSize: '10px', marginBottom: '10px' }}>
          Skills
        </div>
        <div className="text-slate-400" style={{ fontSize: '10px' }}>
          {data.skills.join(' / ')}
        </div>
      </div>
    )}
  </div>
));
MinimalPreview.displayName = 'MinimalPreview';
