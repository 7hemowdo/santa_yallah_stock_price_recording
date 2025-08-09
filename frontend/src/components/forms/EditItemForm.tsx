'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useUpdateItem } from '@/lib/hooks/useItems'
import { updateItemSchema, type UpdateItemInput } from '@/lib/validations/item'
import { cn } from '@/lib/utils'
import type { Item } from '@/types'

interface EditItemFormProps {
  item: Item
  onSuccess?: (updatedItem: Item) => void
  onCancel?: () => void
  className?: string
}

export function EditItemForm({ item, onSuccess, onCancel, className }: EditItemFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { mutate: updateItem, loading, error } = useUpdateItem(item.serialNumber)

  const form = useForm<UpdateItemInput>({
    resolver: zodResolver(updateItemSchema),
    defaultValues: {
      itemName: item.itemName || '',
      category: item.category || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '' // Keep for backend compatibility
    }
  })

  const onSubmit = async (data: UpdateItemInput) => {
    try {
      const result = await updateItem(data)
      if (result) {
        toast({
          title: 'Item Updated',
          description: `Details for ${item.serialNumber} have been updated successfully.`
        })
        onSuccess?.(result)
        router.back()
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update item. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleCancel = () => {
    onCancel?.()
    router.back()
  }

  const hasChanges = React.useMemo(() => {
    const values = form.getValues()
    return (
      values.itemName !== (item.itemName || '') ||
      values.category !== (item.category || '') ||
      values.description !== (item.description || '')
    )
  }, [form.watch(), item])

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
            <h1 className="text-lg font-semibold">Edit Item</h1>
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
                  <Edit className="w-5 h-5" />
                  Edit Item Details
                </CardTitle>
                <CardDescription>
                  Update information for {item.serialNumber}
                </CardDescription>
              </div>
            </div>
            <div className="lg:hidden">
              <CardTitle className="flex items-center gap-2">
                ✏️ Edit Details
              </CardTitle>
              <CardDescription>
                Update item information and details
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Item Info Header */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-medium text-lg">{item.serialNumber}</span>
                <span className="text-lg font-semibold text-green-600">
                  ${Number(item.currentPrice).toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Serial number and price cannot be changed here
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="itemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Wireless Headphones"
                          {...field}
                          className="text-lg h-12 lg:h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Electronics, Tools, Parts"
                          {...field}
                          className="text-lg h-12 lg:h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional details about this item..."
                          rows={4}
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
                    disabled={loading || !hasChanges}
                    className="flex-1 h-12 lg:h-10"
                  >
                    {loading ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
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