// Export all services
export { authService } from './authService';
export { botService } from './botService';
export { ticketService } from './ticketService';
export { referralService } from './referralService';
export { billingService } from './billingService';
export { telegaPayService } from './telegaPayService';
export { adminService } from './adminService';
export { crmService } from './crmService';

// Initialize auth on app start
import { authService } from './authService';
authService.initializeAuth();