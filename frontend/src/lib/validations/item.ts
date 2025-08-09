import { z } from 'zod'

export const createItemSchema = z.object({
  serialNumber: z
    .string()
    .min(1, 'Serial number is required')
    .max(50, 'Serial number must be 50 characters or less')
    .regex(/^[A-Z0-9-_]+$/i, 'Serial number can only contain letters, numbers, hyphens, and underscores'),
  
  currentPrice: z
    .number({ required_error: 'Current price is required' })
    .positive('Price must be greater than 0')
    .max(999999.99, 'Price cannot exceed $999,999.99'),
  
  itemName: z
    .string()
    .max(100, 'Item name must be 100 characters or less')
    .optional()
    .or(z.literal('')),
  
  description: z
    .string()
    .max(500, 'Description must be 500 characters or less')
    .optional()
    .or(z.literal('')),
  
  imageUrl: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal(''))
})

export const updateItemSchema = createItemSchema.omit({ 
  serialNumber: true, 
  currentPrice: true 
})

export const updatePriceSchema = z.object({
  newPrice: z
    .number({ required_error: 'New price is required' })
    .positive('Price must be greater than 0')
    .max(999999.99, 'Price cannot exceed $999,999.99'),
  
  notes: z
    .string()
    .max(200, 'Notes must be 200 characters or less')
    .optional()
    .or(z.literal(''))
})

export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>
export type UpdatePriceInput = z.infer<typeof updatePriceSchema>