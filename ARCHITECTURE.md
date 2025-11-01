# 📊 System Architecture & Flow Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              React Frontend (Next.js 14)             │   │
│  │  ┌──────────┬──────────┬──────────┬──────────────┐ │   │
│  │  │  Home    │  Donors  │ Members  │ Distribution │ │   │
│  │  └──────────┴──────────┴──────────┴──────────────┘ │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │            Slideshow Presentation               │ │   │
│  │  └─────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS SERVER                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  API Routes                          │   │
│  │  ┌──────────┬──────────┬────────────────────────┐  │   │
│  │  │ /donors  │ /members │ /distribution          │  │   │
│  │  │          │          │                        │  │   │
│  │  │ GET      │ GET      │ GET (summary)          │  │   │
│  │  │ POST     │ POST     │ POST (calculate)       │  │   │
│  │  │ DELETE   │ PATCH    │                        │  │   │
│  │  │          │ DELETE   │                        │  │   │
│  │  └──────────┴──────────┴────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Prisma ORM Client                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ SQL
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL DATABASE                         │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │   donors     │   members    │   slideshows         │    │
│  │              │              │                      │    │
│  │  - id        │  - id        │  - id                │    │
│  │  - name      │  - name      │  - memberId          │    │
│  │  - phone     │  - fatherName│  - pageNumber        │    │
│  │  - beef      │  - houseName │  - createdAt         │    │
│  │  - lungs     │  - family... │                      │    │
│  │  - bone      │  - beefShare │                      │    │
│  │  - createdAt │  - lungsShare│                      │    │
│  │              │  - boneShare │                      │    │
│  │              │  - status    │                      │    │
│  │              │  - createdAt │                      │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. Adding a Donor

```
User Opens /donors Page
        ↓
Clicks "Add Donor" Button
        ↓
Dialog Opens with Form
        ↓
User Fills Form:
  - Name: "Ahmed Khan"
  - Phone: "+1234567890"
  - Beef: 50000 gm
  - Lungs: 10000 gm
  - Bone: 5000 gm
        ↓
User Clicks "Add Donor"
        ↓
Frontend Validates Input
        ↓
POST /api/donors
{
  name: "Ahmed Khan",
  phone: "+1234567890",
  beef: 50000,
  lungs: 10000,
  bone: 5000
}
        ↓
API Route Processes Request
        ↓
Prisma Creates Database Record
        ↓
Database Returns New Donor
        ↓
API Returns Success Response
        ↓
Frontend Updates UI
        ↓
Toast Notification: "Donor added successfully"
        ↓
Dialog Closes
        ↓
Donor List Refreshes
```

---

### 2. Adding a Member

```
User Opens /members Page
        ↓
Clicks "Add Member" Button
        ↓
Dialog Opens with Form
        ↓
User Fills Form:
  - Name: "Mohammad Ali"
  - Father's Name: "Rashid Ali"
  - House Name: "East Villa"
  - Family Members: 5
        ↓
User Clicks "Add Member"
        ↓
Frontend Validates Input
        ↓
POST /api/members
{
  name: "Mohammad Ali",
  fatherName: "Rashid Ali",
  houseName: "East Villa",
  familyMembers: 5
}
        ↓
API Route Processes Request
        ↓
Prisma Creates Database Record
(beefShare, lungsShare, boneShare = 0 initially)
        ↓
Database Returns New Member
        ↓
API Returns Success Response
        ↓
Frontend Updates UI
        ↓
Toast Notification: "Member added successfully"
        ↓
Dialog Closes
        ↓
Member List Refreshes
```

---

### 3. Calculating Distribution

