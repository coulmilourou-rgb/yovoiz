import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', width, height, animation = 'wave', ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'bg-gradient-to-r from-yo-gray-200 via-yo-gray-100 to-yo-gray-200',
          'bg-[length:200%_100%]',
          {
            'rounded-yo-lg': variant === 'rectangular',
            'rounded-full': variant === 'circular',
            'rounded h-4': variant === 'text',
            'animate-pulse': animation === 'pulse',
          },
          className
        )}
        style={{ width, height }}
        animate={
          animation === 'wave'
            ? { backgroundPosition: ['0%', '100%'] }
            : undefined
        }
        transition={
          animation === 'wave'
            ? { duration: 1.5, repeat: Infinity, ease: 'linear' }
            : undefined
        }
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// Skeleton presets pour usage rapide
export const SkeletonCard = () => (
  <div className="space-y-3 p-6 border border-yo-gray-200 rounded-yo-lg">
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="rectangular" height={120} />
    <div className="flex gap-2">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
  </div>
);

export const SkeletonList = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="space-y-2">
    {/* Header */}
    <div className="flex gap-4 pb-2 border-b border-yo-gray-200">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={`header-${i}`} variant="text" width="100%" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex gap-4 py-2">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" width="100%" />
        ))}
      </div>
    ))}
  </div>
);
