'use client';

import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function DashboardCard({
  title,
  value,
  icon: Icon,
  iconColor = '#F37021',
  iconBgColor = '#FFF0E5',
  trend,
  description,
  action,
}: DashboardCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500">vs mois dernier</span>
            </div>
          )}
          
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
          
          {action && (
            <button
              onClick={action.onClick}
              className="mt-4 text-sm font-medium text-[#F37021] hover:text-[#D45A10] transition-colors"
            >
              {action.label} →
            </button>
          )}
        </div>
        
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon size={24} style={{ color: iconColor }} />
        </div>
      </div>
    </Card>
  );
}
