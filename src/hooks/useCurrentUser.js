/**
 * useCurrentUser hook
 * Manages current user state from authentication
 */

import { useState, useEffect } from 'react';
import { auth } from '@/lib/auth';

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = auth.getUser();
    console.log('Current user loaded:', user);
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  return {
    currentUser,
    isLoading,
  };
};
