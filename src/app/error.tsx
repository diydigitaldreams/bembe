"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bembe-night flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-bembe-coral/20 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-bembe-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Algo salio mal</h1>
      <p className="text-white/60 mb-8 max-w-sm">Something unexpected happened. Please try again.</p>
      <button
        onClick={reset}
        className="px-8 py-3 rounded-full bg-bembe-teal text-white font-semibold hover:bg-bembe-teal/90 transition"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
