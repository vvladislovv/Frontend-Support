import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { getProfile, uploadProfilePhoto } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../components/common/Button";
import MobileHeader from "../components/MobileHeader";
import { isTelegramWebApp } from "../telegram";
import { forceCleanAll, debugStorageData } from "../utils/devUtils";
import { useAuth } from "../hooks/useAuth";
import {
  UserIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

interface Profile {
  id: string;
  email: string;
  name: string;
  role: string;
  photoUrl?: string;
}

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { handleLogout } = useAuth(); // Используем правильную функцию выхода
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  // Тестовые данные для профиля
  const [stats] = useState({
    totalBots: 3,
    activeTickets: 5,
    totalMessages: 1247,
    joinDate: "15 января 2024",
    lastLogin: "2 часа назад",
    subscription: "Профессиональный",
    subscriptionExpiry: "15 февраля 2025",
  });

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setError(t("errorLoadingData")))
      .finally(() => setLoading(false));
  }, [t]);



  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверка размера файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Файл слишком большой. Максимальный размер: 5MB");
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert("Пожалуйста, выберите изображение");
      return;
    }

    setUploadingPhoto(true);
    try {
      const result = await uploadProfilePhoto(file);
      setProfile(prev => prev ? { ...prev, photoUrl: result.photoUrl } : null);
      // Показать уведомление об успехе
      if (isMobile && window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(t("photoUploaded"));
      } else {
        alert(t("photoUploaded"));
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      if (isMobile && window.Telegram?.WebApp) {
        window.Telegram.WebApp.showAlert(t("photoUploadError"));
      } else {
        alert(t("photoUploadError"));
      }
    } finally {
      setUploadingPhoto(false);
    }
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen tg-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg tg-text">{t("loadingProfile")}</p>
      </div>
    );
  }

  if (error)
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!profile) return null;

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader
          title={t("profile")}
          showMenu={true}
          onLogout={handleLogout}
          isAuth={true}
          fullWidth={true}
        />

        <div className="px-4 py-6 pb-32">
          {/* Аватар и основная информация */}
          <div className="card-mobile mb-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                {profile.photoUrl ? (
                  <img 
                    src={profile.photoUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-10 h-10 text-white" />
                )}
              </div>
              <button
                onClick={triggerPhotoUpload}
                disabled={uploadingPhoto}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors disabled:opacity-50"
              >
                {uploadingPhoto ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CameraIcon className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <h1 className="text-xl font-bold tg-text mb-1">{profile.name}</h1>
            <p className="tg-hint text-sm mb-3">{profile.email}</p>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                profile.role === "admin"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {profile.role === "admin" ? (
                <>
                  <ShieldCheckIcon className="w-3 h-3 mr-1" />
                  {t("administrator")}
                </>
              ) : (
                <>
                  <UserIcon className="w-3 h-3 mr-1" />
                  {t("user")}
                </>
              )}
            </div>
          </div>

          {/* Статистика */}
          <div className="card-mobile mb-6">
            <h2 className="text-lg font-semibold tg-text mb-4 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              {t("statistics")}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white border border-blue-200 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalBots}
                </div>
                <div className="text-xs tg-hint">{t("bots")}</div>
              </div>
              <div className="text-center p-3 bg-white border border-green-200 rounded-xl">
                <div className="text-2xl font-bold text-green-600">
                  {stats.activeTickets}
                </div>
                <div className="text-xs tg-hint">{t("tickets")}</div>
              </div>
              <div className="text-center p-3 bg-white border border-purple-200 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalMessages}
                </div>
                <div className="text-xs tg-hint">{t("messages")}</div>
              </div>
              <div className="text-center p-3 bg-white border border-orange-200 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">98%</div>
                <div className="text-xs tg-hint">{t("uptime")}</div>
              </div>
            </div>
          </div>

          {/* Информация об аккаунте */}
          <div className="card-mobile mb-6">
            <h2 className="text-lg font-semibold tg-text mb-4">
              {t("accountInfo")}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 tg-hint mr-2" />
                  <span className="text-sm tg-text">
                    {t("registrationDate")}
                  </span>
                </div>
                <span className="text-sm tg-hint">{stats.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 tg-hint mr-2" />
                  <span className="text-sm tg-text">{t("lastLogin")}</span>
                </div>
                <span className="text-sm tg-hint">{stats.lastLogin}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CreditCardIcon className="w-4 h-4 tg-hint mr-2" />
                  <span className="text-sm tg-text">
                    {t("subscriptionPlan")}
                  </span>
                </div>
                <span className="text-sm font-medium text-green-600">
                  {stats.subscription}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="w-4 h-4 tg-hint mr-2" />
                  <span className="text-sm tg-text">{t("validUntil")}</span>
                </div>
                <span className="text-sm tg-hint">
                  {stats.subscriptionExpiry}
                </span>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/settings")}
              className="btn-secondary-mobile w-full flex items-center justify-center"
            >
              <CogIcon className="w-4 h-4 mr-2" />
              {t("settings")}
            </button>

            <button
              onClick={handleLogout}
              className="btn-primary-mobile w-full flex items-center justify-center bg-red-500 hover:bg-red-600 active:bg-red-700 focus:ring-red-500"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              {t("profileLogout")}
            </button>

            {/* Кнопки для разработки */}
            {(process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') && (
              <>
                <button
                  onClick={debugStorageData}
                  className="btn-secondary-mobile w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
                >
                  🔍 Debug Storage
                </button>
                <button
                  onClick={forceCleanAll}
                  className="btn-secondary-mobile w-full flex items-center justify-center bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white"
                >
                  🧹 Force Clean All
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Десктопная версия
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">{t('backToMenu')}</Button>
        </Link>
        <Link to="/analytics">
          <Button variant="primary">{t('analytics')}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Основная информация */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            👤 {t('profile')}
          </h2>

          {/* Фото профиля */}
          <div className="bg-white p-6 rounded-xl mb-6 text-center border border-gray-200">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center overflow-hidden mx-auto">
                {profile.photoUrl ? (
                  <img 
                    src={profile.photoUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-16 h-16 text-white" />
                )}
              </div>
              <button
                onClick={triggerPhotoUpload}
                disabled={uploadingPhoto}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors disabled:opacity-50"
              >
                {uploadingPhoto ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CameraIcon className="w-5 h-5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{profile.name}</h3>
            <p className="text-gray-600 mb-4">{profile.email}</p>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                profile.role === "admin"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {profile.role === "admin"
                ? `👑 ${t('administrator')}`
                : `👤 ${t('user')}`}
            </span>
          </div>

          <div className="bg-white p-6 rounded-xl mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-semibold text-gray-600">
                  {t('userId')}:
                </div>
                <div className="text-lg font-mono">{profile.id}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-600">{t('status')}:</div>
                <div className="text-lg text-green-600 font-semibold">{t('active')}</div>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="bg-white p-6 rounded-xl mb-6 border border-blue-200">
            <h3 className="text-xl font-bold mb-4 text-blue-800">
              📊 {t('statistics')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalBots}
                </div>
                <div className="text-sm text-gray-600">{t('botsCount')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.activeTickets}
                </div>
                <div className="text-sm text-gray-600">{t('activeTickets')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalMessages}
                </div>
                <div className="text-sm text-gray-600">{t('messages')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">98%</div>
                <div className="text-sm text-gray-600">{t('uptime')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Боковая панель */}
        <div>
          <div className="bg-white p-6 rounded-xl mb-6 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">
              ℹ️ {t('accountInfo')}
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">{t('registrationDate')}:</span>
                <div>{stats.joinDate}</div>
              </div>
              <div>
                <span className="font-semibold">{t('lastLogin')}:</span>
                <div>{stats.lastLogin}</div>
              </div>
              <div>
                <span className="font-semibold">{t('subscriptionPlan')}:</span>
                <div className="text-green-600 font-semibold">
                  {stats.subscription}
                </div>
              </div>
              <div>
                <span className="font-semibold">{t('validUntil')}:</span>
                <div>{stats.subscriptionExpiry}</div>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="space-y-3">
            <Button
              className="w-full"
              onClick={() => navigate("/settings")}
            >
              ⚙️ {t('settings')}
            </Button>
            <Button className="w-full" variant="danger" onClick={handleLogout}>
              🚪 {t('logout')}
            </Button>

            {/* Кнопки для разработки */}
            {(process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') && (
              <>
                <Button className="w-full" variant="secondary" onClick={debugStorageData}>
                  🔍 Debug Storage
                </Button>
                <Button className="w-full" variant="warning" onClick={forceCleanAll}>
                  🧹 Force Clean All
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
