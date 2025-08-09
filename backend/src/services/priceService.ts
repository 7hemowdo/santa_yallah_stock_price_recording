import { PrismaClient, PriceHistory } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePriceHistoryData {
  itemId: string;
  serialNumber: string;
  oldPrice: number;
  newPrice: number;
  notes?: string | null;
}

export interface PriceHistoryWithItem extends PriceHistory {
  item: {
    itemName: string | null;
    serialNumber: string;
  };
}

class PriceService {
  /**
   * Create price history record
   */
  async createPriceHistory(data: CreatePriceHistoryData): Promise<PriceHistory> {
    return await prisma.priceHistory.create({
      data: {
        itemId: data.itemId,
        serialNumber: data.serialNumber,
        oldPrice: data.oldPrice,
        newPrice: data.newPrice,
        notes: data.notes,
      },
    });
  }

  /**
   * Get price history for an item by serial number
   */
  async getHistoryBySerial(serialNumber: string): Promise<PriceHistory[]> {
    return await prisma.priceHistory.findMany({
      where: { serialNumber },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get price history for an item by item ID
   */
  async getHistoryById(itemId: string): Promise<PriceHistory[]> {
    return await prisma.priceHistory.findMany({
      where: { itemId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get recent price changes across all items
   */
  async getRecentChanges(limit = 10): Promise<PriceHistoryWithItem[]> {
    return await prisma.priceHistory.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        item: {
          select: {
            itemName: true,
            serialNumber: true,
          },
        },
      },
    });
  }

  /**
   * Get price changes within a date range
   */
  async getChangesByDateRange(
    startDate: Date,
    endDate: Date,
    limit?: number
  ): Promise<PriceHistoryWithItem[]> {
    return await prisma.priceHistory.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      ...(limit && { take: limit }),
      orderBy: { createdAt: 'desc' },
      include: {
        item: {
          select: {
            itemName: true,
            serialNumber: true,
          },
        },
      },
    });
  }

  /**
   * Get price changes for today
   */
  async getTodaysChanges(): Promise<PriceHistoryWithItem[]> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    return await this.getChangesByDateRange(startOfDay, endOfDay);
  }

  /**
   * Get price statistics
   */
  async getPriceStats() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Get today's price changes count
    const todaysChangesCount = await prisma.priceHistory.count({
      where: {
        createdAt: { gte: startOfDay },
      },
    });

    // Get items with price increases today
    const itemsIncreasedToday = await prisma.priceHistory.count({
      where: {
        createdAt: { gte: startOfDay },
        newPrice: { gt: prisma.priceHistory.fields.oldPrice },
      },
    });

    // Get items with price decreases today
    const itemsDecreasedToday = await prisma.priceHistory.count({
      where: {
        createdAt: { gte: startOfDay },
        newPrice: { lt: prisma.priceHistory.fields.oldPrice },
      },
    });

    // Get average current price
    const avgPriceResult = await prisma.item.aggregate({
      _avg: { currentPrice: true },
    });

    // Get total items count
    const totalItems = await prisma.item.count();

    return {
      totalItems,
      priceUpdatesToday: todaysChangesCount,
      averagePrice: avgPriceResult._avg.currentPrice || 0,
      itemsIncreasedToday,
      itemsDecreasedToday,
    };
  }

  /**
   * Calculate price trend for an item
   */
  async calculatePriceTrend(serialNumber: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const history = await prisma.priceHistory.findMany({
      where: {
        serialNumber,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (history.length === 0) {
      return { trend: 'neutral', changes: 0, totalChange: 0, changePercent: 0 };
    }

    const firstPrice = Number(history[0]?.oldPrice || 0);
    const lastPrice = Number(history[history.length - 1]?.newPrice || 0);
    const totalChange = lastPrice - firstPrice;
    const changePercent = firstPrice > 0 ? ((totalChange / firstPrice) * 100) : 0;

    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    if (changePercent > 5) trend = 'up';
    else if (changePercent < -5) trend = 'down';

    return {
      trend,
      changes: history.length,
      totalChange,
      changePercent: Math.round(changePercent * 100) / 100,
      priceHistory: history.map(h => ({
        date: h.createdAt,
        price: Number(h.newPrice),
        change: Number(h.newPrice) - Number(h.oldPrice),
      })),
    };
  }

  /**
   * Get most volatile items (items with most price changes)
   */
  async getMostVolatileItems(limit = 10) {
    const result = await prisma.priceHistory.groupBy({
      by: ['serialNumber'],
      _count: { serialNumber: true },
      orderBy: { _count: { serialNumber: 'desc' } },
      take: limit,
    });

    // Get item details for each serial number
    const itemDetails = await Promise.all(
      result.map(async (item) => {
        const itemInfo = await prisma.item.findUnique({
          where: { serialNumber: item.serialNumber },
          select: { serialNumber: true, itemName: true, currentPrice: true },
        });
        return {
          ...itemInfo,
          priceChangeCount: item._count.serialNumber,
        };
      })
    );

    return itemDetails.filter(item => item !== null);
  }
}

export const priceService = new PriceService();