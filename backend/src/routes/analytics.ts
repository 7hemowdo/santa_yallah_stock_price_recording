import { Router, Request, Response } from 'express';
import { priceService } from '../services/priceService';

const router = Router();

/**
 * GET /api/analytics/summary
 * Get dashboard summary statistics
 */
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const stats = await priceService.getPriceStats();
    
    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching summary stats:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch summary statistics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/analytics/price-trends?serial=SN001&days=30
 * Get price trend analysis for a specific item or overall trends
 */
router.get('/price-trends', async (req: Request, res: Response) => {
  try {
    const serialNumber = req.query.serial as string;
    const days = parseInt(req.query.days as string) || 30;
    
    if (serialNumber) {
      // Get trend for specific item
      const trend = await priceService.calculatePriceTrend(serialNumber, days);
      
      return res.json({
        success: true,
        data: {
          serialNumber,
          days,
          ...trend,
        },
      });
    } else {
      // Get overall trends (recent changes)
      const recentChanges = await priceService.getRecentChanges(50);
      
      // Calculate overall trends
      const increases = recentChanges.filter(change => change.newPrice > change.oldPrice).length;
      const decreases = recentChanges.filter(change => change.newPrice < change.oldPrice).length;
      const totalChanges = recentChanges.length;
      
      const overallTrend = {
        totalChanges,
        increases,
        decreases,
        increasePercent: totalChanges > 0 ? (increases / totalChanges) * 100 : 0,
        decreasePercent: totalChanges > 0 ? (decreases / totalChanges) * 100 : 0,
        recentChanges: recentChanges.slice(0, 10), // Top 10 recent changes
      };
      
      return res.json({
        success: true,
        data: overallTrend,
      });
    }
  } catch (error) {
    console.error('Error fetching price trends:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch price trends',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/analytics/today
 * Get today's price change activity
 */
router.get('/today', async (req: Request, res: Response) => {
  try {
    const todaysChanges = await priceService.getTodaysChanges();
    
    // Calculate statistics for today
    const increases = todaysChanges.filter(change => change.newPrice > change.oldPrice);
    const decreases = todaysChanges.filter(change => change.newPrice < change.oldPrice);
    
    const stats = {
      totalChanges: todaysChanges.length,
      increases: increases.length,
      decreases: decreases.length,
      averageIncrease: increases.length > 0 
        ? increases.reduce((sum, change) => sum + (Number(change.newPrice) - Number(change.oldPrice)), 0) / increases.length 
        : 0,
      averageDecrease: decreases.length > 0 
        ? Math.abs(decreases.reduce((sum, change) => sum + (Number(change.newPrice) - Number(change.oldPrice)), 0) / decreases.length)
        : 0,
      changes: todaysChanges.map(change => ({
        serialNumber: change.serialNumber,
        itemName: change.item.itemName,
        oldPrice: change.oldPrice,
        newPrice: change.newPrice,
        change: Number(change.newPrice) - Number(change.oldPrice),
        changePercent: ((Number(change.newPrice) - Number(change.oldPrice)) / Number(change.oldPrice)) * 100,
        direction: change.newPrice > change.oldPrice ? 'up' : 'down',
        createdAt: change.createdAt,
        notes: change.notes,
      })),
    };
    
    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching today\'s analytics:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch today\'s analytics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/analytics/date-range?start=2024-01-01&end=2024-01-31
 * Get price changes within a specific date range
 */
router.get('/date-range', async (req: Request, res: Response) => {
  try {
    const startDateStr = req.query.start as string;
    const endDateStr = req.query.end as string;
    
    if (!startDateStr || !endDateStr) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Both start and end dates are required',
      });
    }
    
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Invalid date format. Use YYYY-MM-DD',
      });
    }
    
    if (startDate > endDate) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: 'Start date must be before end date',
      });
    }
    
    const changes = await priceService.getChangesByDateRange(startDate, endDate);
    
    // Calculate statistics for the date range
    const increases = changes.filter(change => change.newPrice > change.oldPrice);
    const decreases = changes.filter(change => change.newPrice < change.oldPrice);
    
    const stats = {
      dateRange: { start: startDate, end: endDate },
      totalChanges: changes.length,
      increases: increases.length,
      decreases: decreases.length,
      averageIncrease: increases.length > 0 
        ? increases.reduce((sum, change) => sum + (Number(change.newPrice) - Number(change.oldPrice)), 0) / increases.length 
        : 0,
      averageDecrease: decreases.length > 0 
        ? Math.abs(decreases.reduce((sum, change) => sum + (Number(change.newPrice) - Number(change.oldPrice)), 0) / decreases.length)
        : 0,
      changes: changes.map(change => ({
        serialNumber: change.serialNumber,
        itemName: change.item.itemName,
        oldPrice: change.oldPrice,
        newPrice: change.newPrice,
        change: Number(change.newPrice) - Number(change.oldPrice),
        changePercent: ((Number(change.newPrice) - Number(change.oldPrice)) / Number(change.oldPrice)) * 100,
        direction: change.newPrice > change.oldPrice ? 'up' : 'down',
        createdAt: change.createdAt,
        notes: change.notes,
      })),
    };
    
    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching date range analytics:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch date range analytics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;