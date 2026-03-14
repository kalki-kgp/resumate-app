import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#faf7f2', color: '#2c1810' }}
    >
      <p
        className="text-8xl font-black tracking-tight"
        style={{ fontFamily: 'var(--font-geist-sans), sans-serif', color: '#c96442' }}
      >
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-center text-sm" style={{ color: '#8b7355' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/home"
        className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg"
        style={{ backgroundColor: '#c96442' }}
      >
        Back to Home
      </Link>
    </div>
  );
}
