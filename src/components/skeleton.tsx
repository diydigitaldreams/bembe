"use client";

export function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white overflow-hidden animate-pulse">
      <div className="h-40 bg-bembe-night/5" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-bembe-night/10 rounded w-3/4" />
        <div className="h-3 bg-bembe-night/5 rounded w-1/2" />
        <div className="flex gap-3">
          <div className="h-3 bg-bembe-night/5 rounded w-16" />
          <div className="h-3 bg-bembe-night/5 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonReview() {
  return (
    <div className="bg-white rounded-2xl p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-8 w-8 rounded-full bg-bembe-night/10" />
        <div className="flex-1">
          <div className="h-3 bg-bembe-night/10 rounded w-24 mb-1" />
          <div className="h-2 bg-bembe-night/5 rounded w-16" />
        </div>
      </div>
      <div className="h-3 bg-bembe-night/5 rounded w-full mb-2" />
      <div className="h-3 bg-bembe-night/5 rounded w-2/3" />
    </div>
  );
}
