# Price Tracking System

A mobile-first inventory price tracking system that maintains price history and enables quick price lookups using serial numbers as item identifiers.

## Project Structure

```text
price-tracker/
├── frontend/                    # Next.js Application
│   ├── src/
│   │   ├── app/                # Next.js 14 app directory
│   │   │   ├── (dashboard)/    # Dashboard pages
│   │   │   ├── api/           # API routes (if using Next.js API)
│   │   │   ├── globals.css    # Global styles
│   │   │   └── layout.tsx     # Root layout
│   │   ├── components/         # Reusable React components
│   │   │   ├── ui/            # shadcn/ui components
│   │   │   ├── forms/         # Form components
│   │   │   ├── tables/        # Data table components
│   │   │   └── mobile/        # Mobile-specific components
│   │   ├── lib/               # Utilities and configurations
│   │   │   ├── utils.ts       # Helper functions
│   │   │   ├── api.ts         # API client
│   │   │   └── validations.ts # Zod schemas
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── tsconfig.json
│
├── backend/                     # Express.js API Server
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   │   ├── items.ts        # Items CRUD operations
│   │   │   ├── search.ts       # Search functionality
│   │   │   └── analytics.ts    # Analytics endpoints
│   │   ├── middleware/         # Express middleware
│   │   ├── services/           # Business logic
│   │   │   ├── itemService.ts  # Item operations
│   │   │   └── priceService.ts # Price history management
│   │   ├── utils/              # Helper functions
│   │   └── server.ts           # Express server setup
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── migrations/         # Database migrations
│   │   └── seed.ts            # Sample data
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                       # Documentation
│   ├── API.md                  # API documentation
│   ├── DEPLOYMENT.md           # Deployment guide
│   └── systemDesign.md         # System design document
│
└── README.md                   # Project overview
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: SQLite (production: persistent storage on Railway)
- **Deployment**: Vercel (frontend) + Railway (backend)

## Development Setup

1. **Backend Setup**:

   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

2. **Frontend Setup**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Key Features

- Serial number-based item tracking
- Automatic price history logging
- Mobile-first responsive design
- Real-time search with partial matching
- Price trend analysis
- Offline PWA capabilities
- CSV data export

## User Experience

- **Mobile**: Step-by-step wizards, large touch targets
- **Laptop**: Multi-column dashboards, bulk operations
- **Target**: Non-technical business users

## Success Metrics

- Find item price within 3 taps on mobile
- Add new items in <30 seconds
- Seamless mobile experience
- Works offline for basic operations