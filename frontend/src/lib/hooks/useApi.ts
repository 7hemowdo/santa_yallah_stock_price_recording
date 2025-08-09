'use client'

import { useState, useCallback, useRef } from 'react'
import { api } from '../api'
import type { AxiosError } from 'axios'

interface ApiError {
  message: string
  code?: string
  details?: any
}

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: () => Promise<T | null>
  reset: () => void
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  immediate = false
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  // Memoize the API call function to prevent recreation
  const memoizedApiCall = useCallback(apiCall, [])
  const lastCallRef = useRef<number>(0)
  const cacheRef = useRef<{ data: T | null; timestamp: number } | null>(null)

  const execute = useCallback(async (): Promise<T | null> => {
    // Simple cache - return cached data if less than 2 seconds old
    const now = Date.now()
    if (cacheRef.current && (now - cacheRef.current.timestamp) < 2000) {
      return cacheRef.current.data
    }

    // Debounce rapid calls - wait 300ms between calls
    if (now - lastCallRef.current < 300) {
      return state.data
    }
    lastCallRef.current = now

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const data = await memoizedApiCall()

      setState({
        data,
        loading: false,
        error: null,
      })

      // Cache the result
      cacheRef.current = { data, timestamp: now }

      return data
    } catch (err) {
      const error = formatApiError(err as AxiosError)
      
      setState({
        data: null,
        loading: false,
        error,
      })

      return null
    }
  }, [memoizedApiCall, state.data])

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  })

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const data = await mutationFn(variables)

        setState({
          data,
          loading: false,
          error: null,
        })

        return data
      } catch (err) {
        const error = formatApiError(err as AxiosError)
        
        setState({
          data: null,
          loading: false,
          error,
        })

        return null
      }
    },
    [mutationFn]
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    mutate,
    reset,
  }
}

function formatApiError(error: AxiosError): ApiError {
  if (error.response?.data) {
    const errorData = error.response.data as any
    return {
      message: errorData.message || errorData.error || 'An error occurred',
      code: errorData.code,
      details: errorData.details,
    }
  }

  if (error.message) {
    return { message: error.message }
  }

  return { message: 'Network error occurred' }
}