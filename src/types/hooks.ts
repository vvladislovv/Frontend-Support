// Типы для хуков

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T, TArgs extends unknown[] = unknown[]> extends UseApiState<T> {
  execute: (...args: TArgs) => Promise<T>;
  reset: () => void;
}

export interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => string | null;
  throttleMs?: number;
}

export interface UseFormReturn<T> {
  values: T;
  setValues: (values: T) => void;
  loading: boolean;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setError: (error: string) => void;
}

export interface UseModalReturn<T> {
  open: boolean;
  openModal: (payload?: T) => void;
  closeModal: () => void;
  data: T | null;
  setData: (data: T | null) => void;
  error: string;
  setError: (error: string) => void;
}

export interface UseAuthReturn {
  isAuth: boolean;
  isAdmin: boolean;
  loading: boolean;
  tgLoading: boolean;
  handleLogout: () => void;
  handleAuth: (profile: Profile) => void;
  forceUpdate: number;
}

export interface UsePaginationOptions {
  initialPage?: number;
  pageSize?: number;
  totalItems?: number;
}

export interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  setTotalItems: (total: number) => void;
}

export interface UseSearchOptions {
  debounceMs?: number;
  minLength?: number;
  onSearch?: (query: string) => void;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  debouncedQuery: string;
  isSearching: boolean;
  clearSearch: () => void;
}

export interface UseSortOptions<T> {
  initialSortBy?: keyof T;
  initialSortOrder?: 'asc' | 'desc';
}

export interface UseSortReturn<T> {
  sortBy: keyof T | null;
  sortOrder: 'asc' | 'desc';
  sortedData: T[];
  handleSort: (key: keyof T) => void;
  resetSort: () => void;
}

export interface UseFilterOptions<T> {
  data: T[];
  filterFn?: (item: T, filters: Record<string, unknown>) => boolean;
}

export interface UseFilterReturn<T> {
  filteredData: T[];
  filters: Record<string, unknown>;
  setFilter: (key: string, value: unknown) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}

export interface UseDebounceReturn<T> {
  debouncedValue: T;
  isDebouncing: boolean;
}

export interface UseAsyncReturn<T, TArgs extends unknown[] = unknown[]> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: TArgs) => Promise<T | undefined>;
  reset: () => void;
}

// Определяем Profile локально, чтобы избежать циклической зависимости
type Profile = {
  id: string;
  email: string;
  name: string;
  role: string;
};