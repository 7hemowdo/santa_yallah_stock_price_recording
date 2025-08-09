'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useItemSearch } from '@/lib/hooks/useItems'
import { cn } from '@/lib/utils'
import type { Item } from '@/types'

interface SearchInputProps {
  onSelectItem?: (item: Item) => void
  placeholder?: string
  className?: string
  showSuggestions?: boolean
  debounceMs?: number
}

export function SearchInput({ 
  onSelectItem,
  placeholder = "Search by serial number...",
  className,
  showSuggestions = true,
  debounceMs = 300
}: SearchInputProps) {
  const [query, setQuery] = React.useState('')
  const [debouncedQuery, setDebouncedQuery] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, debounceMs])

  // Search API hook
  const { data: searchResults, loading, execute } = useItemSearch(
    debouncedQuery.length > 0 ? debouncedQuery : null
  )

  // Execute search when debounced query changes
  React.useEffect(() => {
    if (debouncedQuery.length > 0) {
      execute()
      setIsOpen(true)
      setSelectedIndex(-1)
    } else {
      setIsOpen(false)
    }
  }, [debouncedQuery, execute])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.length === 0) {
      setIsOpen(false)
    }
  }

  // Handle item selection
  const handleSelectItem = (item: Item) => {
    setQuery(item.serialNumber)
    setIsOpen(false)
    onSelectItem?.(item)
  }

  // Clear search
  const handleClear = () => {
    setQuery('')
    setDebouncedQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || !searchResults?.items || !Array.isArray(searchResults.items)) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < searchResults.items.length - 1 ? prev + 1 : prev
        )
        break
        
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
        
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelectItem(searchResults.items[selectedIndex])
        }
        break
        
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const suggestions = (searchResults?.items && Array.isArray(searchResults.items)) ? searchResults.items : []
  const showClearButton = query.length > 0

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "pl-10 pr-10",
            loading && "animate-pulse"
          )}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />
        
        {showClearButton && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 px-3 hover:bg-transparent"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg">
          <CardContent className="p-0">
            <div 
              className="max-h-60 overflow-auto"
              role="listbox"
              aria-label="Search suggestions"
            >
              {suggestions.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                    "border-b border-border last:border-b-0",
                    selectedIndex === index && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleSelectItem(item)}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {item.serialNumber}
                      </span>
                      <span className="font-semibold text-sm">
                        ${Number(item.currentPrice).toFixed(2)}
                      </span>
                    </div>
                    {item.itemName && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.itemName}
                        {item.category && ` • ${item.category}`}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No results message */}
      {isOpen && showSuggestions && suggestions.length === 0 && debouncedQuery && !loading && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg">
          <CardContent className="p-4 text-center text-muted-foreground">
            <p className="text-sm">No items found matching "{debouncedQuery}"</p>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading && isOpen && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg">
          <CardContent className="p-4 text-center text-muted-foreground">
            <p className="text-sm">Searching...</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}