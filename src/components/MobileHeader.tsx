import { ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
  onLogout?: () => void;
  isAuth?: boolean;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  title, 
  showBack = false, 
  showMenu = false,
  onLogout,
  isAuth = false
}) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="mobile-header">
      <div className="flex items-center">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg active:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-gray-900 ml-2">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        
        {showMenu && isAuth && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 rounded-lg active:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-mobile border border-gray-200 py-2 z-20 animate-scale-in">
                  <button
                    onClick={() => {
                      onLogout?.();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
                  >
                    Выйти
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;