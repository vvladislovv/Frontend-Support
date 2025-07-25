import { Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { isTelegramWebApp } from "./telegram";
import { clearDevData, debugStorageData } from "./utils/devUtils";
// Initialize services
import "./services";
import Navbar from "./components/Navbar";
import MobileNavigation from "./components/MobileNavigation";

import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import BotsPage from "./pages/Bots/BotsPage";
import TicketsPage from "./pages/Tickets/TicketsPage";
import CRMPage from "./pages/CRM/CRMPage";
import AnalyticsPage from "./pages/Dashboard/AnalyticsPage";
import GreetingsPage from "./pages/Dashboard/GreetingsPage";
import BillingPage from "./pages/Billing/BillingPage";
import ReferralsPage from "./pages/Referrals/ReferralsPage";
import SettingsPage from "./pages/SettingsPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPage from "./pages/Admin/AdminPage";
import TariffsPage from "./pages/Admin/TariffsPage";
import PromoCodesPage from "./pages/Admin/PromoCodesPage";
import SystemLogsPage from "./pages/Admin/SystemLogsPage";
import SystemMonitorPage from "./pages/Admin/SystemMonitorPage";
import NotFound from "./pages/NotFound";

import BackendStatus from "./components/BackendStatus";

export default function App() {
  const { t } = useTranslation();
  const { isAuth, isAdmin, loading, tgLoading, handleLogout, handleAuth } =
    useAuth();
  const location = useLocation();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();
  const isWelcomePage = location.pathname === "/";

  // Дополнительная проверка для мобильной навигации
  const shouldShowMobileNav =
    isAuth && !sessionStorage.getItem("user_logged_out");

  // Очистка данных при перезапуске сервера разработки
  useEffect(() => {
    const wasCleared = clearDevData();
    if (wasCleared) {
      console.log("🔄 Dev data cleared, reloading page...");
      // Небольшая задержка перед перезагрузкой
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }

    // В режиме разработки показываем отладочную информацию
    if (process.env.NODE_ENV === "development") {
      debugStorageData();
    }
  }, []);

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (isTelegramWebApp()) {
      const tg = window.Telegram.WebApp;

      // Настройка внешнего вида
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();

      // Настройка цветовой схемы
      if (tg.colorScheme === "dark") {
        document.documentElement.classList.add("dark");
      }

      // Настройка viewport
      tg.setHeaderColor("#ffffff");
      tg.setBackgroundColor("#f8fafc");

      // Hide back button in main menu
      if (tg.BackButton) {
        tg.BackButton.hide();
      }
    }
  }, []);

  // Manage back button in Telegram
  useEffect(() => {
    if (isTelegramWebApp()) {
      const tg = window.Telegram.WebApp;

      if (tg.BackButton) {
        if (isWelcomePage || !isAuth) {
          tg.BackButton.hide();
        } else {
          tg.BackButton.show();
          tg.BackButton.onClick(() => {
            window.history.back();
          });
        }
      }
    }
  }, [location.pathname, isAuth, isWelcomePage]);

  if (loading || tgLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen tg-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg tg-text">
          {tgLoading ? t("connectingToTelegram") : t("loading")}
        </p>
      </div>
    );
  }

  return (
    <div className={`mobile-container ${isMobile ? "tg-bg" : "bg-white"}`}>
      {/* Десктопная навигация */}
      {!isMobile && (
        <Navbar
          isAuth={isAuth}
          isAdmin={isAdmin}
          onLogout={handleLogout}
          hideNavbar={isWelcomePage}
        />
      )}

      {/* Основной контент */}
      <main
        className={`${isMobile ? "content-with-nav" : "py-8 px-4"} ${
          !isWelcomePage && isMobile ? "px-4 py-4" : ""
        }`}
      >
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login onAuth={handleAuth} />} />
          <Route path="/register" element={<Register onAuth={handleAuth} />} />

          {/* Protected Routes - требуют авторизации */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuth={isAuth} loading={loading}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuth={isAuth} loading={loading}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bots"
            element={
              <ProtectedRoute isAuth={isAuth} loading={loading}>
                <BotsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <ProtectedRoute isAuth={isAuth} loading={loading}>
                <TicketsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/crm"
            element={
              <ProtectedRoute isAuth={isAuth} loading={loading}>
                <CRMPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute isAuth={isAuth} loading={loading}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/greetings"
            element={
              <ProtectedRoute isAuth={isAuth} loading={loading}>
                <GreetingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute isAuth={isAuth} loading={loading}>
                <BillingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/referrals"
            element={
              <ProtectedRoute isAuth={isAuth} loading={loading}>
                <ReferralsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute isAuth={isAuth} loading={loading}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - требуют авторизации и прав админа */}
          <Route
            path="/admin"
            element={
              <AdminRoute isAuth={isAuth} isAdmin={isAdmin} loading={loading}>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute isAuth={isAuth} isAdmin={isAdmin} loading={loading}>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tariffs"
            element={
              <AdminRoute isAuth={isAuth} isAdmin={isAdmin} loading={loading}>
                <TariffsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/promo-codes"
            element={
              <AdminRoute isAuth={isAuth} isAdmin={isAdmin} loading={loading}>
                <PromoCodesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/monitor"
            element={
              <AdminRoute isAuth={isAuth} isAdmin={isAdmin} loading={loading}>
                <SystemMonitorPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/logs"
            element={
              <AdminRoute isAuth={isAuth} isAdmin={isAdmin} loading={loading}>
                <SystemLogsPage />
              </AdminRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Мобильная навигация */}
      {isMobile && shouldShowMobileNav && (
        <MobileNavigation isAuth={isAuth} isAdmin={isAdmin} />
      )}

      {/* Development Tools */}
      {process.env.NODE_ENV === "development" && <>{/* <BackendStatus /> */}</>}
    </div>
  );
}