```
User Opens /distribution Page
        ↓
Views Current Statistics:
  - Total Donors: 50
  - Total Members: 1000
  - Total Beef: 500,000 gm
  - Total Lungs: 100,000 gm
  - Total Bone: 50,000 gm
        ↓
User Clicks "Calculate Distribution"
        ↓
Frontend Shows Loading State
        ↓
POST /api/distribution
        ↓
API Fetches All Donors
        ↓
Calculate Totals:
  totalBeef = Sum of all donor.beef
  totalLungs = Sum of all donor.lungs
  totalBone = Sum of all donor.bone
        ↓
API Fetches All Members
        ↓
Count Total Members = 1000
        ↓
Calculate Per Person Shares:
  beefPerPerson = 500,000 / 1000 = 500 gm
  lungsPerPerson = 100,000 / 1000 = 100 gm
  bonePerPerson = 50,000 / 1000 = 50 gm
        ↓
Update Each Member Record:
  member.beefShare = 500
  member.lungsShare = 100
  member.boneShare = 50
        ↓
Database Transaction (All or Nothing)
        ↓
All 1000 Members Updated Successfully
        ↓
API Returns Success Response
{
  message: "Distribution calculated",
  totals: { beef: 500000, lungs: 100000, bone: 50000 },
  perPerson: { beef: 500, lungs: 100, bone: 50 },
  totalMembers: 1000
}
        ↓
Frontend Updates UI
        ↓
Toast Notification: "Distribution calculated for 1000 members"
        ↓
Statistics Refresh
```

---

### 4. Viewing Slideshow

```
User Opens /slideshow Page
        ↓
Frontend Fetches All Members
GET /api/members?limit=1000
        ↓
API Returns All Members (sorted)
        ↓
Frontend Initializes:
  currentIndex = 0
  members = [...all members]
        ↓
Display First Member Card:
┌─────────────────────────────────┐
│   🐄 Qurbani Distribution       │
├─────────────────────────────────┤
│   Name: Mohammad Ali            │
│   Father's Name: Rashid Ali     │
│   House Name: East Villa        │
├─────────────────────────────────┤
│   Your Share:                   │
│   🥩 Beef: 500 gm               │
│   🫁 Lungs: 100 gm              │
│   🦴 Bone: 50 gm                │
├─────────────────────────────────┤
│   Status: ⏳ Pending            │
└─────────────────────────────────┘
        ↓
User Can Navigate:
  - Click "Next" Button
  - Click "Previous" Button
  - Press → (Right Arrow)
  - Press ← (Left Arrow)
        ↓
Each Navigation:
  currentIndex updates
  → Animation plays (slide out)
  → New member data loads
  → Animation plays (slide in)
  → Display updates
```

---

### 5. Marking Member as Completed

```
User Opens /members Page
        ↓
Views Member List with Status Buttons
        ↓
Finds Member "Mohammad Ali"
Status: 🟠 Pending
        ↓
Clicks Status Button
        ↓
Frontend Sends Request:
PATCH /api/members
{
  id: "cm123abc...",
  status: "COMPLETED"
}
        ↓
API Updates Member
        ↓
Prisma Updates Database
        ↓
Database Returns Updated Member
        ↓
API Returns Success
        ↓
Frontend Updates UI
        ↓
Button Changes:
  🟠 Pending → 🟢 Completed
        ↓
Toast Notification: "Status updated to COMPLETED"
```

---

## 🎯 User Journey Flow

### Complete Workflow (Qurbani Day)

```
BEFORE QURBANI DAY
├─ Admin adds all expected donors
├─ Admin adds all village members
└─ System ready

QURBANI DAY MORNING
├─ Donors arrive with meat
├─ Admin updates/adds donor records
│  ├─ Donor 1: 50 kg beef, 10 kg lungs, 5 kg bone
│  ├─ Donor 2: 45 kg beef, 9 kg lungs, 4.5 kg bone
│  └─ ... continues
└─ All donations recorded

BEFORE DISTRIBUTION
├─ Admin opens /distribution page
├─ Verifies totals are correct
├─ Clicks "Calculate Distribution"
├─ System calculates fair shares
└─ Ready to distribute

DURING DISTRIBUTION
├─ Open /slideshow on projector/TV
├─ Display in full screen
│
├─ For Each Member:
│  ├─ Call member name
│  ├─ Show their allocation on screen
│  ├─ Member collects their share
│  ├─ Staff marks as "Completed" on tablet/phone
│  └─ Move to next member
│
└─ Continue until all distributed

AFTER DISTRIBUTION
├─ Admin checks /distribution page
├─ Verifies all marked as Completed
├─ Review statistics:
│  ├─ Total Distributed: 100%
│  ├─ Pending: 0
│  └─ Completed: 1000
├─ Generate final report (future feature)
└─ Backup database
```

