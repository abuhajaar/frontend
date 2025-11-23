# Booking Page Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BOOKING PAGE ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        /src/app/booking/page.js                         │
│                         (Main Orchestrator)                             │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  State Management:                                              │   │
│  │  • UI state (sidebar, date, time, filters, modal)              │   │
│  │  • Custom hooks (useCurrentUser, useBookingSearch)              │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  Event Handlers:                                                │   │
│  │  • handleSearch()                                               │   │
│  │  • handleBookSpace()                                            │   │
│  │  • handleCloseModal()                                           │   │
│  └────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │  Component Composition:                                         │   │
│  │  <Sidebar /> + <DateTimeSelector /> + <FilterBar /> +           │   │
│  │  <SpacesGrid /> + <BookingModal />                              │   │
│  └────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                               │
                               │ uses
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          CUSTOM HOOKS LAYER                              │
├─────────────────────────────────┬───────────────────────────────────────┤
│  /hooks/useCurrentUser.js       │  /hooks/useBookingSearch.js          │
│  ┌──────────────────────────┐  │  ┌──────────────────────────────────┐ │
│  │ • Fetch user from auth   │  │  │ • searchSpaces(date, time)       │ │
│  │ • Return currentUser     │  │  │ • Fetch from API                 │ │
│  │ • Handle loading state   │  │  │ • Transform data (uses utils)    │ │
│  └──────────────────────────┘  │  │ • Return spaces, loading, error  │ │
│                                 │  └──────────────────────────────────┘ │
└─────────────────────────────────┴───────────────────────────────────────┘
                               │
                               │ uses
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PRESENTATIONAL COMPONENTS                           │
├─────────────────┬─────────────────┬─────────────────┬──────────────────┤
│  Sidebar.js     │ DateTimeSelector│  FilterBar.js   │  SpacesGrid.js   │
│  ┌───────────┐  │  ┌────────────┐ │  ┌───────────┐  │  ┌────────────┐  │
│  │ • Logo    │  │  │ • Date     │ │  │ • Floors  │  │  │ • Loading  │  │
│  │ • Nav     │  │  │ • Start    │ │  │ • Types   │  │  │ • Error    │  │
│  │ • User    │  │  │ • End      │ │  │ • Active  │  │  │ • Empty    │  │
│  │ • Logout  │  │  │ • Search   │ │  │   states  │  │  │ • Grid     │  │
│  └───────────┘  │  └────────────┘ │  └───────────┘  │  └────────────┘  │
│  Props:         │  Props:         │  Props:         │  Props:          │
│  • isOpen       │  • selectedDate │  • selectedFloor│  • spaces        │
│  • currentUser  │  • startTime    │  • selectedType │  • loading       │
│                 │  • endTime      │  • available... │  • error         │
│                 │  • onChange...  │  • onChange...  │  • onBookSpace   │
│                 │  • onSearch     │                 │                  │
└─────────────────┴─────────────────┴─────────────────┴──────────────────┘
                               │
                               │ uses
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          UTILITY FUNCTIONS                               │
├─────────────────────┬───────────────────────┬─────────────────────────┤
│  /utils/user.js     │  /utils/date.js       │  /utils/space.js        │
│  ┌───────────────┐  │  ┌─────────────────┐  │  ┌───────────────────┐  │
│  │ Display name  │  │  │ Ordinal suffix  │  │  │ Type config       │  │
│  │ Initials      │  │  │ Format display  │  │  │ Extract floor     │  │
│  │               │  │  │ Weekend check   │  │  │ Unique floors     │  │
│  └───────────────┘  │  └─────────────────┘  │  │ Transform data    │  │
│                     │                       │  │ Filter spaces     │  │
│  Pure Functions     │  Pure Functions       │  └───────────────────┘  │
│  (No React)         │  (No React)           │  Pure Functions         │
└─────────────────────┴───────────────────────┴─────────────────────────┘
                               │
                               │ imports
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            CONSTANTS                                     │
│                     /constants/booking.js                                │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ API_BASE_URL       = 'http://192.168.1.101:5000'              │    │
│  │ TIME_SLOTS         = ['08:00', '08:30', ..., '19:30']         │    │
│  │ SPACE_TYPES        = { HOT_DESK: {...}, PRIVATE: {...}, ...}  │    │
│  │ FILTER_OPTIONS     = { FLOORS: {...}, TYPES: {...}}           │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Single Source of Truth - No Magic Strings!                             │
└─────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL DEPENDENCIES                            │
├────────────────────┬────────────────────┬────────────────────────────┤
│  /component/       │  /lib/auth.js      │  Backend API                │
│  ┌──────────────┐  │  ┌──────────────┐  │  ┌──────────────────────┐  │
│  │ SpaceCard    │  │  │ getUser()    │  │  │ GET /api/spaces      │  │
│  │ BookingModal │  │  │ login()      │  │  │  ?date=...           │  │
│  │ ProtectedRte │  │  │ logout()     │  │  │  &start_time=...     │  │
│  │ LogoutButton │  │  └──────────────┘  │  │  &end_time=...       │  │
│  └──────────────┘  │                    │  └──────────────────────┘  │
│  (Existing)        │  (Existing)        │  (External Service)        │
└────────────────────┴────────────────────┴────────────────────────────┘
```

---

## Data Flow Diagram

```
┌───────────┐
│   USER    │
│  ACTION   │
└─────┬─────┘
      │
      │ 1. User selects date/time and clicks "Search"
      ▼
