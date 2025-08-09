'use client'

import { useCallback } from 'react'
import { itemsApi, searchApi } from '../api'
import { useApi, useMutation } from './useApi'
import type { 
  Item, 
  CreateItemRequest, 
  UpdateItemRequest, 
  UpdatePriceRequest,
  SearchResponse 
} from '../../types'

export function useItems(page = 1, limit = 50) {
  return useApi(
    () => itemsApi.getAll(page, limit),
    false
  )
}

export function useItem(serialNumber: string | null) {
  return useApi(
    () => itemsApi.getBySerial(serialNumber!),
    !!serialNumber
  )
}

export function useItemSearch(query: string | null) {
  return useApi<SearchResponse>(
    () => searchApi.searchBySerial(query!),
    false
  )
}

export function usePriceHistory(serialNumber: string | null) {
  return useApi(
    () => itemsApi.getPriceHistory(serialNumber!),
    !!serialNumber
  )
}

export function useCreateItem() {
  return useMutation<Item, CreateItemRequest>(
    (itemData) => itemsApi.create(itemData)
  )
}

export function useUpdateItem(serialNumber: string) {
  return useMutation<Item, UpdateItemRequest>(
    (updateData) => itemsApi.update(serialNumber, updateData)
  )
}

export function useUpdatePrice(serialNumber: string) {
  return useMutation<Item, UpdatePriceRequest>(
    (priceData) => itemsApi.updatePrice(serialNumber, priceData)
  )
}

export function useDeleteItem() {
  return useMutation<void, string>(
    (serialNumber) => itemsApi.delete(serialNumber)
  )
}

export function useRecentChanges(limit = 10) {
  const apiCall = useCallback(
    () => searchApi.getRecentChanges(limit),
    [limit]
  )
  
  return useApi<any[]>(apiCall, false)
}

// Composed hook for item management workflow
export function useItemManagement() {
  const createItem = useCreateItem()
  const updatePrice = useUpdatePrice('')
  const deleteItem = useDeleteItem()
  const recentChanges = useRecentChanges()

  const refreshRecentChanges = useCallback(async () => {
    await recentChanges.execute()
  }, [recentChanges.execute])

  const createItemWithRefresh = useCallback(
    async (itemData: CreateItemRequest) => {
      const result = await createItem.mutate(itemData)
      if (result) {
        await refreshRecentChanges()
      }
      return result
    },
    [createItem, refreshRecentChanges]
  )

  const updateItemPrice = useCallback(
    async (serialNumber: string, priceData: UpdatePriceRequest) => {
      // Create new mutation instance for this serial number
      const priceUpdate = useMutation<Item, UpdatePriceRequest>(
        (data) => itemsApi.updatePrice(serialNumber, data)
      )
      
      const result = await priceUpdate.mutate(priceData)
      if (result) {
        await refreshRecentChanges()
      }
      return result
    },
    [refreshRecentChanges]
  )

  return {
    createItem: {
      ...createItem,
      mutate: createItemWithRefresh,
    },
    updatePrice,
    deleteItem,
    recentChanges,
    refreshRecentChanges,
    updateItemPrice,
  }
}