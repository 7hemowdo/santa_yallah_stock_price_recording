# Price Tracking System Design

## System Overview

**Core Purpose**: A simple inventory price tracking system that maintains price history and enables quick price lookups, primarily using serial numbers as item identifiers.

**Target User**: Non-technical business owner who needs simple, mobile-friendly price tracking.

## Database Design

### Items Table
- `item_id` (Auto-increment Primary Key)
- `serial_number` (String, Unique, Primary Business Key) 
- `item_name` (String, Optional)
- `category` (String, Optional)
- `description` (Text, Optional)
- `current_price` (Decimal)
- `created_date` (Timestamp)
- `last_updated` (Timestamp)
- `image_url` (String, Optional - for visual identification)

### Price History Table
- `history_id` (Primary Key)
- `item_id` (Foreign Key)
- `serial_number` (String, for easy reference)
- `old_price` (Decimal)
- `new_price` (Decimal)
- `price_change_date` (Timestamp)
- `notes` (String, Optional - simple reason)

## Core Features

### 1. Item Management
- Add new items with serial number (required) and initial price
- Edit item details (name, category, description)
- Update item prices (automatically creates history record)
- Delete items (with confirmation)

### 2. Price Tracking
- Automatic price history logging on every price change
- Calculate price change percentage
- Track price trends (increasing/decreasing)
- Date range filtering for price history

### 3. Search & Lookup
- Real-time search by serial number
- Partial serial number matching
- Filter by category
- Sort by price, name, or last updated
- Quick price lookup interface

### 4. Reporting
- Price change summary reports
- Items with recent price changes
- Price volatility analysis
- Export data to CSV

## Responsive UI/UX Design (Mobile-First with Laptop Support)

### Key Design Principles for Non-Tech Users
- **Large touch targets** (minimum 44px on mobile, scalable on desktop)
- **Clear visual hierarchy** with icons and colors
- **One primary action per screen** (mobile) / **Multiple actions visible** (laptop)
- **Minimal text input** with smart defaults
- **Visual feedback** for all actions
- **Offline capability** for basic operations
- **Responsive breakpoints**: Mobile (320px-768px), Tablet (768px-1024px), Laptop (1024px+)

### User Interface Design

#### 1. Home Screen (Mobile-Optimized)
```
┌─────────────────────────────────────┐
│  📱 Price Tracker                   │
├─────────────────────────────────────┤
│                                     │
│    🔍 [Search by Serial Number]     │
│         ___________________         │
│                                     │
│    ➕ [Add New Item]               │
│         (Large Button)              │
│                                     │
│    📋 [View All Items]             │
│         (Large Button)              │
│                                     │
│ 📊 Recent Changes (Last 5)          │
│ • SN001 → $25.00 ↗️ (+$2)          │
│ • SN045 → $18.50 ↘️ (-$1.50)       │
│ • SN023 → $42.00 ↗️ (+$5)          │
│                                     │
└─────────────────────────────────────┘
```

## Laptop/Desktop Interface Design

