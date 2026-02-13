import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'verified' | 'level';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  dot?: boolean;
  icon?: React.ReactNode;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', pulse, dot, icon, children, ...props }, ref) => {
    const BadgeContent = (
      <div
        className={cn(
          'inline-flex items-center justify-center gap-1.5 font-semibold rounded-full whitespace-nowrap',
          'transition-all duration-200',
          {
            // Variants
            'bg-yo-gray-100 text-yo-gray-700': variant === 'default',
            'bg-green-50 text-green-700 border border-green-200': variant === 'success',
            'bg-yellow-50 text-yellow-700 border border-yellow-200': variant === 'warning',
            'bg-red-50 text-red-700 border border-red-200': variant === 'error',
            'bg-blue-50 text-blue-700 border border-blue-200': variant === 'info',
            'bg-yo-green-pale text-yo-green-dark border border-yo-green': variant === 'verified',
            'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg': variant === 'level',
            
            // Sizes
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-3 py-1 text-sm': size === 'md',
            'px-4 py-1.5 text-base': size === 'lg',
            
            // Pulse animation
            'animate-pulse': pulse,
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {dot && (
          <motion.span
            className="w-2 h-2 rounded-full bg-current"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        
        {icon && <span>{icon}</span>}
        
        {children}
      </div>
    );

    return pulse ? (
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {BadgeContent}
      </motion.div>
    ) : (
      BadgeContent
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
