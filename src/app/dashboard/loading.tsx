export default function DashboardLoading() {
  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f3f4f6' }}>
      <div className="w-64 flex-shrink-0" style={{ backgroundColor: '#1b1d21' }} />
      <div className="flex-1 p-8">
        <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      </div>
    </div>
  );
}
