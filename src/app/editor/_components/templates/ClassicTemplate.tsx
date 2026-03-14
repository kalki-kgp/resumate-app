'use client';

import { memo } from 'react';
import type { ResumeData } from '@/types';

export const ClassicPreview = memo(({ data }: { data: ResumeData }) => (
  <div
    className="bg-white text-slate-900"
    style={{ width: '794px', minHeight: '1123px', padding: '48px', fontSize: '11px', fontFamily: 'Georgia, serif' }}
  >
    {/* Header - centered */}
    <div className="text-center border-b-2 border-slate-900" style={{ paddingBottom: '16px', marginBottom: '24px' }}>
      <div className="font-bold uppercase tracking-widest" style={{ fontSize: '22px' }}>
        {data.personal.fullName}
      </div>
      <div className="text-slate-600 italic" style={{ fontSize: '13px', marginTop: '6px' }}>
        {data.personal.role}
      </div>
      <div className="text-slate-500 flex justify-center flex-wrap gap-1" style={{ fontSize: '10px', marginTop: '4px' }}>
        <span>{data.personal.email}</span>
        {data.personal.phone && <><span>|</span><span>{data.personal.phone}</span></>}
        {data.personal.location && <><span>|</span><span>{data.personal.location}</span></>}
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <div style={{ marginBottom: '20px' }}>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: '13px', paddingBottom: '4px', marginBottom: '8px' }}>
          Professional Summary
        </div>
        <div className="text-slate-700 leading-relaxed" style={{ fontSize: '11px' }}>
          {data.personal.summary}
        </div>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div style={{ marginBottom: '20px' }}>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: '13px', paddingBottom: '4px', marginBottom: '10px' }}>
          Work Experience
        </div>
        {data.experience.map((job) => (
          <div key={job.id} style={{ marginBottom: '16px' }}>
            <div className="flex justify-between font-bold" style={{ fontSize: '12px' }}>
              <span>{job.company}</span>
              <span>{job.date}</span>
            </div>
            <div className="italic text-slate-600" style={{ fontSize: '11px' }}>{job.role}</div>
            {job.description && (
              <div className="text-slate-700" style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.5 }}>
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
      <div style={{ marginBottom: '20px' }}>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: '13px', paddingBottom: '4px', marginBottom: '10px' }}>
          Projects
        </div>
        {data.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: '16px' }}>
            <div className="flex justify-between font-bold" style={{ fontSize: '12px' }}>
              <span>{proj.name}</span>
              <span>{proj.date}</span>
            </div>
            {proj.description && (
              <div className="text-slate-700" style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.5 }}>
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
      <div style={{ marginBottom: '20px' }}>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: '13px', paddingBottom: '4px', marginBottom: '10px' }}>
          Education
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: '14px' }}>
            <div className="flex justify-between font-bold" style={{ fontSize: '12px' }}>
              <span>{edu.degree}</span>
              {edu.date && <span>{edu.date}</span>}
            </div>
            <div className="italic text-slate-600" style={{ fontSize: '11px' }}>{edu.school}</div>
          </div>
        ))}
      </div>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <div>
        <div className="font-bold uppercase border-b border-slate-300" style={{ fontSize: '13px', paddingBottom: '4px', marginBottom: '8px' }}>
          Skills
        </div>
        <div className="text-slate-700" style={{ fontSize: '11px', lineHeight: 1.6 }}>
          {data.skills.join(' \u2022 ')}
        </div>
      </div>
    )}
  </div>
));
ClassicPreview.displayName = 'ClassicPreview';
