import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const Modal = ({ isOpen, onClose, title, children, className, maxWidth = '2xl' }: ModalProps) => {
    // Handle Esc key to close
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWeights = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-xl"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Content */}
            <div
                className={cn(
                    "relative w-full bg-card rounded-[3rem] border-2 border-card-border shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]",
                    maxWeights[maxWidth],
                    className
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-8 sm:p-10 border-b border-card-border/30">
                    {title && (
                        <h2
                            id="modal-title"
                            className="text-3xl font-black text-sharp tracking-tighter uppercase italic"
                        >
                            {title}
                        </h2>
                    )}
                    <button
                        onClick={onClose}
                        className="p-3 bg-background hover:bg-sharp/5 text-muted hover:text-sharp rounded-2xl transition-all border border-card-border/50 shadow-sm outline-none focus:ring-4 focus:ring-primary/10"
                        aria-label="Close modal"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 sm:p-10 scrollbar-hide">
                    {children}
                </div>
            </div>
        </div>
    );
};

export { Modal }
