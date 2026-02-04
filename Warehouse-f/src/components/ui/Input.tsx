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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        className={`
              block w-full rounded-lg border border-gray-300 px-3 py-2 
              shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm 
              disabled:opacity-50 disabled:bg-gray-50 
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
