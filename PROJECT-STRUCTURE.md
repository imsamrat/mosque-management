# 📂 Project Structure Guide

## Directory Overview

```
d:\mosque-management/
├── 📁 prisma/                    # Database schema and migrations
│   └── schema.prisma             # Prisma schema definition
│
├── 📁 public/                    # Static assets (if any)
│
├── 📁 src/                       # Source code
│   ├── 📁 app/                   # Next.js 14 App Router
│   │   ├── 📁 api/               # API routes
│   │   │   ├── 📁 donors/        # Donor endpoints
│   │   │   ├── 📁 members/       # Member endpoints
│   │   │   └── 📁 distribution/  # Distribution endpoints
│   │   ├── 📁 donors/            # Donors page
│   │   ├── 📁 members/           # Members page
│   │   ├── 📁 distribution/      # Distribution page
│   │   ├── 📁 slideshow/         # Slideshow page
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   └── globals.css           # Global styles
│   │
│   ├── 📁 components/            # Reusable components
│   │   ├── 📁 ui/                # shadcn/ui components
│   │   ├── navigation.tsx        # Navigation component
│   │   └── ...
│   │
│   └── 📁 lib/                   # Utilities and helpers
│       ├── prisma.ts             # Prisma client
│       ├── utils.ts              # Utility functions
│       └── helpers.ts            # Helper functions
│
├── 📄 .env                       # Environment variables (DO NOT COMMIT)
├── 📄 .env.example               # Environment template
├── 📄 .gitignore                 # Git ignore rules
├── 📄 next.config.js             # Next.js configuration
├── 📄 package.json               # Dependencies
├── 📄 postcss.config.js          # PostCSS config
├── 📄 tailwind.config.ts         # Tailwind configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 setup.ps1                  # Setup script
├── 📄 README.md                  # Main documentation
├── 📄 SETUP.md                   # Setup instructions
├── 📄 DEPLOYMENT.md              # Deployment guide
└── 📄 FEATURES.md                # Features list
```

---

## 📁 Detailed Structure

### `/prisma`

Database schema and configuration.

**Files:**

- `schema.prisma` - Database models (Donor, Member, SlideShow)

**Purpose:**

- Define database structure
- Generate Prisma Client
- Handle migrations

---

### `/src/app`

Next.js 14 App Router - All pages and routes.

#### `/src/app/api`

Backend API endpoints for CRUD operations.

**Structure:**

```
api/
├── donors/
│   └── route.ts        # GET, POST, DELETE donors
├── members/
│   └── route.ts        # GET, POST, PATCH, DELETE members
└── distribution/
    └── route.ts        # GET summary, POST calculate
```

**Each route.ts contains:**

- `GET` - Fetch data
- `POST` - Create new record
- `PATCH` - Update existing record
- `DELETE` - Remove record

#### `/src/app/donors`

Donor management page.

**Files:**

- `page.tsx` - Main donors page component

**Features:**

- Add new donors
- View all donors
- Delete donors
- Display totals

#### `/src/app/members`

Member management page.

**Files:**

- `page.tsx` - Main members page component

**Features:**

- Add new members
- View members with pagination
- Search/filter members
- Toggle status
- Delete members

#### `/src/app/distribution`

Distribution management dashboard.

**Files:**

- `page.tsx` - Distribution page component

**Features:**

- View statistics
- Calculate distribution
- Display totals
- Show per-person shares

#### `/src/app/slideshow`

Slideshow presentation mode.

**Files:**

- `page.tsx` - Slideshow component

**Features:**

- Full-screen presentation
- Member card display
- Navigation (buttons + keyboard)
- Animations

#### Root Files

- `layout.tsx` - Root layout wrapper (fonts, metadata, providers)
- `page.tsx` - Homepage with navigation cards
- `globals.css` - Global CSS styles and Tailwind directives

---

### `/src/components`

Reusable React components.

#### `/src/components/ui`

shadcn/ui component library.

**Components:**

- `button.tsx` - Button component with variants
- `card.tsx` - Card container components
- `dialog.tsx` - Modal dialog
- `input.tsx` - Form input
- `label.tsx` - Form label
- `table.tsx` - Data table
- `toast.tsx` - Toast notifications
- `toaster.tsx` - Toast provider
- `use-toast.ts` - Toast hook

**Usage:**

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

#### Other Components

- `navigation.tsx` - Main navigation menu

---

### `/src/lib`

Utility functions and configurations.

**Files:**

#### `prisma.ts`

Prisma Client singleton instance.

```typescript
import { prisma } from "@/lib/prisma";
// Use prisma to query database
```

#### `utils.ts`

Utility function for className merging.

```typescript
import { cn } from "@/lib/utils";
```

#### `helpers.ts`

Helper functions for common operations:

- Weight conversions (kg ↔ grams)
- Date formatting
- Validation
- Statistics calculation
- CSV export

---

## 🔧 Configuration Files

### `package.json`

Project dependencies and scripts.

**Key Scripts:**

```json
"dev": "next dev",           // Start dev server
"build": "next build",       // Build for production
"start": "next start",       // Start production server
"postinstall": "prisma generate"  // Auto-generate Prisma Client
```

### `tsconfig.json`

TypeScript configuration.

**Key Settings:**

- Path aliases: `@/*` → `./src/*`
- Strict mode enabled
- Next.js plugin included

### `tailwind.config.ts`

TailwindCSS configuration.

**Features:**

- Custom color scheme (green theme)
- Custom animations
- Component variants
- Dark mode support

### `next.config.js`

Next.js configuration.

