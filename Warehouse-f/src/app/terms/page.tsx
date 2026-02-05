'use client';

export default function TermsPage() {
    return (
        <div className="bg-background min-h-screen py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-foreground tracking-tight mb-8">Terms & <span className="text-primary">Conditions</span></h1>
                <div className="bg-card rounded-3xl border border-card-border p-10 prose prose-invert max-w-none">
                    <p className="text-muted font-medium mb-6">Last updated: February 5, 2026</p>
                    <section className="space-y-6">
                        <div>
                            <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-widest text-[12px]">Acceptance of Terms</h2>
                            <p className="text-muted leading-relaxed font-medium">By accessing WarehouseMS, you agree to optimize your facility with integrity. These terms govern the use of our dummy logistics platform.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-widest text-[12px]">User Obligations</h2>
                            <p className="text-muted leading-relaxed font-medium">Users must ensure accurate data entry for all inventory and shipment records. Mismanagement of digital blocks is strictly prohibited in this demonstration environment.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground mb-4 uppercase tracking-widest text-[12px]">Limitation of Liability</h2>
                            <p className="text-muted leading-relaxed font-medium">WarehouseMS is not liable for virtual inventory losses or imaginary logistics delays incurred while using this training software.</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
