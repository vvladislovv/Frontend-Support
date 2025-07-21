// Глобальные типы для приложения

// Расширяем глобальный объект Window для Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

// Типы для Telegram WebApp API
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramWebApp {
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

// Типы для переменных окружения
export interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_TELEGRAM_BOT_TOKEN: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Типы для локализации
export type SupportedLanguage = 'en' | 'ru';

export interface TranslationFunction {
  (key: string, options?: Record<string, unknown>): string;
}

// Типы для роутинга
export type RouteParams = Record<string, string | undefined>;

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
  adminOnly?: boolean;
}

// Типы для состояния приложения
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  language: SupportedLanguage;
  theme: 'light' | 'dark';
}

// Типы для ошибок
export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

// Типы для уведомлений
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
}

// Типы для конфигурации
export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  supportedLanguages: SupportedLanguage[];
  defaultLanguage: SupportedLanguage;
  features: {
    telegramIntegration: boolean;
    darkMode: boolean;
    notifications: boolean;
  };
}

// Типы для метаданных
export interface PageMeta {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

// Типы для аналитики
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

// Типы для кэширования
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Типы для валидации
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Типы для форматирования
export interface FormatOptions {
  locale?: string;
  currency?: string;
  dateFormat?: string;
  timeFormat?: string;
}

// Определяем User локально, чтобы избежать циклической зависимости
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  photoUrl?: string;
}