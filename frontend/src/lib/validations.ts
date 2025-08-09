import { z } from 'zod'

// Item validation schemas
export const createItemSchema = z.object({
  serialNumber: z.string()
    .min(1, 'Serial number is required')
    .max(50, 'Serial number must be 50 characters or less')
    .regex(/^[A-Z0-9\-_]+$/i, 'Serial number can only contain letters, numbers, hyphens, and underscores'),
  
  itemName: z.string()
    .max(100, 'Item name must be 100 characters or less')
    .optional()
    .nullable(),
  
  category: z.string()
    .max(50, 'Category must be 50 characters or less')
    .optional()
    .nullable(),
  
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .nullable(),
  
  currentPrice: z.number()
    .positive('Price must be positive')
    .max(999999.99, 'Price cannot exceed $999,999.99')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  
  imageUrl: z.string()
    .url('Must be a valid URL')
    .optional()
    .nullable(),
})

export const updateItemSchema = createItemSchema.omit({ 
  serialNumber: true, 
  currentPrice: true 
})

export const updatePriceSchema = z.object({
  newPrice: z.number()
    .positive('Price must be positive')
    .max(999999.99, 'Price cannot exceed $999,999.99')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  
  notes: z.string()
    .max(200, 'Notes must be 200 characters or less')
    .optional()
    .nullable(),
})

// Search validation schema
export const searchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(50, 'Search query must be 50 characters or less'),
  
  category: z.string()
    .max(50, 'Category must be 50 characters or less')
    .optional(),
  
  page: z.number()
    .int('Page must be an integer')
    .positive('Page must be positive')
    .default(1),
  
  limit: z.number()
    .int('Limit must be an integer')
    .positive('Limit must be positive')
    .max(100, 'Limit cannot exceed 100')
    .default(50),
})

// Form validation schemas for React Hook Form
export type CreateItemFormData = z.infer<typeof createItemSchema>
export type UpdateItemFormData = z.infer<typeof updateItemSchema>
export type UpdatePriceFormData = z.infer<typeof updatePriceSchema>
export type SearchFormData = z.infer<typeof searchSchema>

// Client-side validation helpers
export const validateSerialNumber = (serialNumber: string): boolean => {
  try {
    createItemSchema.pick({ serialNumber: true }).parse({ serialNumber })
    return true
  } catch {
    return false
  }
}

export const validatePrice = (price: number): boolean => {
  try {
    updatePriceSchema.pick({ newPrice: true }).parse({ newPrice: price })
    return true
  } catch {
    return false
  }
}

export const formatValidationError = (error: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {}
  
  error.errors.forEach((err) => {
    if (err.path.length > 0) {
      formattedErrors[err.path[0] as string] = err.message
    }
  })
  
  return formattedErrors
}