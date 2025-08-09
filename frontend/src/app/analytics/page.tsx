'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Package, DollarSign, Activity, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApi } from '@/lib/hooks/useApi';
import { useRecentChanges } from '@/lib/hooks/useItems';
import { formatPriceChange } from '@/lib/utils';
import { analyticsApi } from '@/lib/api';

interface AnalyticsSummary {
  totalItems: number;
  priceUpdatesToday: number;
  averagePrice: string;
  itemsIncreasedToday: number;
  itemsDecreasedToday: number;
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('today');
  
  const { data: summaryData, loading: summaryLoading, error: summaryError, execute: fetchSummary } = useApi<AnalyticsSummary>(
    () => analyticsApi.getSummary(),
    false
  );

  const { data: recentChangesData, loading: changesLoading, execute: fetchRecentChanges } = useRecentChanges(20);

  useEffect(() => {
    fetchSummary();
    fetchRecentChanges();
  }, []);

  const recentChanges = Array.isArray(recentChangesData) ? recentChangesData : [];

  // Calculate trend statistics from recent changes
  const trendStats = recentChanges.reduce((acc, change) => {
    const oldPrice = Number(change.oldPrice);
    const newPrice = Number(change.newPrice);
    const priceDiff = newPrice - oldPrice;
    
    if (priceDiff > 0) {
      acc.increases++;
      acc.totalIncrease += priceDiff;
    } else if (priceDiff < 0) {
      acc.decreases++;
      acc.totalDecrease += Math.abs(priceDiff);
    }
    
    return acc;
  }, { increases: 0, decreases: 0, totalIncrease: 0, totalDecrease: 0 });

  const averageIncrease = trendStats.increases > 0 ? trendStats.totalIncrease / trendStats.increases : 0;
  const averageDecrease = trendStats.decreases > 0 ? trendStats.totalDecrease / trendStats.decreases : 0;

  if (summaryError) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error Loading Analytics</h1>
          <p className="text-red-600 dark:text-red-400">{summaryError.message}</p>
          <Button onClick={fetchSummary} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Price tracking insights and inventory statistics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryLoading ? (
                <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
              ) : (
                summaryData?.totalItems?.toLocaleString() || '0'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Items in inventory
            </p>
          </CardContent>
        </Card>

        {/* Price Updates Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Updates Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryLoading ? (
                <div className="h-8 bg-muted rounded w-12 animate-pulse"></div>
              ) : (
                summaryData?.priceUpdatesToday || '0'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Price changes today
            </p>
          </CardContent>
        </Card>

        {/* Average Price */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryLoading ? (
                <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
              ) : (
                `$${Number(summaryData?.averagePrice || 0).toFixed(2)}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all items
            </p>
          </CardContent>
        </Card>

        {/* Price Trends Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Trends</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  {summaryLoading ? '...' : summaryData?.itemsIncreasedToday || 0}
                </span>
              </div>
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  {summaryLoading ? '...' : summaryData?.itemsDecreasedToday || 0}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Items up/down today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      {!changesLoading && recentChanges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Trend Analysis</CardTitle>
            <CardDescription>
              Based on the last {recentChanges.length} price changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {trendStats.increases + trendStats.decreases}
                </div>
                <div className="text-sm text-muted-foreground">Total Changes</div>
              </div>
              
              <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${averageIncrease.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Increase ({trendStats.increases} items)
                </div>
              </div>
              
              <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  ${averageDecrease.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Decrease ({trendStats.decreases} items)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Price Changes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Price Changes</CardTitle>
              <CardDescription>
                Latest price updates across your inventory
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                fetchRecentChanges();
                fetchSummary();
              }}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {changesLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : recentChanges.length > 0 ? (
            <div className="space-y-4">
              {recentChanges.slice(0, 10).map((change) => {
                const priceChangeInfo = formatPriceChange(
                  Number(change.oldPrice), 
                  Number(change.newPrice)
                );
                
                return (
                  <div key={change.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium">
                        {change.serialNumber}
                        {change.itemName && ` - ${change.itemName}`}
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground">
                          ${Number(change.oldPrice).toFixed(2)} → ${Number(change.newPrice).toFixed(2)}
                        </span>
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
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(change.createdAt).toLocaleString()}
                        {change.notes && ` • ${change.notes}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Price Changes Yet</h3>
              <p className="text-muted-foreground">
                Start updating item prices to see analytics data here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}