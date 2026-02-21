'use client';

import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { notify } from "@/lib/notify";
import ShipperManagementView from "@/components/ShipperManagementView";
import ShipmentManagementView from "@/components/ShipmentManagementView";
import AnalyticsDashboardView from "@/components/AnalyticsDashboardView";
import {
    LayoutDashboard,
    Building2,
    Network,
    Users as UsersIcon,
    ChevronRight,
    LogOut,
    Menu,
    Package,
    Boxes,
    Activity,
    ShoppingCart,
    ClipboardList,
    Truck,
    Ship,
    Sun,
    Moon,
    CheckCircle2,
    Timer,
    AlertTriangle,
    MapPin,
    Box,
    BarChart3,
    Lightbulb as LightbulbIcon,
    Plus,
    Zap,
    History,
    TrendingUp,
    ArrowUpRight,
    ShieldAlert,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/context/ThemeContext";
import UserManagementView from "@/components/UserManagementView";
import WarehouseListView from "@/components/WarehouseListView";
import HierarchyManagementView from "@/components/HierarchyManagementView";
import ProductManagementView from "@/components/ProductManagementView";
import InventoryManagementView from "@/components/InventoryManagementView";
import ActivityFeedView from "@/components/ActivityFeedView";
import OrderManagementView from "@/components/OrderManagementView";
import PickTaskView from "@/components/PickTaskView";
import httpClient from "@/lib/httpClient";
import { ShipmentService } from '@/services/ShipmentService';
import RequireRole from "@/components/auth/RequireRole";

type TabType = 'overview' | 'warehouses' | 'hierarchy' | 'products' | 'inventory' | 'activity' | 'orders' | 'pick-tasks' | 'users' | 'shippers' | 'shipments' | 'reports' | 'profile' | 'insights';
type PickerTaskSummary = { status: string };
type OrderSummary = { status: string };

export default function DashboardPage() {
    const { user, isLoading, logout, refreshUser } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [stats, setStats] = useState({ warehouses: 0, rooms: 0, blocks: 0, products: 0, inventories: 0, lowStock: 0 });
    const [pickerStats, setPickerStats] = useState({ active: 0, completed: 0, total: 0 });
    const [managerStats, setManagerStats] = useState({ activeOrders: 0, activeShipments: 0 });
    const [shipperStats, setShipperStats] = useState({ active: 0, pending: 0, completed: 0 });
    const [packingStats, setPackingStats] = useState({ readyToPack: 0, packed: 0, total: 0 });
    const [profileData, setProfileData] = useState({ username: '', email: '', mobile: '', profileImage: '' });
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const [warehouses, rooms, blocks, products, inventories, lowStock] = await Promise.all([
                httpClient.get<unknown[]>('/warehouses'),
                httpClient.get<unknown[]>('/rooms'),
                httpClient.get<unknown[]>('/blocks'),
                httpClient.get<unknown[]>('/products'),
                httpClient.get<unknown[]>('/inventory'),
                httpClient.get<unknown[]>('/inventory/low-stock'),
            ]);
            setStats({
                warehouses: warehouses?.length || 0,
                rooms: rooms?.length || 0,
                blocks: blocks?.length || 0,
                products: products?.length || 0,
                inventories: inventories?.length || 0,
                lowStock: lowStock?.length || 0,
            });
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    }, []);

    const fetchPickerStats = useCallback(async () => {
        if (!user) return;
        try {
            const tasks = await httpClient.get<PickerTaskSummary[]>(`/orders/pick-tasks/picker/${user.username}`);
            const active = tasks.filter((t) => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length;
            const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
            setPickerStats({ active, completed, total: tasks.length });
        } catch (error) {
            console.error('Failed to fetch picker tasks', error);
        }
    }, [user]);

    const fetchManagerStats = useCallback(async () => {
        try {
            const [orders, shipmentsData] = await Promise.all([
                httpClient.get<OrderSummary[]>('/orders'),
                ShipmentService.getAllShipments(),
            ]);

            const activeOrders = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;
            const shipments = shipmentsData || [];
            const activeShipments = shipments.filter((s) => ['CREATED', 'PICKED', 'PACKED', 'IN_TRANSIT'].includes(s.status)).length;

            setManagerStats({ activeOrders, activeShipments });
        } catch (error) {
            console.error('Failed to fetch manager stats', error);
        }
    }, []);

    const fetchShipperStats = useCallback(async () => {
        if (!user) return;
        try {
            const allShipments = await ShipmentService.getAllShipments();
            // Filter shipments where the shipper name matches the current user's username
            const myShipments = allShipments.filter((s) => s.shipperName === user.username);

            const active = myShipments.filter((s) => s.status === 'IN_TRANSIT').length;
            const pending = myShipments.filter((s) => ['CREATED', 'PICKED', 'PACKED', 'WAITING_FOR_DRIVER'].includes(s.status)).length;
            const completed = myShipments.filter((s) => s.status === 'DELIVERED').length;

            setShipperStats({ active, pending, completed });
        } catch (error) {
            console.error('Failed to fetch shipper stats', error);
        }
    }, [user]);

    const fetchPackingStats = useCallback(async () => {
        try {
            const allShipments = await ShipmentService.getAllShipments();
            // Ready to pack = status is 'PICKED'
            const readyToPack = allShipments.filter((s) => s.status === 'PICKED').length;
            // Packed = status is 'PACKED'
            const packed = allShipments.filter((s) => s.status === 'PACKED').length;
            // Total eligible for packer interaction (roughly)
            const total = allShipments.filter((s) => ['PICKED', 'PACKED'].includes(s.status)).length;

            setPackingStats({ readyToPack, packed, total });
        } catch (error) {
            console.error('Failed to fetch packing stats', error);
        }
    }, []);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
        if (!user) {
            return;
        }
        const loadRoleDashboard = async () => {
            if (user.userRole === 'PICKER') {
                await fetchPickerStats();
            } else if (user.userRole === 'WAREHOUSE_MANAGER') {
                await Promise.all([fetchStats(), fetchManagerStats()]);
            } else if (user.userRole === 'EXTERNAL_SHIPPER') {
                await fetchShipperStats();
            } else if (user.userRole === 'PACKER') {
                await fetchPackingStats();
            } else {
                await fetchStats();
            }
        };
        void loadRoleDashboard();
    }, [fetchManagerStats, fetchPackingStats, fetchPickerStats, fetchShipperStats, fetchStats, isLoading, router, user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await httpClient.put('/users', profileData);
            await refreshUser();
            setIsEditingProfile(false);
            notify.success('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile', error);
            notify.error('Failed to update profile. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="font-medium text-gray-500 dark:text-gray-400">Initializing Dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['ADMIN', 'STAFF', 'PICKER', 'WAREHOUSE_MANAGER', 'EXTERNAL_SHIPPER', 'PACKER'] },
        { id: 'warehouses', label: 'Warehouses', icon: Building2, roles: ['ADMIN'] },
        { id: 'hierarchy', label: 'Rooms & Blocks', icon: Network, roles: ['ADMIN', 'STAFF', 'WAREHOUSE_MANAGER'] },
        { id: 'products', label: 'Products', icon: Package, roles: ['ADMIN', 'STAFF', 'WAREHOUSE_MANAGER'] },
        { id: 'inventory', label: 'Inventory', icon: Boxes, roles: ['ADMIN', 'STAFF', 'WAREHOUSE_MANAGER'] },
        { id: 'orders', label: 'Orders', icon: ShoppingCart, roles: ['ADMIN', 'STAFF', 'WAREHOUSE_MANAGER'] },
        { id: 'pick-tasks', label: 'Pick Tasks', icon: ClipboardList, roles: ['ADMIN', 'STAFF', 'PICKER', 'WAREHOUSE_MANAGER'] },
        { id: 'shippers', label: 'Shippers', icon: Truck, roles: ['ADMIN'] },
        { id: 'shipments', label: 'Shipments', icon: Ship, roles: ['ADMIN', 'STAFF', 'WAREHOUSE_MANAGER', 'EXTERNAL_SHIPPER', 'PACKER'] },
        { id: 'activity', label: 'Activity Feed', icon: Activity, roles: ['ADMIN', 'STAFF', 'WAREHOUSE_MANAGER'] },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['ADMIN', 'WAREHOUSE_MANAGER'] },
        { id: 'users', label: 'User Directory', icon: UsersIcon, roles: ['ADMIN'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(user.userRole));

    const renderQuickActions = () => {
        const actions = [
            { label: 'Create Order', icon: Plus, color: 'blue', tab: 'orders' as TabType },
            { label: 'Dispatch', icon: Truck, color: 'emerald', tab: 'shipments' as TabType },
            { label: 'Add Stock', icon: Box, color: 'amber', tab: 'inventory' as TabType },
            { label: 'View Insights', icon: Zap, color: 'purple', tab: 'insights' as TabType },
        ];

        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {actions.map((action, i) => (
                    <RequireRole key={i} role={['ADMIN', 'WAREHOUSE_MANAGER', 'STAFF']}>
                        <button
                            onClick={() => setActiveTab(action.tab)}
                            className="group flex flex-col items-center justify-center p-6 bg-card border border-card-border rounded-3xl transition-all hover:bg-primary/5 hover:border-primary/30 hover:-translate-y-1 shadow-sm"
                        >
                            <div className={`h-12 w-12 rounded-2xl bg-${action.color}-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                <action.icon className={`h-6 w-6 text-${action.color}-500`} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted group-hover:text-primary transition-colors">{action.label}</span>
                        </button>
                    </RequireRole>
                ))}
            </div>
        );
    };

    const renderRecentActivity = () => {
        const data = [32, 45, 38, 52, 48, 65, 54, 72, 68, 85, 75, 92];
        return (
            <div className="bg-card rounded-3xl p-8 border border-card-border shadow-xl shadow-black/5">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Volume Trends</h3>
                        </div>
                        <p className="text-xs text-muted font-bold">SHIPMENT THROUGHPUT - LAST 24 HOURS</p>
                    </div>
                </div>

                <div className="h-48 w-full flex items-end gap-2 mb-6">
                    {data.map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-primary/5 rounded-full relative overflow-hidden flex flex-col justify-end" style={{ height: '100%' }}>
                                <div
                                    className="w-full bg-primary rounded-full transition-all duration-1000 ease-out animate-in slide-in-from-bottom"
                                    style={{
                                        height: `${val}%`,
                                        animationDelay: `${idx * 100}ms`,
                                        opacity: 0.3 + (val / 100) * 0.7
                                    }}
                                ></div>
                                <div className="absolute top-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity -mt-6">
                                    <span className="text-[9px] font-black text-primary">{val}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-card-border">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">Growth</p>
                            <p className="text-sm font-black text-foreground">+24.5%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <History className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">Peak Hour</p>
                            <p className="text-sm font-black text-foreground">14:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSystemHealth = () => {
        const issues = [
            { label: 'Low Stock', value: '12 SKU', icon: AlertTriangle, color: 'rose', tab: 'inventory' as TabType },
            { label: 'Pending Dispatch', value: '4 Shipments', icon: Clock, color: 'amber', tab: 'shipments' as TabType },
            { label: 'Ready for Picking', value: '18 Orders', icon: ShoppingCart, color: 'emerald', tab: 'orders' as TabType },
        ];

        return (
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white shadow-xl shadow-black/20 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <ShieldAlert className="h-24 w-24" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-black mb-6 leading-tight flex items-center gap-2">
                        System Health
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </h3>
                    <div className="space-y-6">
                        {issues.map((issue, i) => (
                            <button key={i} onClick={() => setActiveTab(issue.tab)} className="w-full flex items-center justify-between group/item hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`h-10 w-10 bg-${issue.color}-500/20 rounded-xl flex items-center justify-center border border-${issue.color}-500/30 group-hover/item:scale-110 transition-transform`}>
                                        <issue.icon className={`h-5 w-5 text-${issue.color}-500`} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{issue.label}</p>
                                        <p className="text-sm font-black text-white">{issue.value}</p>
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-white/20 group-hover/item:text-white group-hover/item:translate-x-1 group-hover/item:-translate-y-1 transition-all" />
                            </button>
                        ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab('activity')} className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                            View All Alerts
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    const renderOverviewStats = () => {
        if (user.userRole === 'PICKER') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { label: 'Active Tasks', value: pickerStats.active, icon: Timer, color: 'blue', gradient: 'from-blue-500 to-cyan-600' },
                        { label: 'Completed Today', value: pickerStats.completed, icon: CheckCircle2, color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
                        { label: 'Total Assigned', value: pickerStats.total, icon: ClipboardList, color: 'purple', gradient: 'from-purple-500 to-indigo-600' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="group relative overflow-hidden glass-card p-6 rounded-3xl border-2 border-card-border shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 animate-scale-in"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className={`absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-[0.08] transition-all duration-500 group-hover:scale-150 group-hover:opacity-[0.15] animate-pulse-subtle`}></div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`p-4 bg-gradient-to-br ${stat.gradient} text-white rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl`}>
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                                    <h4 className="text-4xl font-black text-sharp tabular-nums group-hover:text-primary transition-colors duration-300">{stat.value}</h4>
                                </div>
                            </div>
                            <div className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r ${stat.gradient} transition-all duration-500 w-0 group-hover:w-full rounded-full`}></div>
                        </div>
                    ))}
                </div>
            );
        }

        if (user.userRole === 'WAREHOUSE_MANAGER') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Pending Orders', value: managerStats.activeOrders, icon: ShoppingCart, color: 'indigo', gradient: 'from-indigo-500 to-blue-600' },
                        { label: 'Active Shipments', value: managerStats.activeShipments, icon: Truck, color: 'blue', gradient: 'from-blue-500 to-cyan-600' },
                        { label: 'Low Stock Alerts', value: stats.lowStock, icon: AlertTriangle, color: 'rose', gradient: 'from-rose-500 to-red-600' },
                        { label: 'Total Products', value: stats.products, icon: Package, color: 'purple', gradient: 'from-purple-500 to-pink-600' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="group relative overflow-hidden glass-card p-6 rounded-3xl border-2 border-card-border shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 animate-scale-in"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className={`absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-[0.08] transition-all duration-500 group-hover:scale-150 group-hover:opacity-[0.15] animate-pulse-subtle`}></div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`p-4 bg-gradient-to-br ${stat.gradient} text-white rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl`}>
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                                    <h4 className="text-4xl font-black text-sharp tabular-nums group-hover:text-primary transition-colors duration-300">{stat.value}</h4>
                                </div>
                            </div>
                            <div className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r ${stat.gradient} transition-all duration-500 w-0 group-hover:w-full rounded-full`}></div>
                        </div>
                    ))}
                </div>
            );
        }

        if (user.userRole === 'EXTERNAL_SHIPPER') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { label: 'Active Deliveries', value: shipperStats.active, icon: Truck, color: 'blue', gradient: 'from-blue-500 to-cyan-600' },
                        { label: 'Pending Pickups', value: shipperStats.pending, icon: MapPin, color: 'amber', gradient: 'from-amber-500 to-orange-600' },
                        { label: 'Completed Jobs', value: shipperStats.completed, icon: CheckCircle2, color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="group relative overflow-hidden glass-card p-6 rounded-3xl border-2 border-card-border shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 animate-scale-in"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className={`absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-[0.08] transition-all duration-500 group-hover:scale-150 group-hover:opacity-[0.15] animate-pulse-subtle`}></div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`p-4 bg-gradient-to-br ${stat.gradient} text-white rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl`}>
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                                    <h4 className="text-4xl font-black text-sharp tabular-nums group-hover:text-primary transition-colors duration-300">{stat.value}</h4>
                                </div>
                            </div>
                            <div className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r ${stat.gradient} transition-all duration-500 w-0 group-hover:w-full rounded-full`}></div>
                        </div>
                    ))}
                </div>
            );
        }

        if (user.userRole === 'PACKER') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { label: 'Ready to Pack', value: packingStats.readyToPack, icon: Package, color: 'blue', gradient: 'from-blue-500 to-cyan-600' },
                        { label: 'Packed Today', value: packingStats.packed, icon: Box, color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
                        { label: 'Total in Pipeline', value: packingStats.total, icon: ClipboardList, color: 'purple', gradient: 'from-purple-500 to-indigo-600' },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="group relative overflow-hidden glass-card p-6 rounded-3xl border-2 border-card-border shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 animate-scale-in"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className={`absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-[0.08] transition-all duration-500 group-hover:scale-150 group-hover:opacity-[0.15] animate-pulse-subtle`}></div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`p-4 bg-gradient-to-br ${stat.gradient} text-white rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl`}>
                                    <stat.icon className="h-7 w-7" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                                    <h4 className="text-4xl font-black text-sharp tabular-nums group-hover:text-primary transition-colors duration-300">{stat.value}</h4>
                                </div>
                            </div>
                            <div className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r ${stat.gradient} transition-all duration-500 w-0 group-hover:w-full rounded-full`}></div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: 'Total Warehouses', value: stats.warehouses, icon: Building2, color: 'indigo', gradient: 'from-indigo-500 to-blue-600' },
                    { label: 'Total Rooms', value: stats.rooms, icon: Network, color: 'emerald', gradient: 'from-emerald-500 to-teal-600' },
                    { label: 'Total Blocks', value: stats.blocks, icon: Boxes, color: 'amber', gradient: 'from-amber-500 to-orange-600' },
                    { label: 'Products Available', value: stats.products, icon: Package, color: 'purple', gradient: 'from-purple-500 to-pink-600' },
                    { label: 'Inventory Allocations', value: stats.inventories, icon: ClipboardList, color: 'blue', gradient: 'from-blue-500 to-cyan-600' },
                    ...(stats.lowStock > 0 ? [{ label: 'Low Stock Items', value: stats.lowStock, icon: Activity, color: 'rose', gradient: 'from-rose-500 to-red-600' }] : [])
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="group relative overflow-hidden glass-card p-6 rounded-3xl border-2 border-card-border shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 animate-scale-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className={`absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-[0.08] transition-all duration-500 group-hover:scale-150 group-hover:opacity-[0.15] animate-pulse-subtle`}></div>
                        <div className="flex items-center gap-5 relative z-10">
                            <div className={`p-4 bg-gradient-to-br ${stat.gradient} text-white rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl`}>
                                <stat.icon className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{stat.label}</p>
                                <h4 className="text-4xl font-black text-sharp tabular-nums group-hover:text-primary transition-colors duration-300">{stat.value}</h4>
                            </div>
                        </div>
                        <div className={`absolute bottom-0 left-0 h-1.5 bg-gradient-to-r ${stat.gradient} transition-all duration-500 w-0 group-hover:w-full rounded-full`}></div>
                    </div>
                ))}
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-black text-sharp tracking-tight">
                                    Command <span className="text-primary">Center</span>
                                </h1>
                                <p className="text-muted font-medium">Real-time facility oversight and operational metrics.</p>
                            </div>
                            <div onClick={() => setActiveTab('insights')} className="flex items-center gap-3 bg-card border border-card-border p-2 rounded-2xl shadow-sm cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-all group/eff">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover/eff:scale-110 transition-transform">
                                    <Zap className="h-5 w-5 text-primary" />
                                </div>
                                <div className="pr-4">
                                    <p className="text-[9px] font-black text-muted uppercase tracking-widest">Efficiency</p>
                                    <p className="text-sm font-black text-foreground">94.2%</p>
                                </div>
                            </div>
                        </div>

                        {renderQuickActions()}

                        {renderOverviewStats()}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                {renderRecentActivity()}
                            </div>
                            <div className="space-y-8">
                                {renderSystemHealth()}
                                <div className="bg-card rounded-3xl p-8 border border-card-border shadow-xl shadow-black/5 relative overflow-hidden group">
                                    <h4 className="text-sm font-black text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <History className="h-4 w-4 text-primary" /> Recent Logs
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { msg: "Order #842 dispatched", time: "2m ago" },
                                            { msg: "Low stock alert: AC-43", time: "15m ago" },
                                            { msg: "New inventory in Room A", time: "1h ago" }
                                        ].map((log, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setActiveTab('activity')}
                                                className="w-full h-full flex justify-between items-center text-xs border-b border-card-border pb-3 last:border-0 hover:bg-primary/5 -mx-2 px-2 py-1 rounded-lg transition-all group/log"
                                            >
                                                <span className="font-medium text-muted group-hover/log:text-primary transition-colors">{log.msg}</span>
                                                <span className="text-[10px] font-black text-primary/60">{log.time}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                );
            case 'insights':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-black text-sharp tracking-tight">
                                Warehouse <span className="text-primary">Insights</span>
                            </h1>
                            <p className="text-muted font-medium">Data-driven performance analysis and storage optimization metrics.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-3 space-y-8">
                                <div className="bg-card rounded-3xl p-8 border border-card-border shadow-xl shadow-black/5">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Storage Density Trends</h3>
                                            <p className="text-xs text-muted font-bold mt-1">VOLUMETRIC ANALYSIS - LAST 30 DAYS</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500"></div> Used
                                            </span>
                                            <span className="flex items-center gap-2 text-[10px] font-black text-primary uppercase">
                                                <div className="h-2 w-2 rounded-full bg-primary"></div> Optimized
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-64 w-full flex items-end gap-3 mb-4">
                                        {[45, 62, 58, 75, 82, 68, 92, 85, 78, 88].map((val, idx) => (
                                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="w-full bg-primary/5 rounded-t-xl relative overflow-hidden flex flex-col justify-end" style={{ height: '100%' }}>
                                                    <div className="w-full bg-primary/20 rounded-t-xl transition-all duration-500 group-hover:bg-primary/40" style={{ height: `${val}%` }}></div>
                                                    <div className="absolute top-2 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[10px] font-black text-primary">{val}%</span>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-black text-muted uppercase">W{idx + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t border-card-border">
                                        <p className="text-sm font-medium text-muted leading-relaxed">
                                            Your storage efficiency has increased by <span className="text-emerald-500 font-black">12.4%</span> since the last audit. The introduction of standardized racking in <span className="text-foreground font-black">Room A-4</span> has significantly reduced aisle congestion.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-card rounded-3xl p-8 border border-card-border shadow-xl shadow-black/5 group hover:border-primary/30 transition-all">
                                        <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <Activity className="h-6 w-6 text-primary" />
                                        </div>
                                        <h4 className="text-base font-black text-foreground uppercase tracking-tight mb-2">Throughput Velocity</h4>
                                        <p className="text-sm font-medium text-muted leading-relaxed mb-6">
                                            Measure the rate at which inventory moves through the facility. Higher velocity indicates efficient pick-pack workflows.
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black text-muted uppercase">Standard Flow</span>
                                                <span className="text-xs font-black text-foreground">1,240 units/day</span>
                                            </div>
                                            <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-[85%] rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-card rounded-3xl p-8 border border-card-border shadow-xl shadow-black/5 group hover:border-emerald-500/30 transition-all">
                                        <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                            <BarChart3 className="h-6 w-6 text-emerald-500" />
                                        </div>
                                        <h4 className="text-base font-black text-foreground uppercase tracking-tight mb-2">Picking Accuracy</h4>
                                        <p className="text-sm font-medium text-muted leading-relaxed mb-6">
                                            Percentage of orders fulfilled without errors. Maintaining 99%+ is critical for customer satisfaction and reducing returns.
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] font-black text-muted uppercase">Precision Rate</span>
                                                <span className="text-xs font-black text-foreground">99.8%</span>
                                            </div>
                                            <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-[99%] rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 text-white shadow-xl shadow-black/20">
                                    <h3 className="text-xl font-black mb-6 leading-tight">Optimization Steps</h3>
                                    <div className="space-y-6">
                                        {[
                                            { step: "01", title: "ZONE MAPPING", desc: "Redefine high-velocity pick zones near dispatch." },
                                            { step: "02", title: "SKU PROFILING", desc: "Batch products by seasonal demand levels." },
                                            { step: "03", title: "DENSITY AUDIT", desc: "Convert underutilized bulk areas to racking." }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <span className="text-primary font-black text-sm">{item.step}</span>
                                                <div>
                                                    <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{item.title}</h5>
                                                    <p className="text-xs text-white/60 font-medium leading-relaxed">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-primary/5 rounded-3xl p-8 border-2 border-primary/10 border-dashed">
                                    <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <LightbulbIcon className="h-4 w-4" /> Pro Tip
                                    </h4>
                                    <p className="text-xs font-medium text-muted leading-relaxed italic">
                                        &quot;Implementing cross-docking for high-priority shipments can reduce storage duration by up to 40%.&quot;
                                    </p>
                                </div>

                                <div className="relative h-48 rounded-3xl overflow-hidden group">
                                    <Image
                                        src="/warehouse_logo.svg"
                                        alt="Warehouse Optimization"
                                        fill
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Facility Audit Visual</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div >
                );
            case 'profile':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-black text-sharp tracking-tight">
                                User <span className="text-primary">Profile</span>
                            </h1>
                            <p className="text-muted font-medium">Manage your personal information and account settings.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-card rounded-3xl shadow-xl shadow-black/5 border border-card-border overflow-hidden transition-all duration-300 hover:shadow-2xl">
                                <div className="px-8 py-6 border-b border-card-border flex justify-between items-center bg-background/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-1 bg-primary rounded-full"></div>
                                        <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Personal Information</h3>
                                    </div>
                                    {!isEditingProfile ? (
                                        <Button variant="outline" size="sm" className="rounded-xl font-bold uppercase tracking-wider text-[10px]" onClick={() => {
                                            setIsEditingProfile(true);
                                            setProfileData({
                                                username: user.username,
                                                email: user.email,
                                                mobile: user.mobile || '',
                                                profileImage: user.profileImage || ''
                                            });
                                        }}>
                                            Modify Account
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" className="rounded-xl font-bold uppercase tracking-wider text-[10px]" onClick={() => {
                                            setIsEditingProfile(false);
                                            setProfileData({
                                                username: user.username,
                                                email: user.email,
                                                mobile: user.mobile || '',
                                                profileImage: user.profileImage || ''
                                            });
                                        }}>Discard</Button>
                                    )}
                                </div>
                                <div className="p-8">
                                    {isEditingProfile ? (
                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Username</label>
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-2xl border-2 border-input-border bg-background text-foreground text-sm py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                        value={profileData.username}
                                                        onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                                    <input
                                                        type="email"
                                                        className="w-full rounded-2xl border-2 border-input-border bg-background text-foreground text-sm py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                        value={profileData.email}
                                                        onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Mobile Number</label>
                                                    <input
                                                        type="tel"
                                                        className="w-full rounded-2xl border-2 border-input-border bg-background text-foreground text-sm py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                        value={profileData.mobile}
                                                        placeholder="+1 (555) 000-0000"
                                                        onChange={e => setProfileData({ ...profileData, mobile: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Profile Image URL</label>
                                                    <input
                                                        type="url"
                                                        className="w-full rounded-2xl border-2 border-input-border bg-background text-foreground text-sm py-3 px-4 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                                                        value={profileData.profileImage}
                                                        placeholder="https://example.com/image.jpg"
                                                        onChange={e => setProfileData({ ...profileData, profileImage: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <Button type="submit" className="rounded-2xl px-8 shadow-lg shadow-primary/20">Save Profile</Button>
                                                <Button variant="outline" className="rounded-2xl px-8" onClick={() => {
                                                    setIsEditingProfile(false);
                                                    setProfileData({
                                                        username: user.username,
                                                        email: user.email,
                                                        mobile: user.mobile || '',
                                                        profileImage: user.profileImage || ''
                                                    });
                                                }}>Cancel</Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                                            {[
                                                { label: 'Username', value: user.username, icon: UsersIcon },
                                                { label: 'Email Address', value: user.email, icon: Menu },
                                                { label: 'Account Role', value: user.userRole, badge: true },
                                                { label: 'Registered Since', value: new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' }) }
                                            ].map((item, idx) => (
                                                <div key={idx} className="group">
                                                    <dt className="text-[10px] font-black text-muted uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{item.label}</dt>
                                                    <dd className="mt-1 flex items-center gap-2">
                                                        {item.badge ? (
                                                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full border-2 border-primary/20">
                                                                {item.value}
                                                            </span>
                                                        ) : (
                                                            <span className="text-base font-black text-sharp">{item.value}</span>
                                                        )}
                                                    </dd>
                                                </div>
                                            ))}
                                            {user.mobile && (
                                                <div className="group">
                                                    <dt className="text-[10px] font-black text-muted uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Mobile Number</dt>
                                                    <dd className="mt-1">
                                                        <span className="text-base font-black text-sharp">{user.mobile}</span>
                                                    </dd>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-primary to-indigo-900 rounded-3xl p-8 text-white shadow-xl shadow-primary/20 flex flex-col justify-between relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 bg-white/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150"></div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black leading-tight mb-4">Streamline Your Logistics</h3>
                                    <p className="text-white/80 text-sm font-medium leading-relaxed">
                                        Monitor warehouse occupancy, track high-turnover products, and optimize storage density in real-time.
                                    </p>
                                </div>
                                <div className="relative z-10 pt-8">
                                    <Button
                                        onClick={() => setActiveTab('insights')}
                                        className="w-full bg-white hover:bg-white/90 !text-indigo-600 border-none rounded-2xl font-black py-6 shadow-xl shadow-black/20 text-lg transition-transform hover:scale-[1.02]"
                                    >
                                        View Insights
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div >
                );
            case 'warehouses':
                return <WarehouseListView />;
            case 'hierarchy':
                return <HierarchyManagementView />;
            case 'products':
                return <ProductManagementView />;
            case 'inventory':
                return <InventoryManagementView />;
            case 'orders':
                return <OrderManagementView />;
            case 'pick-tasks':
                return <PickTaskView />;
            case 'shippers':
                return <ShipperManagementView />;
            case 'shipments':
                return <ShipmentManagementView />;
            case 'activity':
                return <ActivityFeedView />;
            case 'reports':
                return <AnalyticsDashboardView />;
            case 'users':
                return <UserManagementView />;
        }
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground transition-colors duration-300">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-80' : 'w-24'} bg-sidebar border-r border-card-border transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-30 shadow-2xl shadow-black/5`}
            >
                <div className="h-24 flex items-center px-8 border-b border-card-border bg-sidebar/50 backdrop-blur-sm">
                    <div className="h-12 w-12 bg-gradient-to-br from-primary to-emerald-800 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 animate-float overflow-hidden">
                        <Image src="/warehouse_logo.svg" alt="WarehouseMS" width={32} height={32} className="h-8 w-8 object-contain" />
                    </div>
                    {isSidebarOpen && (
                        <div className="ml-4 flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                            <span className="font-black text-2xl text-foreground tracking-tighter leading-none">Warehouse<span className="text-primary">MS</span></span>
                            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Enterprise Core</span>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
                    {filteredNavItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as TabType)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${activeTab === item.id
                                ? 'bg-primary text-white shadow-2xl shadow-primary/30'
                                : 'text-gray-400 dark:text-gray-500 hover:bg-primary/5 hover:text-foreground'
                                }`}
                        >
                            <item.icon className={`h-6 w-6 transition-transform duration-300 ${activeTab === item.id ? 'text-white' : 'group-hover:scale-125 group-hover:text-primary'}`} />
                            {isSidebarOpen && (
                                <span className={`font-black text-sm tracking-wide ${activeTab === item.id ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-foreground'}`}>{item.label}</span>
                            )}
                            {activeTab === item.id && isSidebarOpen && (
                                <div className="ml-auto bg-white/20 p-1 rounded-lg">
                                    <ChevronRight className="h-3 w-3 text-white" />
                                </div>
                            )}
                            {activeTab === item.id && !isSidebarOpen && (
                                <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full"></div>
                            )}
                        </button>
                    ))}
                </nav>


            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Decorative BG element */}
                <div className="absolute top-0 right-0 -mr-32 -mt-32 h-96 w-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 h-96 w-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none opacity-50"></div>

                {/* Header */}
                <header className="h-24 bg-header glass z-20 transition-all duration-300 border-b border-card-border">
                    <div className="h-full flex items-center justify-between px-10">
                        <div className="flex items-center gap-6">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="h-12 w-12 rounded-2xl hover:bg-primary/5 p-0"
                            >
                                <Menu className="h-6 w-6 text-gray-500" />
                            </Button>
                            <div className="h-10 w-px bg-card-border"></div>
                            <div className="flex flex-col">
                                <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">
                                    {activeTab.replace('-', ' ')}
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">

                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-4 hover:bg-primary/5 rounded-2xl p-2 transition-all duration-300 group"
                                >
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-black text-foreground tracking-tight">{user.username}</p>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{user.userRole}</p>
                                    </div>
                                    <div className="relative h-12 w-12 bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-black/10 dark:shadow-black/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 overflow-hidden">
                                        {user.profileImage ? (
                                            <Image src={user.profileImage} alt={user.username} fill className="h-full w-full object-cover" />
                                        ) : (
                                            user.username.charAt(0).toUpperCase()
                                        )}
                                    </div>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-4 w-72 bg-card rounded-3xl shadow-2xl border border-card-border py-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="px-6 py-4 border-b border-card-border bg-background/50 rounded-t-3xl">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-black overflow-hidden">
                                                    {user.profileImage ? (
                                                        <Image src={user.profileImage} alt={user.username} fill className="h-full w-full object-cover" />
                                                    ) : (
                                                        user.username.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-black text-foreground tracking-tight">{user.username}</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{user.userRole}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-2 space-y-1 border-b border-card-border">
                                            <button
                                                onClick={() => {
                                                    setActiveTab('profile');
                                                    setIsProfileOpen(false);
                                                }}
                                                className="w-full flex items-center gap-4 px-4 py-3 text-foreground hover:bg-primary/5 rounded-2xl transition-all duration-300 group"
                                            >
                                                <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                                                    <UsersIcon className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="font-black text-xs uppercase tracking-widest">My Profile</span>
                                            </button>
                                        </div>
                                        <div className="p-2 space-y-1">
                                            <button
                                                onClick={() => {
                                                    toggleTheme();
                                                }}
                                                className="w-full flex items-center justify-between px-4 py-3 text-foreground hover:bg-primary/5 rounded-2xl transition-all duration-300 group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                                                        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                                    </div>
                                                    <span className="font-black text-xs uppercase tracking-widest">
                                                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                                                    </span>
                                                </div>
                                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setIsProfileOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-4 px-4 py-4 text-red-600 hover:bg-red-500/5 rounded-2xl transition-all duration-300 group"
                                            >
                                                <div className="p-2 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                                    <LogOut className="h-4 w-4" />
                                                </div>
                                                <span className="font-black text-xs uppercase tracking-widest">Terminate Session</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}
