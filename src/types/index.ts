// Общие типы для приложения

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  photoUrl?: string;
}

export interface Bot {
  id: string;
  name: string;
  token: string;
  username: string;
  link: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  message: string;
  botId: string;
  telegramId: string;
  status: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface SystemLoad {
  cpu: number;
  memory: number;
}

export interface Tariff {
  id: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
  features: string[];
  createdAt: string;
}

export type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
};