import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const location = useLocation();

  // Дополнительная проверка - не показываем навигацию если пользователь вышел
  const wasLoggedOut = sessionStorage.getItem('user_logged_out') === 'true';
  
  if (!isAuth || wasLoggedOut) return null;

  const navItems = [
    {
      path: '/dashboard',
      label: t('dashboard'),
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      path: '/bots',
      label: t('bots'),
      icon: ChatBubbleLeftRightIcon,
      iconSolid: ChatBubbleLeftRightIconSolid,
    },
    {
      path: '/analytics',
      label: t('analytics'),
      icon: ChartBarIcon,
      iconSolid: ChartBarIconSolid,
    },
    {
      path: '/tickets',
      label: t('tickets'),
      icon: TicketIcon,
      iconSolid: TicketIconSolid,
    },
    {
      path: '/profile',
      label: t('profile'),
      icon: UserIcon,
      iconSolid: UserIconSolid,
    },
  ];

  // Админ пункт убран из мобильной навигации

  return (
    <nav className={`mobile-nav ${wasLoggedOut ? 'hidden' : ''}`}>
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