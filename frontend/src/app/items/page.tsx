'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/forms/SearchInput';
import { ItemCard } from '@/components/mobile/ItemCard';
import { useItems } from '@/lib/hooks/useItems';
import type { Item } from '@/types';

export default function ItemsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, loading, error, execute } = useItems(1, 100);

  useEffect(() => {
    execute();
  }, []);

  const items = data?.items || [];
  const totalItems = data?.total || 0;

  // Filter items based on search query
  const filteredItems = items.filter(item => {
    const matchesSearch = !searchQuery || 
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.itemName && item.itemName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error Loading Items</h1>
          <p className="text-red-600 dark:text-red-400">{error.message}</p>
          <Button onClick={execute} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">All Items</h1>
          <p className="text-muted-foreground">
            {totalItems} items in inventory
          </p>
        </div>
        <Link href="/items/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SearchInput 
            onSearch={setSearchQuery}
            placeholder="Search by serial number or item name..."
          />
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Items Grid */}
      {!loading && (
        <>
          {filteredItems.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredItems.length} of {totalItems} items
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-sm font-medium">{item.serialNumber}</span>
                        <div className="flex gap-1">
                          <Link href={`/items/${encodeURIComponent(item.serialNumber)}/price`}>
                            <Button size="sm" variant="ghost">
                              <TrendingUp className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/items/${encodeURIComponent(item.serialNumber)}/edit`}>
                            <Button size="sm" variant="ghost">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      {item.itemName && (
                        <h3 className="font-semibold mb-2">{item.itemName}</h3>
                      )}
                      
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          ${Number(item.currentPrice).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="mt-3 text-xs text-muted-foreground">
                        Updated: {new Date(item.updatedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-muted-foreground mb-4">
                  {searchQuery ? 
                    'No items found matching your search criteria' : 
                    'No items in inventory yet'
                  }
                </div>
                {!searchQuery && (
                  <Link href="/items/add">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Item
                    </Button>
                  </Link>
                )}
                {searchQuery && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}