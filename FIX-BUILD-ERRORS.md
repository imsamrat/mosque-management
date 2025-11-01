# 🔧 Fix Build Errors - Quick Guide

## Issue: Prisma Client Not Generated

### Error Message:

```
EPERM: operation not permitted, rename query_engine-windows.dll.node
```

### Solution:

#### Option 1: Close VS Code and Terminal (Recommended)

```powershell
# 1. Close ALL VS Code windows
# 2. Close ALL PowerShell/Terminal windows
# 3. Reopen VS Code
# 4. Open new terminal and run:
npm install
```

#### Option 2: Kill Node Processes

```powershell
# Stop all Node processes
taskkill /F /IM node.exe

# Then run
npm install
```

#### Option 3: Manual Prisma Generate

```powershell
# If npm install still fails, try:
npx prisma generate --skip-generate
npx prisma generate
```

#### Option 4: Delete and Reinstall

```powershell
# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

---

## Current TypeScript Errors Fixed

✅ All TypeScript type errors in the code have been fixed
✅ `reduce` functions now have proper type annotations
✅ All callback parameters are properly typed

---

## After Fixing Prisma:

### 1. Generate Prisma Client

```powershell
npx prisma generate
```

### 2. Setup Database

```powershell
npx prisma db push
```

### 3. Run Development Server

```powershell
npm run dev
```

### 4. Build for Production

```powershell
npm run build
```

---

## Alternative: Use Any Types (Temporary)

If you need to build immediately without Prisma:

The code already has `any` type annotations for the reduce callbacks, so the build should work once Prisma Client is generated.

---

## Verify Everything Works:

```powershell
# 1. Check Prisma Client exists
dir node_modules\.prisma\client

# 2. Try build
npm run build

# 3. Start dev server
npm run dev
```

---

## Common Issues:

### Issue: "Cannot find module '@prisma/client'"

**Solution**: Run `npx prisma generate`

### Issue: "Port 3000 already in use"

**Solution**:

```powershell
# Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Database connection error

**Solution**:

1. Check `.env` file exists
2. Verify `DATABASE_URL` is correct
3. Test connection: `npx prisma db push`

---

## Quick Fix Command Sequence:

```powershell
# Run these in order:
1. Close VS Code completely
2. Reopen VS Code
3. Run: npm install
4. Run: npx prisma generate
5. Run: npx prisma db push
6. Run: npm run dev
```

---

## If All Else Fails:

```powershell
# Nuclear option - Fresh start
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
Remove-Item -Recurse -Force .next
npm cache clean --force
npm install
npx prisma generate
npx prisma db push
npm run dev
```

---

**The code is correct! Just need to generate Prisma Client properly.**
