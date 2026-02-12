import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-yo-green text-white hover:bg-yo-green-dark shadow-yo-md': variant === 'primary',
            'bg-yo-orange text-white hover:bg-yo-orange-dark shadow-yo-md': variant === 'secondary',
            'border-2 border-yo-gray-300 text-yo-gray-800 hover:bg-yo-gray-50': variant === 'outline',
            'text-yo-gray-600 hover:bg-yo-gray-100': variant === 'ghost',
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
