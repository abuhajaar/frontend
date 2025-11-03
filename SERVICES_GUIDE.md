# API Services Documentation

## Overview
Professional API service layer for centralized API management.

## Folder Structure
```
/src/services/
├── index.js ..................... Central export point
├── config.js .................... API configuration & endpoints
├── authService.js ............... Authentication APIs
├── spaceService.js .............. Space/workspace APIs
├── bookingService.js ............ Booking management APIs
└── userService.js ............... User profile APIs
```

---

## How to Use

### Import Services
```javascript
// Import specific service
import { searchSpaces } from '@/services/spaceService';
import { login, logout } from '@/services/authService';
import { createBooking } from '@/services/bookingService';

// Or import all from index
import { searchSpaces, login, createBooking } from '@/services';
```

---

## Available Services

### 1. **Authentication Service** (`authService.js`)
- `login(username, password)` - User login
- `logout()` - User logout
- `register(userData)` - New user registration

### 2. **Space Service** (`spaceService.js`)
- `searchSpaces(date, startTime, endTime)` - Search available spaces
- `getAllSpaces()` - Get all spaces
- `getSpaceById(spaceId)` - Get space details

### 3. **Booking Service** (`bookingService.js`)
- `createBooking(bookingData)` - Create new booking
- `getUserBookings()` - Get user's bookings
- `getBookingById(bookingId)` - Get booking details
- `cancelBooking(bookingId)` - Cancel a booking
- `updateBooking(bookingId, updateData)` - Update booking

### 4. **User Service** (`userService.js`)
- `getUserProfile()` - Get user profile
- `updateUserProfile(profileData)` - Update profile

---

## Quick Examples

### Search Spaces
```javascript
import { searchSpaces } from '@/services/spaceService';

const result = await searchSpaces('2025-11-02', '09:00', '17:00');
console.log(result.data); // Array of spaces
```

### Create Booking
```javascript
import { createBooking } from '@/services/bookingService';

const booking = await createBooking({
  spaceId: '123',
  date: '2025-11-02',
  startTime: '09:00',
  endTime: '17:00'
});
```

### Login
```javascript
import { login } from '@/services/authService';

const response = await login('user@example.com', 'password');
console.log(response.token, response.user);
```

---

**✅ All API calls are now centralized and reusable!**
