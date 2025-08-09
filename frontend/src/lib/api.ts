import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available (for future use)
    // const token = localStorage.getItem('auth_token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access')
    }
    return Promise.reject(error)
  }
)

// Type definitions
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
}

// API functions
export const itemsApi = {
  // Get item by serial number
  getBySerial: async (serialNumber: string): Promise<Item> => {
    const response = await api.get(`/api/items/serial/${serialNumber}`)
    return response.data
  },

  // Get all items (with pagination)
  getAll: async (page = 1, limit = 50): Promise<SearchResponse> => {
    const response = await api.get(`/api/items?page=${page}&limit=${limit}`)
    return response.data
  },

  // Create new item
  create: async (item: CreateItemRequest): Promise<Item> => {
    const response = await api.post('/api/items', item)
    return response.data
  },

  // Update item details
  update: async (serialNumber: string, updates: UpdateItemRequest): Promise<Item> => {
    const response = await api.put(`/api/items/serial/${serialNumber}`, updates)
    return response.data
  },

  // Delete item
  delete: async (serialNumber: string): Promise<void> => {
    await api.delete(`/api/items/serial/${serialNumber}`)
  },

  // Update price
  updatePrice: async (serialNumber: string, priceUpdate: UpdatePriceRequest): Promise<Item> => {
    const response = await api.post(`/api/items/serial/${serialNumber}/price`, priceUpdate)
    return response.data
  },

  // Get price history
  getPriceHistory: async (serialNumber: string): Promise<PriceHistory[]> => {
    const response = await api.get(`/api/items/serial/${serialNumber}/history`)
    return response.data
  },
}

export const searchApi = {
  // Search items by serial number (partial match)
  searchBySerial: async (query: string): Promise<SearchResponse> => {
    const response = await api.get(`/api/search?q=${encodeURIComponent(query)}`)
    return response.data
  },

  // Get recent price changes
  getRecentChanges: async (limit = 10): Promise<PriceHistory[]> => {
    const response = await api.get(`/api/search/recent-changes?limit=${limit}`)
    return response.data
  },

  // Filter by category
  getByCategory: async (category: string): Promise<SearchResponse> => {
    const response = await api.get(`/api/items/category/${encodeURIComponent(category)}`)
    return response.data
  },
}

export const analyticsApi = {
  // Get dashboard summary stats
  getSummary: async () => {
    const response = await api.get('/api/analytics/summary')
    return response.data
  },

  // Get price trends
  getPriceTrends: async (serialNumber?: string) => {
    const url = serialNumber 
      ? `/api/analytics/price-trends?serial=${serialNumber}`
      : '/api/analytics/price-trends'
    const response = await api.get(url)
    return response.data
  },
}

export const dataApi = {
  // Export items to CSV
  exportItems: async (): Promise<Blob> => {
    const response = await api.get('/api/export/items', {
      responseType: 'blob',
    })
    return response.data
  },

  // Import items from CSV
  importItems: async (file: File): Promise<{ imported: number, errors: any[] }> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/import/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}