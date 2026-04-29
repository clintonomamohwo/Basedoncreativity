import { Suspense, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
import { prefetchCriticalRoutes } from '../lib/prefetch';

function RouteLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Based on Creativity</p>
        <p className="mt-4 text-sm text-white/85">Loading page…</p>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    prefetchCriticalRoutes();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Suspense fallback={<RouteLoadingFallback />}>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </Suspense>
    </MotionConfig>
  );
}
