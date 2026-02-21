'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Box, Lock, Mail, User, Eye, EyeOff, Shield } from 'lucide-react';
import httpClient from '@/lib/httpClient';
import { ApiError } from '@/lib/httpClient';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        userRole: 'STAFF',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await httpClient.post('/register', formData);
            router.push('/login?registered=true');
        } catch (err: unknown) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : err instanceof Error
                        ? err.message
                        : 'Registration failed',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6 animate-in fade-in duration-700">
            <div className="w-full max-w-xl">
                {/* Header */}
                <div className="text-center mb-12 animate-in slide-in-from-top duration-500">
                    <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-primary to-primary/80 rounded-[2.5rem] shadow-2xl shadow-primary/30 mb-8 group hover:scale-110 transition-transform duration-500">
                        <Box className="h-14 w-14 text-white animate-pulse" strokeWidth={2.5} />
                    </div>
                    <h1 className="text-5xl font-black text-sharp tracking-tighter mb-4">
                        Join the System
                    </h1>
                    <p className="text-sm font-medium text-muted">
                        Already have access?{' '}
                        <Link
                            href="/login"
                            className="text-primary font-black hover:underline underline-offset-4 transition-all"
                        >
                            Sign in to your account
                        </Link>
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-card rounded-[4rem] p-12 border-2 border-card-border shadow-2xl animate-in zoom-in-95 duration-500">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-3xl p-6 border-2 border-red-200 dark:border-red-800 animate-shake">
                                <p className="text-sm font-black text-red-800 dark:text-red-300 uppercase tracking-wider">
                                    ⚠️ {error}
                                </p>
                            </div>
                        )}

                        {/* Username */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block ml-2">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full rounded-[2rem] border-2 border-input-border bg-background py-5 pl-14 pr-6 focus:ring-8 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sharp outline-none placeholder:text-muted/40 placeholder:font-medium"
                                    placeholder="Enter unique username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block ml-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full rounded-[2rem] border-2 border-input-border bg-background py-5 pl-14 pr-6 focus:ring-8 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sharp outline-none placeholder:text-muted/40 placeholder:font-medium"
                                    placeholder="you@warehouse.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block ml-2">
                                Access Level
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                                    <Shield className="h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                                </div>
                                <select
                                    id="userRole"
                                    name="userRole"
                                    className="w-full rounded-[2rem] border-2 border-input-border bg-background py-5 pl-14 pr-12 focus:ring-8 focus:ring-primary/10 focus:border-primary transition-all font-black text-sharp outline-none appearance-none cursor-pointer"
                                    value={formData.userRole}
                                    onChange={handleChange}
                                >
                                    <option value="STAFF">👤 Staff Member — Standard Access</option>
                                    <option value="ADMIN">🔐 Administrator — Full System Access</option>
                                    <option value="WAREHOUSE_MANAGER">🏢 Warehouse Manager — Operations Control</option>
                                    <option value="PICKER">📦 Picker — Order Fulfillment</option>
                                    <option value="PACKER">📦 Packer — Packaging Operations</option>
                                    <option value="EXTERNAL_SHIPPER">🚚 External Shipper — Delivery Partner</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                                    ▼
                                </div>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block ml-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    className="w-full rounded-[2rem] border-2 border-input-border bg-background py-5 pl-14 pr-14 focus:ring-8 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sharp outline-none placeholder:text-muted/40 placeholder:font-medium"
                                    placeholder="Create secure password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-6 flex items-center cursor-pointer hover:scale-110 transition-transform"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-muted hover:text-sharp transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-muted hover:text-sharp transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <Button
                                type="submit"
                                className="w-full py-7 text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 rounded-[2.5rem]"
                                isLoading={loading}
                            >
                                {loading ? 'Initializing Account...' : 'Create Account'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-[10px] font-bold text-muted/60 uppercase tracking-widest mt-8">
                    Warehouse Management System v2.0
                </p>
            </div>
        </div>
    );
}
