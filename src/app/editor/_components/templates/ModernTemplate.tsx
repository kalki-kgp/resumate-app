'use client';

import { memo } from 'react';
import type { ResumeData } from '@/types';

export const ModernPreview = memo(({ data }: { data: ResumeData }) => (
  <div
    className="bg-white text-slate-800 relative overflow-hidden"
    style={{ width: '794px', minHeight: '1123px', padding: '40px', fontSize: '11px' }}
  >
    {/* Top accent bar */}
    <div className="absolute top-0 left-0 w-full bg-blue-600" style={{ height: '6px' }} />
    <div className="absolute top-0 left-0 bg-blue-500 rounded-br-full" style={{ width: '48px', height: '48px' }} />

    {/* Header */}
    <div style={{ marginTop: '8px', marginBottom: '20px' }}>
      <div className="font-bold text-slate-900 uppercase tracking-tight" style={{ fontSize: '24px' }}>
        {data.personal.fullName}
      </div>
      <div className="text-blue-600 font-medium" style={{ fontSize: '14px', marginTop: '4px' }}>
        {data.personal.role}
      </div>
      <div className="text-slate-400 flex flex-wrap gap-1" style={{ fontSize: '10px', marginTop: '8px' }}>
        <span>{data.personal.email}</span>
        {data.personal.phone && <><span>|</span><span>{data.personal.phone}</span></>}
        {data.personal.location && <><span>|</span><span>{data.personal.location}</span></>}
      </div>
    </div>

    {/* Professional Summary */}
    {data.personal.summary && (
      <div style={{ marginBottom: '20px' }}>
        <div className="text-slate-400 uppercase tracking-widest border-b border-slate-100"
             style={{ fontSize: '12px', paddingBottom: '4px', marginBottom: '8px' }}>
          Professional Summary
        </div>
        <div className="text-slate-600" style={{ fontSize: '11px', lineHeight: 1.6 }}>
          {data.personal.summary}
        </div>
      </div>
    )}

    {/* Content columns */}
    <div className="flex" style={{ gap: '20px' }}>
      {/* Main column - Experience + Projects */}
      <div className="flex-1 min-w-0">
        {/* Experience */}
        {data.experience.length > 0 && (
          <>
            <div className="text-slate-400 uppercase tracking-widest border-b border-slate-100"
                 style={{ fontSize: '12px', paddingBottom: '4px', marginBottom: '8px' }}>
              Experience
            </div>
            {data.experience.map((job) => (
              <div key={job.id} style={{ marginBottom: '16px' }}>
                <div className="font-semibold text-slate-800" style={{ fontSize: '14px' }}>{job.role}</div>
                <div className="text-blue-600" style={{ fontSize: '12px' }}>{job.company}</div>
                <div className="text-slate-400" style={{ fontSize: '10px', marginTop: '2px' }}>{job.date}</div>
                {job.description && (
                  <div className="text-slate-600" style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.5 }}>
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
                 style={{ fontSize: '12px', paddingBottom: '4px', marginBottom: '8px', marginTop: '20px' }}>
              Projects
            </div>
            {data.projects.map((proj) => (
              <div key={proj.id} style={{ marginBottom: '16px' }}>
                <div className="font-semibold text-slate-800" style={{ fontSize: '14px' }}>{proj.name}</div>
                <div className="text-slate-400" style={{ fontSize: '10px', marginTop: '2px' }}>{proj.date}</div>
                {proj.description && (
                  <div className="text-slate-600" style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.5 }}>
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
      <div className="bg-slate-50 rounded" style={{ width: '35%', padding: '16px', flexShrink: 0 }}>
        {/* Skills */}
        {data.skills.length > 0 && (
          <>
            <div className="text-slate-600 uppercase tracking-widest" style={{ fontSize: '12px', marginBottom: '8px' }}>
              Skills
            </div>
            <div className="flex flex-wrap" style={{ gap: '5px' }}>
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-white border border-slate-200 text-slate-600 rounded"
                  style={{ fontSize: '10px', padding: '4px 8px' }}
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
                 style={{ fontSize: '12px', marginBottom: '8px', marginTop: '20px' }}>
              Education
            </div>
            {data.education.map((edu) => (
              <div key={edu.id} style={{ marginBottom: '12px' }}>
                <div className="font-semibold text-slate-800" style={{ fontSize: '12px' }}>{edu.degree}</div>
                <div className="text-slate-500" style={{ fontSize: '11px' }}>{edu.school}</div>
                {edu.date && <div className="text-slate-400" style={{ fontSize: '10px' }}>{edu.date}</div>}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  </div>
));
ModernPreview.displayName = 'ModernPreview';
