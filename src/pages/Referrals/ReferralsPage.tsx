import React, { useEffect, useState } from 'react';
import { referralService } from '../../services';
import type { ReferralLink, ReferralStats } from '../../types';

const ReferralsPage: React.FC = () => {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [links, setLinks] = useState<ReferralLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Получаем реальные данные с backend
      const statsData = await referralService.getReferralStats();
      setStats(statsData);
      const referralsData = await referralService.getReferrals();
      setLinks(referralsData);
      setLoadError(false);
    } catch (error) {
      setLoadError(true);
      setStats(null);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async () => {
    try {
      setLoading(true);
      const newLink = await referralService.getNewReferralLink();
      setLinks(prev => [...prev, newLink]);
    } catch (error) {
      console.error('Error creating referral link:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Можно добавить уведомление о копировании
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Реферальная программа</h1>
        <p className="text-gray-600">Приглашайте друзей и получайте бонусы</p>
      </div>

      {/* Статистика */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Всего рефералов</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Общий бонус</h3>
            <p className="text-2xl font-bold text-green-600">{stats.totalBonus} ₽</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">К выплате</h3>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingBonus} ₽</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Выплачено</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.paidBonus} ₽</p>
          </div>
        </div>
      )}

      {/* Реферальные ссылки */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Реферальные ссылки</h2>
          <button
            onClick={handleCreateLink}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать ссылку'}
          </button>
        </div>

        <div className="p-6">
          {loadError ? (
            <div className="text-gray-400 text-center py-8">Нет данных (backend недоступен)</div>
          ) : (
            links.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                У вас пока нет реферальных ссылок. Создайте первую!
              </p>
            ) : (
              <div className="space-y-4">
                {links.map((link) => (
                  <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Код: {link.code}</span>
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>Переходы: {link.clicks}</span>
                        <span>Регистрации: {link.registrations}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={`${window.location.origin}/auth/register?ref=${link.code}`}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/auth/register?ref=${link.code}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Копировать
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;