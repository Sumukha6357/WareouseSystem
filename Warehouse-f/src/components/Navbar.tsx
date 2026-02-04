'use client';

import Link from 'next/link';
import { LayoutDashboard, LogIn, UserPlus, Box, BarChart2, Truck, Package, Map as MapIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
    const { user, isLoading } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 hover:text-indigo-700 transition-colors">
                                <Box className="h-8 w-8" />
                                <span>WarehouseMS</span>
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {user && (
                                <>
                                    <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Link>
                                    <Link href="/analytics" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                        <BarChart2 className="w-4 h-4 mr-2" />
                                        Analytics
                                    </Link>
                                    <Link href="/shippers" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                        <Truck className="w-4 h-4 mr-2" />
                                        Shippers
                                    </Link>
                                    <Link href="/shipments" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                        <Package className="w-4 h-4 mr-2" />
                                        Shipments
                                    </Link>
                                    <Link href="/tracking" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                        <MapIcon className="w-4 h-4 mr-2" />
                                        Tracking
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
                        {isLoading ? (
                            <span className="text-sm text-gray-400">Loading...</span>
                        ) : !user && (
                            <>
                                <Link href="/login">
                                    <Button variant="primary" size="sm">
                                        <LogIn className="w-4 h-4 mr-2" />
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button variant="outline" size="sm">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Register
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
