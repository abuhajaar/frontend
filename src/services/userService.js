/**
 * User Service
 * Handles all user-related API calls
 */

import { API_CONFIG, API_ENDPOINTS } from './config';
import { auth } from '@/lib/auth';

/**
 * Get headers with authentication token
 * @returns {Object} Headers object with auth token if available
 */
const getAuthHeaders = () => {
  const token = auth.getToken();
  const headers = { ...API_CONFIG.HEADERS };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Get user profile
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USER_PROFILE}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.UPDATE_PROFILE}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

/**
 * Get all users (admin only)
 * @returns {Promise<Object>} All users data
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

/**
 * Create a new user (admin only)
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user data
 */
export const createUser = async (userData) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS}`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }

    return await response.json();
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

/**
 * Update an existing user (admin only)
 * @param {number} userId - User ID to update
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user data
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS}/${userId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }

    return await response.json();
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

/**
 * Delete a user (admin only)
 * @param {number} userId - User ID to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteUser = async (userId) => {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS}/${userId}`,
      {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

