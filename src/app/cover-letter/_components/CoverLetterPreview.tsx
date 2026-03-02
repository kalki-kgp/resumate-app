'use client';

import type { CoverLetterData } from '@/types';
import { ParagraphRefineAssist } from './ParagraphRefineAssist';

interface CoverLetterPreviewProps {
  data: CoverLetterData;
  scale: number;
  editable: boolean;
  onFieldChange: (field: keyof CoverLetterData, value: string) => void;
  onBodyChange: (index: number, value: string) => void;
  context?: Record<string, string>;
}

export const CoverLetterPreview = ({
  data,
  scale,
  editable,
  onFieldChange,
  onBodyChange,
  context = {},
}: CoverLetterPreviewProps) => {
  // A4 dimensions in mm: 210 x 297
  const widthPx = 210 * 3.78 * scale; // ~794px at scale 1
  const minHeightPx = 297 * 3.78 * scale; // ~1123px at scale 1

  return (
    <div
      style={{
        width: `${widthPx}px`,
        minHeight: `${minHeightPx}px`,
        padding: `${48 * scale}px ${56 * scale}px`,
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: `${14 * scale}px`,
        lineHeight: 1.7,
        color: '#2c2c2c',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Date */}
      <p
        style={{ fontSize: `${13 * scale}px`, color: '#666', marginBottom: `${24 * scale}px` }}
      >
        {data.date}
      </p>

      {/* Recipient */}
      <div style={{ marginBottom: `${8 * scale}px` }}>
        <p style={{ fontSize: `${14 * scale}px`, fontWeight: 600 }}>
          {data.recipientName}
        </p>
        <p style={{ fontSize: `${13 * scale}px`, color: '#666' }}>
          {data.companyName}
        </p>
      </div>

      {/* Greeting */}
      <p style={{ marginBottom: `${20 * scale}px`, fontSize: `${14 * scale}px` }}>
        {data.greeting}
      </p>

      {/* Opening */}
      <div style={{ marginBottom: `${16 * scale}px` }}>
        {editable ? (
          <ParagraphRefineAssist
            paragraphType="opening"
            text={data.opening}
            onChange={(v) => onFieldChange('opening', v)}
            context={context}
          />
        ) : (
          <p style={{ fontSize: `${13 * scale}px` }}>{data.opening}</p>
        )}
      </div>

      {/* Body paragraphs */}
      {data.body.map((paragraph, index) => (
        <div key={index} style={{ marginBottom: `${16 * scale}px` }}>
          {editable ? (
            <ParagraphRefineAssist
              paragraphType="body"
              text={paragraph}
              onChange={(v) => onBodyChange(index, v)}
              context={context}
            />
          ) : (
            <p style={{ fontSize: `${13 * scale}px` }}>{paragraph}</p>
          )}
        </div>
      ))}

      {/* Closing */}
      <div style={{ marginBottom: `${28 * scale}px` }}>
        {editable ? (
          <ParagraphRefineAssist
            paragraphType="closing"
            text={data.closing}
            onChange={(v) => onFieldChange('closing', v)}
            context={context}
          />
        ) : (
          <p style={{ fontSize: `${13 * scale}px` }}>{data.closing}</p>
        )}
      </div>

      {/* Sign-off */}
      <div>
        <p style={{ fontSize: `${14 * scale}px`, marginBottom: `${4 * scale}px` }}>
          {data.signOff}
        </p>
        <p style={{ fontSize: `${14 * scale}px`, fontWeight: 600 }}>
          {data.senderName}
        </p>
      </div>
    </div>
  );
};
