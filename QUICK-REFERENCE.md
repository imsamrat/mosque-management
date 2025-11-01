# 🎯 Quick Reference Card

## 🚀 Quick Start Commands

```powershell
# First Time Setup
npm install                    # Install dependencies
npx prisma generate           # Generate Prisma Client
npx prisma db push           # Setup database
npm run dev                   # Start development server

# Daily Development
npm run dev                   # Start dev server (port 3000)
npx prisma studio            # Open database GUI
npx prisma db push           # Update database schema

# Production Build
npm run build                # Build for production
npm run start                # Start production server

# Database Management
npx prisma generate          # Regenerate Prisma Client
npx prisma migrate dev       # Create and apply migration
npx prisma db push          # Push schema without migration
npx prisma studio           # Open Prisma Studio GUI
```

---

## 📁 File Locations

| What              | Where                               |
| ----------------- | ----------------------------------- |
| Homepage          | `src/app/page.tsx`                  |
| Donors Page       | `src/app/donors/page.tsx`           |
| Members Page      | `src/app/members/page.tsx`          |
| Distribution Page | `src/app/distribution/page.tsx`     |
| Slideshow Page    | `src/app/slideshow/page.tsx`        |
| Donors API        | `src/app/api/donors/route.ts`       |
| Members API       | `src/app/api/members/route.ts`      |
| Distribution API  | `src/app/api/distribution/route.ts` |
| Database Schema   | `prisma/schema.prisma`              |
| Environment       | `.env`                              |
| Styles            | `src/app/globals.css`               |

---

## 🔌 API Endpoints

### Donors

```
GET    /api/donors              - List all donors
POST   /api/donors              - Create donor
DELETE /api/donors?id={id}      - Delete donor
```

### Members

```
GET    /api/members?page=1&limit=10&search=name  - List members
POST   /api/members              - Create member
PATCH  /api/members              - Update status
DELETE /api/members?id={id}      - Delete member
```

### Distribution

```
GET    /api/distribution         - Get summary
POST   /api/distribution         - Calculate shares
```

---

## 🗄️ Database Models

### Donor

```typescript
{
  id: string
  name: string
  phone?: string
  beef: number      // grams
  lungs: number     // grams
  bone: number      // grams
  createdAt: Date
}
```

### Member

```typescript
{
  id: string;
  name: string;
  fatherName: string;
  houseName: string;
  familyMembers: number;
  beefShare: number; // grams (calculated)
  lungsShare: number; // grams (calculated)
  boneShare: number; // grams (calculated)
  status: "PENDING" | "COMPLETED";
  createdAt: Date;
}
```

---

## 🎨 UI Components

```typescript
// Button
import { Button } from "@/components/ui/button";
<Button variant="default">Click</Button>;
// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon

// Card
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Input
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Dialog
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";

// Table
import { Table, TableHeader, TableBody, TableRow } from "@/components/ui/table";

// Toast
import { useToast } from "@/components/ui/use-toast";
const { toast } = useToast();
toast({ title: "Success", description: "Done!" });
```

---

## 🛠️ Common Tasks

### Add New Page

```typescript
// Create: src/app/your-page/page.tsx
export default function YourPage() {
  return <div>Your content</div>;
}
```

### Add New API Route

```typescript
// Create: src/app/api/your-route/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: "value" });
}
```

### Add Database Model

```prisma
// Edit: prisma/schema.prisma
model YourModel {
  id   String @id @default(cuid())
  name String
}

// Then run:
npx prisma db push
```

### Fetch Data in Component

```typescript
"use client";
import { useEffect, useState } from "react";

export default function MyComponent() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/your-endpoint")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <div>{/* Use data */}</div>;
}
```

---

## 🎯 Distribution Formula

```
Per Person Share = Total Collected ÷ Total Members

Example:
Total Beef:     150,000 gm
Total Members:  500
Each gets:      150,000 ÷ 500 = 300 gm
```

---

## 🔄 Typical Workflow

### 1. Before Qurbani Day

```
1. Add all expected donors
2. Add all village members
3. Test the system
```

### 2. On Qurbani Day

```
1. Update donor quantities as meat arrives
2. Click "Calculate Distribution"
3. Print or display member list
4. Use Slideshow during distribution
```

### 3. During Distribution

```
1. Open Slideshow page
2. Call member name
3. Show their allocation
4. Distribute meat
5. Mark as "Completed" in Members page
```

### 4. After Distribution

```
1. Verify all marked as Completed
2. Generate final report
3. Backup database
```

---

## 🐛 Troubleshooting

| Problem           | Solution                                           |
| ----------------- | -------------------------------------------------- |
| Port 3000 in use  | Kill process or use: `$env:PORT=3001; npm run dev` |
| Database error    | Check `.env` file, verify `DATABASE_URL`           |
| Prisma error      | Run `npx prisma generate`                          |
| Build errors      | Run `npm install` and restart VS Code              |
| Page not updating | Hard refresh: Ctrl+Shift+R                         |
| TypeScript errors | Restart TypeScript server in VS Code               |

---

## ⌨️ Keyboard Shortcuts

### Slideshow Page

- `←` Left Arrow - Previous member
- `→` Right Arrow - Next member

### VS Code

- `Ctrl+P` - Quick file open
- `Ctrl+Shift+P` - Command palette
- `F5` - Start debugging
- `Ctrl+` ` - Toggle terminal

---

## 🔗 Important URLs

| What          | URL                                |
| ------------- | ---------------------------------- |
| Local Dev     | http://localhost:3000              |
| Homepage      | http://localhost:3000              |
| Donors        | http://localhost:3000/donors       |
| Members       | http://localhost:3000/members      |
| Distribution  | http://localhost:3000/distribution |
| Slideshow     | http://localhost:3000/slideshow    |
| Prisma Studio | http://localhost:5555              |

---

## 📦 Environment Variables

```env
# Required
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Optional (for future features)
# NEXTAUTH_SECRET="your-secret"
# NEXTAUTH_URL="http://localhost:3000"
```

---

## 📞 Need Help?

1. Check `README.md` for overview
2. Check `SETUP.md` for setup instructions
3. Check `DEPLOYMENT.md` for deployment
4. Check `PROJECT-STRUCTURE.md` for file locations
5. Check `FEATURES.md` for feature list
6. Open an issue on GitHub

---

## 💡 Pro Tips

- All measurements in **grams (gm)** for precision
- Calculate distribution **after** adding all donors
- Use **Slideshow** on projector during distribution
- Mark members as **Completed** immediately
- **Backup database** regularly
- Test on mobile before deployment

---

## 🎨 Color Codes (for customization)

```css
Green (Primary):     #16a34a
Blue (Secondary):    #3b82f6
Red (Destructive):   #ef4444
Gray (Neutral):      #6b7280
```

---

**Quick Reference v1.0** | Last Updated: November 1, 2025
