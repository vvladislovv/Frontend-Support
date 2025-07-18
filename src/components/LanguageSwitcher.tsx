import { useTranslation } from 'react-i18next';
import { Menu } from '@headlessui/react';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-black hover:bg-gray-100 focus:outline-none">
        {t('language')}
      </Menu.Button>
      <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-50">
        <div className="p-1">
          <Menu.Item>
            {() => (
              <button className="group flex rounded-md items-center w-full px-2 py-2 text-sm text-black hover:text-blue-600 hover:bg-blue-50 transition" onClick={() => i18n.changeLanguage('ru')}>Русский</button>
            )}
          </Menu.Item>
          <Menu.Item>
            {() => (
              <button className="group flex rounded-md items-center w-full px-2 py-2 text-sm text-black hover:text-blue-600 hover:bg-blue-50 transition" onClick={() => i18n.changeLanguage('en')}>English</button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default LanguageSwitcher; 