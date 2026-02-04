'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Package, Plus, Search, Edit2, Trash2, DollarSign, Weight, Ruler } from 'lucide-react';
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
    const [isCreating, setIsCreating] = useState(false);
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
            setProducts(response.data.data);
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
            setIsCreating(false);
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
            description: product.description,
            sku: product.sku,
            category: product.category,
            unitPrice: product.unitPrice,
            weight: product.weight,
            dimensions: product.dimensions
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
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="text-gray-500 font-medium">Loading products...</p>
            </div>
        );
    }

    if (isCreating || editingProduct) {
        return (
            <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <header>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                        {editingProduct ? 'Edit Product' : 'Create New Product'}
                    </h3>
                    <p className="text-sm font-medium text-gray-400">
                        {editingProduct ? 'Update product information' : 'Add a new product to inventory'}
                    </p>
                </header>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <form onSubmit={editingProduct ? handleUpdate : handleCreate} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Product Name *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="e.g. Industrial Widget"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">SKU *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="e.g. WDG-001"
                                    value={formData.sku}
                                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                                    disabled={!!editingProduct}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Category</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="e.g. Electronics"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Unit Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="0.00"
                                    value={formData.unitPrice}
                                    onChange={e => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="0.00"
                                    value={formData.weight}
                                    onChange={e => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Dimensions (LxWxH)</label>
                                <input
                                    type="text"
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="e.g. 10x5x3 cm"
                                    value={formData.dimensions}
                                    onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-2">Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full rounded-xl border-gray-200 py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="Product description..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <Button type="submit" className="flex-1 py-6 text-base shadow-lg shadow-indigo-100" isLoading={loading}>
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1 py-6 text-base"
                                onClick={() => {
                                    setIsCreating(false);
                                    setEditingProduct(null);
                                    resetForm();
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Product Catalog</h3>
                    <p className="text-sm font-medium text-gray-400">Manage your product inventory</p>
                </div>
                <Button onClick={() => setIsCreating(true)} className="rounded-xl px-6 h-12 shadow-lg shadow-indigo-100">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Product
                </Button>
            </header>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, SKU, or category..."
                    className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-base focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <div key={product.productId} className="bg-white rounded-2xl p-6 border border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative">
                        {deletingProductId === product.productId && (
                            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center p-6 gap-4">
                                <p className="text-sm font-bold text-gray-900 text-center">Delete this product?</p>
                                <p className="text-xs text-gray-500 text-center">This action cannot be undone.</p>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setDeletingProductId(null)}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(product.productId)} isLoading={loading}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <Package className="h-5 w-5" />
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="p-2 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setDeletingProductId(product.productId)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <h4 className="text-lg font-black text-gray-900 mb-1 truncate">{product.name}</h4>
                        <p className="text-xs text-gray-400 mb-3 font-mono">SKU: {product.sku}</p>

                        {product.description && (
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
                        )}

                        <div className="space-y-2">
                            {product.category && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="px-2 py-1 bg-gray-100 rounded-full font-bold">{product.category}</span>
                                </div>
                            )}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                {product.unitPrice > 0 && (
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <DollarSign className="h-3 w-3" />
                                        <span className="font-bold">${product.unitPrice}</span>
                                    </div>
                                )}
                                {product.weight > 0 && (
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Weight className="h-3 w-3" />
                                        <span className="font-bold">{product.weight}kg</span>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Ruler className="h-3 w-3" />
                                        <span className="font-bold text-[10px]">{product.dimensions}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="col-span-full py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">No products found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
