'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export default function LogoutButton({ className = '', children = 'Logout' }) {
  const router = useRouter();

  const handleLogout = () => {
    // Clear all auth cookies
    auth.logout();
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <button 
      onClick={handleLogout}
      className={className || "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"}
    >
      {children}
    </button>
  );
}
