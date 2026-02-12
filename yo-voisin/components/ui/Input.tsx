import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold text-yo-gray-800 mb-2">
            {label}
          </label>
        )}
        <input
          className={cn(
            'w-full px-4 py-3 rounded-yo-md border-2 border-yo-gray-200',
            'focus:outline-none focus:border-yo-green transition-colors',
            'placeholder:text-yo-gray-400',
            error && 'border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
