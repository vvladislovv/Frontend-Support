import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "../components/MobileHeader";
import { isTelegramWebApp } from "../telegram";
import {
  LanguageIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  
  const [language, setLanguage] = useState(i18n.language);

  const handleLanguageChange = (newLanguage: string) => {
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const languageOptions = [
    { value: 'ru', label: 'Русский', flag: '🇷🇺' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
  ];

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader
          title={t("settings")}
          showBack={true}
          fullWidth={true}
        />

        <div className="px-4 py-6 pb-32">
          {/* Язык */}
          <div className="card-mobile mb-6">
            <h2 className="text-lg font-semibold tg-text mb-4 flex items-center">
              <LanguageIcon className="w-5 h-5 mr-2" />
              {t("languageSettings")}
            </h2>
            <div className="space-y-2">
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleLanguageChange(option.value)}
                  className={`w-full p-3 rounded-xl flex items-center justify-between transition-colors ${
                    language === option.value
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{option.flag}</span>
                    <span className="tg-text">{option.label}</span>
                  </div>
                  {language === option.value && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            {t("backToMenu")}
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          ⚙️ {t("settings")}
        </h1>

        {/* Language Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
            <LanguageIcon className="w-6 h-6 mr-2" />
            {t("languageSettings")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleLanguageChange(option.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  language === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-2">{option.flag}</div>
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;