import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

export function formatPriceChange(oldPrice: number, newPrice: number) {
  const change = newPrice - oldPrice
  const changePercent = ((change / oldPrice) * 100)
  
  return {
    change,
    changePercent,
    direction: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'neutral' as const,
    formattedChange: `${change > 0 ? '+' : ''}$${Math.abs(change).toFixed(2)}`,
    formattedPercent: `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(1)}%`
  }
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return date.toLocaleDateString()
}

export function validateSerialNumber(serialNumber: string): boolean {
  // Basic validation - can be enhanced based on business rules
  return serialNumber.length > 0 && serialNumber.length <= 50
}

export function validatePrice(price: number): boolean {
  return price > 0 && price <= 999999.99 && Number.isFinite(price)
}