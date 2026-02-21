'use client';

import React, { useEffect, useState } from 'react';
import httpClient from '@/lib/httpClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    Package,
    Plus,
    Search,
    Trash2,
    DollarSign,
    Weight,
    Ruler,
    X,
    Settings2,
    Tag,
    Boxes,
    PackageCheck,
    AlertTriangle
} from 'lucide-react';
import { notify } from '@/lib/notify';
import RequireRole from './auth/RequireRole';
import LoadingSpinner from './ui/LoadingSpinner';
import { Card, CardHeader, CardContent, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';

interface Product {
    productId: string;
    name: string;
    description: string;
    sku: string;
    category: string;
    unitPrice: number;
    weight: number;
    dimensions: string;
}

export default function ProductManagementView() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        sku: '',
        category: '',
        unitPrice: 0,
        weight: 0,
        dimensions: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await httpClient.get<Product[]>('/products');
            setProducts(data || []);
        } catch {
            notify.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await httpClient.post('/products', formData);
            notify.success('Product created successfully!');
            await fetchProducts();
            setShowCreateModal(false);
            resetForm();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to create product';
            notify.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setLoading(true);
        try {
            await httpClient.put(`/products/${editingProduct.productId}`, formData);
            notify.success('Product updated successfully!');
            await fetchProducts();
            setEditingProduct(null);
            resetForm();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to update product';
            notify.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        setLoading(true);
        try {
            await httpClient.delete(`/products/${productId}`);
            notify.success('Product deleted successfully!');
            await fetchProducts();
            setDeletingProductId(null);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to delete product';
            notify.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            sku: product.sku,
            category: product.category || '',
            unitPrice: product.unitPrice || 0,
            weight: product.weight || 0,
            dimensions: product.dimensions || ''
        });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            sku: '',
            category: '',
            unitPrice: 0,
            weight: 0,
            dimensions: ''
        });
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading && products.length === 0) {
        return <LoadingSpinner message="Synchronizing product catalog..." />;
    }

    return (
        <div className="p-8 space-y-10 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h1 className="text-4xl font-black text-sharp tracking-tighter flex items-center gap-4">
                        <PackageCheck className="h-10 w-10 text-primary" />
                        Component Ledger
                    </h1>
                    <p className="text-sm font-medium text-muted mt-2">Technical specifications and asset profile management</p>
                </div>
                <RequireRole role={['ADMIN', 'WAREHOUSE_MANAGER']}>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="h-16 px-8 rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group"
                    >
                        <Plus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                        Register Component
                    </Button>
                </RequireRole>
            </header>

            <div className="relative group max-w-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    placeholder="Scan by title, SKU index, or category group..."
                    className="w-full pl-16 pr-8 py-5 bg-card border-2 border-input-border rounded-[2rem] text-sm font-black uppercase tracking-widest text-sharp focus:ring-4 focus:ring-primary/10 transition-all shadow-sm outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                    <Card
                        key={product.productId}
                        className="p-0 overflow-hidden flex flex-col"
                    >
                        {deletingProductId === product.productId && (
                            <div className="absolute inset-0 bg-background/95 backdrop-blur-md z-[10] flex flex-col items-center justify-center p-10 gap-6 animate-in fade-in zoom-in-95">
                                <div className="p-4 bg-red-500/10 rounded-3xl text-red-600 border border-red-500/20">
                                    <AlertTriangle size={48} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-sharp uppercase tracking-widest mb-2">Abort Component?</p>
                                    <p className="text-[10px] text-muted font-bold uppercase tracking-widest">This logic node will be permanentely purged.</p>
                                </div>
                                <div className="flex flex-col w-full gap-3">
                                    <Button size="sm" variant="danger" className="w-full h-12" onClick={() => handleDelete(product.productId)} isLoading={loading}>
                                        Confirm Purge
                                    </Button>
                                    <Button variant="ghost" size="sm" className="w-full" onClick={() => setDeletingProductId(null)}>
                                        Stand Down
                                    </Button>
                                </div>
                            </div>
                        )}

                        <CardHeader className="flex flex-row justify-between items-start pb-4">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                <Tag className="h-7 w-7" />
                            </div>
                            <div className="flex gap-2">
                                <RequireRole role={['ADMIN', 'WAREHOUSE_MANAGER']}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(product)}
                                        className="h-10 w-10 flex items-center justify-center bg-background border border-card-border/50"
                                    >
                                        <Settings2 className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setDeletingProductId(product.productId)}
                                        className="h-10 w-10 flex items-center justify-center bg-background border border-card-border/50 hover:text-red-500 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </RequireRole>
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1">
                            <CardTitle className="mb-2 truncate group-hover:text-primary transition-colors">
                                {product.name}
                            </CardTitle>

                            <p className="text-[10px] font-black text-muted mb-6 font-mono uppercase tracking-[0.2em] bg-background w-fit px-3 py-1 rounded-lg border border-card-border/50">
                                INDEX: {product.sku}
                            </p>

                            {product.description && (
                                <p className="text-sm text-muted mb-10 line-clamp-2 font-medium leading-relaxed italic">&quot;{product.description}&quot;</p>
                            )}

                            <div className="space-y-4">
                                {product.category && (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="primary" className="flex items-center gap-2">
                                            <Boxes size={12} />
                                            {product.category}
                                        </Badge>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-3 mt-6">
                                    <div className="flex items-center gap-4 p-4 bg-background/50 rounded-2xl border border-card-border/30">
                                        <div className="p-2 bg-card rounded-xl border border-card-border text-primary/50">
                                            <DollarSign size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-muted uppercase tracking-widest leading-none mb-1">Exchange Logic</p>
                                            <p className="text-lg font-black text-sharp tracking-tight tabular-nums">${product.unitPrice || '0.00'}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-4 p-4 bg-background/50 rounded-2xl border border-card-border/30">
                                            <div className="p-2 bg-card rounded-xl border border-card-border text-primary/50">
                                                <Weight size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[8px] font-black text-muted uppercase tracking-widest leading-none mb-1">Mass</p>
                                                <p className="text-sm font-black text-sharp tracking-tight">{product.weight || '0'} KG</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 bg-background/50 rounded-2xl border border-card-border/30">
                                            <div className="p-2 bg-card rounded-xl border border-card-border text-primary/50">
                                                <Ruler size={14} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[8px] font-black text-muted uppercase tracking-widest leading-none mb-1">Volume</p>
                                                <p className="text-sm font-black text-sharp tracking-tight truncate">{product.dimensions || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="col-span-full py-40 border-4 border-dashed border-card-border rounded-[4rem] text-center bg-card/30">
                        <Package className="h-24 w-24 text-muted/10 mx-auto mb-8" />
                        <p className="text-muted font-black uppercase tracking-[0.5em] text-sm">Catalog Null Result</p>
                        <p className="text-[10px] text-muted/40 mt-6 font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                            No component profiles detected in the current filter scope. Initialize registration protocol to populate the ledger.
                        </p>
                        <Button
                            variant="ghost"
                            className="mt-10 text-[10px] font-black uppercase tracking-widest"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Executive Registration
                        </Button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={showCreateModal || !!editingProduct}
                onClose={() => {
                    setShowCreateModal(false);
                    setEditingProduct(null);
                    resetForm();
                }}
                title={editingProduct ? 'Update Blueprint' : 'New Component'}
            >
                <div>
                    <p className="text-sm font-medium text-muted mb-10">
                        {editingProduct ? 'Adjusting technical specifications' : 'Defining new asset node parameters'}
                    </p>

                    <form onSubmit={editingProduct ? handleUpdate : handleCreate} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="md:col-span-2">
                                <Input
                                    label="Component Designation *"
                                    required
                                    className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                    placeholder="e.g. CORE_MODULE_X1"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <Input
                                    label="SKU Index *"
                                    required
                                    className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                    placeholder="WDG-001"
                                    value={formData.sku}
                                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                    disabled={!!editingProduct}
                                />
                            </div>

                            <div>
                                <Input
                                    label="Category Tier"
                                    className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                    placeholder="e.g. LOGIC_LAYER"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>

                            <div>
                                <Input
                                    label="Economic Metric ($)"
                                    type="number"
                                    step="0.01"
                                    className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                    placeholder="0.00"
                                    value={formData.unitPrice || ''}
                                    onChange={e => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                                />
                            </div>

                            <div>
                                <Input
                                    label="Physical Mass (KG)"
                                    type="number"
                                    step="0.01"
                                    className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                    placeholder="0.00"
                                    value={formData.weight || ''}
                                    onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Input
                                    label="Dimensional Vectors (LxWxH)"
                                    className="py-5 px-8 rounded-[2rem] font-black text-lg"
                                    placeholder="e.g. 10x5x3 CM"
                                    value={formData.dimensions}
                                    onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block mb-4 ml-2">Extraction Brief (Description)</label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-[2rem] border-2 border-input-border bg-background py-6 px-8 focus:ring-8 focus:ring-primary/10 transition-all font-medium text-sharp outline-none shadow-sm"
                                    placeholder="Define technical context..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 pt-10 border-t border-card-border/30">
                            <Button
                                type="submit"
                                className="flex-1 py-7 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/30 h-18"
                                isLoading={loading}
                            >
                                {editingProduct ? 'Finalize Blueprint' : 'Initiate Registration'}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingProduct(null);
                                    resetForm();
                                }}
                            >
                                Abort protocol
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
