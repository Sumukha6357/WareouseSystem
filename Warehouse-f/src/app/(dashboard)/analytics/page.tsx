'use client';

import AnalyticsDashboardView from '@/components/AnalyticsDashboardView';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AnalyticsPage() {
    return (
        <ProtectedRoute>
            <AnalyticsDashboardView />
        </ProtectedRoute>
    );
}
