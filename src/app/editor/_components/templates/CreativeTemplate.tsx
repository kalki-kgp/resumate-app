'use client';

import { memo } from 'react';
import type { ResumeData } from '@/types';

export const CreativePreview = memo(({ data }: { data: ResumeData }) => (
  <div
    className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white relative overflow-hidden"
    style={{ width: '794px', minHeight: '1123px', padding: '40px', fontSize: '11px' }}
  >
    {/* Decorative shapes */}
    <div className="absolute bg-pink-500/30 rounded-full blur-xl"
         style={{ width: '80px', height: '80px', top: '-16px', right: '-16px' }} />
    <div className="absolute bg-blue-500/30 rounded-full blur-xl"
         style={{ width: '60px', height: '60px', bottom: '-8px', left: '-8px' }} />

    {/* Header */}
    <div style={{ marginBottom: '24px' }}>
      <div className="font-black tracking-tight" style={{ fontSize: '24px' }}>
        {data.personal.fullName}
      </div>
      <div className="text-pink-300 font-medium" style={{ fontSize: '14px', marginTop: '4px' }}>
        {data.personal.role}
      </div>
      <div className="text-purple-300/80 flex flex-wrap gap-1" style={{ fontSize: '10px', marginTop: '6px' }}>
        <span>{data.personal.email}</span>
        {data.personal.phone && <><span>|</span><span>{data.personal.phone}</span></>}
        {data.personal.location && <><span>|</span><span>{data.personal.location}</span></>}
      </div>
    </div>

    {/* Summary */}
    {data.personal.summary && (
      <div className="bg-white/10 backdrop-blur rounded-lg"
           style={{ padding: '16px', marginBottom: '20px' }}>
        <div className="text-purple-200/90" style={{ fontSize: '11px', lineHeight: 1.6 }}>
          {data.personal.summary}
        </div>
      </div>
    )}

    {/* Experience */}
    {data.experience.length > 0 && (
      <div style={{ marginBottom: '20px' }}>
        <div className="text-pink-300 uppercase tracking-widest font-bold"
             style={{ fontSize: '11px', marginBottom: '10px' }}>
          Experience
        </div>
        {data.experience.map((job) => (
          <div
            key={job.id}
            className="bg-white/10 backdrop-blur rounded-lg"
            style={{ padding: '16px', marginBottom: '14px' }}
          >
            <div className="font-bold text-white" style={{ fontSize: '13px' }}>{job.role}</div>
            <div className="text-pink-200" style={{ fontSize: '11px' }}>{job.company}</div>
            <div className="text-purple-300/70" style={{ fontSize: '10px', marginTop: '2px' }}>{job.date}</div>
            {job.description && (
              <div className="text-purple-200/80" style={{ fontSize: '10px', marginTop: '6px', lineHeight: 1.5 }}>
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
        <div className="text-pink-300 uppercase tracking-widest font-bold"
             style={{ fontSize: '11px', marginBottom: '10px' }}>
          Projects
        </div>
        {data.projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white/10 backdrop-blur rounded-lg"
            style={{ padding: '16px', marginBottom: '14px' }}
          >
            <div className="font-bold text-white" style={{ fontSize: '13px' }}>{proj.name}</div>
            <div className="text-purple-300/70" style={{ fontSize: '10px', marginTop: '2px' }}>{proj.date}</div>
            {proj.description && (
              <div className="text-purple-200/80" style={{ fontSize: '10px', marginTop: '6px', lineHeight: 1.5 }}>
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
        <div className="text-pink-300 uppercase tracking-widest font-bold"
             style={{ fontSize: '11px', marginBottom: '10px' }}>
          Education
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: '14px' }}>
            <div className="font-bold text-white" style={{ fontSize: '12px' }}>{edu.degree}</div>
            <div className="text-pink-200" style={{ fontSize: '10px' }}>{edu.school}</div>
            {edu.date && <div className="text-purple-300/70" style={{ fontSize: '9px' }}>{edu.date}</div>}
          </div>
        ))}
      </div>
    )}

    {/* Skills */}
    {data.skills.length > 0 && (
      <div>
        <div className="text-pink-300 uppercase tracking-widest font-bold"
             style={{ fontSize: '11px', marginBottom: '10px' }}>
          Skills
        </div>
        <div className="flex flex-wrap" style={{ gap: '6px' }}>
          {data.skills.map((skill, i) => (
            <span
              key={i}
              className="bg-pink-500/30 text-pink-100 rounded-full"
              style={{ fontSize: '10px', padding: '4px 10px' }}
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
