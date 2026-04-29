/**
 * Route Prefetching Utilities
 *
 * Preloads route components before navigation to improve perceived performance.
 * Uses modern browser APIs like requestIdleCallback for optimal timing.
 */

// Map of route paths to their lazy-loaded chunks
const routeModules: Record<string, () => Promise<any>> = {
  '/work': () => import('../app/components/WorkPage'),
  '/services': () => import('../app/components/ServicesPage'),
  '/studio': () => import('../app/components/StudioPage'),
  '/vault': () => import('../app/components/VaultPage'),
  '/about': () => import('../app/components/AboutPage'),
  '/contact': () => import('../app/components/ContactPage'),
  '/stories': () => import('../app/components/StoriesPage'),
};

// Track which routes have been prefetched
const prefetchedRoutes = new Set<string>();

/**
 * Prefetch a route's component chunk
 *
 * @param path - Route path to prefetch
 * @returns Promise that resolves when prefetch completes
 */
export function prefetchRoute(path: string): Promise<void> {
  // Already prefetched
  if (prefetchedRoutes.has(path)) {
    return Promise.resolve();
  }

  const moduleLoader = routeModules[path];
  if (!moduleLoader) {
    if (import.meta.env.DEV) {
      console.warn(`No prefetch module found for route: ${path}`);
    }
    return Promise.resolve();
  }

  // Mark as prefetched immediately to avoid duplicate requests
  prefetchedRoutes.add(path);

  return moduleLoader()
    .then(() => {
      if (import.meta.env.DEV) {
        console.log(`Prefetched route: ${path}`);
      }
    })
    .catch((error) => {
      // Remove from set if prefetch failed
      prefetchedRoutes.delete(path);
      if (import.meta.env.DEV) {
        console.error(`Failed to prefetch route ${path}:`, error);
      }
    });
}

/**
 * Prefetch multiple routes at once
 *
 * @param paths - Array of route paths to prefetch
 */
export function prefetchRoutes(paths: string[]): Promise<void[]> {
  return Promise.all(paths.map(prefetchRoute));
}

/**
 * Prefetch a route when the browser is idle
 * Uses requestIdleCallback for optimal performance
 *
 * @param path - Route path to prefetch
 */
export function prefetchRouteOnIdle(path: string): void {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => {
      prefetchRoute(path);
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      prefetchRoute(path);
    }, 1);
  }
}

/**
 * Prefetch high-priority routes after initial page load
 * Called from the main app component
 */
export function prefetchCriticalRoutes(): void {
  // Wait for the page to be fully loaded
  if (document.readyState === 'complete') {
    prefetchHighPriorityRoutes();
  } else {
    window.addEventListener('load', prefetchHighPriorityRoutes, { once: true });
  }
}

function prefetchHighPriorityRoutes(): void {
  // Prefetch most commonly visited routes
  const highPriorityRoutes = ['/work', '/services', '/contact'];

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(() => {
      prefetchRoutes(highPriorityRoutes);
    }, { timeout: 2000 });
  } else {
    setTimeout(() => {
      prefetchRoutes(highPriorityRoutes);
    }, 1000);
  }
}

/**
 * Hook for link hover prefetching
 * Call this on mouseEnter for navigation links
 */
export function handleLinkHover(path: string): void {
  prefetchRoute(path);
}
