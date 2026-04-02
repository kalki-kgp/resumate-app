'use client';

import { memo } from 'react';
import type { ResumeData } from '@/types';

export const ExecutivePreview = memo(({ data }: { data: ResumeData }) => (
  <div
    className="relative overflow-hidden text-[#1a1a2e]"
    style={{ width: '794px', minHeight: '1123px', fontSize: '11px', background: '#fafaf8' }}
  >
    {/* Gold accent stripe */}
    <div className="absolute top-0 left-0 w-full" style={{ height: '4px', background: 'linear-gradient(90deg, #b8860b, #daa520, #b8860b)' }} />

    {/* Header */}
    <div style={{ padding: '44px 48px 24px' }}>
      <div className="uppercase tracking-[0.25em] font-bold" style={{ fontSize: '28px', color: '#1a1a2e', letterSpacing: '0.18em' }}>
        {data.personal.fullName}
      </div>
      <div className="font-medium" style={{ fontSize: '13px', marginTop: '6px', color: '#b8860b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {data.personal.role}
      </div>
      <div className="flex flex-wrap items-center" style={{ marginTop: '12px', gap: '16px', fontSize: '10px', color: '#6b7280' }}>
        {data.personal.email && <span>{data.personal.email}</span>}
        {data.personal.phone && <span>{data.personal.phone}</span>}
        {data.personal.location && <span>{data.personal.location}</span>}
      </div>
      <div style={{ marginTop: '16px', height: '1px', background: 'linear-gradient(90deg, #b8860b, transparent)' }} />
    </div>

    {/* Body */}
    <div style={{ padding: '0 48px 40px' }}>
      {/* Summary */}
      {data.personal.summary && (
        <div style={{ marginBottom: '24px' }}>
          <div className="uppercase tracking-[0.15em] font-semibold" style={{ fontSize: '11px', color: '#b8860b', marginBottom: '8px' }}>
            Executive Summary
          </div>
          <div style={{ fontSize: '11px', lineHeight: 1.7, color: '#374151' }}>
            {data.personal.summary}
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="flex" style={{ gap: '32px' }}>
        {/* Main column */}
        <div style={{ flex: '1 1 0%', minWidth: 0 }}>
          {/* Experience */}
          {data.experience.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div className="uppercase tracking-[0.15em] font-semibold" style={{ fontSize: '11px', color: '#b8860b', marginBottom: '12px', borderBottom: '1px solid #e5e1d8', paddingBottom: '4px' }}>
                Professional Experience
              </div>
              {data.experience.map((job) => (
                <div key={job.id} style={{ marginBottom: '18px' }}>
                  <div className="flex items-baseline justify-between">
                    <div className="font-bold" style={{ fontSize: '13px', color: '#1a1a2e' }}>{job.role}</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', flexShrink: 0, marginLeft: '8px' }}>{job.date}</div>
                  </div>
                  <div className="font-medium" style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>{job.company}</div>
                  {job.description && (
                    <div style={{ fontSize: '11px', marginTop: '6px', lineHeight: 1.6, color: '#4b5563' }}>
                      {job.description.split('\n').map((line, i) => (
                        <div key={i} style={{ paddingLeft: line.trim().startsWith('•') ? '0' : '0' }}>{line}</div>
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
              <div className="uppercase tracking-[0.15em] font-semibold" style={{ fontSize: '11px', color: '#b8860b', marginBottom: '12px', borderBottom: '1px solid #e5e1d8', paddingBottom: '4px' }}>
                Key Projects
              </div>
              {data.projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '14px' }}>
                  <div className="flex items-baseline justify-between">
                    <div className="font-bold" style={{ fontSize: '12px', color: '#1a1a2e' }}>{proj.name}</div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', flexShrink: 0, marginLeft: '8px' }}>{proj.date}</div>
                  </div>
                  {proj.description && (
                    <div style={{ fontSize: '11px', marginTop: '4px', lineHeight: 1.6, color: '#4b5563' }}>
                      {proj.description.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side column */}
        <div style={{ width: '200px', flexShrink: 0 }}>
          {/* Skills */}
          {data.skills.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div className="uppercase tracking-[0.15em] font-semibold" style={{ fontSize: '11px', color: '#b8860b', marginBottom: '10px', borderBottom: '1px solid #e5e1d8', paddingBottom: '4px' }}>
                Core Competencies
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {data.skills.map((skill, i) => (
                  <div key={i} style={{ fontSize: '10px', color: '#374151', paddingLeft: '10px', borderLeft: '2px solid #daa520' }}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <div className="uppercase tracking-[0.15em] font-semibold" style={{ fontSize: '11px', color: '#b8860b', marginBottom: '10px', borderBottom: '1px solid #e5e1d8', paddingBottom: '4px' }}>
                Education
              </div>
              {data.education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <div className="font-semibold" style={{ fontSize: '11px', color: '#1a1a2e' }}>{edu.degree}</div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>{edu.school}</div>
                  {edu.date && <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '1px' }}>{edu.date}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
));
ExecutivePreview.displayName = 'ExecutivePreview';
