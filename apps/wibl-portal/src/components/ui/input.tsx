import React from 'react';
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftElement?: React.ReactNode;
    rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, leftElement, rightElement, id, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const [hasValue, setHasValue] = React.useState(false);

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
            props.onBlur?.(e);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            props.onFocus?.(e);
        };

        return (
            <div className="w-full space-y-1.5">
                <div className="relative group">
                    {leftElement && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 group-focus-within:text-wibl-teal transition-colors">
                            {leftElement}
                        </div>
                    )}

                    <input
                        {...props}
                        id={id}
                        ref={ref}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        onChange={(e) => {
                            setHasValue(!!e.target.value);
                            props.onChange?.(e);
                        }}
                        className={cn(
                            "block w-full px-4 py-3.5 bg-canvas-muted border-2 border-navy-100 rounded-wibl-sm text-navy-700 font-medium transition-all duration-200 outline-none",
                            isFocused && "border-wibl-teal shadow-[0_0_0_4px_rgba(78,205,196,0.1)] bg-white",
                            error && "border-wibl-coral focus:border-wibl-coral focus:shadow-[0_0_0_4px_rgba(255,107,107,0.1)]",
                            leftElement && "pl-11",
                            rightElement && "pr-11",
                            className
                        )}
                        placeholder={label ? " " : props.placeholder}
                    />

                    {label && (
                        <label
                            htmlFor={id}
                            className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 font-bold pointer-events-none transition-all duration-200",
                                (isFocused || hasValue || props.placeholder) && "-top-2 left-3 scale-90 px-2 bg-white text-wibl-teal rounded-md",
                                error && (isFocused || hasValue) && "text-wibl-coral",
                                leftElement && !(isFocused || hasValue) && "left-11"
                            )}
                        >
                            {label}
                        </label>
                    )}

                    {rightElement && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-400">
                            {rightElement}
                        </div>
                    )}
                </div>

                {(error || helperText) && (
                    <p className={cn("text-xs font-bold px-1", error ? "text-wibl-coral" : "text-navy-400")}>
                        {error || helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
