'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useUpdatePrice } from '@/lib/hooks/useItems'
import { updatePriceSchema, type UpdatePriceInput } from '@/lib/validations/item'
import { formatPriceChange, cn } from '@/lib/utils'
import type { Item } from '@/types'

interface UpdatePriceFormProps {
  item: Item
  onSuccess?: (updatedItem: Item) => void
  onCancel?: () => void
  className?: string
}

export function UpdatePriceForm({ item, onSuccess, onCancel, className }: UpdatePriceFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { mutate: updatePrice, loading, error } = useUpdatePrice(item.serialNumber)

  const form = useForm<UpdatePriceInput>({
    resolver: zodResolver(updatePriceSchema),
    defaultValues: {
      newPrice: Number(item.currentPrice),
      notes: ''
    }
  })

  const watchedPrice = form.watch('newPrice')
  const currentPrice = Number(item.currentPrice)
  const priceChangeInfo = React.useMemo(() => {
    if (!watchedPrice || watchedPrice === currentPrice) {
      return null
    }
    return formatPriceChange(currentPrice, watchedPrice)
  }, [currentPrice, watchedPrice])

  const onSubmit = async (data: UpdatePriceInput) => {
    try {
      const result = await updatePrice(data)
      if (result) {
        toast({
          title: 'Price Updated',
          description: `Price for ${item.serialNumber} has been updated to $${data.newPrice.toFixed(2)}.`
        })
        onSuccess?.(result)
        router.back()
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update price. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleCancel = () => {
    onCancel?.()
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCancel}
            className="px-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Cancel
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-semibold">Update Price</h1>
            <p className="text-sm text-muted-foreground">
              {item.serialNumber}
            </p>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="px-4 py-6 lg:px-8">
        <Card className={cn('w-full max-w-2xl mx-auto', className)}>
          <CardHeader>
            <div className="hidden lg:flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCancel}
                className="px-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Update Price
                </CardTitle>
                <CardDescription>
                  Update the price for {item.serialNumber}
                  {item.itemName && ` - ${item.itemName}`}
                </CardDescription>
              </div>
            </div>
            <div className="lg:hidden">
              <CardTitle className="flex items-center gap-2">
                💰 Price Update
              </CardTitle>
              <CardDescription>
                Adjust the current price for this item
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Current Item Info */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-medium">{item.serialNumber}</span>
                {item.category && (
                  <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                    {item.category}
                  </span>
                )}
              </div>
              {item.itemName && (
                <p className="text-muted-foreground mb-2">{item.itemName}</p>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Current Price:</span>
                <span className="text-xl font-semibold text-green-600">
                  ${currentPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="newPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">New Price *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="999999.99"
                            placeholder="0.00"
                            className="pl-10 text-lg h-12 lg:h-10"
                            autoFocus
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price Change Indicator */}
                {priceChangeInfo && (
                  <div className={cn(
                    "flex items-center justify-center gap-2 p-4 rounded-lg font-medium",
                    priceChangeInfo.direction === 'up' 
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  )}>
                    {priceChangeInfo.direction === 'up' ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    <span>
                      {priceChangeInfo.formattedChange} ({priceChangeInfo.formattedPercent})
                    </span>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quick Note (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., supplier increase, market adjustment, promotion..."
                          rows={3}
                          {...field}
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error.message}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 h-12 lg:h-10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !watchedPrice || watchedPrice === currentPrice}
                    className="flex-1 h-12 lg:h-10 bg-green-600 hover:bg-green-700"
                  >
                    {loading ? 'Updating...' : 'Save Update'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}