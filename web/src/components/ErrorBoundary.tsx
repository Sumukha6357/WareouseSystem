'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Copy, CheckCircle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorId: string | null;
    copied: boolean;
}

function generateErrorId(): string {
    return `ERR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorId: null,
            copied: false,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return {
            hasError: true,
            error,
            errorId: generateErrorId(),
        };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Placeholder for monitoring service (Sentry, Datadog, etc.)
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('[ErrorBoundary] Uncaught Error:', error.message);
        console.error('[ErrorBoundary] Error ID:', this.state.errorId);
        console.error('[ErrorBoundary] Stack:', error.stack);
        console.error('[ErrorBoundary] Component Stack:', info.componentStack);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorId: null, copied: false });
    };

    handleCopyId = () => {
        if (this.state.errorId) {
            navigator.clipboard.writeText(this.state.errorId).then(() => {
                this.setState({ copied: true });
                setTimeout(() => this.setState({ copied: false }), 2000);
            });
        }
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            const { error, errorId, copied } = this.state;

            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-6">
                    <div className="max-w-xl w-full">
                        {/* Animated alert icon */}
                        <div className="flex justify-center mb-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse scale-150" />
                                <div className="relative p-8 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-[2.5rem] border-2 border-red-500/20">
                                    <AlertTriangle className="h-16 w-16 text-red-500" strokeWidth={1.5} />
                                </div>
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="text-center mb-10">
                            <h1 className="text-4xl font-black text-sharp tracking-tighter mb-4">
                                System Exception
                            </h1>
                            <p className="text-sm font-medium text-muted max-w-sm mx-auto leading-relaxed">
                                An unexpected error disrupted the render cycle. The error has been logged
                                and the system state has been preserved.
                            </p>
                        </div>

                        {/* Error card */}
                        <div className="bg-card rounded-[3rem] border-2 border-card-border shadow-xl overflow-hidden mb-8">
                            {/* Error message */}
                            <div className="p-8 border-b border-card-border/50">
                                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-3">
                                    Exception Message
                                </p>
                                <p className="text-sm font-mono text-red-500 font-bold bg-red-500/5 py-3 px-5 rounded-2xl border border-red-500/10 break-words">
                                    {error?.message || 'Unknown error'}
                                </p>
                            </div>

                            {/* Error ID */}
                            <div className="p-8">
                                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-3">
                                    Error Reference ID
                                </p>
                                <div className="flex items-center gap-3">
                                    <code className="flex-1 text-sm font-black font-mono text-sharp bg-background py-3 px-5 rounded-2xl border-2 border-card-border tracking-wider">
                                        {errorId}
                                    </code>
                                    <button
                                        onClick={this.handleCopyId}
                                        className="p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-2xl border border-primary/20 transition-all hover:scale-110 shrink-0"
                                        title="Copy error ID"
                                    >
                                        {copied ? (
                                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <Copy className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-[10px] text-muted/60 font-bold uppercase tracking-widest mt-3">
                                    Provide this ID when reporting the issue
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={this.handleRetry}
                                className="flex-1 flex items-center justify-center gap-3 py-5 px-8 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
                            >
                                <RefreshCw className="h-5 w-5" />
                                Retry Render
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex-1 flex items-center justify-center gap-3 py-5 px-8 bg-card text-sharp rounded-[2rem] font-black text-sm uppercase tracking-widest border-2 border-card-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
