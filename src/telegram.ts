// Определяет, открыт ли сайт в Telegram Mini App
export function isTelegramWebApp() {
  // @ts-expect-error: Telegram WebApp API is not typed
  return typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp
}

// Получает user info из Telegram WebApp
export function getTelegramUser() {
  if (isTelegramWebApp()) {
    // @ts-expect-error: Telegram WebApp API is not typed
    return window.Telegram.WebApp.initDataUnsafe?.user || null
  }
  return null
}

// Получает initData (для подписи)
export function getTelegramInitData() {
  if (isTelegramWebApp()) {
    // @ts-expect-error: Telegram WebApp API is not typed
    return window.Telegram.WebApp.initData || ''
  }
  return ''
}

// Пример функции для автоматического логина через Telegram
export async function telegramAutoLogin(apiLogin: (data: { telegramInitData: string }) => Promise<unknown>): Promise<unknown | null> {
  const user = getTelegramUser()
  const initData = getTelegramInitData()
  if (user && initData) {
    // Обычно backend принимает initData и возвращает JWT
    return apiLogin({ telegramInitData: initData })
  }
  return null
} 