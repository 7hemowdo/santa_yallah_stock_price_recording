import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { itemService } from '../services/itemService';
import { priceService } from '../services/priceService';

const router = Router();

// Validation schemas
const searchSchema = z.object({
  q: z.string().min(1, 'Query is required').max(50),
  category: z.string().max(50).optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? Math.min(parseInt(val) || 50, 100) : 50),
});

/**
 * GET /api/search?q=query&category=category&page=1&limit=50
 * Search items by serial number or name
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { q: query, category, page, limit } = searchSchema.parse(req.query);
    
    const result = await itemService.search({
      query,
      category,
      page,
      limit,
    });
    
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error searching items:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to search items',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/search/recent-changes?limit=10
 * Get recent price changes across all items
 */
router.get('/recent-changes', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    
    const changes = await priceService.getRecentChanges(limit);
    
    // Transform the data to include helpful information
    const transformedChanges = changes.map(change => ({
      id: change.id,
      serialNumber: change.serialNumber,
      itemName: change.item.itemName,
      oldPrice: change.oldPrice,
      newPrice: change.newPrice,
      change: Number(change.newPrice) - Number(change.oldPrice),
      changePercent: ((Number(change.newPrice) - Number(change.oldPrice)) / Number(change.oldPrice)) * 100,
      direction: change.newPrice > change.oldPrice ? 'up' : 'down',
      notes: change.notes,
      createdAt: change.createdAt,
    }));
    
    return res.json({
      success: true,
      data: transformedChanges,
    });
  } catch (error) {
    console.error('Error fetching recent changes:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch recent changes',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/search/suggestions?q=query
 * Get search suggestions based on partial query
 */
router.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    
    if (!query || query.length < 1) {
      return res.json({
        success: true,
        data: [],
      });
    }

    // Get top 10 matching items for suggestions
    const result = await itemService.search({
      query,
      page: 1,
      limit: 10,
    });
    
    // Transform to simple suggestions format
    const suggestions = result.items.map(item => ({
      serialNumber: item.serialNumber,
      itemName: item.itemName,
      currentPrice: item.currentPrice,
    }));
    
    return res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch suggestions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/search/categories
 * Get all categories with item counts
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categoryCounts = await itemService.getCategoryCounts();
    
    return res.json({
      success: true,
      data: categoryCounts,
    });
  } catch (error) {
    console.error('Error fetching category counts:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch category counts',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/search/volatile?limit=10
 * Get most volatile items (items with most price changes)
 */
router.get('/volatile', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    
    const volatileItems = await priceService.getMostVolatileItems(limit);
    
    return res.json({
      success: true,
      data: volatileItems,
    });
  } catch (error) {
    console.error('Error fetching volatile items:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch volatile items',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;