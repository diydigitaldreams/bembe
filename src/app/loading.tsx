export default function Loading() {
  return (
    <div className="min-h-screen bg-bembe-sand">
      {/* Navbar skeleton */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-bembe-night/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-7 w-20 rounded bg-bembe-gold/20 animate-pulse" />
          <div className="flex gap-3">
            <div className="h-8 w-16 rounded-full bg-bembe-night/5 animate-pulse" />
            <div className="h-8 w-16 rounded-full bg-bembe-night/5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="h-12 w-3/4 mx-auto rounded-lg bg-bembe-night/5 animate-pulse mb-4" />
        <div className="h-6 w-1/2 mx-auto rounded bg-bembe-night/5 animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-white p-4 shadow-sm"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="h-40 rounded-xl bg-bembe-teal/10 animate-pulse mb-4" />
            <div className="h-5 w-3/4 rounded bg-bembe-night/10 animate-pulse mb-2" />
            <div className="h-4 w-1/2 rounded bg-bembe-night/5 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