**Settings:**

- React strict mode
- Image optimization
- Environment variables

### `postcss.config.js`

PostCSS configuration for Tailwind.

### `.env.example`

Environment variables template.

**Required Variables:**

```env
DATABASE_URL="postgresql://..."
```

---

## 🗄️ Database Models

### Donor Model

```prisma
model Donor {
  id        String   @id @default(cuid())
  name      String
  phone     String?
  beef      Float    @default(0)
  lungs     Float    @default(0)
  bone      Float    @default(0)
  createdAt DateTime @default(now())
}
```

### Member Model

```prisma
model Member {
  id            String   @id @default(cuid())
  name          String
  fatherName    String
  houseName     String
  familyMembers Int      @default(1)
  beefShare     Float    @default(0)
  lungsShare    Float    @default(0)
  boneShare     Float    @default(0)
  status        Status   @default(PENDING)
  createdAt     DateTime @default(now())
}
```

### SlideShow Model

```prisma
model SlideShow {
  id         String   @id @default(cuid())
  memberId   String
  member     Member   @relation(fields: [memberId], references: [id])
  pageNumber Int
  createdAt  DateTime @default(now())
}
```

---

## 🎨 Styling System

### Color Palette

```css
--primary: 142.1 76.2% 36.3%      /* Green */
--secondary: 210 40% 96.1%        /* Light Gray */
--destructive: 0 84.2% 60.2%      /* Red */
--background: 0 0% 100%           /* White */
```

### Component Variants

**Button Variants:**

- `default` - Primary green
- `destructive` - Red
- `outline` - Border only
- `secondary` - Gray
- `ghost` - Transparent
- `link` - Text link

**Button Sizes:**

- `default` - Medium
- `sm` - Small
- `lg` - Large
- `icon` - Square icon button

---

## 📡 API Routes

### Donors API (`/api/donors`)

**GET** - List all donors

```typescript
Response: Donor[]
```

**POST** - Create donor

```typescript
Body: { name, phone?, beef, lungs, bone }
Response: Donor
```

**DELETE** - Remove donor

```typescript
Query: {
  id;
}
Response: {
  message;
}
```

### Members API (`/api/members`)

**GET** - List members (paginated)

```typescript
Query: { page, limit, search }
Response: { members: Member[], pagination }
```

**POST** - Create member

```typescript
Body: {
  name, fatherName, houseName, familyMembers;
}
Response: Member;
```

**PATCH** - Update status

```typescript
Body: {
  id, status;
}
Response: Member;
```

**DELETE** - Remove member

```typescript
Query: {
  id;
}
Response: {
  message;
}
```

### Distribution API (`/api/distribution`)

**GET** - Distribution summary

```typescript
Response: {
  totals, statistics;
}
```

**POST** - Calculate distribution

```typescript
Response: {
  message, totals, perPerson, totalMembers;
}
```

---

## 🔄 Data Flow

### Adding a Donor

```
User clicks "Add Donor"
  → Form opens (Dialog)
  → User fills form
  → Form submits
  → POST /api/donors
  → Prisma creates record
  → Response returns
  → UI updates
  → Toast notification
```

### Calculating Distribution

```
User clicks "Calculate Distribution"
  → POST /api/distribution
  → Fetch all donors (sum totals)
  → Fetch all members (count)
  → Calculate per-person shares
  → Update all member records
  → Return statistics
  → UI updates
  → Toast notification
```

---

## 🚀 Development Workflow

### 1. Making Changes

```powershell
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Test locally

# Commit
git add .
git commit -m "Add new feature"

# Push
git push origin feature/new-feature
```

### 2. Testing Locally

```powershell
# Start dev server
npm run dev

# Test all features
# Check console for errors
```

### 3. Database Changes

```powershell
# Modify prisma/schema.prisma
# Push changes
npx prisma db push

# Or create migration
npx prisma migrate dev --name your_migration_name
```

### 4. Adding New Components

```powershell
# Create component file
New-Item src/components/MyComponent.tsx

# Import and use
import { MyComponent } from '@/components/MyComponent'
```

---

## 📚 Import Aliases

The project uses TypeScript path aliases:

```typescript
// Instead of: import { prisma } from '../../lib/prisma'
import { prisma } from "@/lib/prisma";

// Instead of: import { Button } from '../../components/ui/button'
import { Button } from "@/components/ui/button";
```

**Alias Mapping:**

- `@/*` → `./src/*`

---

## 🔍 Finding Code

### Need to modify donors page?

→ `src/app/donors/page.tsx`

### Need to add new API endpoint?

→ Create `src/app/api/your-endpoint/route.ts`

### Need to update database schema?

→ `prisma/schema.prisma`

### Need to add new UI component?

→ `src/components/ui/your-component.tsx`

### Need to add utility function?

→ `src/lib/helpers.ts`

---

## 💡 Best Practices

### 1. File Naming

- Pages: `page.tsx`
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- API Routes: `route.ts`

### 2. Import Order

```typescript
// 1. External imports
import { useState } from 'react'
import Link from 'next/link'

// 2. Internal imports
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

// 3. Types
interface MyProps { ... }
```

### 3. Component Structure

```typescript
'use client' // If needed

// Imports
import ...

// Types
interface Props { ... }

// Component
export default function MyComponent({ props }: Props) {
  // State
  const [state, setState] = useState()

  // Effects
  useEffect(() => { ... }, [])

  // Handlers
  const handleClick = () => { ... }

  // Render
  return ( ... )
}
```

---

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

**This structure is designed for scalability and maintainability.**
