'use client';

/**
 * ClientErrorBoundary.tsx
 * A thin 'use client' wrapper so ErrorBoundary (class component)
 * can be imported inside a Next.js server layout without issues.
 */

import ErrorBoundary from './ErrorBoundary';
export { ErrorBoundary as default };
