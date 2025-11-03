/**
 * useBookingSearch hook
 * Manages space search functionality with date and time parameters
 */

import { useState, useCallback } from 'react';
import { searchSpaces as fetchSpaces } from '@/services/spaceService';
import { transformSpaceData } from '@/utils/space';

export const useBookingSearch = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * Fetch spaces from API with date and time parameters
   */
  const searchSpaces = useCallback(async (date, startTime, endTime) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchSpaces(date, startTime, endTime);
      const apiData = result.data || [];
      
      // Transform API data to UI format
      const transformedSpaces = apiData.map(transformSpaceData);
      
      setSpaces(transformedSpaces);
      setHasSearched(true);
      
    } catch (err) {
      console.error('Error fetching spaces:', err);
      setError(err.message);
      setSpaces([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset search state
   */
  const resetSearch = useCallback(() => {
    setSpaces([]);
    setError(null);
    setHasSearched(false);
  }, []);

  return {
    spaces,
    loading,
    error,
    hasSearched,
    searchSpaces,
    resetSearch,
  };
};
