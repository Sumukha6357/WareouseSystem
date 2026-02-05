'use client';

import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
    return (
        <div className="bg-background min-h-screen py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-base text-primary font-black tracking-widest uppercase mb-4">Contact Us</h2>
                        <h1 className="text-5xl font-black text-foreground tracking-tight mb-8">
                            Let's Talk <span className="text-primary">Logistics.</span>
                        </h1>
                        <p className="text-lg text-muted font-medium leading-relaxed mb-12">
                            Have questions about our enterprise solutions? Our team is ready to help you optimize your facility.
                        </p>

                        <div className="space-y-8">
                            {[
                                { icon: Mail, label: "Email Support", value: "support@warehousems.com" },
                                { icon: Phone, label: "Sales Inquiries", value: "+1 (888) LOG-WARE" },
                                { icon: MapPin, label: "Headquarters", value: "77 Innovation Way, Tech Park, CA" }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                        <item.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-lg font-black text-foreground">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card rounded-3xl border border-card-border p-10 shadow-xl shadow-black/5">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Full Name</label>
                                    <input type="text" className="w-full rounded-2xl border-2 border-input-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Email Address</label>
                                    <input type="email" className="w-full rounded-2xl border-2 border-input-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold" placeholder="john@company.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest">Subject</label>
                                <input type="text" className="w-full rounded-2xl border-2 border-input-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold" placeholder="Enterprise Quote" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest">Message</label>
                                <textarea rows={4} className="w-full rounded-2xl border-2 border-input-border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold resize-none" placeholder="Tell us about your facility..."></textarea>
                            </div>
                            <Button className="w-full py-6 rounded-2xl shadow-lg shadow-primary/20 group text-sm uppercase tracking-widest font-black">
                                Send Message <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
