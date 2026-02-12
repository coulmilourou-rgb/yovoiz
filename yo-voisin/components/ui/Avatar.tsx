import React from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';

export interface AvatarProps {
  firstName: string;
  lastName: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  firstName,
  lastName,
  imageUrl,
  size = 'md',
  verified = false,
}) => {
  const initials = getInitials(firstName, lastName);

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'rounded-full bg-gradient-to-br from-yo-green to-yo-green-light',
          'flex items-center justify-center text-white font-display font-bold',
          {
            'w-8 h-8 text-xs': size === 'sm',
            'w-12 h-12 text-sm': size === 'md',
            'w-20 h-20 text-lg': size === 'lg',
            'w-24 h-24 text-xl': size === 'xl',
          }
        )}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={`${firstName} ${lastName}`} className="w-full h-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>
      {verified && (
        <div
          className={cn(
            'absolute -bottom-0.5 -right-0.5 bg-yo-green rounded-full',
            'flex items-center justify-center text-white border-2 border-white',
            {
              'w-4 h-4 text-[8px]': size === 'sm',
              'w-5 h-5 text-[10px]': size === 'md',
              'w-7 h-7 text-xs': size === 'lg',
              'w-8 h-8 text-sm': size === 'xl',
            }
          )}
        >
          ✓
        </div>
      )}
    </div>
  );
};
