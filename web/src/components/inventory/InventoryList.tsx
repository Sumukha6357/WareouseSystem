'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Package, Search, AlertTriangle, TrendingUp, Settings2, Trash2, MapPin } from 'lucide-react';
import RequireRole from '../auth/RequireRole';

interface Inventory {
    inventoryId: string;
    product: {
        productId: string;
        name: string;
        sku: string;
    };
    blockId: string;
    blockName: string;
    quantity: number;
    reservedQuantity: number;
    availableQuantity: number;
    minStockLevel: number;
    maxStockLevel: number;
    isLowStock: boolean;
}

interface InventoryListProps {
    inventories: Inventory[];
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onAdjust: (inventory: Inventory) => void;
    onEdit: (inventory: Inventory) => void;
    onDelete: (inventoryId: string) => void;
    onCreateClick: () => void;
}

export default function InventoryList({
    inventories,
    searchTerm,
    onSearchChange,
    onAdjust,
    onEdit,
    onDelete,
    onCreateClick
}: InventoryListProps) {
    const filteredInventories = inventories.filter(inv =>
        inv.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.blockName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockCount = inventories.filter(inv => inv.isLowStock).length;

    return (
        <div className="space-y-10">
            {lowStockCount > 0 && (
                <div className="bg-amber-500/5 border-2 border-amber-500/20 rounded-[2.5rem] p-8 flex items-center gap-6 animate-pulse shadow-lg shadow-amber-500/5">
                    <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-600 border border-amber-500/20">
                        <AlertTriangle className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-amber-900 uppercase tracking-[0.2em]">Low Stock Condition Detected</p>
                        <p className="text-base font-black text-amber-700/80 mt-1">{lowStockCount} resource clusters require immediate replenishment</p>
                    </div>
                </div>
            )}

            <div className="relative group max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Scan by product name, SKU, or storage node..."
                    className="w-full pl-16 pr-8 py-5 bg-card border-2 border-input-border rounded-[2rem] text-sm font-black uppercase tracking-widest text-sharp focus:ring-4 focus:ring-primary/10 transition-all shadow-sm outline-none"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Product / Entity</TableHead>
                        <TableHead>Location Hub</TableHead>
                        <TableHead>Total Load</TableHead>
                        <TableHead>Reserved</TableHead>
                        <TableHead>Available</TableHead>
                        <TableHead>Capacity Util</TableHead>
                        <TableHead className="text-right">Action Matrix</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredInventories.map((inventory) => (
                        <TableRow key={inventory.inventoryId}>
                            <TableCell>
                                <div>
                                    <p className="text-sm font-black text-sharp uppercase truncate max-w-[200px]">{inventory.product.name}</p>
                                    <p className="text-[10px] font-black text-muted/50 uppercase tracking-widest mt-0.5 font-mono">{inventory.product.sku}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="flex items-center gap-1.5 w-fit">
                                    <MapPin size={10} />
                                    {inventory.blockName}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className={`text-lg font-black tracking-tighter ${inventory.isLowStock ? 'text-amber-600' : 'text-sharp'}`}>
                                        {inventory.quantity}
                                    </span>
                                    {inventory.isLowStock && <AlertTriangle size={14} className="text-amber-500 animate-bounce" />}
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-xs font-black text-muted tabular-nums">{inventory.reservedQuantity}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-xs font-black text-emerald-600 tabular-nums">{inventory.availableQuantity}</span>
                            </TableCell>
                            <TableCell>
                                {inventory.maxStockLevel > 0 && (
                                    <div className="w-24 space-y-1">
                                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted/50">
                                            <span>{Math.round((inventory.quantity / inventory.maxStockLevel) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-background rounded-full h-1.5 overflow-hidden border border-card-border/30">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${inventory.isLowStock ? 'bg-amber-500' : 'bg-primary'}`}
                                                style={{ width: `${Math.min((inventory.quantity / inventory.maxStockLevel) * 100, 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <RequireRole role={['ADMIN', 'WAREHOUSE_MANAGER']}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onAdjust(inventory)}
                                            className="h-9 px-4 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-sharp hover:text-white"
                                        >
                                            <TrendingUp className="h-3 w-3 mr-2" />
                                            Adjust
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(inventory)}
                                            className="h-9 w-9 bg-background border border-card-border/50 rounded-xl"
                                        >
                                            <Settings2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(inventory.inventoryId)}
                                            className="h-9 w-9 bg-background border border-card-border/50 rounded-xl hover:text-red-500 hover:bg-red-500/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </RequireRole>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}

                    {filteredInventories.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-[400px] text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <Package className="h-16 w-16 text-muted/10 mb-6" />
                                    <p className="text-muted font-black uppercase tracking-[0.5em] text-xs">No Grid Data Detected</p>
                                    <p className="text-[10px] text-muted/40 mt-4 font-bold uppercase tracking-widest max-w-xs leading-relaxed italic">
                                        Initialize resource allocation protocols to populate the control interface
                                    </p>
                                    <Button
                                        variant="ghost"
                                        className="mt-8 text-[10px] h-10 px-6 font-black uppercase tracking-widest border border-card-border/50"
                                        onClick={onCreateClick}
                                    >
                                        Execute Primary Allocation
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
