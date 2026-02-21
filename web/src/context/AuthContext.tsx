'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import httpClient from '@/lib/httpClient';
import { ApiError } from '@/lib/httpClient';
import { notify } from '@/lib/notify';
import type { UserResponse } from '@/types/api';

interface AuthContextType {
    user: UserResponse | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: RegisterPayload) => Promise<void>;
    refreshUser: () => Promise<void>;
    hasRole: (role: string | string[]) => boolean;
}

interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    userRole: string;
    mobile?: string;
    profileImage?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'warehouse_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Persist user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_STORAGE_KEY);
        }
    }, [user]);

    const refreshUser = async () => {
        try {
            const cached = localStorage.getItem(USER_STORAGE_KEY);
            if (cached) setUser(JSON.parse(cached) as UserResponse);

            const userData = await httpClient.get<UserResponse>('/users/me');
            setUser(userData);
        } catch {
            setUser(null);
            localStorage.removeItem(USER_STORAGE_KEY);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            // Updated to send JSON instead of Form Data to match backend @RequestBody
            await httpClient.post('/login', {
                identifier: credentials.username,
                password: credentials.password
            });
            await refreshUser();
            notify.success('Welcome back! Login successful');
            router.push('/dashboard');
        } catch (error: unknown) {
            const message =
                error instanceof ApiError
                    ? error.message
                    : error instanceof Error
                        ? error.message
                        : 'Invalid credentials. Please try again.';
            notify.error(message);
            throw error;
        }
    };

    const register = async (data: RegisterPayload) => {
        try {
            await httpClient.post('/register', data);
            notify.success('Registration successful! Please login to continue');
            router.push('/login?registered=true');
        } catch (error: unknown) {
            const message =
                error instanceof ApiError
                    ? error.message
                    : error instanceof Error
                        ? error.message
                        : 'Registration failed. Please try again.';
            notify.error(message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await httpClient.post('/logout', {});
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem(USER_STORAGE_KEY);
            router.push('/login');
            notify.success('Logged out successfully');
        }
    };

    const hasRole = (role: string | string[]) => {
        if (!user) return false;
        if (Array.isArray(role)) {
            return role.includes(user.userRole);
        }
        return user.userRole === role;
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register, refreshUser, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
