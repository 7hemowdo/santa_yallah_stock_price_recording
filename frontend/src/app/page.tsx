'use client'

import * as React from 'react'
import { Search, Plus, List, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchInput } from '@/components/forms/SearchInput'
import { ItemCard } from '@/components/mobile/ItemCard'
import { useRecentChanges } from '@/lib/hooks/useItems'
import { formatPriceChange } from '@/lib/utils'
import type { Item } from '@/types'

export default function HomePage() {
  const [selectedItem, setSelectedItem] = React.useState<Item | null>(null)
  const { data: recentChangesData, loading, execute: fetchRecentChanges } = useRecentChanges(5)

  // Fetch recent changes on component mount - only once
  React.useEffect(() => {
    fetchRecentChanges()
  }, []) // Empty dependency array - only run once on mount

  const handleSearchSelect = (item: Item) => {
    setSelectedItem(item)
  }

  const mockStats = {
    totalItems: 1247,
    priceUpdatesToday: 8,
    averagePrice: 28.50,
    itemsIncreased: 5,
    itemsDecreased: 3
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header - only show on mobile */}
      <header className="bg-card shadow-sm border-b lg:hidden">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-card-foreground flex items-center gap-2">
            📱 Price Tracker
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 lg:px-8">
        {/* Desktop Page Header */}
        <div className="hidden lg:block mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's an overview of your inventory price tracking.
          </p>
        </div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Search className="w-5 h-5" />
                Search Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SearchInput
                onSelectItem={handleSearchSelect}
                placeholder="Enter serial number..."
              />
              {selectedItem && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-medium">{selectedItem.serialNumber}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ${Number(selectedItem.currentPrice).toFixed(2)}
                    </span>
                  </div>
                  {selectedItem.itemName && (
                    <p className="text-sm text-muted-foreground mb-2">{selectedItem.itemName}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <Link href={`/items/${encodeURIComponent(selectedItem.serialNumber)}/price`} className="flex-1">
                      <Button size="sm" className="w-full">Update Price</Button>
                    </Link>
                    <Link href={`/items/${encodeURIComponent(selectedItem.serialNumber)}/edit`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">Edit Details</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link href="/items/add" className="block">
              <Button 
                size="touch-target" 
                className="w-full"
                icon={<Plus className="w-6 h-6" />}
              >
                Add New Item
              </Button>
            </Link>
            
            <Link href="/items" className="block">
              <Button 
                variant="secondary"
                size="touch-target" 
                className="w-full"
                icon={<List className="w-6 h-6" />}
              >
                View All Items
              </Button>
            </Link>
          </div>

          {/* Recent Changes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Recent Changes
              </CardTitle>
              <CardDescription>
                Latest price updates across your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : recentChangesData && Array.isArray(recentChangesData) && recentChangesData.length > 0 ? (
                <div className="space-y-3">
                  {recentChangesData.slice(0, 5).map((change) => {
                    const priceChangeInfo = formatPriceChange(
                      Number(change.oldPrice), 
                      Number(change.newPrice)
                    )
                    return (
                      <div key={change.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{change.serialNumber}</span>
                              {change.itemName && (
                                <span className="text-muted-foreground text-sm">- {change.itemName}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-semibold">${Number(change.newPrice).toFixed(2)}</span>
                              <div className={`flex items-center gap-1 text-sm ${
                                priceChangeInfo.direction === 'up' 
                                  ? 'text-emerald-600 dark:text-emerald-400' 
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {priceChangeInfo.direction === 'up' ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                <span>
                                  {priceChangeInfo.formattedChange} ({priceChangeInfo.formattedPercent})
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No recent price changes</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/search" className="block">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      icon={<Search className="w-5 h-5" />}
                    >
                      Search by Serial
                    </Button>
                  </Link>
                  <Link href="/items/add" className="block">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-primary hover:bg-primary/10"
                      icon={<Plus className="w-5 h-5" />}
                    >
                      Add New Item
                    </Button>
                  </Link>
                  <Link href="/items" className="block">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      icon={<List className="w-5 h-5" />}
                    >
                      View All Items
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Desktop Search */}
              <Card>
                <CardHeader>
                  <CardTitle>Search Items</CardTitle>
                  <CardDescription>Find items by serial number</CardDescription>
                </CardHeader>
                <CardContent>
                  <SearchInput 
                    onSelectItem={handleSearchSelect}
                    placeholder="Enter serial number..."
                  />
                  {selectedItem && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono font-medium">{selectedItem.serialNumber}</span>
                        <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                          ${Number(selectedItem.currentPrice).toFixed(2)}
                        </span>
                      </div>
                      {selectedItem.itemName && (
                        <p className="text-sm text-muted-foreground mb-2">{selectedItem.itemName}</p>
                      )}
                      <div className="flex gap-2">
                        <Link href={`/items/${encodeURIComponent(selectedItem.serialNumber)}/price`}>
                          <Button size="sm">Update Price</Button>
                        </Link>
                        <Link href={`/items/${encodeURIComponent(selectedItem.serialNumber)}/edit`}>
                          <Button size="sm" variant="outline">Edit Details</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Recent Changes & Stats */}
            <div className="col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Price Changes</CardTitle>
                  <CardDescription>Latest updates across your inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse p-4 border rounded-lg">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/2 mb-1"></div>
                          <div className="h-3 bg-muted rounded w-1/4"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentChangesData && Array.isArray(recentChangesData) && recentChangesData.length > 0 ? (
                    <>
                      <div className="space-y-4">
                        {recentChangesData.slice(0, 5).map((change) => {
                          const priceChangeInfo = formatPriceChange(
                            Number(change.oldPrice), 
                            Number(change.newPrice)
                          )
                          return (
                            <div key={change.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <div className="font-medium">
                                  {change.serialNumber}
                                  {change.itemName && ` - ${change.itemName}`}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-lg font-semibold">
                                    ${Number(change.newPrice).toFixed(2)}
                                  </span>
                                  <div className={`flex items-center gap-1 ${
                                    priceChangeInfo.direction === 'up' 
                                      ? 'text-emerald-600 dark:text-emerald-400' 
                                      : 'text-red-600 dark:text-red-400'
                                  }`}>
                                    {priceChangeInfo.direction === 'up' ? (
                                      <TrendingUp className="w-4 h-4" />
                                    ) : (
                                      <TrendingDown className="w-4 h-4" />
                                    )}
                                    <span className="text-sm">
                                      {priceChangeInfo.formattedChange} ({priceChangeInfo.formattedPercent})
                                    </span>
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  Updated: {new Date(change.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-4">
                        <Link href="/analytics">
                          <Button variant="ghost" size="sm">
                            View All Recent Changes →
                          </Button>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No recent price changes</p>
                  )}
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Summary Statistics</CardTitle>
                  <CardDescription>Overview of your inventory metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{mockStats.totalItems.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Items</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{mockStats.priceUpdatesToday}</div>
                      <div className="text-sm text-muted-foreground">Updates Today</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">${mockStats.averagePrice.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Avg Price</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <TrendingUp className="h-4 w-4" />
                          <span className="font-semibold">{mockStats.itemsIncreased}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400">
                          <TrendingDown className="h-4 w-4" />
                          <span className="font-semibold">{mockStats.itemsDecreased}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Price Changes</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}