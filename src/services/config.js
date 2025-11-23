/**
 * API Configuration
 * Centralized API base URL and common configurations
 */

export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.101:5000/',
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REGISTER: '/api/auth/register',
  
  // Spaces
  SPACES: '/api/spaces',
  SPACE_BY_ID: (id) => `/api/spaces/${id}`,
  
  // Bookings
  BOOKINGS: '/api/bookings',
  BOOKING_BY_ID: (id) => `/api/bookings/${id}`,
  USER_BOOKINGS: '/api/bookings/user',
  USER_BOOKINGS_BY_ID: (userId) => `/api/bookings/user/${userId}`,
  
  // User
  USER_PROFILE: '/api/user/profile',
  UPDATE_PROFILE: '/api/user/profile',
  
  // Stats
  STATS_EMPLOYEE: (userId) => `/api/stats_employee/${userId}`,
};
