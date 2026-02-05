import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-2 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        className={`
              block w-full rounded-2xl border-2 border-input-border px-4 py-3 
              bg-background text-sharp shadow-sm font-medium
              focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm 
              disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800
              placeholder:text-muted/50
              transition-all duration-200 outline-none
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              ${className}
            `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
