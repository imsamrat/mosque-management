# Remaining Implementation Tasks

## ✅ Completed:

1. **Members Page** - DONE ✅

   - Added housePriority field to form
   - Added translations (English/Bengali)
   - Added dark mode styling
   - Added SettingsMenu
   - Updated API to support housePriority

2. **Database** - DONE ✅
   - Added housePriority field to schema
   - Migrated database
   - Regenerated Prisma Client

## 🔧 Remaining Tasks:

### 1. **Recreate Slideshow Page** (CRITICAL)

File: `src/app/slideshow/page.tsx`

- Import useApp and SettingsMenu
- Sort members by housePriority then name
- Compact 2-column layout (no scrolling)
- Show priority badge if < 999
- Add translations
- Add dark mode
- Navigation with arrow keys

### 2. **Update Donors Page**

File: `src/app/donors/page.tsx`

- Import useApp and SettingsMenu
- Add translations to all text
- Add dark mode classes
- Add SettingsMenu at top

### 3. **Update Distribution Page**

File: `src/app/distribution/page.tsx`

- Import useApp and SettingsMenu
- Add translations to all text
- Add dark mode classes
- Add SettingsMenu at top

## 📝 Translation Keys Needed:

All keys are already defined in AppContext.tsx!

## Quick Implementation Guide:

### For Each Page:

```typescript
// 1. Add imports
import { useApp } from "@/contexts/AppContext";
import { SettingsMenu } from "@/components/SettingsMenu";

// 2. Use hook
const { t } = useApp();

// 3. Add Settings at top
<SettingsMenu />;

// 4. Replace text with t("key")
// 5. Add dark mode classes:
dark: bg - gray - 800; // for cards
dark: text - white; // for headings
dark: text - gray - 300; // for text
dark: border - gray - 700; // for borders
```

### Slideshow Structure:

```typescript
- Sort: members.sort((a, b) => a.housePriority !== b.housePriority ? a.housePriority - b.housePriority : a.name.localeCompare(b.name))
- Layout: 2-column grid (member info left, shares right)
- Priority badge: {member.housePriority < 999 && <Badge>{t("housePriority")}: {member.housePriority}</Badge>}
- Compact shares: 3-column grid
```

## Current Status:

- Members page: 100% complete with all features
- Slideshow: Needs recreation
- Donors: Needs translations + dark mode
- Distribution: Needs translations + dark mode

All infrastructure is in place! Just need to apply the patterns.
