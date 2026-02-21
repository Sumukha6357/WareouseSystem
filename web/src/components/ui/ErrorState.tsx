'use client';

import React from 'react';
import { Button } from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({
    title = 'Connection Interrupted',
    message = 'We encountered a synchronization error with the logistics uplink.',
    onRetry
}: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="h-20 w-20 bg-red-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 border border-red-500/20 shadow-2xl shadow-red-500/10">
                <AlertCircle className="h-10 w-10 text-red-500" />
            </div>

            <h3 className="text-2xl font-black text-sharp tracking-tighter mb-3 uppercase italic">
                {title}
            </h3>

            <p className="text-sm font-medium text-muted max-w-md mx-auto leading-relaxed mb-10">
                {message}
            </p>

            {onRetry && (
                <Button
                    onClick={onRetry}
                    className="h-14 px-10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] group shadow-xl shadow-primary/20"
                >
                    <RefreshCw className="mr-3 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                    Attempt Reconnection
                </Button>
            )}
        </div>
    );
}
