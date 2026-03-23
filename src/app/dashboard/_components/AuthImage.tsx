'use client';

import { useEffect, useRef, useState } from 'react';
import { getApiBaseUrl, getStoredAccessToken } from '@/lib/api';

type AuthImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  /** API path like /api/v1/resumes/{id}/thumbnail */
  apiPath: string;
};

/**
 * Image component that fetches from an authenticated API endpoint.
 * Creates a blob URL from the response so <img> can render it.
 */
export function AuthImage({ apiPath, alt, ...props }: AuthImageProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => {
    const token = getStoredAccessToken();
    if (!token || !apiPath) return;

    let cancelled = false;

    fetch(`${getApiBaseUrl()}${apiPath}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        urlRef.current = url;
        setBlobUrl(url);
      })
      .catch(() => {
        if (!cancelled) setBlobUrl(null);
      });

    return () => {
      cancelled = true;
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [apiPath]);

  if (!blobUrl) {
    return (
      <div className={props.className} style={{ ...props.style, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="space-y-1.5 p-3">
          <div className="h-1.5 w-3/4 rounded-full bg-[#d7dde7]" />
          <div className="h-1.5 w-1/2 rounded-full bg-[#e0e5ec]" />
          <div className="h-1.5 w-4/5 rounded-full bg-[#dce2eb]" />
        </div>
      </div>
    );
  }

  /* eslint-disable @next/next/no-img-element */
  return <img src={blobUrl} alt={alt} {...props} />;
}
