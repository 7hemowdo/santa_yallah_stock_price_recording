import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { itemService } from '../services/itemService';
import { priceService } from '../services/priceService';

const router = Router();

// Validation schemas
const createItemSchema = z.object({
  serialNumber: z.string()
    .min(1, 'Serial number is required')
    .max(50, 'Serial number must be 50 characters or less'),
  itemName: z.string().max(100).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  currentPrice: z.number().positive('Price must be positive').max(999999.99),
  imageUrl: z.string().url().optional().nullable(),
});

const updateItemSchema = z.object({
  itemName: z.string().max(100).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

const updatePriceSchema = z.object({
  newPrice: z.number().positive('Price must be positive').max(999999.99),
  notes: z.string().max(200).optional().nullable(),
});

/**
 * GET /api/items
 * Get all items with pagination
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);

    const result = await itemService.getAll(page, limit);
    
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch items',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/items/serial/:serialNumber
 * Get item by serial number
 */
router.get('/serial/:serialNumber', async (req: Request, res: Response) => {
  try {
    const { serialNumber } = req.params;
    
    if (!serialNumber) {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Serial number is required',
      });
    }
    
    const item = await itemService.getBySerial(serialNumber);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: `No item found with serial number: ${serialNumber}`,
      });
    }

    return res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch item',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/items
 * Create new item
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createItemSchema.parse(req.body);
    
    const item = await itemService.create(validatedData);
    
    return res.status(201).json({
      success: true,
      data: item,
      message: 'Item created successfully',
    });
  } catch (error) {
    console.error('Error creating item:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to create item',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * PUT /api/items/serial/:serialNumber
 * Update item details (not price)
 */
router.put('/serial/:serialNumber', async (req: Request, res: Response) => {
  try {
    const { serialNumber } = req.params;
    
    if (!serialNumber) {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Serial number is required',
      });
    }
    
    const validatedData = updateItemSchema.parse(req.body);
    
    const item = await itemService.update(serialNumber, validatedData);
    
    return res.json({
      success: true,
      data: item,
      message: 'Item updated successfully',
    });
  } catch (error) {
    console.error('Error updating item:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to update item',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/items/serial/:serialNumber/price
 * Update item price (with history)
 */
router.post('/serial/:serialNumber/price', async (req: Request, res: Response) => {
  try {
    const { serialNumber } = req.params;
    
    if (!serialNumber) {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Serial number is required',
      });
    }
    
    const { newPrice, notes } = updatePriceSchema.parse(req.body);
    
    const item = await itemService.updatePrice(serialNumber, newPrice, notes || undefined);
    
    return res.json({
      success: true,
      data: item,
      message: 'Price updated successfully',
    });
  } catch (error) {
    console.error('Error updating price:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }
    
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to update price',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/items/serial/:serialNumber/history
 * Get price history for item
 */
router.get('/serial/:serialNumber/history', async (req: Request, res: Response) => {
  try {
    const { serialNumber } = req.params;
    
    if (!serialNumber) {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Serial number is required',
      });
    }
    
    // First check if item exists
    const item = await itemService.getBySerial(serialNumber);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: `No item found with serial number: ${serialNumber}`,
      });
    }
    
    const history = await priceService.getHistoryBySerial(serialNumber);
    
    return res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error('Error fetching price history:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch price history',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * DELETE /api/items/serial/:serialNumber
 * Delete item
 */
router.delete('/serial/:serialNumber', async (req: Request, res: Response) => {
  try {
    const { serialNumber } = req.params;
    
    if (!serialNumber) {
      return res.status(400).json({
        success: false,
        error: 'Bad request',
        message: 'Serial number is required',
      });
    }
    
    await itemService.delete(serialNumber);
    
    return res.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: 'Item not found',
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to delete item',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;