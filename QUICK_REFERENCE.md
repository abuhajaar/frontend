# Booking Page - Quick Reference

## 📁 Folder Structure

```
/src
├── app/
│   └── booking/
│       └── page.js ..................... Main booking page (orchestrates all components)
│
├── components/
│   ├── booking/
│   │   ├── Sidebar.js .................. Navigation sidebar with user profile
│   │   ├── DateTimeSelector.js ......... Date and time input controls
│   │   ├── FilterBar.js ................ Floor and type filter buttons
│   │   └── SpacesGrid.js ............... Grid display with loading/error/empty states
│   │
│   ├── BookingModal.js ................. Modal popup for booking (existing)
│   ├── SpaceCard.js .................... Individual space card (existing)
│   └── ProtectedRoute.js ............... Auth guard (existing)
│
├── hooks/
│   ├── useCurrentUser.js ............... Fetch and manage current user
│   └── useBookingSearch.js ............. Fetch and manage space search
│
├── utils/
│   ├── user.js ......................... User display name and initials
│   ├── date.js ......................... Date formatting and weekend detection
│   └── space.js ........................ Space data transformation and filtering
│
├── constants/
│   └── booking.js ...................... API URLs, time slots, type configs, filters
│
└── lib/
    └── auth.js ......................... Authentication utilities (existing)
```

---

## 🎯 When to Use What

### Need to...
- **Display user info?** → Use `getUserDisplayName()` or `getUserInitials()` from `/utils/user.js`
- **Format a date?** → Use `formatDateForDisplay()` from `/utils/date.js`
- **Check if weekend?** → Use `isWeekend()` from `/utils/date.js`
- **Transform API data?** → Use `transformSpaceData()` from `/utils/space.js`
- **Filter spaces?** → Use `filterSpaces()` from `/utils/space.js`
- **Get unique floors?** → Use `getUniqueFloors()` from `/utils/space.js`
- **Fetch current user?** → Use `useCurrentUser()` hook
- **Search for spaces?** → Use `useBookingSearch()` hook
- **Get time slots?** → Import `TIME_SLOTS` from `/constants/booking.js`
- **Get space type config?** → Import `SPACE_TYPES` from `/constants/booking.js`

---

## 🔧 Component Props Quick Reference

### `<Sidebar />`
```jsx
<Sidebar 
  isOpen={boolean}
  currentUser={object}
/>
```

### `<DateTimeSelector />`
```jsx
<DateTimeSelector
  selectedDate={string}        // YYYY-MM-DD
  startTime={string}           // HH:MM
  endTime={string}             // HH:MM
  onDateChange={function}
  onStartTimeChange={function}
  onEndTimeChange={function}
  onSearch={function}
  loading={boolean}
/>
```

### `<FilterBar />`
```jsx
<FilterBar
  selectedFloor={string}       // 'all' or floor value
  selectedType={string}        // 'all', 'hot_desk', 'private_room', 'meeting_room'
  availableFloors={array}      // ['1st Floor', '2nd Floor', ...]
  onFloorChange={function}
  onTypeChange={function}
/>
```

### `<SpacesGrid />`
```jsx
<SpacesGrid
  spaces={array}               // All spaces
  filteredSpaces={array}       // Filtered spaces
  loading={boolean}
  error={string}
  hasSearched={boolean}
  selectedDate={string}        // For weekend detection
  onBookSpace={function}
/>
```

---

## 🪝 Custom Hooks API

### `useCurrentUser()`
```javascript
const { currentUser, isLoading } = useCurrentUser();

// Returns:
// currentUser: { name, username, email, avatar, ... }
// isLoading: boolean
```

### `useBookingSearch()`
```javascript
const { 
  spaces,           // Array of spaces
  loading,          // Boolean
  error,            // String or null
  hasSearched,      // Boolean
  searchSpaces,     // Function(date, startTime, endTime)
  resetSearch       // Function()
} = useBookingSearch();

// Usage:
searchSpaces('2025-10-16', '09:00', '17:00');
```

---

## 🛠️ Utility Functions API

### User Utils (`/utils/user.js`)
```javascript
import { getUserDisplayName, getUserInitials } from '@/utils/user';

getUserDisplayName(user)  // Returns: string (name, username, or email)
getUserInitials(user)     // Returns: string (2 characters for avatar)
```

### Date Utils (`/utils/date.js`)
```javascript
import { 
  getOrdinalSuffix, 
  formatDateForDisplay, 
  isWeekend 
} from '@/utils/date';

getOrdinalSuffix(16)                    // Returns: '16th'
formatDateForDisplay('2025-10-16')      // Returns: 'October 16th, 2025'
isWeekend('2025-10-18')                 // Returns: true (if Saturday/Sunday)
```

