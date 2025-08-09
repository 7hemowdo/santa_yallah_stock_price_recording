// Database models
export interface Item {
  id: string
  serialNumber: string
  itemName?: string
  category?: string
  description?: string
  currentPrice: number
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface PriceHistory {
  id: string
  itemId: string
  serialNumber: string
  oldPrice: number
  newPrice: number
  notes?: string
  createdAt: string
}

// API request/response types
export interface CreateItemRequest {
  serialNumber: string
  itemName?: string
  category?: string
  description?: string
  currentPrice: number
  imageUrl?: string
}

export interface UpdateItemRequest {
  itemName?: string
  category?: string
  description?: string
  imageUrl?: string
}

export interface UpdatePriceRequest {
  newPrice: number
  notes?: string
}

export interface SearchResponse {
  items: Item[]
  total: number
  page?: number
  limit?: number
}

export interface DashboardStats {
  totalItems: number
  priceUpdatesToday: number
  averagePrice: number
  itemsIncreased: number
  itemsDecreased: number
}

export interface PriceTrend {
  date: string
  price: number
  change?: number
  changePercent?: number
}

// UI component types
export interface PriceChangeIndicator {
  direction: 'up' | 'down' | 'neutral'
  change: number
  changePercent: number
  formattedChange: string
  formattedPercent: string
}

export interface RecentChange extends PriceHistory {
  itemName?: string
  timeAgo: string
  priceChange: PriceChangeIndicator
}

// Form types
export interface ItemFormData {
  serialNumber: string
  itemName?: string
  category?: string
  description?: string
  currentPrice: number
  imageUrl?: string
}

export interface PriceUpdateFormData {
  newPrice: number
  notes?: string
}

export interface SearchFormData {
  query: string
  category?: string
}

// Error types
export interface ApiError {
  message: string
  code?: string
  details?: any
}

export interface ValidationError {
  field: string
  message: string
}

// Pagination types
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Filter types
export interface ItemFilter {
  category?: string
  priceMin?: number
  priceMax?: number
  dateFrom?: string
  dateTo?: string
}

// Sort types
export type SortField = 'serialNumber' | 'itemName' | 'currentPrice' | 'updatedAt' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField
  direction: SortDirection
}

// App state types
export interface AppState {
  isLoading: boolean
  error?: string
  user?: User
}

export interface User {
  id: string
  email?: string
  name?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  currency: string
  dateFormat: string
  itemsPerPage: number
}