┌────────────────────┐
│  DateTimeSelector  │ ──────► handleSearch()
│    Component       │
└────────────────────┘
      │
      │ 2. handleSearch() calls searchSpaces()
      ▼
┌────────────────────┐
│ useBookingSearch   │ ──────► API: GET /api/spaces?params
│      Hook          │
└────────────────────┘
      │
      │ 3. API returns raw data
      ▼
┌────────────────────┐
│ transformSpaceData │ ◄────── /utils/space.js
│    (utility)       │
└────────────────────┘
      │
      │ 4. Transformed data returned to hook
      ▼
┌────────────────────┐
│  spaces state      │
│  (updated)         │
└────────────────────┘
      │
      │ 5. Component re-renders with new data
      ▼
┌────────────────────┐
│   SpacesGrid       │
│   Component        │ ──────► Maps over spaces
└────────────────────┘
      │
      │ 6. Renders each space
      ▼
┌────────────────────┐
│    SpaceCard       │ ×N
│   Component        │
└────────────────────┘
      │
      │ 7. User clicks "Book Now"
      ▼
┌────────────────────┐
│  BookingModal      │
│   (popup)          │
└────────────────────┘
```

---

## Component Hierarchy

```
BookingPage (Main Orchestrator)
├── ProtectedRoute (Auth Guard)
│   └── div (Container)
│       ├── Sidebar (Navigation)
│       │   ├── Logo
│       │   ├── Navigation Links
│       │   │   ├── Dashboard Link
│       │   │   └── Browse Spaces Link
│       │   └── User Profile
│       │       ├── Avatar / Initials
│       │       ├── User Name
│       │       └── LogoutButton
│       │
│       ├── main (Content Area)
│       │   ├── Header
│       │   │   ├── Title
│       │   │   └── Description
│       │   │
│       │   ├── DateTimeSelector
│       │   │   ├── Date Input
│       │   │   ├── Start Time Select
│       │   │   ├── End Time Select
│       │   │   └── Search Button
│       │   │
│       │   ├── FilterBar
│       │   │   ├── Floor Filters
│       │   │   │   ├── All Button
│       │   │   │   └── Floor Buttons (dynamic)
│       │   │   │
│       │   │   └── Type Filters
│       │   │       ├── All Button
│       │   │       ├── Hot Desk Button
│       │   │       ├── Private Room Button
│       │   │       └── Meeting Room Button
│       │   │
│       │   └── SpacesGrid
│       │       ├── Loading State (spinner)
│       │       ├── Error State (message)
│       │       ├── Empty State (fun messages)
│       │       └── Grid of SpaceCards
│       │           └── SpaceCard ×N
│       │               ├── Image
│       │               ├── Type Badge
│       │               ├── Name
│       │               ├── Capacity
│       │               ├── Floor
│       │               ├── Amenities
│       │               └── Book Button
│       │
│       └── BookingModal (conditional)
│           ├── Backdrop (blurred)
│           └── Modal Content
│               ├── Space Details
│               ├── Booking Info
│               └── Confirm Button
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       STATE ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────┘

LOCAL STATE (useState in BookingPage)
├── isSidebarOpen ────────► Controls sidebar visibility
├── selectedDate ─────────► Selected booking date
├── startTime ────────────► Selected start time
├── endTime ──────────────► Selected end time
├── selectedFloor ────────► Active floor filter
├── selectedType ─────────► Active type filter
├── selectedSpace ────────► Space to book (for modal)
└── isModalOpen ──────────► Modal visibility

HOOK STATE (useCurrentUser)
├── currentUser ──────────► User object from auth
└── isLoading ────────────► User loading state

