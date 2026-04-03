import { ImageResponse } from 'next/og';

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
          position: 'relative',
        }}
      >
        {/* Soft background circles (no blur — Satori doesn't support filter) */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            left: -40,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,100,66,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            right: -20,
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(45,90,61,0.07) 0%, transparent 70%)',
          }}
        />

        {/* Leaf icon circle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#2d5a3d',
            marginBottom: 28,
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 48 48"
          >
            <path
              d="M24 10c-2 4-3 8-3 12 0 6 3 11 7 14 0 0-1-3-1-6 4-2 7-6 8-11-2 3-5 5-8 6 0-5-1-10-3-15z"
              fill="white"
              stroke="white"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
            <line
              x1="24"
              y1="10"
              x2="21"
              y2="36"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#2c1810',
            lineHeight: 1.1,
            marginBottom: 12,
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
            marginBottom: 48,
          }}
        >
          AI-Powered Resume Builder That Gets You Hired
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px 40px',
              backgroundColor: 'white',
              borderRadius: 16,
              border: '1px solid #e8e0d4',
            }}
          >
            <div style={{ fontSize: 40, fontWeight: 800, color: '#c96442' }}>
              50K+
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#8b7355',
                textTransform: 'uppercase' as const,
                letterSpacing: 1,
                marginTop: 4,
              }}
            >
              Resumes Created
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px 40px',
              backgroundColor: 'white',
              borderRadius: 16,
              border: '1px solid #e8e0d4',
            }}
          >
            <div style={{ fontSize: 40, fontWeight: 800, color: '#c96442' }}>
              92%
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#8b7355',
                textTransform: 'uppercase' as const,
                letterSpacing: 1,
                marginTop: 4,
              }}
            >
              ATS Pass Rate
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px 40px',
              backgroundColor: 'white',
              borderRadius: 16,
              border: '1px solid #e8e0d4',
            }}
          >
            <div style={{ fontSize: 40, fontWeight: 800, color: '#c96442' }}>
              3x
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#8b7355',
                textTransform: 'uppercase' as const,
                letterSpacing: 1,
                marginTop: 4,
              }}
            >
              More Interviews
            </div>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 6,
            background: 'linear-gradient(to right, #c96442, #2d5a3d)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
