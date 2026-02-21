'use client';

import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
    fullPage?: boolean;
}

export default function LoadingSpinner({ message = 'Synchronizing...', fullPage = false }: LoadingSpinnerProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
            <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>

                {/* Spinner Rings */}
                <div className="relative h-16 w-16">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/10"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-primary/5"></div>
                    <div className="absolute inset-2 rounded-full border-4 border-b-primary/40 border-t-transparent border-r-transparent border-l-transparent animate-[spin_1.5s_linear_infinite_reverse]"></div>
                </div>
            </div>

            {(
                <div className="text-center space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted animate-pulse">
                        {message}
                    </p>
                    <div className="flex justify-center gap-1">
                        <div className="h-1 w-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-1 w-1 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-1 w-1 rounded-full bg-primary/40 animate-bounce"></div>
                    </div>
                </div>
            )}
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[999] flex items-center justify-center">
                {content}
            </div>
        );
    }

    return (
        <div className="py-20 flex items-center justify-center w-full">
            {content}
        </div>
    );
}