### 1. Laptop Home Dashboard (1024px+)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 📱 Price Tracker                                              [Settings] [Help] │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────┐  ┌─────────────────────────────────────────────────┐ │
│ │    Quick Actions        │  │             Recent Price Changes               │ │
│ │                         │  │                                                 │ │
│ │ 🔍 [Search by Serial]   │  │ • SN001 - Widget A: $23.00 → $25.00 ↗️ (+8.7%) │ │
│ │ ➕ [Add New Item]       │  │   Updated: 2 hours ago                          │ │
│ │ 📋 [View All Items]     │  │                                                 │ │
│ │ 📊 [Reports]            │  │ • SN045 - Tool B: $20.00 → $18.50 ↘️ (-7.5%)   │ │
│ │                         │  │   Updated: 1 day ago                            │ │
│ └─────────────────────────┘  │                                                 │ │
│                              │ • SN023 - Part C: $37.00 → $42.00 ↗️ (+13.5%)  │ │
│ ┌─────────────────────────┐  │   Updated: 3 days ago                           │ │
│ │   Search by Serial      │  │                                                 │ │
│ │  ___________________    │  │ [View All Recent Changes →]                     │ │
│ │         🔍              │  │                                                 │ │
│ │                         │  └─────────────────────────────────────────────────┘ │
│ │ Quick Results:          │                                                      │
│ │ (Auto-suggestions)      │  ┌─────────────────────────────────────────────────┐ │
│ └─────────────────────────┘  │                Summary Stats                    │ │
│                              │                                                 │ │
│                              │ Total Items: 1,247     Price Updates Today: 8  │ │
│                              │ Avg Price: $28.50      Items Increased: 5      │ │
│                              │                        Items Decreased: 3      │ │
│                              └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2. Laptop Search & Results View
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Back    🔍 Search Items                                    [Advanced Filter ▼] │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ Serial Number: [________________] 🔍    📷 [Scan Barcode]                       │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │                              Search Results                                 │ │
│ ├─────────────┬─────────────────────┬─────────────┬─────────────┬─────────────┤ │
│ │ Serial No.  │ Item Name           │ Price       │ Last Update │ Actions     │ │
│ ├─────────────┼─────────────────────┼─────────────┼─────────────┼─────────────┤ │
│ │ SN001       │ Widget A            │ $25.00 ↗️   │ 2 hrs ago   │ [View][Edit]│ │
│ │ SN045       │ Tool B              │ $18.50 ↘️   │ 1 day ago   │ [View][Edit]│ │
│ │ SN023       │ Part C              │ $42.00 ↗️   │ 3 days ago  │ [View][Edit]│ │
│ │ SN107       │ Component D         │ $15.75 ⚪   │ 1 week ago  │ [View][Edit]│ │
│ │ SN089       │ Assembly E          │ $67.25 ↗️   │ 2 days ago  │ [View][Edit]│ │
│ └─────────────┴─────────────────────┴─────────────┴─────────────┴─────────────┘ │
│                                                                                 │
│ Showing 5 of 247 results    [◀ Previous] [1] [2] [3] ... [25] [Next ▶]         │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3. Laptop Item Details View (Side-by-Side Layout)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Search    📦 SN001 - Widget A                              [Edit Item] │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────┐  ┌─────────────────────────────────────────────┐ │
│ │        Item Details         │  │                Price History               │ │
│ │                             │  │                                             │ │
│ │ Serial Number: SN001        │  │ ┌─────────────┬──────────┬──────────────────┐ │
│ │ Item Name: Widget A         │  │ │ Date        │ Price    │ Change           │ │
│ │ Category: Widgets           │  │ ├─────────────┼──────────┼──────────────────┤ │
│ │                             │  │ │ Today       │ $25.00   │ +$2.00 (+8.7%)   │ │
│ │ 💰 Current Price            │  │ │ 5 days ago  │ $23.00   │ +$3.00 (+15.0%)  │ │
│ │    $25.00                   │  │ │ 12 days ago │ $20.00   │ -$2.00 (-9.1%)   │ │
│ │                             │  │ │ 20 days ago │ $22.00   │ +$1.00 (+4.8%)   │ │
│ │ [Update Price] 📝           │  │ │ 30 days ago │ $21.00   │ Initial Price    │ │
│ │                             │  │ └─────────────┴──────────┴──────────────────┘ │
│ │ Last Updated: 2 hours ago   │  │                                             │ │
│ │ Added: 30 days ago          │  │ 📈 [View Price Chart]                       │ │
│ │                             │  │ 📊 Price Trend: ↗️ Generally Increasing    │ │
│ │ [Delete Item] 🗑️           │  │ 📁 [Export History]                         │ │
│ └─────────────────────────────┘  └─────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4. Laptop Add New Item (Single Form)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Cancel    ➕ Add New Item                                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │                              Item Information                               │ │
│ │                                                                             │ │
│ │ 📝 Serial Number: *          💰 Current Price: *                            │ │
│ │ [___________________]        $ [________________]                           │ │
│ │                                                                             │ │
│ │ 📦 Item Name: (Optional)     🏷️ Category: (Optional)                       │ │
│ │ [___________________]        [___________________]                          │ │
│ │                                                                             │ │
│ │ 📄 Description: (Optional)                                                  │ │
│ │ [_________________________________________________]                         │ │
│ │ [_________________________________________________]                         │ │
│ │                                                                             │ │
│ │ 🖼️ Image: (Optional)         📅 Date Added: Today                          │ │
│ │ [Choose File...]             (Auto-filled)                                 │ │
│ │                                                                             │ │
│ │           [Preview Item]              [Save Item] ✅                        │ │
│ │                                                                             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│ 💡 Tips:                                                                        │ │
│ • Serial number is required and must be unique                                 │ │
│ • Use clear, descriptive names for easy searching                              │ │
│ • Adding category helps with organization                                      │ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### 2. Search Interface (Simplified)
```
┌─────────────────────────────────────┐
│ ← Back    🔍 Find Item              │
├─────────────────────────────────────┤
│                                     │
│  Serial Number:                     │
│  [________________] 🔍              │
│                                     │
│  📷 [Scan Barcode] (if available)   │
│                                     │
│ ✅ Results:                         │
│ ┌─────────────────────────────────┐ │
│ │ SN001 - Widget A                │ │
│ │ Current Price: $25.00           │ │
│ │ Last Updated: 2 days ago        │ │
│ │ [View] [Update Price]           │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

#### 3. Add New Item (Step-by-Step)

**Step 1/3:**
```
┌─────────────────────────────────────┐
│ ← Cancel   ➕ Add Item (Step 1/3)   │
├─────────────────────────────────────┤
│                                     │
│  📝 Serial Number: *                │
│  [_____________________]            │
│                                     │
│  💡 Tip: Usually found on barcode   │
│      or product label               │
│                                     │
│                                     │
│           [Next Step] →              │
│                                     │
└─────────────────────────────────────┘
```

**Step 2/3:**
```
┌─────────────────────────────────────┐
│ ← Back     ➕ Add Item (Step 2/3)   │
├─────────────────────────────────────┤
│                                     │
│  💰 Current Price: *                │
│  $ [________________]               │
│                                     │
│  📝 Item Name: (Optional)           │
│  [_____________________]            │
│                                     │
│                                     │
│           [Next Step] →              │
│                                     │
└─────────────────────────────────────┘
```

**Step 3/3:**
```
┌─────────────────────────────────────┐
│ ← Back     ➕ Add Item (Step 3/3)   │
├─────────────────────────────────────┤
│                                     │
│  ✅ Review Details:                 │
│                                     │
│  Serial: SN001                      │
│  Price: $25.00                      │
│  Name: Widget A                     │
│                                     │
│                                     │
│        [Save Item] ✅               │
│                                     │
└─────────────────────────────────────┘
```

#### 4. Item Details View
```
┌─────────────────────────────────────┐
│ ← Back    📦 SN001                  │
├─────────────────────────────────────┤
│                                     │
│  Widget A                           │
│                                     │
│  💰 Current Price                   │
│     $25.00                          │
│                                     │
│  [Update Price] 📝                  │
│                                     │
│  📊 Price History                   │
│  • Today: $25.00 ↗️                │
│  • 5 days ago: $23.00              │
│  • 12 days ago: $20.00             │
│  • 20 days ago: $22.00             │
│                                     │
│  [View Full History] 📈             │
│                                     │
└─────────────────────────────────────┘
```

#### 5. Update Price (Ultra Simple)
```
┌─────────────────────────────────────┐
│ ← Cancel   💰 Update Price          │
├─────────────────────────────────────┤
│                                     │
│  Item: SN001 - Widget A             │
│                                     │
│  Current Price: $25.00              │
│                                     │
│  New Price:                         │
│  $ [________________]               │
│                                     │
│  📝 Quick Note: (Optional)          │
│  [_____________________]            │
│     (e.g., "supplier increase")     │
│                                     │
│        [Save Update] ✅             │
│                                     │
└─────────────────────────────────────┘
```

## Technical Architecture

### Recommended Tech Stack

#### Frontend Stack
```
Framework: Next.js 14+ (React)
Language: TypeScript
Styling: Tailwind CSS + shadcn/ui
Forms: React Hook Form + Zod validation
PWA: Built-in Next.js PWA support
```

#### Backend Stack
```
Runtime: Node.js + Express
ORM: Prisma (type-safe database operations)
Database: SQLite (with persistent storage)
Authentication: NextAuth.js (for future expansion)
API: RESTful endpoints
```

#### Development Tools
```
Code Quality: ESLint + Prettier
Git Hooks: Husky
Package Manager: npm/yarn
Testing: Jest (optional)
```

### Deployment Architecture

#### Recommended: Split Deployment (Best Performance + Cost)
```
Frontend Deployment:
├── Vercel (free tier)
├── Next.js application
├── Automatic deployments from GitHub
├── Built-in CDN and optimization
└── Custom domain support

