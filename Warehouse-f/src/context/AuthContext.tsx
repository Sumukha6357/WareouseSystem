'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Block {
    blockId: string;
    height: number;
    length: number;
    breath: number;
    type: string;
}

interface Room {
    roomId: string;
    name: string;
    blocks?: Block[] | null;
}

interface Warehouse {
    warehouseId: string;
    name: string;
    city: string;
    address: string;
    landmark: string;
    rooms?: Room[] | null;
}

interface User {
    userId: string;
    username: string;
    email: string;
    userRole: string;
    createdAt: number;
    lastModifiedAt: number;
    warehouse?: Warehouse | null;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: any) => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const refreshUser = async () => {
        try {
            // Check if we have an active session
            const response = await api.get('/users/me');
            setUser(response.data.data); // Based on ResponseStructure
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const login = async (credentials: any) => {
        try {
            const params = new URLSearchParams();
            params.append('username', credentials.username);
            params.append('password', credentials.password);

            await api.post('/login', params, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            await refreshUser();
            toast.success('Welcome back! Login successful');
            router.push('/dashboard');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Invalid credentials. Please try again.';
            toast.error(message);
            throw error;
        }
    };

    const register = async (data: any) => {
        try {
            await api.post('/register', data);
            toast.success('Registration successful! Please login to continue');
            router.push('/login?registered=true');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Logout failed. Please try again.');
        } finally {
            setUser(null);
            router.push('/');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register, refreshUser }}>
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
