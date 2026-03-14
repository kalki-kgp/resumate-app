'use client';

import { useState, useRef, useEffect } from 'react';
import type { CoverLetterData } from '@/types';
import { ParagraphRefineAssist } from './ParagraphRefineAssist';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  scale: number;
}

const EditableText = ({ value, onChange, style, scale }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const commit = () => {
    setIsEditing(false);
    if (draft.trim() !== value) onChange(draft.trim());
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') {
            setDraft(value);
            setIsEditing(false);
          }
        }}
        style={{
          ...style,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          width: '100%',
          fontFamily: 'inherit',
          padding: `${2 * scale}px 0`,
          borderBottom: `${1.5 * scale}px solid #c96442`,
        }}
      />
    );
  }

  return (
    <p
      onClick={() => setIsEditing(true)}
      title="Click to edit"
      style={{
        ...style,
        cursor: 'text',
        borderRadius: `${4 * scale}px`,
        transition: 'background-color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef6ee')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {value}
    </p>
  );
};

interface CoverLetterPreviewProps {
  data: CoverLetterData;
  scale: number;
  printScale?: number;
  editable: boolean;
  onFieldChange: (field: keyof CoverLetterData, value: string) => void;
  onBodyChange: (index: number, value: string) => void;
  context?: Record<string, string>;
}

export const CoverLetterPreview = ({
  data,
  scale,
  printScale = 1,
  editable,
  onFieldChange,
  onBodyChange,
  context = {},
}: CoverLetterPreviewProps) => {
  // A4 dimensions in mm: 210 x 297
  const widthPx = 210 * 3.78 * scale; // ~794px at scale 1
  const minHeightPx = 297 * 3.78 * scale; // ~1123px at scale 1

  // Print dimensions at full scale
  const printWidthPx = 210 * 3.78 * printScale;
  const printMinHeightPx = 297 * 3.78 * printScale;

  return (
    <>
      <style>{`
        @media print {
          .cl-preview {
            width: ${printWidthPx}px !important;
            min-height: ${printMinHeightPx}px !important;
            padding: ${48 * printScale}px ${56 * printScale}px !important;
            font-size: ${14 * printScale}px !important;
          }
          .cl-preview p, .cl-preview input, .cl-preview div {
            font-size: inherit !important;
          }
        }
      `}</style>
      <div
        className="cl-preview"
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
        {editable ? (
          <>
            <EditableText
              value={data.signOff}
              onChange={(v) => onFieldChange('signOff', v)}
              scale={scale}
              style={{ fontSize: `${14 * scale}px`, marginBottom: `${4 * scale}px` }}
            />
            <EditableText
              value={data.senderName}
              onChange={(v) => onFieldChange('senderName', v)}
              scale={scale}
              style={{ fontSize: `${14 * scale}px`, fontWeight: 600 }}
            />
          </>
        ) : (
          <>
            <p style={{ fontSize: `${14 * scale}px`, marginBottom: `${4 * scale}px` }}>
              {data.signOff}
            </p>
            <p style={{ fontSize: `${14 * scale}px`, fontWeight: 600 }}>
              {data.senderName}
            </p>
          </>
        )}
      </div>
    </div>
    </>
  );
};
