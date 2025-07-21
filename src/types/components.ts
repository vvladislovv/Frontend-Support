// Типы для компонентов

import { ReactNode } from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
  loading?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  actions?: ReactNode;
}

export interface FormFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string | number | boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  label?: string;
  error?: string;
  placeholder?: string;
  onChange?: (value: string | number) => void;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

export interface SearchInputProps extends Omit<InputProps, 'onChange'> {
  onSearch: (query: string) => void;
  debounceMs?: number;
  showClearButton?: boolean;
}

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  loading?: boolean;
}