Backend + Database Deployment:
├── Railway ($5/month)
├── Node.js + Express API
├── SQLite with persistent storage
├── Automatic daily backups
└── Environment variables management
```

#### Alternative: All-in-One Deployment
```
Full Stack Deployment:
├── Railway, Render, or DigitalOcean App Platform
├── Frontend + Backend + Database in one place
├── Single deployment pipeline
└── Slightly higher cost but simpler management
```

### Database Strategy
- **SQLite on Railway**: Persistent storage with automatic backups
- **Prisma ORM**: Type-safe database operations and easy migrations
- **Migration Path**: Can upgrade to PostgreSQL when scaling needs increase
- **Backup Strategy**: Daily automated backups + manual export capabilities

### Cost Breakdown
```
Monthly Costs:
├── Vercel: Free (sufficient for small business)
├── Railway: $5/month (backend + database)
├── Domain (optional): $1-2/month
└── Total: ~$5-7/month
```

### Why This Tech Stack

#### For Non-Technical Users:
- **Zero maintenance** database (SQLite)
- **Automatic deployments** (push code = live updates)
- **Built-in backups** and reliability
- **One-click updates** through GitHub

#### For Developers:
- **TypeScript** catches errors before deployment
- **Prisma** makes database operations safe and intuitive
- **Next.js** provides excellent developer experience
- **Vercel + Railway** handle all infrastructure complexity

#### For Mobile-First Design:
- **Next.js PWA** capabilities for app-like mobile experience
- **Tailwind CSS** mobile-first responsive design
- **Offline functionality** built into the framework
- **Fast loading** with server-side rendering

### Device-Specific Optimizations

#### Mobile (320px - 768px)
- Single-column layouts
- Large touch targets (44px minimum)
- Step-by-step wizards for complex tasks
- Swipe gestures support
- Bottom navigation for easy thumb access

#### Tablet (768px - 1024px)
- Two-column layouts where appropriate
- Larger data tables
- Side navigation available
- Touch and keyboard support

#### Laptop/Desktop (1024px+)
- Multi-column dashboard layouts
- Full data tables with sorting/filtering
- Keyboard shortcuts support
- Hover states and right-click context menus
- Side-by-side detail views
- Bulk operations interface

### Smart Features for Non-Tech Users

#### 1. Auto-Complete & Suggestions
- Serial number pattern recognition
- Recently accessed items quick access
- Smart search (partial matches)

#### 2. Visual Indicators
```
Price Change Indicators:
🔴 Significant increase (>10%)
🟡 Moderate increase (5-10%)
🟢 Decrease (any amount)
⚪ No recent changes
```

#### 3. Quick Actions Dashboard
```
Common Tasks (Large Buttons):
┌─────────────────────────────────────┐
│  🔍 Find Item Price                 │
│  ➕ Add New Item                    │
│  📝 Update Prices                   │
│  📊 Recent Changes                  │
└─────────────────────────────────────┘
```

## API Design (Express.js with Prisma)

### RESTful Endpoints
```
Authentication (Future):
POST /api/auth/login
POST /api/auth/logout

