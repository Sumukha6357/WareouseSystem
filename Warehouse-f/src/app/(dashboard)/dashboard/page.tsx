'use client';

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
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
    Ship
} from "lucide-react";
import { Button } from "@/components/ui/Button";
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
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [stats, setStats] = useState({ warehouses: 0, rooms: 0, blocks: 0, products: 0, inventories: 0, lowStock: 0 });
    const [profileData, setProfileData] = useState({ username: '', email: '' });

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
            // Refresh user data
            window.location.reload();
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                    <p className="font-medium text-gray-500">Initializing Dashboard...</p>
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
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400">Total Warehouses</p>
                                    <h4 className="text-xl font-bold text-gray-900">{stats.warehouses}</h4>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                    <Network className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400">Total Rooms</p>
                                    <h4 className="text-xl font-bold text-gray-900">{stats.rooms}</h4>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400">Total Blocks</p>
                                    <h4 className="text-xl font-bold text-gray-900">{stats.blocks}</h4>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400">Products Available</p>
                                    <h4 className="text-xl font-bold text-gray-900">{stats.products}</h4>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                                    <Boxes className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-400">Inventory Allocations</p>
                                    <h4 className="text-xl font-bold text-gray-900">{stats.inventories}</h4>
                                </div>
                            </div>
                            {stats.lowStock > 0 && (
                                <div className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-200 flex items-center gap-4">
                                    <div className="p-3 bg-amber-100 rounded-xl text-amber-700">
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-amber-600">Low Stock Items</p>
                                        <h4 className="text-xl font-bold text-amber-900">{stats.lowStock}</h4>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                                {!isEditingProfile ? (
                                    <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>Edit Profile</Button>
                                ) : (
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setIsEditingProfile(false);
                                        setProfileData({ username: user.username, email: user.email });
                                    }}>Cancel</Button>
                                )}
                            </div>
                            <div className="p-6">
                                {isEditingProfile ? (
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2">Username</label>
                                                <input
                                                    type="text"
                                                    className="w-full rounded-lg border-gray-300 text-sm py-2 px-3"
                                                    value={profileData.username}
                                                    onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider block mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="w-full rounded-lg border-gray-300 text-sm py-2 px-3"
                                                    value={profileData.email}
                                                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button type="submit">Save Changes</Button>
                                            <Button variant="outline" onClick={() => {
                                                setIsEditingProfile(false);
                                                setProfileData({ username: user.username, email: user.email });
                                            }}>Cancel</Button>
                                        </div>
                                    </form>
                                ) : (
                                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Username</dt>
                                            <dd className="mt-1 text-base font-medium text-gray-900">{user.username}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Email Address</dt>
                                            <dd className="mt-1 text-base font-medium text-gray-900">{user.email}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Account Role</dt>
                                            <dd className="mt-1 text-base font-medium text-gray-900">{user.userRole}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Registered Since</dt>
                                            <dd className="mt-1 text-base font-medium text-gray-900">{new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</dd>
                                        </div>
                                        <div className="md:col-span-2">
                                            <dt className="text-sm font-semibold text-gray-400 uppercase tracking-wider">User ID</dt>
                                            <dd className="mt-1 text-xs font-mono font-medium text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">{user.userId}</dd>
                                        </div>
                                    </dl>
                                )}
                            </div>
                        </div>
                    </div>
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
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col z-30`}
            >
                <div className="h-20 flex items-center px-6 border-b border-gray-50">
                    <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Building2 className="h-6 w-6 text-white" />
                    </div>
                    {isSidebarOpen && (
                        <span className="ml-3 font-black text-xl text-gray-900 tracking-tight">Warehouse<span className="text-indigo-600">MS</span></span>
                    )}
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {filteredNavItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as TabType)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === item.id
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                                : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                            {isSidebarOpen && (
                                <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            )}
                            {activeTab === item.id && isSidebarOpen && (
                                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                            )}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-20 shadow-sm shadow-gray-50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
                        >
                            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest hidden sm:block">
                            {activeTab}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-bold text-gray-500 border border-gray-100">
                            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            System Live
                        </div>
                        <div className="h-10 w-px bg-gray-100"></div>
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-gray-900">{user.username}</p>
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">{user.userRole}</p>
                                </div>
                                <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-bold text-gray-900">{user.username}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                                        <span className="inline-block mt-2 px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded">
                                            {user.userRole}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            logout();
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="max-w-6xl mx-auto pb-10">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
}
