import React, { useEffect, useState } from "react";
import { useAppApi } from "../../hooks/useApi";
import type { BillingPlan, Subscription, BillingStatus } from "../../types";

const BillingPage: React.FC = () => {
  const { billing } = useAppApi();
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [billingStatus, setBillingStatus] = useState<BillingStatus | null>(
    null
  );
  const [promoCode, setPromoCode] = useState<string>("");
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansData, subscriptionsData, statusData] = await Promise.all([
        billing.getBillingPlans.execute(),
        billing.getSubscriptions.execute(),
        billing.getBillingStatus.execute(),
      ]);
      setPlans(plansData);
      setSubscriptions(subscriptionsData);
      setBillingStatus(statusData);
      setLoadError(false);
    } catch (error) {
      setLoadError(true);
      setPlans([]);
      setSubscriptions([]);
      setBillingStatus(null);
    }
  };

  const handleSubscribe = async (planId: string) => {
    try {
      const result = await billing.subscribeToPlan.execute(
        planId,
        undefined,
        promoCode || undefined
      );
      if (result?.paymentUrl) {
        window.open(result.paymentUrl, "_blank");
      }
      // Обновляем данные после подписки
      loadData();
    } catch (error) {
      console.error("Error subscribing to plan:", error);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-100";
      case "EXPIRED":
        return "text-red-600 bg-red-100";
      case "CANCELLED":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Биллинг и подписки
        </h1>
        <p className="text-gray-600">
          Управляйте своими подписками и тарифными планами
        </p>
      </div>

      {/* Текущий статус */}
      {billingStatus && (
        <div className="bg-white rounded-lg shadow mb-8 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Текущий статус
          </h2>
          {billingStatus.hasActiveSubscription ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Активный план</p>
                <p className="text-lg font-medium text-gray-900">
                  {billingStatus.currentPlan?.name}
                </p>
                <p className="text-sm text-gray-500">
                  До{" "}
                  {new Date(
                    billingStatus.subscription?.endDate
                  ).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  billingStatus.subscription?.status
                )}`}
              >
                {billingStatus.subscription?.status}
              </span>
            </div>
          ) : (
            <p className="text-gray-500">У вас нет активных подписок</p>
          )}
        </div>
      )}

      {/* Тарифные планы */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Доступные планы</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-200 rounded-lg p-6"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  {formatPrice(plan.price, plan.currency)}
                  <span className="text-sm font-normal text-gray-500">
                    /месяц
                  </span>
                </p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <svg
                        className="w-4 h-4 text-green-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={billing.subscribeToPlan.loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {billing.subscribeToPlan.loading
                    ? "Обработка..."
                    : "Выбрать план"}
                </button>
              </div>
            ))}
          </div>

          {/* Промокод */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Промокод (необязательно)
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Введите промокод"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* История подписок */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            История подписок
          </h2>
        </div>
        <div className="p-6">
          {loadError ? (
            <div className="text-gray-400 text-center py-8">
              Нет данных (backend недоступен)
            </div>
          ) : subscriptions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              У вас пока нет подписок
            </p>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => {
                const plan = plans.find((p) => p.id === subscription.planId);
                return (
                  <div
                    key={subscription.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {plan?.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            subscription.startDate
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(subscription.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          subscription.status
                        )}`}
                      >
                        {subscription.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
