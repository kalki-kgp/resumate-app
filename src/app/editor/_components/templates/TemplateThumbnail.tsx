'use client';

import { memo } from 'react';
import type { TemplateType } from '@/types';
import { ModernPreview } from './ModernTemplate';
import { ClassicPreview } from './ClassicTemplate';
import { CreativePreview } from './CreativeTemplate';
import { MinimalPreview } from './MinimalTemplate';
import { SAMPLE_DATA } from './sampleData';

/**
 * Render the template at a proper scale so text proportions look correct,
 * then CSS-transform the whole thing down to thumbnail size.
 *
 * RENDER_SCALE  – the scale fed to the preview (controls text/spacing ratio)
 * SHRINK        – CSS transform applied on top to fit the sidebar card
 * Container dims = rendered dims × SHRINK  (clips overflow)
 */
const RENDER_SCALE = 0.55;
const SHRINK = 0.42;

const CONTAINER_W = `${210 * RENDER_SCALE * SHRINK}mm`;
const CONTAINER_H = `${297 * RENDER_SCALE * SHRINK}mm`;

const thumbWrapStyle: React.CSSProperties = {
  width: CONTAINER_W,
  height: CONTAINER_H,
  overflow: 'hidden',
};

const innerStyle: React.CSSProperties = {
  transform: `scale(${SHRINK})`,
  transformOrigin: 'top left',
};

export const ModernThumbnail = memo(() => (
  <div style={thumbWrapStyle}>
    <div style={innerStyle}>
      <ModernPreview data={SAMPLE_DATA} scale={RENDER_SCALE} />
    </div>
  </div>
));
ModernThumbnail.displayName = 'ModernThumbnail';

export const ClassicThumbnail = memo(() => (
  <div style={thumbWrapStyle}>
    <div style={innerStyle}>
      <ClassicPreview data={SAMPLE_DATA} scale={RENDER_SCALE} />
    </div>
  </div>
));
ClassicThumbnail.displayName = 'ClassicThumbnail';

export const CreativeThumbnail = memo(() => (
  <div style={thumbWrapStyle}>
    <div style={innerStyle}>
      <CreativePreview data={SAMPLE_DATA} scale={RENDER_SCALE} />
    </div>
  </div>
));
CreativeThumbnail.displayName = 'CreativeThumbnail';

export const MinimalThumbnail = memo(() => (
  <div style={thumbWrapStyle}>
    <div style={innerStyle}>
      <MinimalPreview data={SAMPLE_DATA} scale={RENDER_SCALE} />
    </div>
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
