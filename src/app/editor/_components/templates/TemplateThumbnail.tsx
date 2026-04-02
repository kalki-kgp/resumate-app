'use client';

import { memo } from 'react';
import type { TemplateType } from '@/types';
import { ModernPreview } from './ModernTemplate';
import { ClassicPreview } from './ClassicTemplate';
import { CreativePreview } from './CreativeTemplate';
import { MinimalPreview } from './MinimalTemplate';
import { ExecutivePreview } from './ExecutiveTemplate';
import { SAMPLE_DATA } from './sampleData';

/**
 * Templates render at fixed A4 size (794×1123 px).
 * CSS transform scales the whole thing down to thumbnail size.
 *
 * SHRINK – CSS transform scale factor
 * Container dims = 794 × shrink  by  1123 × shrink  (clips overflow)
 */
const DEFAULT_SHRINK = 0.23;

function getStyles(shrink: number) {
  return {
    wrap: {
      width: `${794 * shrink}px`,
      height: `${1123 * shrink}px`,
      overflow: 'hidden' as const,
    },
    inner: {
      transform: `scale(${shrink})`,
      transformOrigin: 'top left' as const,
    },
  };
}

export const ModernThumbnail = memo(({ shrink = DEFAULT_SHRINK }: { shrink?: number }) => {
  const s = getStyles(shrink);
  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        <ModernPreview data={SAMPLE_DATA} />
      </div>
    </div>
  );
});
ModernThumbnail.displayName = 'ModernThumbnail';

export const ClassicThumbnail = memo(({ shrink = DEFAULT_SHRINK }: { shrink?: number }) => {
  const s = getStyles(shrink);
  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        <ClassicPreview data={SAMPLE_DATA} />
      </div>
    </div>
  );
});
ClassicThumbnail.displayName = 'ClassicThumbnail';

export const CreativeThumbnail = memo(({ shrink = DEFAULT_SHRINK }: { shrink?: number }) => {
  const s = getStyles(shrink);
  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        <CreativePreview data={SAMPLE_DATA} />
      </div>
    </div>
  );
});
CreativeThumbnail.displayName = 'CreativeThumbnail';

export const MinimalThumbnail = memo(({ shrink = DEFAULT_SHRINK }: { shrink?: number }) => {
  const s = getStyles(shrink);
  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        <MinimalPreview data={SAMPLE_DATA} />
      </div>
    </div>
  );
});
MinimalThumbnail.displayName = 'MinimalThumbnail';

export const ExecutiveThumbnail = memo(({ shrink = DEFAULT_SHRINK }: { shrink?: number }) => {
  const s = getStyles(shrink);
  return (
    <div style={s.wrap}>
      <div style={s.inner}>
        <ExecutivePreview data={SAMPLE_DATA} />
      </div>
    </div>
  );
});
ExecutiveThumbnail.displayName = 'ExecutiveThumbnail';

interface TemplateThumbnailProps {
  template: TemplateType;
  shrink?: number;
}

export const TemplateThumbnail = ({ template, shrink }: TemplateThumbnailProps) => {
  switch (template) {
    case 'modern':
      return <ModernThumbnail shrink={shrink} />;
    case 'classic':
      return <ClassicThumbnail shrink={shrink} />;
    case 'creative':
      return <CreativeThumbnail shrink={shrink} />;
    case 'minimal':
      return <MinimalThumbnail shrink={shrink} />;
    case 'executive':
      return <ExecutiveThumbnail shrink={shrink} />;
    default:
      return <ModernThumbnail shrink={shrink} />;
  }
};
