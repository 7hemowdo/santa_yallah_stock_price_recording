"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.priceHistory.deleteMany();
    await prisma.item.deleteMany();
    console.log('Creating sample items...');
    const items = await Promise.all([
        prisma.item.create({
            data: {
                serialNumber: 'SN001',
                itemName: 'Widget A',
                category: 'Widgets',
                description: 'High-quality widget for industrial use',
                currentPrice: 25.00,
            },
        }),
        prisma.item.create({
            data: {
                serialNumber: 'SN045',
                itemName: 'Tool B',
                category: 'Tools',
                description: 'Professional grade tool',
                currentPrice: 18.50,
            },
        }),
        prisma.item.create({
            data: {
                serialNumber: 'SN023',
                itemName: 'Part C',
                category: 'Parts',
                description: 'Essential component for assembly',
                currentPrice: 42.00,
            },
        }),
        prisma.item.create({
            data: {
                serialNumber: 'SN107',
                itemName: 'Component D',
                category: 'Components',
                description: 'Specialized electronic component',
                currentPrice: 15.75,
            },
        }),
        prisma.item.create({
            data: {
                serialNumber: 'SN089',
                itemName: 'Assembly E',
                category: 'Assemblies',
                description: 'Complete assembly unit',
                currentPrice: 67.25,
            },
        }),
    ]);
    console.log('Creating price history...');
    const now = new Date();
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    const twelveDaysAgo = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000);
    const twentyDaysAgo = new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000);
    await prisma.priceHistory.createMany({
        data: [
            {
                itemId: items[0].id,
                serialNumber: 'SN001',
                oldPrice: 21.00,
                newPrice: 23.00,
                createdAt: twentyDaysAgo,
                notes: 'Initial price adjustment',
            },
            {
                itemId: items[0].id,
                serialNumber: 'SN001',
                oldPrice: 23.00,
                newPrice: 25.00,
                createdAt: fiveDaysAgo,
                notes: 'Supplier cost increase',
            },
        ],
    });
    await prisma.priceHistory.createMany({
        data: [
            {
                itemId: items[1].id,
                serialNumber: 'SN045',
                oldPrice: 20.00,
                newPrice: 18.50,
                createdAt: twelveDaysAgo,
                notes: 'Volume discount applied',
            },
        ],
    });
    await prisma.priceHistory.createMany({
        data: [
            {
                itemId: items[2].id,
                serialNumber: 'SN023',
                oldPrice: 37.00,
                newPrice: 42.00,
                createdAt: fiveDaysAgo,
                notes: 'Material cost increase',
            },
        ],
    });
    console.log(`Created ${items.length} items with price history`);
    console.log('Sample data:');
    items.forEach(item => {
        console.log(`- ${item.serialNumber}: ${item.itemName} - $${item.currentPrice}`);
    });
}
main()
    .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map