Items Management:
GET    /api/items/serial/:serialNumber     # Get item by serial
GET    /api/items                          # Get all items (paginated)
POST   /api/items                          # Create new item
PUT    /api/items/serial/:serialNumber     # Update item details
DELETE /api/items/serial/:serialNumber     # Delete item

Price Management:
GET    /api/items/serial/:serialNumber/history  # Get price history
POST   /api/items/serial/:serialNumber/price    # Update price (creates history)

Search & Filter:
GET    /api/search?q=:query               # Search by serial number
GET    /api/search/recent-changes         # Recent price updates
GET    /api/items/category/:category      # Filter by category

Analytics:
GET    /api/analytics/summary             # Dashboard statistics
GET    /api/analytics/price-trends        # Price trend analysis

Data Management:
GET    /api/export/items                  # Export all items to CSV
POST   /api/import/items                  # Bulk import items
```

### Prisma Schema Example
```prisma
// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./price_tracker.db"
}

model Item {
  id           String   @id @default(cuid())
  serialNumber String   @unique @map("serial_number")
  itemName     String?  @map("item_name")
  category     String?
  description  String?
  currentPrice Decimal  @map("current_price")
  imageUrl     String?  @map("image_url")
  createdAt    DateTime @default(now()) @map("created_date")
  updatedAt    DateTime @updatedAt @map("last_updated")
  
  priceHistory PriceHistory[]

  @@map("items")
}

