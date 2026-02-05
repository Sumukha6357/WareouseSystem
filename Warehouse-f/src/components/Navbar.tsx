'use client';

import Link from 'next/link';
import { LayoutDashboard, LogIn, UserPlus, Box, BarChart2, Truck, Package, Map as MapIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
    const { user, isLoading } = useAuth();

    return (
        <nav className="bg-background border-b border-card-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-2 font-black text-2xl text-primary hover:opacity-80 transition-all tracking-tighter">
                                <Box className="h-8 w-8" />
                                <span>Warehouse<span className="text-sharp">MS</span></span>
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {user && (
                                <>
                                    <Link href="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-black text-muted hover:text-sharp hover:border-primary transition-all uppercase tracking-widest">
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Link>
                                    <Link href="/analytics" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-black text-muted hover:text-sharp hover:border-primary transition-all uppercase tracking-widest">
                                        <BarChart2 className="w-4 h-4 mr-2" />
                                        Analytics
                                    </Link>
                                    <Link href="/shippers" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-black text-muted hover:text-sharp hover:border-primary transition-all uppercase tracking-widest">
                                        <Truck className="w-4 h-4 mr-2" />
                                        Shippers
                                    </Link>
                                    <Link href="/shipments" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-black text-muted hover:text-sharp hover:border-primary transition-all uppercase tracking-widest">
                                        <Package className="w-4 h-4 mr-2" />
                                        Shipments
                                    </Link>
                                    <Link href="/tracking" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-black text-muted hover:text-sharp hover:border-primary transition-all uppercase tracking-widest">
                                        <MapIcon className="w-4 h-4 mr-2" />
                                        Tracking
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
                        {isLoading ? (
                            <span className="text-xs font-black text-muted uppercase tracking-widest">Accessing...</span>
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
