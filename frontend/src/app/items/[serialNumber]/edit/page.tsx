'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useItem } from '@/lib/hooks/useItems'
import { EditItemForm } from '@/components/forms/EditItemForm'

export default function EditItemPage() {
  const params = useParams()
  const serialNumber = params.serialNumber as string
  
  const { data: item, loading, error, execute } = useItem(decodeURIComponent(serialNumber))

  React.useEffect(() => {
    if (serialNumber) {
      execute()
    }
  }, [serialNumber, execute])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
            <p className="text-muted-foreground mt-4">Loading item details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">
              {error?.message || 'Item not found'}
            </p>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <EditItemForm item={item} />
}