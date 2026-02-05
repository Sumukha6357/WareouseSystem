'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
    Package,
    Plus,
    Search,
    Edit2,
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
import toast from 'react-hot-toast';

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
            const response = await api.get('/products');
            setProducts(response.data.data || []);
        } catch (error: any) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/products', formData);
            toast.success('Product created successfully!');
            await fetchProducts();
            setShowCreateModal(false);
            resetForm();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to create product';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setLoading(true);
        try {
            await api.put(`/products/${editingProduct.productId}`, formData);
            toast.success('Product updated successfully!');
            await fetchProducts();
            setEditingProduct(null);
            resetForm();
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to update product';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        setLoading(true);
        try {
            await api.delete(`/products/${productId}`);
            toast.success('Product deleted successfully!');
            await fetchProducts();
            setDeletingProductId(null);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to delete product';
            toast.error(message);
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
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-xl shadow-primary/20"></div>
                <p className="text-muted font-black text-[10px] uppercase tracking-[0.2em]">Synchronizing product catalog...</p>
            </div>
        );
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
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="h-16 px-8 rounded-3xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-primary/30 group"
                >
                    <Plus className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Register Component
                </Button>
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
                    <div
                        key={product.productId}
                        className="bg-card rounded-[3rem] p-10 border-2 border-card-border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group relative overflow-hidden flex flex-col"
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
                                    <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 h-12 text-[10px] font-black uppercase tracking-widest" onClick={() => handleDelete(product.productId)} isLoading={loading}>
                                        Confirm Purge
                                    </Button>
                                    <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase tracking-widest" onClick={() => setDeletingProductId(null)}>
                                        Stand Down
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-8">
                            <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                                <Tag className="h-7 w-7" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="h-10 w-10 flex items-center justify-center bg-background hover:bg-primary/10 rounded-xl text-muted hover:text-primary transition-all border border-card-border/50 shadow-sm"
                                >
                                    <Settings2 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setDeletingProductId(product.productId)}
                                    className="h-10 w-10 flex items-center justify-center bg-background hover:bg-red-500/10 rounded-xl text-muted hover:text-red-500 transition-all border border-card-border/50 shadow-sm"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <h4 className="text-2xl font-black text-sharp mb-2 truncate group-hover:text-primary transition-colors">{product.name}</h4>
                        <p className="text-[10px] font-black text-muted mb-6 font-mono uppercase tracking-[0.2em] bg-background w-fit px-3 py-1 rounded-lg border border-card-border/50">
                            INDEX: {product.sku}
                        </p>

                        {product.description && (
                            <p className="text-sm text-muted mb-10 line-clamp-2 font-medium leading-relaxed italic">"{product.description}"</p>
                        )}

                        <div className="space-y-4 flex-1">
                            {product.category && (
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1.5 bg-primary/5 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/10 flex items-center gap-2">
                                        <Boxes size={12} />
                                        {product.category}
                                    </span>
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
                    </div>
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

            {/* Create / Edit Modal */}
            {(showCreateModal || editingProduct) && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-xl flex items-center justify-center z-[100] p-6 animate-in fade-in duration-500">
                    <div className="bg-card rounded-[4rem] p-12 max-w-2xl w-full border-2 border-card-border shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto scrollbar-hide">
                        <div className="flex justify-between items-start mb-12 sticky top-0 bg-card z-10 pb-4 border-b border-card-border/30">
                            <div>
                                <h3 className="text-4xl font-black text-sharp tracking-tighter">
                                    {editingProduct ? 'Update Blueprint' : 'New Component'}
                                </h3>
                                <p className="text-sm font-medium text-muted mt-2">
                                    {editingProduct ? 'Adjusting technical specifications' : 'Defining new asset node parameters'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setEditingProduct(null);
                                    resetForm();
                                }}
                                className="p-4 bg-background rounded-3xl text-muted hover:text-sharp transition-all border border-card-border/50 shadow-sm"
                            >
                                <X size={28} />
                            </button>
                        </div>

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
                </div>
            )}
        </div>
    );
}
