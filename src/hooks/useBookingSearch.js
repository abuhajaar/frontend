/**
 * useBookingSearch hook
 * Manages space search functionality with date and time parameters using React Query
 */

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchSpaces as fetchSpaces } from '@/services/spaceService';
import { transformSpaceData } from '@/utils/space';

export const useBookingSearch = () => {
  const [searchParams, setSearchParams] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * React Query for fetching spaces
   */
  const { data: spaces = [], isLoading, error, refetch } = useQuery({
    queryKey: ['spaces', searchParams?.date, searchParams?.startTime, searchParams?.endTime],
    queryFn: async () => {
      if (!searchParams) return [];
      
      const result = await fetchSpaces(
        searchParams.date, 
        searchParams.startTime, 
        searchParams.endTime
      );
      const apiData = result.data || [];
      
      // Transform API data to UI format
      return apiData.map(transformSpaceData);
    },
    enabled: !!searchParams, // Only run query when searchParams is set
    staleTime: 30 * 1000, // Data is fresh for 30 seconds
    retry: 1,
  });

  /**
   * Trigger search with new parameters
   */
  const searchSpaces = async (date, startTime, endTime) => {
    setSearchParams({ date, startTime, endTime });
    setHasSearched(true);
  };

  /**
   * Reset search state
   */
  const resetSearch = () => {
    setSearchParams(null);
    setHasSearched(false);
  };

  return {
    spaces,
    loading: isLoading,
    error: error?.message || null,
    hasSearched,
    searchSpaces,
    resetSearch,
    refetch,
  };
};