---

## 🔐 Security Architecture

```
┌──────────────────────────────────────┐
│           User Browser               │
└──────────────────────────────────────┘
                ↓ HTTPS
┌──────────────────────────────────────┐
│          Vercel Edge Network         │
│  - DDoS Protection                   │
│  - Auto HTTPS                        │
│  - CDN Caching                       │
└──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────┐
│        Next.js Serverless            │
│  - Input Validation                  │
│  - Environment Variables             │
│  - API Rate Limiting (future)        │
└──────────────────────────────────────┘
                ↓
┌──────────────────────────────────────┐
│         Prisma ORM Layer             │
│  - SQL Injection Prevention          │
│  - Type Safety                       │
│  - Query Validation                  │
└──────────────────────────────────────┘
                ↓ SSL
┌──────────────────────────────────────┐
│      PostgreSQL Database             │
│  - Encrypted at Rest                 │
│  - Encrypted in Transit              │
│  - Automatic Backups                 │
│  - Row Level Security (Supabase)     │
└──────────────────────────────────────┘
```

---

## 📊 Database Schema Relationships

```
┌──────────────────┐
│     Donor        │
│                  │
│  id (PK)         │
│  name            │
│  phone           │
│  beef            │
│  lungs           │
│  bone            │
│  createdAt       │
└──────────────────┘
                             ┌──────────────────┐
                             │     Member       │
                             │                  │
                             │  id (PK)         │
                             │  name            │
                             │  fatherName      │
                             │  houseName       │
                             │  familyMembers   │
                             │  beefShare       │
                             │  lungsShare      │
                             │  boneShare       │
                             │  status          │
                             │  createdAt       │
                             └──────────────────┘
                                     │
                                     │ One-to-Many
                                     ↓
                             ┌──────────────────┐
                             │   SlideShow      │
                             │                  │
                             │  id (PK)         │
                             │  memberId (FK)   │
                             │  pageNumber      │
                             │  createdAt       │
                             └──────────────────┘

Legend:
PK = Primary Key
FK = Foreign Key
```

---

## 🎨 Component Hierarchy

```
App
├── Layout
│   ├── Inter Font
│   ├── Toaster Provider
│   └── Children Pages
│
├── Home Page (/)
│   ├── Header Section
│   ├── Quick Action Cards
│   │   ├── Donors Card
│   │   ├── Members Card
│   │   ├── Distribution Card
│   │   └── Slideshow Card
│   └── Features Section
│
├── Donors Page (/donors)
│   ├── Back Button
│   ├── Add Donor Dialog
│   │   └── Donor Form
│   ├── Summary Cards (4)
│   └── Donors Table
│
├── Members Page (/members)
│   ├── Back Button
│   ├── Add Member Dialog
│   │   └── Member Form
│   ├── Search Bar
│   ├── Members Table
│   └── Pagination Controls
│
├── Distribution Page (/distribution)
│   ├── Back Button
│   ├── Calculate Button
│   ├── Statistics Cards (4)
│   ├── Total Collection Card
│   ├── Per Person Distribution Card
│   └── Instructions Card
│
└── Slideshow Page (/slideshow)
    ├── Home Button
    ├── Progress Indicator
    ├── Member Card (Animated)
    │   ├── Header
    │   ├── Member Info
    │   ├── Distribution Details
    │   └── Status Badge
    └── Navigation Controls
```

---

## 📱 Responsive Design Breakpoints

```
Mobile (< 768px)
└─ Single column layout
   └─ Stacked cards
      └─ Full-width tables

Tablet (768px - 1024px)
└─ 2-column grid
   └─ Side-by-side cards
      └─ Scrollable tables

Desktop (> 1024px)
└─ 4-column grid
   └─ Multi-column layout
      └─ Full tables visible
```

---

## 🔄 State Management Flow

```
User Action
    ↓
Event Handler
    ↓
Update Local State (useState)
    ↓
Call API (fetch)
    ↓
Server Processing
    ↓
Database Operation
    ↓
Response Returned
    ↓
Update Local State
    ↓
Re-render Component
    ↓
Show Toast Notification
```

---

**This system is designed for clarity, maintainability, and scalability.**
