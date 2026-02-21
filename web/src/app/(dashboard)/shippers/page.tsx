'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ShipperManagementView from '@/components/ShipperManagementView';

export default function ShippersPage() {
    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ShipperManagementView />
            </div>
        </ProtectedRoute>
    );
}
