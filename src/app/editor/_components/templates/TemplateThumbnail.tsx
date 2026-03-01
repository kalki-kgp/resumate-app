'use client';

import { memo } from 'react';
import type { TemplateType } from '@/types';
import { ModernPreview } from './ModernTemplate';
import { ClassicPreview } from './ClassicTemplate';
import { CreativePreview } from './CreativeTemplate';
import { MinimalPreview } from './MinimalTemplate';
import { SAMPLE_DATA } from './sampleData';

const THUMB_SCALE = 0.13;

export const ModernThumbnail = memo(() => (
  <div className="overflow-hidden" style={{ width: 210 * THUMB_SCALE + 'mm', height: 297 * THUMB_SCALE + 'mm' }}>
    <ModernPreview data={SAMPLE_DATA} scale={THUMB_SCALE} />
  </div>
));
ModernThumbnail.displayName = 'ModernThumbnail';

export const ClassicThumbnail = memo(() => (
  <div className="overflow-hidden" style={{ width: 210 * THUMB_SCALE + 'mm', height: 297 * THUMB_SCALE + 'mm' }}>
    <ClassicPreview data={SAMPLE_DATA} scale={THUMB_SCALE} />
  </div>
));
ClassicThumbnail.displayName = 'ClassicThumbnail';

export const CreativeThumbnail = memo(() => (
  <div className="overflow-hidden" style={{ width: 210 * THUMB_SCALE + 'mm', height: 297 * THUMB_SCALE + 'mm' }}>
    <CreativePreview data={SAMPLE_DATA} scale={THUMB_SCALE} />
  </div>
));
CreativeThumbnail.displayName = 'CreativeThumbnail';

export const MinimalThumbnail = memo(() => (
  <div className="overflow-hidden" style={{ width: 210 * THUMB_SCALE + 'mm', height: 297 * THUMB_SCALE + 'mm' }}>
    <MinimalPreview data={SAMPLE_DATA} scale={THUMB_SCALE} />
  </div>
));
MinimalThumbnail.displayName = 'MinimalThumbnail';

interface TemplateThumbnailProps {
  template: TemplateType;
}

export const TemplateThumbnail = ({ template }: TemplateThumbnailProps) => {
  switch (template) {
    case 'modern':
      return <ModernThumbnail />;
    case 'classic':
      return <ClassicThumbnail />;
    case 'creative':
      return <CreativeThumbnail />;
    case 'minimal':
      return <MinimalThumbnail />;
    default:
      return <ModernThumbnail />;
  }
};
