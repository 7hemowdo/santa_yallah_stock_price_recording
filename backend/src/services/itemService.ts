import { PrismaClient, Item, Prisma } from '@prisma/client';
import { priceService } from './priceService';

const prisma = new PrismaClient();

export interface CreateItemData {
  serialNumber: string;
  itemName?: string | null;
  description?: string | null;
  currentPrice: number;
  imageUrl?: string | null;
}

export interface UpdateItemData {
  itemName?: string | null;
  description?: string | null;
  imageUrl?: string | null;
}

export interface SearchOptions {
  query?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ItemService {
  /**
   * Get item by serial number
   */
  async getBySerial(serialNumber: string): Promise<Item | null> {
    return await prisma.item.findUnique({
      where: { serialNumber },
    });
  }

  /**
   * Get item by ID
   */
  async getById(id: string): Promise<Item | null> {
    return await prisma.item.findUnique({
      where: { id },
    });
  }

  /**
   * Get all items with pagination
   */
  async getAll(page = 1, limit = 50): Promise<SearchResult> {
    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      prisma.item.findMany({
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.item.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Search items by serial number (partial match)
   */
  async search({ query, page = 1, limit = 50 }: SearchOptions): Promise<SearchResult> {
    const skip = (page - 1) * limit;
    
    const where: Prisma.ItemWhereInput = {};
    
    if (query) {
      where.OR = [
        { serialNumber: { contains: query } },
        { itemName: { contains: query } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.item.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }


  /**
   * Create new item
   */
  async create(data: CreateItemData): Promise<Item> {
    // Check if serial number already exists
    const existingItem = await this.getBySerial(data.serialNumber);
    if (existingItem) {
      throw new Error(`Item with serial number ${data.serialNumber} already exists`);
    }

    return await prisma.item.create({
      data: {
        serialNumber: data.serialNumber,
        itemName: data.itemName,
        description: data.description,
        currentPrice: data.currentPrice,
        imageUrl: data.imageUrl,
      },
    });
  }

  /**
   * Update item details (not price)
   */
  async update(serialNumber: string, data: UpdateItemData): Promise<Item> {
    const existingItem = await this.getBySerial(serialNumber);
    if (!existingItem) {
      throw new Error(`Item with serial number ${serialNumber} not found`);
    }

    return await prisma.item.update({
      where: { serialNumber },
      data: {
        itemName: data.itemName,
        description: data.description,
        imageUrl: data.imageUrl,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Update item price (with history logging)
   */
  async updatePrice(serialNumber: string, newPrice: number, notes?: string): Promise<Item> {
    const existingItem = await this.getBySerial(serialNumber);
    if (!existingItem) {
      throw new Error(`Item with serial number ${serialNumber} not found`);
    }

    // Create price history record first
    await priceService.createPriceHistory({
      itemId: existingItem.id,
      serialNumber: existingItem.serialNumber,
      oldPrice: Number(existingItem.currentPrice),
      newPrice,
      notes,
    });

    // Update item price
    return await prisma.item.update({
      where: { serialNumber },
      data: {
        currentPrice: newPrice,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Delete item
   */
  async delete(serialNumber: string): Promise<void> {
    const existingItem = await this.getBySerial(serialNumber);
    if (!existingItem) {
      throw new Error(`Item with serial number ${serialNumber} not found`);
    }

    // Prisma will handle cascade delete of price history due to the schema
    await prisma.item.delete({
      where: { serialNumber },
    });
  }

}

export const itemService = new ItemService();