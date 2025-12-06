import { API_CONFIG, API_ENDPOINTS } from './config';

/**
 * Get all departments
 */
export const getAllDepartments = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.DEPARTMENTS}`, {
      method: 'GET',
      headers: {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch departments');
    }

    return data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};
