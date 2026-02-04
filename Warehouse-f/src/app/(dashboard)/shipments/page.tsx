'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ShipmentManagementView from '@/components/ShipmentManagementView';

export default function ShipmentsPage() {
    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ShipmentManagementView />
            </div>
        </ProtectedRoute>
    );
}
