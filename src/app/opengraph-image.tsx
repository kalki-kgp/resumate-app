import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ResuMate - AI-Powered Resume Builder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #faf7f2 0%, #f0e6d8 50%, #faf7f2 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative blobs */}
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(201, 100, 66, 0.12)',
            filter: 'blur(60px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            right: -40,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'rgba(45, 90, 61, 0.10)',
            filter: 'blur(60px)',
          }}
        />

        {/* Leaf icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: '50%',
            backgroundColor: '#2d5a3d',
            marginBottom: 24,
          }}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: '#2c1810',
            lineHeight: 1.1,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          ResuMate
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: '#8b7355',
            textAlign: 'center',
            marginBottom: 40,
            maxWidth: 700,
          }}
        >
          AI-Powered Resume Builder That Gets You Hired
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: 48,
            alignItems: 'center',
          }}
        >
          {[
            { value: '50K+', label: 'Resumes Created' },
            { value: '92%', label: 'ATS Pass Rate' },
            { value: '3x', label: 'More Interviews' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 32px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                borderRadius: 16,
                border: '1px solid #e8e0d4',
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: '#c96442',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#8b7355',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(to right, #c96442, #2d5a3d)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
