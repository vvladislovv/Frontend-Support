// Локальные определения типов для Telegram
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    [key: string]: unknown;
  };
  ready(): void;
  expand(): void;
  enableClosingConfirmation(): void;
  colorScheme: 'light' | 'dark';
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  BackButton?: {
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// Определяет, открыт ли сайт в Telegram Mini App
export function isTelegramWebApp(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
}

// Получает user info из Telegram WebApp
export function getTelegramUser(): TelegramUser | null {
  if (isTelegramWebApp()) {
    return window.Telegram?.WebApp.initDataUnsafe?.user || null;
  }
  return null;
}

// Получает initData (для подписи)
export function getTelegramInitData(): string {
  if (isTelegramWebApp()) {
    return window.Telegram?.WebApp.initData || '';
  }
  return '';
}

// Пример функции для автоматического логина через Telegram
export async function telegramAutoLogin(apiLogin: (data: { telegramInitData: string }) => Promise<unknown>): Promise<unknown | null> {
  const user = getTelegramUser();
  const initData = getTelegramInitData();
  if (user && initData) {
    // Обычно backend принимает initData и возвращает JWT
    return apiLogin({ telegramInitData: initData });
  }
  return null;
} 