HOOK STATE (useBookingSearch)
├── spaces ───────────────► Array of all spaces from API
├── loading ──────────────► API loading state
├── error ────────────────► API error message
└── hasSearched ──────────► Whether search was performed

DERIVED STATE (computed)
├── availableFloors ──────► getUniqueFloors(spaces)
└── filteredSpaces ───────► filterSpaces(spaces, floor, type)
```

---

## File Dependency Graph

```
page.js
  ├─► Sidebar
  │     ├─► getUserDisplayName (from utils/user)
  │     ├─► getUserInitials (from utils/user)
  │     └─► LogoutButton
  │
  ├─► DateTimeSelector
  │     └─► TIME_SLOTS (from constants/booking)
  │
  ├─► FilterBar
  │     └─► FILTER_OPTIONS (from constants/booking)
  │
  ├─► SpacesGrid
  │     ├─► isWeekend (from utils/date)
  │     └─► SpaceCard
  │
  ├─► BookingModal
  │
  ├─► useCurrentUser
  │     └─► auth.getUser (from lib/auth)
  │
  ├─► useBookingSearch
  │     ├─► API_BASE_URL (from constants/booking)
  │     ├─► transformSpaceData (from utils/space)
  │     └─► fetch (native)
  │
  ├─► getUniqueFloors (from utils/space)
  │
  └─► filterSpaces (from utils/space)
        └─► SPACE_TYPES (from constants/booking)
```

---

## Folder Structure With Purpose

```
/src
│
├── app/                           ◄── Next.js App Router pages
│   └── booking/
│       └── page.js                ◄── Main page (orchestrates everything)
│
├── components/                    ◄── Reusable UI components
│   └── booking/                   ◄── Booking-specific components
│       ├── Sidebar.js             ◄── Navigation + user profile
│       ├── DateTimeSelector.js    ◄── Date/time input controls
│       ├── FilterBar.js           ◄── Filter buttons
│       └── SpacesGrid.js          ◄── Grid with all states
│
├── hooks/                         ◄── Custom React hooks
│   ├── useCurrentUser.js          ◄── User state management
│   └── useBookingSearch.js        ◄── Space search logic
│
├── utils/                         ◄── Pure utility functions
│   ├── user.js                    ◄── User data helpers
│   ├── date.js                    ◄── Date formatting
│   └── space.js                   ◄── Space transformations
│
├── constants/                     ◄── Configuration & constants
│   └── booking.js                 ◄── API URLs, types, filters
│
└── lib/                           ◄── Core libraries
    └── auth.js                    ◄── Authentication utilities
```

---

## Code Organization Principles

```
┌─────────────────────────────────────────────────────────────┐
│                  SEPARATION OF CONCERNS                      │
└─────────────────────────────────────────────────────────────┘

CONSTANTS      → Configuration only, no logic
               → Imported by utils, hooks, components

UTILS          → Pure functions only
               → No React, no side effects
               → Easy to test

HOOKS          → React hooks only
               → State management
               → Side effects (API calls, subscriptions)
               → Uses utils for transformations

COMPONENTS     → UI presentation only
               → Receives props
               → Renders JSX
               → Uses hooks for data
               → Uses utils for formatting

PAGES          → Orchestration only
               → Composes components
               → Manages page-level state
               → Connects everything together
```

---

## Benefits Visualization

```
BEFORE                              AFTER
┌──────────────────┐               ┌─────┐ ┌─────┐ ┌─────┐
│                  │               │     │ │     │ │     │
│  One giant file  │               │Small│ │Small│ │Small│
│      616 lines   │     ════►     │ 58  │ │ 68  │ │ 78  │
│                  │               │lines│ │lines│ │lines│
│  Everything      │               │     │ │     │ │     │
│  mixed together  │               └─────┘ └─────┘ └─────┘
│                  │               
│                  │               ┌─────┐ ┌─────┐ ┌─────┐
└──────────────────┘               │     │ │     │ │     │
                                   │ 81  │ │ 92  │ │103  │
❌ Hard to maintain                │lines│ │lines│ │lines│
❌ Hard to test                    │     │ │     │ │     │
❌ Can't reuse code                └─────┘ └─────┘ └─────┘
❌ Difficult to extend             
❌ Confusing structure             ✅ Easy to maintain
                                   ✅ Easy to test
                                   ✅ Highly reusable
                                   ✅ Simple to extend
                                   ✅ Clear structure
```

---

This architecture follows **React best practices** and **industry standards**
for building **scalable**, **maintainable**, and **professional** applications!
