'use client';

import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  User, 
  Star,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  color: string;
  bgColor: string;
  description?: string;
}

const CLIENT_ACTIONS: QuickAction[] = [
  {
    id: 'new-mission',
    label: 'Nouvelle demande',
    icon: Plus,
    href: '/client/nouvelle-demande',
    color: '#F37021',
    bgColor: '#FFF0E5',
    description: 'Publier une nouvelle demande de service',
  },
  {
    id: 'search',
    label: 'Rechercher un prestataire',
    icon: Search,
    href: '/client/recherche',
    color: '#1B7A3D',
    bgColor: '#E8F5ED',
    description: 'Trouver le prestataire idéal',
  },
  {
    id: 'messages',
    label: 'Mes messages',
    icon: MessageSquare,
    href: '/messages',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    description: 'Voir mes conversations',
  },
  {
    id: 'favorites',
    label: 'Mes favoris',
    icon: Star,
    href: '/client/favoris',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    description: 'Prestataires favoris',
  },
];

const PROVIDER_ACTIONS: QuickAction[] = [
  {
    id: 'new-demands',
    label: 'Nouvelles demandes',
    icon: Clock,
    href: '/prestataire/demandes-recues',
    color: '#F37021',
    bgColor: '#FFF0E5',
    description: 'Voir les demandes disponibles',
  },
  {
    id: 'missions',
    label: 'Mes missions',
    icon: Search,
    href: '/prestataire/missions',
    color: '#1B7A3D',
    bgColor: '#E8F5ED',
    description: 'Gérer mes missions en cours',
  },
  {
    id: 'messages',
    label: 'Mes messages',
    icon: MessageSquare,
    href: '/messages',
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    description: 'Voir mes conversations',
  },
  {
    id: 'profile',
    label: 'Mon profil',
    icon: User,
    href: '/prestataire/modifier-profil',
    color: '#8B5CF6',
    bgColor: '#F3E8FF',
    description: 'Modifier mon profil pro',
  },
];

interface QuickActionsProps {
  userType: 'client' | 'prestataire';
}

export function QuickActions({ userType }: QuickActionsProps) {
  const router = useRouter();
  const actions = userType === 'client' ? CLIENT_ACTIONS : PROVIDER_ACTIONS;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Actions rapides</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <button
              key={action.id}
              onClick={() => router.push(action.href)}
              className="flex flex-col items-start p-4 rounded-xl border-2 border-gray-100 hover:border-[#F37021] hover:shadow-md transition-all group"
            >
              <div
                className="p-3 rounded-lg mb-3"
                style={{ backgroundColor: action.bgColor }}
              >
                <Icon size={24} style={{ color: action.color }} />
              </div>
              
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#F37021] transition-colors">
                {action.label}
              </h3>
              
              {action.description && (
                <p className="text-xs text-gray-500">{action.description}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
