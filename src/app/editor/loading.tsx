export default function EditorLoading() {
  return (
    <div className="flex h-screen" style={{ backgroundColor: '#faf7f2' }}>
      <div className="w-96 flex-shrink-0 border-r" style={{ borderColor: '#eadfce', backgroundColor: '#fffaf4' }}>
        <div className="h-16 border-b" style={{ borderColor: '#eadfce' }} />
        <div className="space-y-4 p-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-2xl" style={{ backgroundColor: '#f0e6d8' }} />
          ))}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="h-[500px] w-[353px] animate-pulse rounded-sm bg-white shadow-lg" />
      </div>
    </div>
  );
}
