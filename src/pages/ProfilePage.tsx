import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/common/Button';
import { isTelegramWebApp } from '../telegram';
import MobileHeader from '../components/MobileHeader';
import type { User } from '../types';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { auth } = useAppApi();
  const { handleLogout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await auth.getProfile.execute();
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    
    setUploadingPhoto(true);
    try {
      const result = await auth.uploadProfilePhoto.execute(photoFile);
      if (profile) {
        setProfile({ ...profile, photoUrl: result.photoUrl });
      }
      setPhotoFile(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploadingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">{t('loadingProfile')}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Error loading profile</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t('profile')} />
        
        <div className="px-4 py-6 pb-32">
          {/* Профиль пользователя */}
          <div className="card-mobile text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
            
            <h1 className="text-xl font-bold tg-text mb-1">{profile.name}</h1>
            <p className="text-sm tg-hint mb-4">{profile.email}</p>
            
            {profile.role === 'admin' && (
              <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                👑 {t('administrator')}
              </div>
            )}

            {photoFile && (
              <div className="mt-4">
                <Button
                  onClick={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="w-full btn-primary-mobile"
                >
                  {uploadingPhoto ? t('uploading') : t('uploadPhoto')}
                </Button>
              </div>
            )}
          </div>

          {/* Информация об аккаунте */}
          <div className="card-mobile mb-6">
            <h2 className="text-lg font-semibold tg-text mb-4">{t('accountInfo')}</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="tg-hint">{t('email')}</span>
                <span className="tg-text font-medium">{profile.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="tg-hint">{t('name')}</span>
                <span className="tg-text font-medium">{profile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="tg-hint">{t('user')}</span>
                <span className="tg-text font-medium">
                  {profile.role === 'admin' ? t('administrator') : t('user')}
                </span>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="space-y-3">
            <Link
              to="/settings"
              className="card-mobile flex items-center justify-between active:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-medium tg-text">{t('profileSettings')}</span>
              </div>
              <svg className="w-5 h-5 tg-hint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <button
              onClick={handleLogout}
              className="card-mobile flex items-center justify-between w-full text-left active:bg-red-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="font-medium text-red-600">{t('profileLogout')}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">{t('backToMenu')}</Button>
        </Link>
      </div>

      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            {profile.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl text-white">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>
        
        <h1 className="text-2xl font-bold text-black mb-2">{profile.name}</h1>
        <p className="text-gray-600 mb-4">{profile.email}</p>
        
        {profile.role === 'admin' && (
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full font-medium">
            👑 {t('administrator')}
          </div>
        )}

        {photoFile && (
          <div className="mt-4">
            <Button
              onClick={handlePhotoUpload}
              disabled={uploadingPhoto}
            >
              {uploadingPhoto ? 'Uploading...' : t('uploadPhoto')}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-black mb-4">{t('accountInfo')}</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">{t('email')}:</span>
            <span className="text-black font-medium">{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('name')}:</span>
            <span className="text-black font-medium">{profile.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('user')}:</span>
            <span className="text-black font-medium">
              {profile.role === 'admin' ? t('administrator') : t('user')}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/settings" className="flex-1">
          <Button variant="secondary" className="w-full">
            {t('settings')}
          </Button>
        </Link>
        <Button
          variant="danger"
          onClick={handleLogout}
          className="flex-1"
        >
          {t('logout')}
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;