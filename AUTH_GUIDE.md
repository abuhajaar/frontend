# Authentication System Documentation

## Overview
This application uses cookie-based authentication to securely store user tokens and data.

## Files Created

### 1. `/src/lib/auth.js`
Authentication utility with helper functions for managing cookies.

### 2. `/src/lib/useAuth.js`
Custom React hook for accessing authentication state.

### 3. `/src/component/ProtectedRoute.js`
Wrapper component for pages that require authentication.

### 4. `/src/component/LogoutButton.js`
Reusable logout button component.

## Usage Examples

### Using the auth helper directly

```javascript
import { auth } from '@/lib/auth';

// Check if user is logged in
if (auth.isAuthenticated()) {
  console.log('User is logged in');
}

// Get current user
const user = auth.getUser();

// Get auth token
const token = auth.getToken();

// Logout
auth.logout();
```

### Using the useAuth hook

```javascript
import { useAuth } from '@/lib/useAuth';

function MyComponent() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome {user.username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting a page

```javascript
import ProtectedRoute from '@/component/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>This content is only visible to authenticated users</p>
      </div>
    </ProtectedRoute>
  );
}
```

### Using LogoutButton component

```javascript
import LogoutButton from '@/component/LogoutButton';

export default function Header() {
  return (
    <nav>
      <LogoutButton />
      {/* or with custom styling */}
      <LogoutButton className="custom-class">
        Sign Out
      </LogoutButton>
    </nav>
  );
}
```

### Making authenticated API requests

```javascript
import { fetchWithAuth } from '@/lib/auth';

async function getData() {
  const response = await fetchWithAuth('http://192.168.1.101:5000/api/data');
  const data = await response.json();
  return data;
}
```

## Cookie Configuration

Cookies are configured with:
- **Expiration**: 7 days
- **Secure**: true (HTTPS only in production)
- **SameSite**: strict (CSRF protection)

## Security Features

1. **Automatic logout on 401**: If server returns 401, user is automatically logged out
2. **CSRF protection**: SameSite cookie policy
3. **Secure cookies**: HTTPS-only in production
4. **Token in Authorization header**: Bearer token authentication

## API Response Format

Expected login response:
```json
{
  "access_token": "your-jwt-token",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

## Login Flow

1. User submits username and password
2. Frontend sends POST to `http://192.168.1.101:5000/api/auth/login`
3. Backend validates credentials
4. Backend returns token and user data
5. Frontend stores token and user in cookies
6. User is redirected to home page

## Logout Flow

1. User clicks logout button
2. All auth cookies are removed
3. User is redirected to login page
