'use client'

import * as React from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, Eye, Edit, MoreVertical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice, formatRelativeTime } from '@/lib/utils'
import type { Item, PriceChangeIndicator } from '@/types'

interface ItemCardProps {
  item: Item
  priceChange?: PriceChangeIndicator
  showActions?: boolean
  onEdit?: (item: Item) => void
  onView?: (item: Item) => void
  className?: string
}

export function ItemCard({ 
  item, 
  priceChange, 
  showActions = true, 
  onEdit, 
  onView,
  className 
}: ItemCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        {/* Mobile-first layout */}
        <div className="space-y-3">
          {/* Header with serial number and item name */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">
                {item.serialNumber}
              </h3>
              {item.itemName && (
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {item.itemName}
                </p>
              )}
            </div>
            {showActions && (
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onView?.(item)}
                  aria-label={`View ${item.serialNumber}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit?.(item)}
                  aria-label={`Edit ${item.serialNumber}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Category badge */}
          {item.category && (
            <div className="flex">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                {item.category}
              </span>
            </div>
          )}

          {/* Price information */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">
                {formatPrice(Number(item.currentPrice))}
              </span>
              {priceChange && (
                <div className={`flex items-center gap-1 text-sm ${
                  priceChange.direction === 'up' 
                    ? 'text-green-600' 
                    : priceChange.direction === 'down'
                    ? 'text-red-600'
                    : 'text-muted-foreground'
                }`}>
                  {priceChange.direction === 'up' && (
                    <TrendingUp className="h-3 w-3" />
                  )}
                  {priceChange.direction === 'down' && (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {priceChange.formattedChange} ({priceChange.formattedPercent})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Last updated timestamp */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Updated {formatRelativeTime(new Date(item.updatedAt))}</span>
            {item.description && (
              <span className="truncate ml-2 max-w-[120px]" title={item.description}>
                {item.description}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton loading state for ItemCard
export function ItemCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header skeleton */}
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </div>
            <div className="flex gap-1">
              <div className="h-8 w-8 bg-muted rounded"></div>
              <div className="h-8 w-8 bg-muted rounded"></div>
            </div>
          </div>

          {/* Category skeleton */}
          <div className="h-5 bg-muted rounded w-16"></div>

          {/* Price skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-6 bg-muted rounded w-20"></div>
            <div className="h-4 bg-muted rounded w-16"></div>
          </div>

          {/* Footer skeleton */}
          <div className="flex justify-between items-center">
            <div className="h-3 bg-muted rounded w-24"></div>
            <div className="h-3 bg-muted rounded w-20"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// List variant for desktop/tablet views
export function ItemCardListView({ 
  item, 
  priceChange, 
  showActions = true, 
  onEdit, 
  onView,
  className 
}: ItemCardProps) {
  return (
    <Card className={`hover:shadow-sm transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left section: Serial and name */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-semibold text-sm">
                  {item.serialNumber}
                </h3>
                {item.itemName && (
                  <p className="text-xs text-muted-foreground truncate">
                    {item.itemName}
                  </p>
                )}
              </div>
              {item.category && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                  {item.category}
                </span>
              )}
            </div>
          </div>

          {/* Center section: Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold">
              {formatPrice(Number(item.currentPrice))}
            </span>
            {priceChange && (
              <div className={`flex items-center gap-1 text-xs ${
                priceChange.direction === 'up' 
                  ? 'text-green-600' 
                  : priceChange.direction === 'down'
                  ? 'text-red-600'
                  : 'text-muted-foreground'
              }`}>
                {priceChange.direction === 'up' && (
                  <TrendingUp className="h-3 w-3" />
                )}
                {priceChange.direction === 'down' && (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>
                  {priceChange.formattedChange}
                </span>
              </div>
            )}
          </div>

          {/* Right section: Actions and timestamp */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatRelativeTime(new Date(item.updatedAt))}
            </span>
            {showActions && (
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView?.(item)}
                  className="h-7 px-2"
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(item)}
                  className="h-7 px-2"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}