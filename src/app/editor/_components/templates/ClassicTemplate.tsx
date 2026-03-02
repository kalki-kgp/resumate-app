'use client';

import { memo } from 'react';
import type { ResumeData } from '@/types';

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
