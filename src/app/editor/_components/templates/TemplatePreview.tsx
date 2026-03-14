'use client';

import type { ResumeData, TemplateType } from '@/types';
import { ModernPreview } from './ModernTemplate';
import { ClassicPreview } from './ClassicTemplate';
import { CreativePreview } from './CreativeTemplate';
import { MinimalPreview } from './MinimalTemplate';

interface TemplatePreviewProps {
  template: TemplateType;
  data: ResumeData;
}

export const TemplatePreview = ({ template, data }: TemplatePreviewProps) => {
  switch (template) {
    case 'modern':
      return <ModernPreview data={data} />;
    case 'classic':
      return <ClassicPreview data={data} />;
    case 'creative':
      return <CreativePreview data={data} />;
    case 'minimal':
      return <MinimalPreview data={data} />;
    default:
      return <ModernPreview data={data} />;
  }
};
