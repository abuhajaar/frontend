/**
 * useStats hooks
 * React Query hooks for dashboard statistics
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { getEmployeeStats } from '@/services/statsService';

/**
 * Fetch dashboard statistics for a user
 */
export const useDashboardStats = (userId) => {
  return useQuery({
    queryKey: ['stats', 'dashboard', userId],
    queryFn: () => getEmployeeStats(userId),
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
