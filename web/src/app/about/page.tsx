'use client';

import { Building2, Globe, Users, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="max-w-3xl">
                    <h2 className="text-base text-primary font-black tracking-widest uppercase mb-4">Our Mission</h2>
                    <h1 className="text-5xl font-black text-foreground tracking-tight mb-8">
                        Redefining Warehouse <span className="text-primary">Intelligence.</span>
                    </h1>
                    <p className="text-xl text-muted font-medium leading-relaxed mb-12">
                        WarehouseMS was built by logistics experts for the digital age. We provide the tools companies need to turn complex storage challenges into streamlined operational advantages.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                    {[
                        { icon: Globe, label: "Global Reach", text: "Scaling operations across 12 countries." },
                        { icon: Users, label: "Expert Support", text: "24/7 dedicated facility management team." },
                        { icon: ShieldCheck, label: "Enterpise Grade", text: "Bank-level security for your inventory data." },
                        { icon: Building2, label: "Smart Facilities", text: "Integrating AI into physical warehouse space." }
                    ].map((item, i) => (
                        <div key={i} className="p-8 bg-card border border-card-border rounded-3xl group hover:border-primary/50 transition-all">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <item.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-black text-foreground mb-2">{item.label}</h3>
                            <p className="text-sm font-medium text-muted">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
