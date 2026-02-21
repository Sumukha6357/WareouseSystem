'use client';

export default function PrivacyPage() {
    return (
        <div className="bg-background min-h-screen py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-foreground tracking-tight mb-8">Privacy <span className="text-primary">Policy</span></h1>
                <div className="bg-card rounded-3xl border border-card-border p-10 prose prose-invert max-w-none">
                    <p className="text-muted font-medium mb-6">Last updated: February 5, 2026</p>
                    <section className="space-y-6">
                        <div>
                            <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-widest text-[12px]">Data Collection</h2>
                            <p className="text-muted leading-relaxed font-medium">We collect information necessary for facility management, including inventory data, user logs, and operational metrics. This is dummy content for demonstration purposes.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-widest text-[12px]">How We Use Data</h2>
                            <p className="text-muted leading-relaxed font-medium">Your data is used to optimize warehouse throughput, provide predictive insights, and maintain secure access control across your facility.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-widest text-[12px]">Security Protocols</h2>
                            <p className="text-muted leading-relaxed font-medium">We implement industry-standard AES-256 encryption for all stored data and use TLS 1.3 for all data in transit across the WarehouseMS network.</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
