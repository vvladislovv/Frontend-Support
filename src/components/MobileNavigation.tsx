import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserIcon, 
  CogIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  UserIcon as UserIconSolid,
  CogIcon as CogIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  TicketIcon as TicketIconSolid
} from '@heroicons/react/24/solid';

interface MobileNavigationProps {
  isAuth: boolean;
  isAdmin: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ isAuth, isAdmin }) => {
  const location = useLocation();

  if (!isAuth) return null;

  const navItems = [
    {
      path: '/dashboard',
      label: 'Главная',
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      path: '/bots',
      label: 'Боты',
      icon: ChatBubbleLeftRightIcon,
      iconSolid: ChatBubbleLeftRightIconSolid,
    },
    {
      path: '/analytics',
      label: 'Аналитика',
      icon: ChartBarIcon,
      iconSolid: ChartBarIconSolid,
    },
    {
      path: '/tickets',
      label: 'Тикеты',
      icon: TicketIcon,
      iconSolid: TicketIconSolid,
    },
    {
      path: '/profile',
      label: 'Профиль',
      icon: UserIcon,
      iconSolid: UserIconSolid,
    },
  ];

  // Добавляем админ пункт если пользователь админ
  if (isAdmin) {
    navItems.splice(4, 0, {
      path: '/admin',
      label: 'Админ',
      icon: CogIcon,
      iconSolid: CogIconSolid,
    });
  }

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || 
          (item.path === '/dashboard' && location.pathname.startsWith('/dashboard'));
        const Icon = isActive ? item.iconSolid : item.icon;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${isActive ? 'active' : 'text-gray-500'}`}
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNavigation;