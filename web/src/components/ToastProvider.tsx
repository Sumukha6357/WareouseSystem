'use client';

import { Toaster } from 'react-hot-toast';
import { useTheme } from '@/context/ThemeContext';

export default function ToastProvider() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <Toaster
            position="top-right"
            gutter={10}
            containerStyle={{ top: 72 }} // below the navbar
            toastOptions={{
                duration: 4000,
                className: '',
                style: {
                    borderRadius: '1.25rem',
                    padding: '14px 18px',
                    fontSize: '13px',
                    fontWeight: '700',
                    maxWidth: '420px',
                    background: isDark ? '#1e1e2e' : '#ffffff',
                    color: isDark ? '#e2e8f0' : '#0f172a',
                    border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                    boxShadow: isDark
                        ? '0 20px 60px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'
                        : '0 20px 60px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
                },
                success: {
                    iconTheme: { primary: '#10b981', secondary: '#fff' },
                    style: {
                        borderRadius: '1.25rem',
                        padding: '14px 18px',
                        fontSize: '13px',
                        fontWeight: '700',
                        background: isDark ? '#052e16' : '#f0fdf4',
                        color: isDark ? '#86efac' : '#14532d',
                        border: isDark ? '1px solid #166534' : '1px solid #bbf7d0',
                        boxShadow: '0 20px 60px rgba(16,185,129,0.15)',
                    },
                },
                error: {
                    iconTheme: { primary: '#ef4444', secondary: '#fff' },
                    duration: 6000,
                    style: {
                        borderRadius: '1.25rem',
                        padding: '14px 18px',
                        fontSize: '13px',
                        fontWeight: '700',
                        background: isDark ? '#450a0a' : '#fef2f2',
                        color: isDark ? '#fca5a5' : '#7f1d1d',
                        border: isDark ? '1px solid #991b1b' : '1px solid #fecaca',
                        boxShadow: '0 20px 60px rgba(239,68,68,0.15)',
                    },
                },
            }}
        />
    );
}
