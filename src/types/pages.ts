// Типы для страниц и их хуков

export interface UseLoginReturn {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  error: string;
  handleSubmit: (e: React.FormEvent) => void;
}

export interface UseRegisterReturn {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  error: string;
  handleSubmit: (e: React.FormEvent) => void;
}

export interface UseBotsReturn {
  bots: Bot[];
  loading: boolean;
  error: string;
  showModal: boolean;
  openModal: (bot?: Bot) => void;
  closeModal: () => void;
  editBot: Bot | null;
  form: {
    name: string;
    token: string;
    username: string;
    link: string;
  };
  setForm: (form: any) => void;
  formLoading: boolean;
  formError: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleDelete: (id: string) => void;
}

export interface UseTicketsReturn {
  tickets: Ticket[];
  loading: boolean;
  error: string;
  showModal: boolean;
  openModal: (ticket?: Ticket) => void;
  closeModal: () => void;
  editTicket: Ticket | null;
  form: TicketFormData;
  setForm: (form: TicketFormData) => void;
  formLoading: boolean;
  formError: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleDelete: (id: string) => void;
}

export interface TicketFormData {
  subject: string;
  message: string;
  botId: string;
  telegramId: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
}

export interface UseAdminReturn {
  clients: AdminClient[];
  systemLoad: SystemLoad;
  loading: boolean;
  error: string;
  showModal: boolean;
  openModal: (client?: AdminClient) => void;
  closeModal: () => void;
  editClient: AdminClient | null;
  form: {
    name: string;
    email: string;
    active: boolean;
  };
  formLoading: boolean;
  formError: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string | boolean } }) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleDelete: (id: string) => void;
  refreshData: () => Promise<void>;
}

export interface AdminClient {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface UseTariffsReturn {
  tariffs: Tariff[];
  loading: boolean;
  error: string;
  showModal: boolean;
  openModal: (tariff?: Tariff) => void;
  closeModal: () => void;
  editTariff: Tariff | null;
  form: {
    name: string;
    price: number;
    description: string;
    active: boolean;
    features: string;
  };
  formLoading: boolean;
  formError: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string | number | boolean } }) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleDelete: (id: string) => void;
  refreshData: () => void;
}

export interface UseBillingReturn {
  plans: BillingPlan[];
  subscriptions: Subscription[];
  loading: boolean;
  error: string;
  throttledSubscribe: (planId: string) => void;
}

export interface UseReferralsReturn {
  referrals: ReferralLink[];
  loading: boolean;
  error: string;
  newLink: string | null;
  handleCreateLink: () => void;
}

export interface UseCRMReturn {
  users: CRMUser[];
  loading: boolean;
  connections: CRMConnection[];
  fetchConnections: () => Promise<void>;
}

export interface CRMUser {
  telegramId: string;
  name: string;
  email?: string;
}

export interface UseAnalyticsReturn {
  stats: AnalyticsStats | null;
  loading: boolean;
  error: string;
}

export interface AnalyticsStats {
  bots: number;
  tickets: number;
  users: number;
}

export interface UseGreetingsReturn {
  greetings: Greeting[];
  loading: boolean;
  error: string;
  form: { id?: string; text: string };
  setForm: (form: { id?: string; text: string }) => void;
  formLoading: boolean;
  formError: string;
  handleSubmit: (e: React.FormEvent) => void;
  handleEdit: (greeting: Greeting) => void;
  handleDelete: () => Promise<void>;
}

export interface Greeting {
  id: string;
  text: string;
}

export interface UseAdminPanelReturn {
  clients: Client[];
  systemLoad: SystemLoad;
  loading: boolean;
  refreshData: () => Promise<void>;
}

// Импортируем типы из основного файла, чтобы избежать дублирования
// Используем только те типы, которые нужны для страниц