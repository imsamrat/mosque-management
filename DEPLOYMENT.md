# 🚀 Deployment Guide

## Deploying to Vercel + Supabase (Recommended)

This guide will help you deploy your Qurbani Management System to production for FREE.

### Prerequisites

- GitHub account
- Vercel account (free)
- Supabase account (free)

---

## Step 1: Setup Supabase Database

### 1.1 Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub

### 1.2 Create New Project

1. Click "New Project"
2. Choose organization (or create new)
3. Enter project details:
   - **Name**: qurbani-management
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to your location
4. Click "Create new project"
5. Wait 2-3 minutes for setup

### 1.3 Get Database Connection String

1. Go to Project Settings (gear icon)
2. Click "Database" in sidebar
3. Scroll to "Connection string"
4. Select "URI" tab
5. Copy the connection string
6. Replace `[YOUR-PASSWORD]` with your actual password
7. Save this string securely!

Example:

```
postgresql://postgres.xxxxxxxxxxxxx:yourpassword@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

---

## Step 2: Push Code to GitHub

### 2.1 Initialize Git Repository

```powershell
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Qurbani Management System"
```

### 2.2 Create GitHub Repository

1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `qurbani-management-system`
4. Choose "Public" or "Private"
5. Click "Create repository"

### 2.3 Push to GitHub

```powershell
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/qurbani-management-system.git

# Push
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### 3.1 Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub

### 3.2 Import Project

1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Click "Import"

### 3.3 Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: ./
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: .next (default)

### 3.4 Add Environment Variables

1. Click "Environment Variables"
2. Add variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string
3. Click "Add"

### 3.5 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app is now live! 🎉

---

## Step 4: Initialize Database

### 4.1 Open Vercel Deployment

1. Click on your deployment URL
2. You'll see your app (but database isn't set up yet)

### 4.2 Run Prisma Migration

Option A - Using Vercel CLI:

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migration
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

Option B - Using Supabase SQL Editor:

1. Go to your Supabase project
2. Click "SQL Editor"
3. Run this SQL:

```sql
-- Create Donor table
CREATE TABLE "donors" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "beef" DOUBLE PRECISION DEFAULT 0,
  "lungs" DOUBLE PRECISION DEFAULT 0,
  "bone" DOUBLE PRECISION DEFAULT 0,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create Member table
CREATE TABLE "members" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "fatherName" TEXT NOT NULL,
  "houseName" TEXT NOT NULL,
  "familyMembers" INTEGER DEFAULT 1,
  "beefShare" DOUBLE PRECISION DEFAULT 0,
  "lungsShare" DOUBLE PRECISION DEFAULT 0,
  "boneShare" DOUBLE PRECISION DEFAULT 0,
  "status" TEXT DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create SlideShow table
CREATE TABLE "slideshows" (
  "id" TEXT PRIMARY KEY,
  "memberId" TEXT NOT NULL,
  "pageNumber" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("memberId") REFERENCES "members"("id") ON DELETE CASCADE
);
```

---

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Try adding a donor
3. Try adding a member
4. Test distribution calculation
5. Check slideshow

---

## 🔄 Updating Your Deployment

Whenever you make changes:

```powershell
# Save changes
git add .
git commit -m "Your update message"
git push

# Vercel will automatically redeploy!
```

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain in Vercel:

1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS instructions

---

## 📊 Monitoring

### Vercel Dashboard:

- View deployment logs
- Monitor performance
- See error reports

### Supabase Dashboard:

- View database tables
- Run SQL queries
- Monitor database usage

---

## 🔒 Security Best Practices

1. **Never commit `.env` file**
   - Already in `.gitignore`
2. **Use strong database password**
   - Minimum 16 characters
3. **Enable Row Level Security (RLS) in Supabase**

   ```sql
   ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
   ALTER TABLE members ENABLE ROW LEVEL SECURITY;
   ```

4. **Add Authentication (Optional)**
   - Use NextAuth.js or Clerk

---

## 💰 Cost Estimation

### Free Tier (Recommended for Small Villages):

- **Vercel**: Free (Hobby plan)
  - Unlimited deployments
  - 100 GB bandwidth/month
  - Automatic HTTPS
- **Supabase**: Free
  - 500 MB database
  - 1 GB bandwidth/month
  - 50,000 monthly active users

### If You Outgrow Free Tier:

- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month

---

## 🆘 Troubleshooting Deployment

### Issue: Build Failed

**Solution:**

```powershell
# Test build locally first
npm run build
```

### Issue: Database Connection Error

**Solutions:**

1. Verify `DATABASE_URL` in Vercel environment variables
2. Check Supabase project is active
3. Verify password in connection string
4. Check database region accessibility

### Issue: API Routes Not Working

**Solution:**

1. Check Vercel function logs
2. Verify Prisma is generated:

```json
// In package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

### Issue: Prisma Client Not Found

**Solution:**
Add build command in `package.json`:

```json
"scripts": {
  "build": "prisma generate && next build"
}
```

---

## 📱 Progressive Web App (PWA) - Optional

Make your app installable on mobile:

1. Create `public/manifest.json`:

```json
{
  "name": "Qurbani Management System",
  "short_name": "Qurbani",
  "description": "Manage Qurbani meat distribution",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#16a34a",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

2. Install `next-pwa` package
3. Configure in `next.config.js`

---

## ✅ Post-Deployment Checklist

- [ ] App loads successfully
- [ ] Can add donors
- [ ] Can add members
- [ ] Distribution calculation works
- [ ] Slideshow displays correctly
- [ ] Mobile responsive
- [ ] Custom domain configured (if applicable)
- [ ] Backup database regularly
- [ ] Monitor Vercel analytics

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check Supabase logs
3. Test locally with same `DATABASE_URL`
4. Open GitHub issue

---

**Your Qurbani Management System is now live! 🎉**

Share your deployment URL with mosque administrators!
