'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface RequireRoleProps {
    role: string | string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * A wrapper component that only renders its children if the user
 * has one of the required roles.
 */
export default function RequireRole({ role, children, fallback = null }: RequireRoleProps) {
    const { hasRole, isLoading } = useAuth();

    if (isLoading) return null;

    if (hasRole(role)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
