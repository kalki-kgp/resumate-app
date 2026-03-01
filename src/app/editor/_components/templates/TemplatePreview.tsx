'use client';

import type { ResumeData, TemplateType } from '@/types';
import { ModernPreview } from './ModernTemplate';
import { ClassicPreview } from './ClassicTemplate';
import { CreativePreview } from './CreativeTemplate';
import { MinimalPreview } from './MinimalTemplate';

interface TemplatePreviewProps {
  template: TemplateType;
  data: ResumeData;
  scale?: number;
}

export const TemplatePreview = ({ template, data, scale = 0.15 }: TemplatePreviewProps) => {
  switch (template) {
    case 'modern':
      return <ModernPreview data={data} scale={scale} />;
    case 'classic':
      return <ClassicPreview data={data} scale={scale} />;
    case 'creative':
      return <CreativePreview data={data} scale={scale} />;
    case 'minimal':
      return <MinimalPreview data={data} scale={scale} />;
    default:
      return <ModernPreview data={data} scale={scale} />;
  }
};
