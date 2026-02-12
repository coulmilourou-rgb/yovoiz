'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-yo-gray-800 mb-2">
            {label}
            {props.required && <span className="text-yo-orange ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={inputType}
            className={cn(
              'flex h-12 w-full rounded-yo-md border border-yo-gray-200 bg-white px-4 py-2 text-base',
              'placeholder:text-yo-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-yo-green focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-yo-gray-50',
              error && 'border-red-500 focus:ring-red-500',
              isPassword && 'pr-12',
              className
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-yo-gray-400 hover:text-yo-gray-600 transition"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
            <span className="text-red-500">⚠️</span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-yo-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
