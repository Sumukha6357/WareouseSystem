'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Footer from '@/components/Footer';

export default function ConditionalFooter() {
    const pathname = usePathname();
    const { user, isLoading } = useAuth();

    // Don't show footer on dashboard pages
    if (pathname?.startsWith('/dashboard')) {
        return null;
    }

    // Don't show footer if user is logged in (as per user request)
    if (user && !isLoading) {
        return null;
    }

    return <Footer />;
}
