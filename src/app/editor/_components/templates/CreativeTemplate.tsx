'use client';

import { memo } from 'react';
import type { ResumeData } from '@/types';

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
