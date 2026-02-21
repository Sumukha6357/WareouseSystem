'use client';

import { useCallback, useEffect, useState } from 'react';
import { notify } from '@/lib/notify';
import httpClient from '@/lib/httpClient';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';
import ErrorState from './ui/ErrorState';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Package, ClipboardList, CheckCircle2, Timer, AlertCircle, Box, MapPin, ChevronRight, Zap, History } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';

interface PickTask {
    taskId: string;
    orderId: string;
    orderNumber: string;
    product: {
        productId: string;
        name: string;
        sku: string;
        category: string;
    };
    blockId: string;
    blockName: string;
    quantity: number;
    assignedTo: string;
    status: string;
    notes?: string;
    createdAt: number;
    lastModifiedAt: number;
    completedAt?: number;
}

export default function PickTaskView() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<PickTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [selectedTask, setSelectedTask] = useState<PickTask | null>(null);


    const fetchMyTasks = useCallback(async () => {
        try {
            if (!user) {
                // Should useAuth handle redirection? Or parent? 
                // But definitely don't toast generic error if we know user is missing
                return;
            }

            const tasks = await httpClient.get<PickTask[]>(`/orders/pick-tasks/picker/${user.username}`);
            setTasks(tasks || []);
        } catch {
            setError(true);
            notify.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            setError(false);
            fetchMyTasks();
        }
    }, [fetchMyTasks, user]);

    // WebSocket Integration for real-time task updates
    useWebSocket(`/topic/pick-tasks`, () => {
        if (user) {
            console.log('Pick Task update received');
            fetchMyTasks();
        }
    });

    const startTask = async (taskId: string) => {
        try {
            await httpClient.put(`/orders/pick-tasks/${taskId}/start`, {});
            notify.success('Task started successfully');
            fetchMyTasks();
        } catch {
            notify.error('Failed to start task');
        }
    };

    const completeTask = async (taskId: string) => {
        if (!confirm('Are you sure you have picked all items for this task?')) return;

        try {
            await httpClient.put(`/orders/pick-tasks/${taskId}/complete`, {});
            notify.success('Task completed successfully');
            fetchMyTasks();
        } catch {
            notify.error('Failed to complete task');
        }
    };

    const getStatusVariant = (status: string) => {
        const variants: Record<string, string> = {
            ASSIGNED: 'primary',
            IN_PROGRESS: 'secondary',
            COMPLETED: 'outline',
            CANCELLED: 'ghost'
        };
        return (variants[status] || 'ghost') as 'primary' | 'secondary' | 'outline' | 'ghost';
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            ASSIGNED: 'bg-blue-100 text-blue-800',
            IN_PROGRESS: 'bg-amber-100 text-amber-800',
            COMPLETED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPriorityIcon = (status: string) => {
        if (status === 'ASSIGNED') return <ClipboardList className="h-4 w-4" />;
        if (status === 'IN_PROGRESS') return <Zap className="h-4 w-4" />;
        if (status === 'COMPLETED') return <CheckCircle2 className="h-4 w-4" />;
        return <Box className="h-4 w-4" />;
    };

    const filteredTasks = filterStatus === 'ALL'
        ? tasks
        : tasks.filter(task => task.status === filterStatus);

    const activeTasks = tasks.filter(t => t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS');
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

    if (loading) {
        return <LoadingSpinner message="Mobilizing pick tasks..." />;
    }

    if (error) {
        return <ErrorState onRetry={() => { setError(false); setLoading(true); fetchMyTasks(); }} />;
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4 italic uppercase">
                        <ClipboardList className="h-10 w-10 text-primary" />
                        Operational Tasks
                    </h1>
                    <p className="text-sm font-medium text-muted mt-2">Active retrieval assignments for your current sector.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 bg-card/50 p-2 rounded-3xl border border-card-border shadow-xl shadow-black/5">
                    <div className="flex items-center gap-3 px-6 py-3 border-r border-card-border last:border-0">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-muted uppercase tracking-widest">Active</p>
                            <p className="text-lg font-black text-sharp tabular-nums">{activeTasks.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 border-r border-card-border last:border-0">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-muted uppercase tracking-widest">Done</p>
                            <p className="text-lg font-black text-sharp tabular-nums">{completedTasks.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 px-6 py-3 border-r border-card-border last:border-0">
                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                            <History className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-muted uppercase tracking-widest">Total</p>
                            <p className="text-lg font-black text-sharp tabular-nums">{tasks.length}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="flex items-center gap-3 bg-card p-2 rounded-[2rem] border-2 border-card-border shadow-inner w-fit overflow-x-auto no-scrollbar">
                {['ALL', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                    <Button
                        key={status}
                        variant={filterStatus === status ? 'primary' : 'ghost'}
                        onClick={() => setFilterStatus(status)}
                        className={`h-12 px-8 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${filterStatus === status
                            ? 'shadow-xl shadow-primary/25 translate-y-[-2px]'
                            : 'text-muted hover:text-sharp'
                            }`}
                    >
                        {status === 'ALL' ? 'Everything' : status.replace('_', ' ')}
                    </Button>
                ))}
            </div>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
                <div className="col-span-full py-32 text-center bg-card rounded-[3rem] border-4 border-dashed border-card-border/50 animate-in zoom-in-95 duration-500">
                    <ClipboardList className="h-20 w-20 text-muted/10 mx-auto mb-8" />
                    <p className="text-muted font-black uppercase tracking-[0.4em] text-sm">Task Registry Vacant</p>
                    <p className="text-[10px] text-muted/40 font-bold uppercase tracking-widest mt-6 max-w-sm mx-auto leading-relaxed italic">
                        No {filterStatus === 'ALL' ? 'operational' : filterStatus.toLowerCase().replace('_', ' ')} assignments detected in the current orchestration buffer.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredTasks.map(task => (
                        <Card
                            key={task.taskId}
                            className={`group relative overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 border-2 ${task.status === 'IN_PROGRESS'
                                ? 'border-amber-500/30'
                                : 'hover:border-primary/30'
                                }`}
                        >
                            {task.status === 'IN_PROGRESS' && (
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000">
                                    <Zap className="h-32 w-32 text-amber-500" />
                                </div>
                            )}

                            <div className="flex bg-background/50 border-b border-card-border p-6 justify-between items-center rounded-t-2xl">
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border-2 shadow-xl shadow-black/5 ${task.status === 'IN_PROGRESS' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                                        task.status === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                            'bg-primary/10 border-primary/20 text-primary'
                                        }`}>
                                        <Package className="h-6 w-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xl font-black text-sharp italic uppercase tracking-tighter truncate group-hover:text-primary transition-colors">{task.product.name}</p>
                                        <div className="flex items-center gap-2 mt-1 opacity-60">
                                            <span className="text-[10px] font-black uppercase tracking-widest">SKU: {task.product.sku}</span>
                                            <div className="h-1 w-1 rounded-full bg-muted"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary"># {task.orderNumber}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant={getStatusVariant(task.status)} className="h-8 px-5 rounded-xl uppercase italic">
                                    {getPriorityIcon(task.status)}
                                    <span className="ml-2">{task.status.replace('_', ' ')}</span>
                                </Badge>
                            </div>

                            <CardContent className="p-8 space-y-8 flex-1">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="p-5 bg-background/50 rounded-2xl border border-card-border/50 group-hover:border-primary/20 transition-all">
                                        <div className="flex items-center gap-2 mb-3">
                                            <MapPin className="h-3.5 w-3.5 text-primary opacity-50" />
                                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">Sector Node</p>
                                        </div>
                                        <p className="text-xl font-black text-sharp italic tracking-tighter">{task.blockName}</p>
                                    </div>
                                    <div className="p-5 bg-background/50 rounded-2xl border border-card-border/50 group-hover:border-primary/20 transition-all">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Box className="h-3.5 w-3.5 text-primary opacity-50" />
                                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">Quantity</p>
                                        </div>
                                        <p className="text-3xl font-black text-sharp tabular-nums">{task.quantity} <span className="text-[10px] text-muted opacity-40 lowercase">units</span></p>
                                    </div>
                                </div>

                                {task.notes && (
                                    <div className="p-5 bg-primary/5 rounded-2xl border-l-4 border-primary/30 italic text-xs text-muted font-medium">
                                        &quot;{task.notes}&quot;
                                    </div>
                                )}

                                {task.status === 'IN_PROGRESS' && (
                                    <div className="flex items-center gap-3 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20 text-amber-500 animate-pulse">
                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Execution window active - Complete retrieval immediately.</p>
                                    </div>
                                )}
                            </CardContent>

                            <div className="p-6 bg-background/30 rounded-b-2xl border-t border-card-border/50 flex flex-col sm:flex-row gap-3">
                                {task.status === 'ASSIGNED' && (
                                    <Button
                                        onClick={() => startTask(task.taskId)}
                                        className="flex-1 h-14 rounded-xl shadow-xl shadow-primary/20 group/btn"
                                    >
                                        <Zap className="mr-2 h-4 w-4 group-hover/btn:animate-pulse" />
                                        Initialize Protocol
                                    </Button>
                                )}
                                {task.status === 'IN_PROGRESS' && (
                                    <Button
                                        onClick={() => completeTask(task.taskId)}
                                        className="flex-1 h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 border-none group/btn"
                                    >
                                        <CheckCircle2 className="mr-2 h-4 w-4 group-hover/btn:scale-125 transition-transform" />
                                        Commit Fulfillment
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedTask(task)}
                                    className="h-14 rounded-xl px-8 border-card-border/50 hover:border-primary/30"
                                >
                                    Detailed Audit
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Task Details Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Task Details</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTask.status)}`}>
                                    {selectedTask.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="border-t pt-3">
                                <h3 className="font-semibold mb-2">Product Information</h3>
                                <p><strong>Name:</strong> {selectedTask.product.name}</p>
                                <p><strong>SKU:</strong> {selectedTask.product.sku}</p>
                                <p><strong>Category:</strong> {selectedTask.product.category}</p>
                            </div>

                            <div className="border-t pt-3">
                                <h3 className="font-semibold mb-2">Pick Information</h3>
                                <p><strong>Location:</strong> {selectedTask.blockName}</p>
                                <p><strong>Quantity:</strong> {selectedTask.quantity} units</p>
                                <p><strong>Order Number:</strong> {selectedTask.orderNumber}</p>
                            </div>

                            <div className="border-t pt-3">
                                <h3 className="font-semibold mb-2">Timeline</h3>
                                <p><strong>Created:</strong> {new Date(selectedTask.createdAt).toLocaleString()}</p>
                                <p><strong>Last Modified:</strong> {new Date(selectedTask.lastModifiedAt).toLocaleString()}</p>
                                {selectedTask.completedAt && (
                                    <p><strong>Completed:</strong> {new Date(selectedTask.completedAt).toLocaleString()}</p>
                                )}
                            </div>

                            {selectedTask.notes && (
                                <div className="border-t pt-3">
                                    <h3 className="font-semibold mb-2">Notes</h3>
                                    <p className="text-gray-700">{selectedTask.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 mt-8 pt-8 border-t border-card-border/30">
                            {selectedTask.status === 'ASSIGNED' && (
                                <Button
                                    className="flex-1 h-14"
                                    onClick={() => {
                                        startTask(selectedTask.taskId);
                                        setSelectedTask(null);
                                    }}
                                >
                                    <Zap className="mr-2 h-4 w-4" />
                                    Initialize Protocol
                                </Button>
                            )}
                            {selectedTask.status === 'IN_PROGRESS' && (
                                <Button
                                    className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20"
                                    onClick={() => {
                                        completeTask(selectedTask.taskId);
                                        setSelectedTask(null);
                                    }}
                                >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Commit fulfillment
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                className="flex-1 h-14"
                                onClick={() => setSelectedTask(null)}
                            >
                                Close Interface
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
