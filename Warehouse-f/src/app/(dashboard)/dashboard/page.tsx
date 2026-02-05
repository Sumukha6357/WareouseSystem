'use client';

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ShipperManagementView from "@/components/ShipperManagementView";
import ShipmentManagementView from "@/components/ShipmentManagementView";
import {
    LayoutDashboard,
    Building2,
    Network,
    Users as UsersIcon,
    ChevronRight,
    LogOut,
    Menu,
    X,
    Package,
    Boxes,
    Activity,
    ShoppingCart,
    ClipboardList,
    Truck,
    Ship,
    Sun,
    Moon
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
import api from "@/lib/api";

type TabType = 'overview' | 'warehouses' | 'hierarchy' | 'products' | 'inventory' | 'activity' | 'orders' | 'pick-tasks' | 'users' | 'shippers' | 'shipments';

export default function DashboardPage() {
    const { user, isLoading, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [stats, setStats] = useState({ warehouses: 0, rooms: 0, blocks: 0, products: 0, inventories: 0, lowStock: 0 });
    const [profileData, setProfileData] = useState({ username: '', email: '' });
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

    const fetchStats = async () => {
        try {
            const [warehousesRes, roomsRes, blocksRes, productsRes, inventoriesRes, lowStockRes] = await Promise.all([
                api.get('/warehouses'),
                api.get('/rooms'),
                api.get('/blocks'),
                api.get('/products'),
                api.get('/inventory'),
                api.get('/inventory/low-stock')
            ]);
            setStats({
                warehouses: warehousesRes.data.data?.length || 0,
                rooms: roomsRes.data.data?.length || 0,
                blocks: blocksRes.data.data?.length || 0,
                products: productsRes.data.data?.length || 0,
                inventories: inventoriesRes.data.data?.length || 0,
                lowStock: lowStockRes.data.data?.length || 0
            });
        } catch (error) {
            console.error('Failed to fetch stats', error);
        }
    };

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
        if (user) {
            setProfileData({ username: user.username, email: user.email });
            fetchStats();
        }
    }, [user, isLoading, router]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put(`/users/${user?.userId}`, profileData);
            setIsEditingProfile(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to update profile', error);
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
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['ADMIN', 'STAFF'] },
        { id: 'warehouses', label: 'Warehouses', icon: Building2, roles: ['ADMIN'] },
        { id: 'hierarchy', label: 'Rooms & Blocks', icon: Network, roles: ['ADMIN', 'STAFF'] },
        { id: 'products', label: 'Products', icon: Package, roles: ['ADMIN', 'STAFF'] },
        { id: 'inventory', label: 'Inventory', icon: Boxes, roles: ['ADMIN', 'STAFF'] },
        { id: 'orders', label: 'Orders', icon: ShoppingCart, roles: ['ADMIN', 'STAFF'] },
        { id: 'pick-tasks', label: 'Pick Tasks', icon: ClipboardList, roles: ['ADMIN', 'STAFF'] },
        { id: 'shippers', label: 'Shippers', icon: Truck, roles: ['ADMIN'] },
        { id: 'shipments', label: 'Shipments', icon: Ship, roles: ['ADMIN', 'STAFF'] },
        { id: 'activity', label: 'Activity Feed', icon: Activity, roles: ['ADMIN', 'STAFF'] },
        { id: 'users', label: 'User Directory', icon: UsersIcon, roles: ['ADMIN'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(user.userRole));

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-black text-sharp tracking-tight">
                                Welcome back, <span className="text-primary">{user.username}</span>
                            </h1>
                            <p className="text-muted font-medium">Here's what's happening in your warehouse today.</p>
                        </div>

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

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-card rounded-3xl shadow-xl shadow-black/5 border border-card-border overflow-hidden transition-all duration-300 hover:shadow-2xl">
                                <div className="px-8 py-6 border-b border-card-border flex justify-between items-center bg-background/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-1 bg-primary rounded-full"></div>
                                        <h3 className="text-lg font-black text-foreground uppercase tracking-tight">Personal Information</h3>
                                    </div>
                                    {!isEditingProfile ? (
                                        <Button variant="outline" size="sm" className="rounded-xl font-bold uppercase tracking-wider text-[10px]" onClick={() => setIsEditingProfile(true)}>
                                            Modify Account
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" className="rounded-xl font-bold uppercase tracking-wider text-[10px]" onClick={() => {
                                            setIsEditingProfile(false);
                                            setProfileData({ username: user.username, email: user.email });
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
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <Button type="submit" className="rounded-2xl px-8 shadow-lg shadow-primary/20">Save Profile</Button>
                                                <Button variant="outline" className="rounded-2xl px-8" onClick={() => {
                                                    setIsEditingProfile(false);
                                                    setProfileData({ username: user.username, email: user.email });
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
                                            <div className="md:col-span-2 pt-4 border-t border-card-border">
                                                <dt className="text-[10px] font-black text-muted uppercase tracking-widest mb-2">Unique Identifier</dt>
                                                <dd className="mt-1">
                                                    <code className="text-[11px] font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-4 py-2 rounded-xl border-2 border-emerald-500/10 block w-fit">
                                                        {user.userId}
                                                    </code>
                                                </dd>
                                            </div>
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
                                    <Button className="w-full bg-white hover:bg-white/90 !text-indigo-600 border-none rounded-2xl font-black py-6 shadow-xl shadow-black/20 text-lg transition-transform hover:scale-[1.02]">
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
                    <div className="h-12 w-12 bg-gradient-to-br from-primary to-indigo-800 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 animate-float">
                        <Building2 className="h-7 w-7 text-white" />
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
                                    <div className="h-12 w-12 bg-gradient-to-br from-gray-800 to-black dark:from-gray-700 dark:to-gray-900 rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-black/10 dark:shadow-black/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-4 w-72 bg-card rounded-3xl shadow-2xl border border-card-border py-3 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="px-6 py-4 border-b border-card-border bg-background/50 rounded-t-3xl">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-black">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-black text-foreground tracking-tight">{user.username}</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">{user.userRole}</p>
                                                </div>
                                            </div>
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
