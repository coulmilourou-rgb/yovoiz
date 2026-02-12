import React from 'react';
import { cn } from '@/lib/utils';
import { ProviderLevel } from '@/lib/types';
import { PROVIDER_LEVELS } from '@/lib/constants';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'verified' | 'level' | 'status' | 'category';
  level?: ProviderLevel;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'status', level, children, ...props }, ref) => {
    const levelInfo = level ? PROVIDER_LEVELS[level] : null;

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold',
          {
            'bg-yo-green-pale text-yo-green': variant === 'verified',
            'bg-yo-orange-pale text-yo-orange': variant === 'category',
          },
          className
        )}
        style={
          variant === 'level' && levelInfo
            ? { backgroundColor: `${levelInfo.color}20`, color: levelInfo.color }
            : undefined
        }
        {...props}
      >
        {variant === 'level' && levelInfo && (
          <span>{levelInfo.icon}</span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
