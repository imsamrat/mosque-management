# Qurbani Management System - Setup Guide

## Quick Start (Windows PowerShell)

### 1️⃣ Install Dependencies

```powershell
npm install
```

### 2️⃣ Setup Database

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your computer
2. Create a database named `qurbani_db`
3. Create `.env` file:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/qurbani_db?schema=public"
```

#### Option B: Supabase (Recommended - Free Cloud Database)

1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to Settings > Database
4. Copy the "Connection string" (URI mode)
5. Create `.env` file and paste:

```env
DATABASE_URL="your_supabase_connection_string"
```

### 3️⃣ Initialize Database

```powershell
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push
```

### 4️⃣ Run Development Server

```powershell
npm run dev
```

### 5️⃣ Open Application

Open your browser and go to: http://localhost:3000

## 📋 Step-by-Step Usage

### Step 1: Add Donors

1. Click "Donors" on homepage
2. Click "Add Donor" button
3. Enter:
   - Name
   - Phone (optional)
   - Beef amount in grams (gm)
   - Lungs amount in grams (gm)
   - Bone amount in grams (gm)
4. Click "Add Donor"

### Step 2: Add Members

1. Click "Members" on homepage
2. Click "Add Member" button
3. Enter:
   - Member Name
   - Father's Name
   - House Name
   - Family Members count
4. Click "Add Member"

### Step 3: Calculate Distribution

1. Click "Distribution" on homepage
2. Review total collection
3. Click "Calculate Distribution" button
4. Shares will be automatically calculated for all members

### Step 4: View Shares

1. Go to "Members" page
2. See individual shares for each member
3. Click status button to mark as "Completed" when distributed

### Step 5: Use Slideshow (During Distribution)

1. Click "Slideshow" on homepage
2. Use "Next" and "Previous" buttons to navigate
3. Or use keyboard arrow keys (← →)
4. Display on projector/TV during actual distribution

## 🔧 Troubleshooting

### Error: "Cannot find module '@prisma/client'"

**Solution:**

```powershell
npx prisma generate
npm install
```

### Error: "Database connection failed"

**Solution:**

- Check your `.env` file exists
- Verify `DATABASE_URL` is correct
- Test database connection:

```powershell
npx prisma db push
```

### Error: TypeScript errors in VS Code

**Solution:**

```powershell
npm install
```

Then restart VS Code

### Port 3000 already in use

**Solution:**

```powershell
# Run on different port
$env:PORT=3001; npm run dev
```

## 🌐 Deployment to Vercel

### Step 1: Prepare GitHub Repository

```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Add Environment Variable:
   - Name: `DATABASE_URL`
   - Value: Your database connection string
5. Click "Deploy"

## 📊 Sample Data for Testing

### Sample Donors

```
Donor 1: Name: Ahmed Khan, Beef: 50000 gm, Lungs: 10000 gm, Bone: 5000 gm
Donor 2: Name: Ali Hassan, Beef: 45000 gm, Lungs: 9000 gm, Bone: 4500 gm
Donor 3: Name: Yusuf Ibrahim, Beef: 55000 gm, Lungs: 11000 gm, Bone: 5500 gm
```

### Sample Members

```
Member 1: Name: Mohammad Ali, Father: Rashid Ali, House: East Villa, Family: 5
Member 2: Name: Fatima Ahmed, Father: Ahmed Khan, House: Green House, Family: 4
Member 3: Name: Omar Farooq, Father: Farooq Ahmad, House: North Block, Family: 6
```

## 📱 Using the System

### For Administrators:

1. Add all donors before Qurbani day
2. Add all village members
3. After collecting all donations, click "Calculate Distribution"
4. Print member list or use slideshow during distribution
5. Mark members as "Completed" as you distribute

### For Distribution Day:

1. Open Slideshow page on projector/TV
2. Call member name
3. Show their allocation on screen
4. Distribute the meat
5. Mark as completed in Members page

## 🎯 Conversion Guide

### Weight Conversions

- 1 kg = 1000 gm
- 100 kg = 100,000 gm
- 0.1 kg = 100 gm

### Example Calculation

- Total Beef: 150,000 gm (150 kg)
- Total Members: 500
- Each gets: 150,000 ÷ 500 = 300 gm (0.3 kg)

## ⚙️ Advanced Configuration

### Change Pagination Limit

Edit `src/app/members/page.tsx`:

```typescript
const [pagination, setPagination] = useState({
  page: 1,
  limit: 20, // Change this number
  ...
})
```

### Enable Auto-Slideshow

Add this to `src/app/slideshow/page.tsx`:

```typescript
useEffect(() => {
  const interval = setInterval(handleNext, 5000); // 5 seconds
  return () => clearInterval(interval);
}, [currentIndex]);
```

## 💡 Tips

- Use gram (gm) for all measurements for precision
- Add all donors before calculating distribution
- Backup your database regularly
- Use Slideshow mode on a large screen during distribution
- Mark members as completed immediately after distribution

## 🆘 Need Help?

1. Check the console for errors (F12 in browser)
2. Verify database connection
3. Ensure all npm packages are installed
4. Check that Prisma is generated (`npx prisma generate`)

---

**Happy Qurbani Distribution! 🐄**
