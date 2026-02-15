import { getApiBaseUrl } from '@/lib/api';
import type { DashboardResume } from './dashboard-types';

export const isPdfFile = (file: File): boolean =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

export const formatRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return 'edited just now';
  if (diffMs < hour) return `edited ${Math.max(1, Math.floor(diffMs / minute))}m ago`;
  if (diffMs < day) return `edited ${Math.max(1, Math.floor(diffMs / hour))}h ago`;
  return `edited ${Math.max(1, Math.floor(diffMs / day))}d ago`;
};

export const formatJoinDate = (isoDate: string | null): string => {
  if (!isoDate) return 'Unknown';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return 'Unknown';
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
};

export const resumeThumbnailSrc = (resume: DashboardResume): string | null => {
  if (!resume.thumbnail_url) return null;
  return `${getApiBaseUrl()}${resume.thumbnail_url}`;
};

export const getCategoryBadge = (value: number): { label: string; className: string } => {
  if (value >= 90) return { label: 'Excellent', className: 'bg-[#eaf8e2] text-[#67bf2b]' };
  if (value >= 75) return { label: 'Good', className: 'bg-[#ecf6ec] text-[#2d8b46]' };
  return { label: 'Average', className: 'bg-[#fff1e6] text-[#d88f54]' };
};
