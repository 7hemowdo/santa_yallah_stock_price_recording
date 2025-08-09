'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, ChevronRight, Check, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useCreateItem } from '@/lib/hooks/useItems'
import { createItemSchema, type CreateItemInput } from '@/lib/validations/item'
import { cn } from '@/lib/utils'

const MOBILE_STEPS = [
  { id: 1, title: 'Basic Info', description: 'Serial number and category' },
  { id: 2, title: 'Pricing', description: 'Current price and item name' },
  { id: 3, title: 'Review', description: 'Confirm all details' }
] as const

interface AddItemFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  className?: string
}

export function AddItemForm({ onSuccess, onCancel, className }: AddItemFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = React.useState(1)
  const [isMobile, setIsMobile] = React.useState(false)

  const { mutate: createItem, loading, error } = useCreateItem()

  const form = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      serialNumber: '',
      currentPrice: 0,
      itemName: '',
      category: '',
      description: '',
      imageUrl: '' // Keep for backend compatibility
    }
  })

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const onSubmit = async (data: CreateItemInput) => {
    try {
      const result = await createItem(data)
      if (result) {
        toast({
          title: 'Success',
          description: `Item ${data.serialNumber} has been added successfully.`
        })
        onSuccess?.()
        router.push(`/items/${data.serialNumber}`)
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create item. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleNext = async () => {
    let fieldsToValidate: (keyof CreateItemInput)[] = []
    
    if (currentStep === 1) {
      fieldsToValidate = ['serialNumber']
      if (form.getValues().category) fieldsToValidate.push('category')
    } else if (currentStep === 2) {
      fieldsToValidate = ['currentPrice']
      if (form.getValues().itemName) fieldsToValidate.push('itemName')
    }

    const isValid = await form.trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, MOBILE_STEPS.length))
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      onCancel?.()
      router.back()
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1))
    }
  }

  const watchedValues = form.watch()

  if (!isMobile) {
    return (
      <Card className={cn('w-full max-w-2xl mx-auto', className)}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="px-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle>Add New Item</CardTitle>
              <CardDescription>Add a new item to your inventory</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="serialNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Serial Number *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., SN001, PROD-123"
                          {...field}
                          className="font-mono"
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
                          placeholder="e.g., Electronics, Tools"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="currentPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Price *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="999999.99"
                            placeholder="0.00"
                            className="pl-8"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional details about this item..."
                        rows={3}
                        {...field}
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
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating...' : 'Create Item'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="px-2"
          >
            <ChevronLeft className="w-5 h-5" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-semibold">Add Item ({currentStep}/3)</h1>
            <p className="text-sm text-muted-foreground">
              {MOBILE_STEPS[currentStep - 1].description}
            </p>
          </div>
          <div className="w-16 text-right text-sm text-muted-foreground">
            {currentStep}/{MOBILE_STEPS.length}
          </div>
        </div>
        
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2">
            {MOBILE_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep > step.id ? "bg-green-500 text-white" :
                  currentStep === step.id ? "bg-primary text-primary-foreground" :
                  "bg-gray-200 text-gray-600"
                )}>
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < MOBILE_STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors",
                    currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🔍 Basic Information
                  </CardTitle>
                  <CardDescription>
                    Enter the serial number and category for this item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serial Number *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., SN001, PROD-123"
                            {...field}
                            className="font-mono text-lg h-12"
                            autoFocus
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
                        <FormLabel>Category (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Electronics, Tools, Parts"
                            {...field}
                            className="text-lg h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    💰 Pricing & Details
                  </CardTitle>
                  <CardDescription>
                    Set the current price and add item details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Price *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">$</span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="999999.99"
                              placeholder="0.00"
                              className="pl-10 text-lg h-12"
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

                  <FormField
                    control={form.control}
                    name="itemName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Name (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Wireless Headphones"
                            {...field}
                            className="text-lg h-12"
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
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional details about this item..."
                            rows={3}
                            {...field}
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ✅ Review Details
                  </CardTitle>
                  <CardDescription>
                    Confirm all information is correct
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Serial Number:</span>
                      <span className="font-mono font-medium">{watchedValues.serialNumber}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-muted-foreground">Current Price:</span>
                      <span className="font-semibold text-lg text-green-600">
                        ${watchedValues.currentPrice.toFixed(2)}
                      </span>
                    </div>

                    {watchedValues.itemName && (
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Item Name:</span>
                        <span className="font-medium">{watchedValues.itemName}</span>
                      </div>
                    )}

                    {watchedValues.category && (
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{watchedValues.category}</span>
                      </div>
                    )}

                    {watchedValues.description && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-muted-foreground mb-1">Description:</div>
                        <p className="text-sm">{watchedValues.description}</p>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                      {error.message}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-3">
          {currentStep < MOBILE_STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex-1 h-12 text-lg"
              disabled={
                (currentStep === 1 && !watchedValues.serialNumber) ||
                (currentStep === 2 && !watchedValues.currentPrice)
              }
            >
              Next Step
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading}
              className="flex-1 h-12 text-lg bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>Creating...</>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Create Item
                </>
              )}
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}