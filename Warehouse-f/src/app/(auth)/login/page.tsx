'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Box, Lock, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

            {successMessage && (
                <div className="mb-4 rounded-md bg-green-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
                        </div>
                    </div>
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username or Email</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                            value={credentials.username}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                            value={credentials.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <Button type="submit" className="w-full" isLoading={loading}>
                        Sign in
                    </Button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                            New to WarehouseMS?
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <Link href="/register">
                        <Button variant="outline" className="w-full">
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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Box className="h-12 w-12 text-indigo-600" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
}
