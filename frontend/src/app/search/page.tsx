'use client';

import { useState } from 'react';
import { SearchInput } from '@/components/forms/SearchInput';
import { ItemCard } from '@/components/mobile/ItemCard';
import { useItems } from '@/lib/hooks/useItems';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, loading, error } = useItems();

  const items = data?.items || [];
  const filteredItems = items.filter(item =>
    item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.itemName && item.itemName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Search Items</h1>
      
      <div className="mb-6">
        <SearchInput onSearch={setSearchQuery} />
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error.message}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
      
      {searchQuery && filteredItems.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          No items found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}