model PriceHistory {
  id           String   @id @default(cuid())
  itemId       String   @map("item_id")
  serialNumber String   @map("serial_number")
  oldPrice     Decimal  @map("old_price")
  newPrice     Decimal  @map("new_price")
  notes        String?
  createdAt    DateTime @default(now()) @map("price_change_date")
  
  item Item @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@map("price_history")
}
```

## Deployment Process

### Initial Setup (One-time)
```bash
1. Create GitHub Repository
   - Push your code to GitHub
   - Set up main branch

2. Deploy Frontend (Vercel)
   - Connect GitHub repository to Vercel
   - Configure build settings (Next.js preset)
   - Add environment variables
   - Deploy automatically

3. Deploy Backend (Railway)
   - Connect GitHub repository to Railway
   - Configure Node.js environment
   - Add environment variables (DATABASE_URL)
   - Deploy with persistent storage

4. Database Setup
   - Prisma migrations run automatically
   - Database file persists on Railway storage
   - Automatic backups configured
```

### Development Workflow
```bash
1. Local Development
   npm run dev              # Start development server
   npx prisma db push       # Update database schema
   npx prisma studio        # Visual database editor

2. Deploy Changes
   git add .
   git commit -m "Add new feature"
   git push origin main     # Triggers automatic deployments

3. Database Migrations
   npx prisma migrate dev   # Create migration locally
   git push                 # Migrations run automatically on deploy
```

### Environment Variables
```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-backend.railway.app

# Backend (.env)
DATABASE_URL=file:./price_tracker.db
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## User Experience Enhancements

### 1. Onboarding for Non-Tech Users
- Interactive tutorial on first use
- Sample data to explore
- Clear explanations with icons

### 2. Error Prevention
- Validation with friendly messages
- Confirmation for important actions
- Undo functionality for price updates

### 3. Accessibility Features
- Large text option
- High contrast mode
- Voice input for serial numbers (if supported)
- Simple language throughout

### 4. Offline Capabilities
- View existing items offline
- Cache recent searches
- Sync when connection returns

## Cross-Device Experience

### Mobile Experience (Primary Target)
- **Focus**: Quick price lookups and simple updates
- **Navigation**: Bottom tab bar, large touch targets
- **Input**: Touch-optimized keyboards, minimal typing
- **Layout**: Single-column, step-by-step workflows

