# Booked Space Card - Usage Guide

## Component: BookedSpaceCard

Komponen untuk menampilkan space yang sudah di-booking oleh user.

### Features:
- ✅ Green top bar indicator (8px height, #05df72)
- ✅ Green border (#00c950)
- ✅ Blue icon background
- ✅ Blue type text (#1447e6)
- ✅ Blue capacity badge
- ✅ "Your Booking" button (disabled, green with 50% opacity)
- ✅ Shows booking time

---

## 3 Space Variations

### 1. Hot Desk (Desk A1)
```javascript
const bookedDesk = {
  id: 1,
  name: 'Desk A1',
  type: 'Hot Desk',
  capacity: 1,
  amenities: ['Monitor', 'Power Outlet'],
};

<BookedSpaceCard 
  space={bookedDesk} 
  bookingTime="08:00-18:00" 
/>
```

### 2. Private Room (Room B2)
```javascript
const bookedPrivateRoom = {
  id: 2,
  name: 'Room B2',
  type: 'Private Room',
  capacity: 4,
  amenities: ['Monitor', 'Whiteboard'],
};

<BookedSpaceCard 
  space={bookedPrivateRoom} 
  bookingTime="09:00-17:00" 
/>
```

### 3. Conference Room (Conference A)
```javascript
const bookedConferenceRoom = {
  id: 3,
  name: 'Conference A',
  type: 'Conference Room',
  capacity: 12,
  amenities: ['Projector', 'Video Conference'],
};

<BookedSpaceCard 
  space={bookedConferenceRoom} 
  bookingTime="14:00-16:00" 
/>
```

---

## Usage in Booking Page

```javascript
import BookedSpaceCard from '@/component/BookedSpaceCard';

// In your component
const userBookings = [
  {
    id: 1,
    space: {
      id: 101,
      name: 'Desk A1',
      type: 'Hot Desk',
      capacity: 1,
      amenities: ['Monitor', 'Power Outlet'],
    },
    bookingTime: '08:00-18:00'
  },
  // ... more bookings
];

// Render
{userBookings.map((booking) => (
  <BookedSpaceCard 
    key={booking.id}
    space={booking.space}
    bookingTime={booking.bookingTime}
  />
))}
```

---

## Integration with SpaceCard

Render logic berdasarkan status booking:

```javascript
{spaces.map((space) => (
  space.isBooked ? (
    <BookedSpaceCard 
      key={space.id}
      space={space}
      bookingTime={space.bookingTime}
    />
  ) : (
    <SpaceCard 
      key={space.id}
      space={space}
      onBook={handleBook}
    />
  )
))}
```

---

## Props

### space (Object) - Required
- `name` (string): Space name
- `type` (string): 'Hot Desk' | 'Private Room' | 'Conference Room'
- `capacity` (number): Number of people
- `amenities` (array): Array of amenity names (max 2 shown)

### bookingTime (String) - Optional
- Format: "HH:MM-HH:MM" (e.g., "08:00-18:00")
- Default: "08:00-18:00"

---

## Design Differences from Regular SpaceCard

| Feature | Regular SpaceCard | BookedSpaceCard |
|---------|------------------|-----------------|
| Border | Various colors | Green (#00c950) |
| Top Bar | None or various | Green bar (#05df72) |
| Icon BG | Various colors | Blue (#eff6ff) |
| Type Color | Various | Blue (#1447e6) |
| Badge BG | Various | Blue (#eff6ff) |
| Badge Text | Various | Blue (#1447e6) |
| Button | "Book Space" active | "Your Booking" disabled |
| Button Color | Various | Green (#00a63e) 50% opacity |

---

**File Location:** `/src/component/BookedSpaceCard.js`
