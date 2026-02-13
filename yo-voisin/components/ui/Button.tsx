import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  success?: boolean;
  error?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, success, error, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-95',
          {
            'bg-yo-green text-white hover:bg-yo-green-dark shadow-yo-md hover:shadow-yo-lg': variant === 'primary',
            'bg-yo-orange text-white hover:bg-yo-orange-dark shadow-yo-md hover:shadow-yo-lg': variant === 'secondary',
            'bg-gradient-to-r from-yo-green to-emerald-600 text-white shadow-yo-lg hover:shadow-xl hover:from-yo-green-dark hover:to-emerald-700': variant === 'gradient',
            'border-2 border-yo-gray-300 text-yo-gray-800 hover:bg-yo-gray-50': variant === 'outline',
            'text-yo-gray-600 hover:bg-yo-gray-100': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600 shadow-yo-md': variant === 'destructive',
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        disabled={disabled || loading || success}
        {...props}
      >
        {/* Loading state */}
        {loading && (
          <motion.div
            className="absolute inset-0 bg-inherit rounded-full flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="w-5 h-5 animate-spin" />
          </motion.div>
        )}

        {/* Success state */}
        {success && (
          <motion.div
            className="absolute inset-0 bg-green-500 rounded-full flex items-center justify-center text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Check className="w-5 h-5" />
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <motion.div
            className="absolute inset-0 bg-red-500 rounded-full flex items-center justify-center text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <X className="w-5 h-5" />
          </motion.div>
        )}

        {/* Content */}
        <span className={cn('flex items-center gap-2', (loading || success || error) && 'invisible')}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