### Space Utils (`/utils/space.js`)
```javascript
import { 
  getSpaceTypeConfig, 
  extractFloorFromLocation, 
  getUniqueFloors,
  transformSpaceData,
  filterSpaces 
} from '@/utils/space';

getSpaceTypeConfig('hot_desk')          // Returns: { type, color, icon }
extractFloorFromLocation('Lantai 12')   // Returns: '12th Floor'
getUniqueFloors(spaces)                 // Returns: ['1st Floor', '2nd Floor', ...]
transformSpaceData(apiSpace)            // Returns: UI-formatted space
filterSpaces(spaces, '1st Floor', 'all') // Returns: filtered array
```

---

## 📦 Constants Reference

### From `/constants/booking.js`
```javascript
import { 
  API_BASE_URL, 
  TIME_SLOTS, 
  SPACE_TYPES, 
  FILTER_OPTIONS 
} from '@/constants/booking';

// API_BASE_URL
'https://backend-openbo.devmosel.com'

// TIME_SLOTS
['08:00', '08:30', '09:00', ..., '19:00', '19:30']

// SPACE_TYPES
{
  HOT_DESK: {
    type: 'Hot Desk',
    apiValue: 'hot_desk',
    color: '#19B55F',
    icon: '/assets/...'
  },
  // ... PRIVATE_ROOM, MEETING_ROOM
}

// FILTER_OPTIONS
{
  FLOORS: { ALL: 'all' },
  TYPES: { 
    ALL: 'all',
    HOT_DESK: 'hot_desk',
    PRIVATE: 'private_room',
    MEETING: 'meeting_room'
  }
}
```

---

## 🎨 Design Tokens (From Figma)

### Colors
- Primary Background: `#FFFFFF`
- Text Primary: `#000000` (neutral-950)
- Text Secondary: `#717182`
- Hot Desk: `#19B55F`
- Private Room: `#F3A51A`
- Meeting Room: `#1974E7`
- Sidebar: `#000000` (neutral-950)

### Typography
- Page Title: `text-[2rem]` (32px), semibold, tracking-[-0.05em]
- Section Title: `text-xl` (20px), semibold
- Body: `text-base` (16px), tracking-[-0.3125px]
- Small: `text-sm` (14px), tracking-[-0.1504px]

### Spacing
- Container padding: `p-8` (32px)
- Section margin: `mb-8` (32px)
- Card gap: `gap-6` (24px)
- Element gap: `gap-4` (16px)

---

## 🚀 Quick Start Examples

### Example 1: Use the booking page as-is
```javascript
// Just navigate to /booking
// Everything is already wired up!
```

### Example 2: Reuse Sidebar in another page
```jsx
import Sidebar from '@/components/booking/Sidebar';
import { useCurrentUser } from '@/hooks/useCurrentUser';

function MyPage() {
  const { currentUser } = useCurrentUser();
  
  return (
    <div className="flex">
      <Sidebar isOpen={true} currentUser={currentUser} />
      <main>{/* Your content */}</main>
    </div>
  );
}
```

### Example 3: Use space utilities elsewhere
```javascript
import { transformSpaceData, filterSpaces } from '@/utils/space';

// Transform API response
const uiSpaces = apiSpaces.map(transformSpaceData);

// Filter spaces
const hotDesks = filterSpaces(uiSpaces, 'all', 'hot_desk');
```

### Example 4: Format dates in any component
```javascript
import { formatDateForDisplay } from '@/utils/date';

function MyComponent({ date }) {
  return <p>{formatDateForDisplay(date)}</p>;
  // Outputs: "October 16th, 2025"
}
```

---

## 📊 Comparison: Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| Main file size | 616 lines | 120 lines |
| Files | 1 | 13 |
| Reusability | ❌ Low | ✅ High |
| Testability | ❌ Hard | ✅ Easy |
| Maintainability | ❌ Difficult | ✅ Simple |
| Documentation | ❌ None | ✅ JSDoc |
| Separation of Concerns | ❌ Mixed | ✅ Clear |
| Industry Standard | ❌ No | ✅ Yes |

---

## 📝 Notes

- All components are **client components** (`'use client'`)
- All utility functions are **pure functions** (no side effects)
- All hooks follow **React Hook rules**
- All files have **JSDoc documentation**
- Original 616-line file saved as `page.js.backup`

---

## ✅ Checklist for New Features

When adding new booking-related features:

1. [ ] Is it a reusable function? → Add to `/utils`
2. [ ] Is it a configuration? → Add to `/constants`
3. [ ] Is it a UI component? → Add to `/components/booking`
4. [ ] Does it fetch data? → Consider adding a hook in `/hooks`
5. [ ] Does it need authentication? → Use `useCurrentUser()` hook
6. [ ] Does it transform API data? → Use or extend `/utils/space.js`
7. [ ] Document with JSDoc comments
8. [ ] Keep files under 150 lines if possible

---

**Last Updated**: November 2024
