import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, type = 'button', ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-4 focus:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none active:scale-95";

        const variants = {
            primary: "bg-primary text-white hover:opacity-90 focus:ring-primary/20 shadow-xl shadow-primary/20",
            secondary: "bg-sharp text-background hover:opacity-90 focus:ring-sharp/20 shadow-xl shadow-sharp/10",
            outline: "border-2 border-card-border bg-transparent text-sharp hover:bg-sharp/5 hover:border-sharp/30 focus:ring-primary/10",
            ghost: "bg-transparent text-muted hover:bg-sharp/5 hover:text-sharp focus:ring-primary/10",
            danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/20 shadow-xl shadow-red-500/20",
        };

        const sizes = {
            sm: "h-9 px-4 text-[10px]",
            md: "h-12 px-6 text-[10px]",
            lg: "h-16 px-10 text-xs",
            icon: "h-10 w-10 p-0",
        };

        return (
            <button
                ref={ref}
                type={type}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={isLoading || props.disabled}
                aria-busy={isLoading}
                aria-label={isLoading ? "Loading..." : props['aria-label']}
                {...props}
            >
                {isLoading ? (
                    <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    children
                )}
            </button>
        );
    }
);

Button.displayName = "Button";
