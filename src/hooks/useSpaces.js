/**
 * useSpaces hooks
 * React Query hooks for space operations
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import {
  searchSpaces,
  getAllSpaces,
  getSpaceById,
} from '@/services/spaceService';

/**
 * Fetch space by ID
 */
export const useSpace = (spaceId) => {
  return useQuery({
    queryKey: ['spaces', spaceId],
    queryFn: () => getSpaceById(spaceId),
    enabled: !!spaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch all spaces
 */
export const useAllSpaces = () => {
  return useQuery({
    queryKey: ['spaces', 'all'],
    queryFn: getAllSpaces,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

