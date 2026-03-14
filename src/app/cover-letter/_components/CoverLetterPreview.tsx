'use client';

import { useState, useRef, useEffect } from 'react';
import type { CoverLetterData } from '@/types';
import { ParagraphRefineAssist } from './ParagraphRefineAssist';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}

const EditableText = ({ value, onChange, style }: EditableTextProps) => {
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
          padding: '2px 0',
          borderBottom: '1.5px solid #c96442',
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
        borderRadius: '4px',
        transition: 'background-color 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef6ee')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {value}
    </p>
  );
};

// A4 at 96 DPI: 794 x 1123 px
const A4_WIDTH = 794;
const A4_MIN_HEIGHT = 1123;

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
  return (
    <div
      className="cl-scale-wrapper"
      style={{
        width: `${A4_WIDTH * scale}px`,
        height: `${A4_MIN_HEIGHT * scale}px`,
        overflow: 'hidden',
      }}
    >
      <div
        className="cl-preview"
        style={{
          width: `${A4_WIDTH}px`,
          minHeight: `${A4_MIN_HEIGHT}px`,
          padding: '48px 56px',
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: '14px',
          lineHeight: 1.7,
          color: '#2c2c2c',
          backgroundColor: '#ffffff',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Date */}
        {editable ? (
          <div style={{ marginBottom: '24px' }}>
            <EditableText
              value={data.date}
              onChange={(v) => onFieldChange('date', v)}
              style={{ fontSize: '13px', color: '#666' }}
            />
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '24px' }}>
            {data.date}
          </p>
        )}

        {/* Recipient */}
        <div style={{ marginBottom: '8px' }}>
          {editable ? (
            <>
              <EditableText
                value={data.recipientName}
                onChange={(v) => onFieldChange('recipientName', v)}
                style={{ fontSize: '14px', fontWeight: 600 }}
              />
              <EditableText
                value={data.companyName}
                onChange={(v) => onFieldChange('companyName', v)}
                style={{ fontSize: '13px', color: '#666' }}
              />
            </>
          ) : (
            <>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>
                {data.recipientName}
              </p>
              <p style={{ fontSize: '13px', color: '#666' }}>
                {data.companyName}
              </p>
            </>
          )}
        </div>

        {/* Greeting */}
        {editable ? (
          <div style={{ marginBottom: '20px' }}>
            <EditableText
              value={data.greeting}
              onChange={(v) => onFieldChange('greeting', v)}
              style={{ fontSize: '14px' }}
            />
          </div>
        ) : (
          <p style={{ marginBottom: '20px', fontSize: '14px' }}>
            {data.greeting}
          </p>
        )}

        {/* Opening */}
        <div style={{ marginBottom: '16px' }}>
          {editable ? (
            <ParagraphRefineAssist
              paragraphType="opening"
              text={data.opening}
              onChange={(v) => onFieldChange('opening', v)}
              context={context}
            />
          ) : (
            <p style={{ fontSize: '13px' }}>{data.opening}</p>
          )}
        </div>

        {/* Body paragraphs */}
        {data.body.map((paragraph, index) => (
          <div key={index} style={{ marginBottom: '16px' }}>
            {editable ? (
              <ParagraphRefineAssist
                paragraphType="body"
                text={paragraph}
                onChange={(v) => onBodyChange(index, v)}
                context={context}
              />
            ) : (
              <p style={{ fontSize: '13px' }}>{paragraph}</p>
            )}
          </div>
        ))}

        {/* Closing */}
        <div style={{ marginBottom: '28px' }}>
          {editable ? (
            <ParagraphRefineAssist
              paragraphType="closing"
              text={data.closing}
              onChange={(v) => onFieldChange('closing', v)}
              context={context}
            />
          ) : (
            <p style={{ fontSize: '13px' }}>{data.closing}</p>
          )}
        </div>

        {/* Sign-off */}
        <div>
          {editable ? (
            <>
              <EditableText
                value={data.signOff}
                onChange={(v) => onFieldChange('signOff', v)}
                style={{ fontSize: '14px', marginBottom: '4px' }}
              />
              <EditableText
                value={data.senderName}
                onChange={(v) => onFieldChange('senderName', v)}
                style={{ fontSize: '14px', fontWeight: 600 }}
              />
            </>
          ) : (
            <>
              <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                {data.signOff}
              </p>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>
                {data.senderName}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
