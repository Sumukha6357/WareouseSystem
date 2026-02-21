import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./Input"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    containerClassName?: string;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, error, containerClassName, id, ...props }, ref) => {
        const generatedId = id || `field-${label.replace(/\s+/g, '-').toLowerCase()}`;

        return (
            <div className={cn("space-y-4", containerClassName)}>
                <label
                    htmlFor={generatedId}
                    className="text-[10px] font-black text-muted uppercase tracking-[0.2em] block ml-2"
                >
                    {label}
                </label>
                <Input
                    id={generatedId}
                    ref={ref}
                    className={cn(
                        "py-5 px-8 rounded-[2rem] font-black text-sharp",
                        error && "border-red-500/50 focus:ring-red-500/10 shadow-red-500/5"
                    )}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${generatedId}-error` : undefined}
                    {...props}
                />
                {error && (
                    <p
                        id={`${generatedId}-error`}
                        className="text-[10px] font-bold text-red-500 uppercase tracking-widest ml-4 animate-in fade-in slide-in-from-top-1"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FormField.displayName = "FormField";

export { FormField }
