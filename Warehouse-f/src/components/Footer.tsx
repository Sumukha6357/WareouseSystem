'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-sidebar border-t border-card-border pt-20 pb-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="h-10 w-10 bg-gradient-to-br from-primary to-emerald-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110 overflow-hidden">
                                <img src="/warehouse_logo.svg" alt="WarehouseMS" className="h-7 w-7 object-contain" />
                            </div>
                            <span className="font-black text-2xl text-foreground tracking-tighter">Warehouse<span className="text-primary">MS</span></span>
                        </Link>
                        <p className="text-muted text-sm font-medium leading-relaxed max-w-xs">
                            Optimizing logistics and inventory management for the next generation of enterprise warehouses.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Linkedin, Github].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="h-10 w-10 rounded-xl bg-card border border-card-border flex items-center justify-center text-muted hover:text-primary hover:border-primary/50 transition-all hover:-translate-y-1"
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-8">Platform</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'About Us', href: '/about' },
                                { label: 'Contact', href: '/contact' },
                                { label: 'Features', href: '/#features' },
                                { label: 'Enterprise', href: '#' }
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-8">Legal</h4>
                        <ul className="space-y-4">
                            {[
                                { label: 'Privacy Policy', href: '/privacy' },
                                { label: 'Terms & Conditions', href: '/terms' },
                                { label: 'Cookie Policy', href: '#' },
                                { label: 'Compliance', href: '#' }
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-8">Connect</h4>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                                    <Mail className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Email</p>
                                    <p className="text-sm font-black text-foreground">support@warehousems.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                                    <Phone className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Call Us</p>
                                    <p className="text-sm font-black text-foreground">+1 (888) LOG-WARE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-card-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">
                        © {new Date().getFullYear()} WarehouseMS. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">System Status: Optimal</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
