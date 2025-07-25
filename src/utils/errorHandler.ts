import axios from 'axios';

export interface ErrorHandlerOptions {
  context?: string; // Контекст операции (например, 'login', 'register', 'create_ticket')
  showGenericMessage?: boolean; // Показывать ли общее сообщение об ошибке
}

export const handleApiError = (error: unknown, options: ErrorHandlerOptions = {}): string => {
  const { context = 'operation', showGenericMessage = true } = options;
  
  console.error(`${context} error:`, error);
  
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;
    
    // Специфические сообщения для разных статусов
    switch (status) {
      case 400:
        if (context === 'login') {
          return serverMessage || 'Неправильный email или пароль';
        } else if (context === 'register') {
          return serverMessage || 'Неправильные данные регистрации. Проверьте все поля.';
        } else if (context === 'create_ticket') {
          return serverMessage || 'Неправильные данные тикета. Проверьте заполнение всех полей.';
        }
        return serverMessage || 'Неправильные данные запроса';
        
      case 401:
        return 'Необходимо войти в систему';
        
      case 403:
        return 'Недостаточно прав для выполнения операции';
        
      case 404:
        if (context === 'login') {
          return 'Пользователь не найден';
        }
        return 'Запрашиваемый ресурс не найден';
        
      case 409:
        if (context === 'register') {
          return 'Пользователь с таким email уже существует';
        }
        return 'Конфликт данных';
        
      case 422:
        return serverMessage || 'Ошибка валидации данных';
        
      case 429:
        return 'Слишком много запросов. Попробуйте позже.';
        
      case 500:
        return 'Ошибка сервера. Попробуйте позже.';
        
      case 502:
      case 503:
      case 504:
        return 'Сервер временно недоступен. Попробуйте позже.';
        
      default:
        if (serverMessage) {
          return serverMessage;
        }
        return showGenericMessage ? `Ошибка ${status}: Не удалось выполнить операцию` : 'Произошла ошибка';
    }
  }
  
  // Обработка сетевых ошибок
  if (error instanceof Error) {
    if (error.message.includes('Network Error') || error.message.includes('ERR_NETWORK')) {
      return 'Ошибка сети. Проверьте подключение к интернету.';
    }
    if (error.message.includes('timeout')) {
      return 'Превышено время ожидания. Попробуйте еще раз.';
    }
    return error.message;
  }
  
  return showGenericMessage ? 'Произошла неизвестная ошибка' : 'Ошибка';
};

// Специализированные функции для разных контекстов
export const handleLoginError = (error: unknown): string => {
  return handleApiError(error, { context: 'login' });
};

export const handleRegisterError = (error: unknown): string => {
  return handleApiError(error, { context: 'register' });
};

export const handleTicketError = (error: unknown): string => {
  return handleApiError(error, { context: 'create_ticket' });
};

// Для обратной совместимости, если где-то еще используются старые функции
export const getErrorMessage = handleApiError;
export const logError = (context: string, error: unknown): void => {
  console.error(`[${context}] Error:`, error);
};