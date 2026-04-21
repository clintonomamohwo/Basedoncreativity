import { Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

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
  return (
    <MotionConfig reducedMotion="user">
      <Suspense fallback={<RouteLoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </MotionConfig>
  );
}
