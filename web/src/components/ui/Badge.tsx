import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger' | 'ghost';
}

function Badge({ className, variant = "primary", ...props }: BadgeProps) {
    const variants = {
        primary: "bg-primary/10 text-primary border-primary/20",
        secondary: "bg-sharp/10 text-sharp border-sharp/20",
        outline: "bg-transparent text-muted border-card-border",
        success: "bg-green-500/10 text-green-600 border-green-500/20",
        warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        danger: "bg-red-500/10 text-red-600 border-red-500/20",
        ghost: "bg-transparent text-muted border-transparent",
    }

    return (
        <div
            role="status"
            className={cn(
                "inline-flex items-center rounded-xl border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest transition-colors",
                variants[variant],
                className
            )}
            {...props}
        />
    )
}

export { Badge }
