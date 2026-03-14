'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#faf7f2', color: '#2c1810' }}
    >
      <p
        className="text-6xl font-black tracking-tight"
        style={{ color: '#c96442' }}
      >
        Oops
      </p>
      <h1 className="mt-4 text-xl font-bold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-center text-sm" style={{ color: '#8b7355' }}>
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
        style={{ backgroundColor: '#c96442' }}
      >
        Try Again
      </button>
    </div>
  );
}
