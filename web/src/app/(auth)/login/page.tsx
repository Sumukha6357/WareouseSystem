'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Box, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccessMessage('Registration successful! Please log in.');
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(credentials);
            // Login function handles redirect
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Login failed. Please try again.';
            if (message.toLowerCase().includes('401') || message.toLowerCase().includes('invalid')) {
                setError('Invalid username or password');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/90 dark:bg-card/90 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-card-border/50 animate-scale-in">

            {successMessage && (
                <div className="mb-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{successMessage}</h3>
                        </div>
                    </div>
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>

                {error && (
                    <div className="rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-4 border border-red-200 dark:border-red-800 animate-slide-up">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-bold text-red-800 dark:text-red-300">{error}</h3>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="username" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Username or Email</label>
                    <div className="mt-1 relative rounded-xl shadow-sm group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="focus:ring-2 focus:ring-primary focus:border-transparent block w-full pl-12 pr-4 py-3 sm:text-sm border-2 border-input-border rounded-xl bg-white dark:bg-background text-foreground transition-all duration-300 hover:border-primary/50"
                            value={credentials.username}
                            onChange={handleChange}
                            placeholder="Enter your username or email"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                    <div className="mt-1 relative rounded-xl shadow-sm group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            className="focus:ring-2 focus:ring-primary focus:border-transparent block w-full pl-12 pr-12 py-3 sm:text-sm border-2 border-input-border rounded-xl bg-white dark:bg-background text-foreground transition-all duration-300 hover:border-primary/50"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:text-primary transition-colors z-10"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-primary transition-colors" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-primary transition-colors" />
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" isLoading={loading}>
                        Sign in
                    </Button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white dark:bg-card text-gray-500 dark:text-gray-400 font-medium">
                            New to WarehouseMS?
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <Link href="/register">
                        <Button variant="outline" className="w-full border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-bold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02]">
                            Create an account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-pink-400/30 to-rose-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse-subtle"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center">
                    <div className="h-16 w-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/50 animate-float">
                        <Box className="h-9 w-9 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Access your warehouse management dashboard
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