### Laptop Experience (Enhanced Productivity)
- **Focus**: Bulk operations, detailed analysis, reporting
- **Navigation**: Side navigation, keyboard shortcuts
- **Input**: Full keyboard support, rapid data entry
- **Layout**: Multi-column dashboards, data tables, charts

### Key Features by Device

| Feature | Mobile | Laptop |
|---------|--------|--------|
| Quick price lookup | ✅ Primary | ✅ Enhanced with tables |
| Add single item | ✅ Step-by-step | ✅ Single form |
| Update prices | ✅ One at a time | ✅ Bulk updates available |
| View price history | ✅ Simple list | ✅ Charts and detailed tables |
| Search items | ✅ Serial number focus | ✅ Advanced filters |
| Reports | ✅ Basic summaries | ✅ Detailed analytics |
| Data export | ✅ Basic CSV | ✅ Multiple formats |
| Offline access | ✅ Full support | ✅ Full support |

### Responsive Design Principles
- **Content Priority**: Most important features work perfectly on mobile
- **Progressive Enhancement**: Laptop version adds productivity features
- **Consistent Experience**: Same core functionality across all devices
- **Adaptive UI**: Interface adapts to screen size and input method
- **Performance**: Fast loading and smooth interactions on all devices

## Implementation Phases

### Phase 1: MVP (2-3 weeks)
```
Backend Setup:
├── Express.js server with basic routes
├── Prisma + SQLite database setup
├── Item CRUD operations with serial number focus
├── Price update with automatic history logging
├── Basic search by serial number
└── Deploy to Railway with persistent storage

Frontend Setup:
├── Next.js 14 with TypeScript
├── Tailwind CSS + shadcn/ui components
├── Mobile-first responsive design
├── Basic PWA capabilities
├── Core pages: Home, Search, Add Item, Item Details
└── Deploy to Vercel

Key Features:
├── Add items with serial number + price
├── Search items by serial number
├── Update item prices (with history)
├── View price history timeline
└── Mobile-optimized interface
```

### Phase 2: Enhanced Features (1-2 weeks)
```
Advanced UI:
├── Laptop-optimized layouts
├── Data tables with sorting/filtering
├── Bulk operations interface
├── Enhanced search with categories
└── Price trend visualizations

Additional Features:
├── CSV import/export functionality
├── Advanced price analytics
├── Recent changes dashboard
├── Offline functionality improvements
└── Better error handling and validation
```

### Phase 3: Advanced Features (1-2 weeks)
```
Business Intelligence:
├── Price trend analysis and forecasting
├── Automated price change alerts
├── Advanced reporting dashboard
├── Category-based analytics
└── Data visualization charts

Technical Enhancements:
├── Full PWA installation
├── Advanced offline sync
├── Automated backup systems
├── Performance optimizations
└── Enhanced security features
```

## Project Structure

```
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
│   └── systemDesign.md         # This file
│
└── README.md                   # Project overview
```

## Simplified User Workflows

### Primary User Journey: "Find Item Price"
1. **Tap search box** → Keyboard appears
2. **Type/scan serial number** → Instant results
3. **Tap item** → See current price immediately
4. **Optional: View history** → Simple timeline

### Secondary Journey: "Update Price"
1. **Find item** (as above)
2. **Tap "Update Price"** → Simple form
3. **Enter new price** → Large number input
4. **Tap Save** → Confirmation message

### Tertiary Journey: "Add New Item"
1. **Tap "Add Item"** → Step-by-step wizard
2. **Enter serial number** → Validation check
3. **Enter price** → Number keypad
4. **Confirm and save** → Success message

## Data Validation Rules
- Serial numbers must be unique
- Serial numbers are required for all items
- Prices must be positive numbers
- Required fields: serial_number, current_price
- Price history automatically timestamped

## Security Considerations
- Input validation for all price entries
- Backup strategy for data protection
- Simple authentication to prevent unauthorized access
- Data export capabilities for business continuity

## Success Metrics
- User can find any item price within 3 taps
- Adding new items takes less than 30 seconds
- System works seamlessly on mobile devices
- Non-technical user can operate without training after brief tutorial