import { useTranslation } from 'react-i18next';
import { Menu } from '@headlessui/react';
import { isTelegramWebApp } from '../telegram';
import { ChevronDownIcon, LanguageIcon } from '@heroicons/react/24/outline';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  
  const getCurrentLanguageLabel = () => {
    return i18n.language === 'ru' ? 'RU' : 'EN';
  };

  if (isMobile) {
    return (
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex items-center justify-center px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
          <LanguageIcon className="w-4 h-4 mr-1" />
          <span className="text-xs">{getCurrentLanguageLabel()}</span>
          <ChevronDownIcon className="w-3 h-3 ml-1" />
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none z-50">
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <button 
                  className={`group flex rounded-md items-center w-full px-3 py-2 text-sm transition-colors ${
                    active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  } ${i18n.language === 'ru' ? 'bg-blue-100 text-blue-700 font-medium' : ''}`}
                  onClick={() => i18n.changeLanguage('ru')}
                >
                  🇷🇺 Русский
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button 
                  className={`group flex rounded-md items-center w-full px-3 py-2 text-sm transition-colors ${
                    active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  } ${i18n.language === 'en' ? 'bg-blue-100 text-blue-700 font-medium' : ''}`}
                  onClick={() => i18n.changeLanguage('en')}
                >
                  🇺🇸 English
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    );
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-black hover:bg-gray-100 focus:outline-none">
        <LanguageIcon className="w-4 h-4 mr-2" />
        {t('language')}
        <ChevronDownIcon className="w-4 h-4 ml-2" />
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
        <div className="p-1">
          <Menu.Item>
            {({ active }) => (
              <button 
                className={`group flex rounded-md items-center w-full px-3 py-2 text-sm transition-colors ${
                  active ? 'bg-blue-50 text-blue-600' : 'text-black'
                } ${i18n.language === 'ru' ? 'bg-blue-100 text-blue-700 font-medium' : ''}`}
                onClick={() => i18n.changeLanguage('ru')}
              >
                🇷🇺 Русский
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button 
                className={`group flex rounded-md items-center w-full px-3 py-2 text-sm transition-colors ${
                  active ? 'bg-blue-50 text-blue-600' : 'text-black'
                } ${i18n.language === 'en' ? 'bg-blue-100 text-blue-700 font-medium' : ''}`}
                onClick={() => i18n.changeLanguage('en')}
              >
                🇺🇸 English
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default LanguageSwitcher; 