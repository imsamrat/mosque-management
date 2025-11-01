# 🐄 Qurbani Management System

A complete Full Stack web application for managing Qurbani (animal sacrifice) meat distribution in villages. Built with Next.js 14, TypeScript, TailwindCSS, Prisma ORM, and PostgreSQL.

## ✨ Features

- **Donor Management**: Track all meat donations (beef, lungs, bone in grams)
- **Member Management**: Register village members with family details
- **Auto Distribution**: Automatically calculate fair shares for all members
- **Status Tracking**: Mark distributions as pending or completed
- **Visual Slideshow**: Display member shares in presentation mode
- **Search & Filter**: Easily find members
- **Pagination**: Handle large datasets efficiently

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### Step 1: Install Dependencies

```powershell
npm install
```

### Step 2: Setup Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/qurbani_db?schema=public"
```

**For Supabase or Railway:**

```env
DATABASE_URL="your_database_connection_string_here"
```

### Step 3: Setup Database

```powershell
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### Step 4: Run Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
qurbani-management-system/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── donors/route.ts       # Donor CRUD operations
│   │   │   ├── members/route.ts      # Member CRUD operations
│   │   │   └── distribution/route.ts # Distribution calculations
│   │   ├── donors/page.tsx           # Donor management page
│   │   ├── members/page.tsx          # Member management page
│   │   ├── distribution/page.tsx     # Distribution dashboard
│   │   ├── slideshow/page.tsx        # Slideshow presentation
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   └── ui/                       # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── table.tsx
│   │       ├── dialog.tsx
│   │       └── ...
│   └── lib/
│       ├── prisma.ts                 # Prisma client instance
│       └── utils.ts                  # Utility functions
├── prisma/
│   └── schema.prisma                 # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🗄️ Database Schema

### Donor Model

```prisma
model Donor {
  id        String   @id @default(cuid())
  name      String
  phone     String?
  beef      Float    @default(0) // in grams
  lungs     Float    @default(0) // in grams
  bone      Float    @default(0) // in grams
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
  beefShare     Float    @default(0) // in grams (auto-calculated)
  lungsShare    Float    @default(0) // in grams (auto-calculated)
  boneShare     Float    @default(0) // in grams (auto-calculated)
  status        Status   @default(PENDING)
  createdAt     DateTime @default(now())
}

enum Status {
  PENDING
  COMPLETED
}
```

## 🔄 How It Works

1. **Add Donors**: Register all donors with their meat contributions (in grams)
2. **Add Members**: Register all village members who will receive distributions
3. **Calculate Distribution**: Click "Calculate Distribution" to divide meat equally
4. **View Shares**: Check individual member shares in the Members page
5. **Track Status**: Mark distributions as completed when handed out
6. **Present**: Use Slideshow page during actual distribution

## 📊 Distribution Formula

```
Per Person Share = Total Donated ÷ Total Members

Example:
- Total Beef: 100,000 gm
- Total Members: 1000
- Each gets: 100,000 ÷ 1000 = 100 gm
```

## 🎨 Pages Overview

### 1. Home Page (`/`)

- Overview of the system
- Quick navigation cards to all sections

### 2. Donors Page (`/donors`)

- Add new donors
- View all donations
- See total collected meat
- Delete donors

### 3. Members Page (`/members`)

- Add new members
- Search and filter members
- View individual shares
- Toggle status (Pending/Completed)
- Pagination support

### 4. Distribution Page (`/distribution`)

- View total collection statistics
- Calculate and distribute shares
- See per-person allocation
- Track completion status

### 5. Slideshow Page (`/slideshow`)

- Full-screen presentation mode
- Navigate with arrow keys or buttons
- Display member information and shares
- Beautiful card-based design

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable: `DATABASE_URL`
5. Deploy!

### Database Options

**Option 1: Supabase (Recommended)**

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings > Database
4. Use as `DATABASE_URL`

**Option 2: Railway**

1. Create account at [railway.app](https://railway.app)
2. Create PostgreSQL service
3. Copy connection string
4. Use as `DATABASE_URL`

**Option 3: Neon**

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Use as `DATABASE_URL`

## 🛠️ Available Scripts

```powershell
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Prisma commands
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Run migrations
npx prisma studio          # Open Prisma Studio
npx prisma db push         # Push schema to database
```

## 🎯 Future Enhancements

- [ ] Export distribution as PDF
- [ ] Export distribution as Excel
- [ ] Multi-village support
- [ ] Admin authentication
- [ ] SMS notifications
- [ ] Print individual vouchers
- [ ] QR code for members
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 📧 Support

For questions or support, please open an issue in the repository.

---

**Made with ❤️ for fair and transparent Qurbani distribution**
