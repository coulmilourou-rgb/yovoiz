import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  circle?: boolean;
}

export function Skeleton({ 
  width = '100%', 
  height = '20px', 
  className = '',
  circle = false
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  const circleClass = circle ? 'rounded-full' : '';
  
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div 
      className={`${baseClasses} ${circleClass} ${className}`}
      style={style}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton 
          key={i} 
          height="16px" 
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <Skeleton circle width={48} height={48} />
        <div className="flex-1">
          <Skeleton width="60%" height="20px" className="mb-2" />
          <Skeleton width="40%" height="16px" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}
