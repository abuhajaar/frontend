/**
 * Reusable Sidebar component
 * Can be shown/hidden with toggle button
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import LogoutButton from '@/component/LogoutButton';
import { getUserDisplayName, getUserInitials } from '@/utils/user';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useCurrentUser();
  
  // Manage sidebar open/close state with localStorage persistence
  const [isOpen, setIsOpen] = useState(true);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setIsOpen(savedState === 'true');
    }
  }, []);

  // Save state to localStorage when it changes
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarOpen', String(newState));
    
    // Dispatch custom event for layout to listen
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { isOpen: newState } }));
  };

  // Dispatch initial state on mount
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { isOpen } }));
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-30 w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm"
        style={{
          left: isOpen ? '260px' : '16px',
          transition: 'left 300ms ease-in-out'
        }}
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            // Close icon (X)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            // Menu icon (hamburger)
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-20 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Branding */}
        <div className="h-28 px-6 pt-8 pb-0">
          <h1 className="text-base font-normal text-[#101828] tracking-tight mb-1">
            Workspace
          </h1>
          <p className="text-sm text-[#717182]">Book your space</p>
        </div>

        {/* Navigation */}
      <div className="flex-1 px-4">
        <div className="space-y-1 mb-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
              pathname === '/dashboard' 
                ? 'bg-gray-100 text-[#101828]' 
                : 'text-[#4a5565] hover:bg-gray-50'
            }`}
          >
            <img
              src="/assets/a24f59b1afa77a0af0fd52d01319957c8c1816ef.svg"
              alt=""
              className="w-4 h-4"
            />
            Dashboard
          </button>
          <button 
            onClick={() => router.push('/dashboard/booking')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
              pathname === '/booking' 
                ? 'bg-gray-100 text-[#101828]' 
                : 'text-[#4a5565] hover:bg-gray-50'
            }`}
          >
            <img
              src="/assets/d328689530a20f442c7a125bf97d5dc2a61fff01.svg"
              alt=""
              className="w-4 h-4"
            />
            Browse Spaces
          </button>
          <button 
            onClick={() => router.push('/dashboard/myBooking')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
              pathname === '/dashboard/myBooking' 
                ? 'bg-gray-100 text-[#101828]' 
                : 'text-[#4a5565] hover:bg-gray-50'
            }`}
          >
            <img
              src="/assets/60e4e55d9bb30bcf44214b60c31e3794ae6f3c4a.svg"
              alt=""
              className="w-4 h-4"
            />
            My Bookings
          </button>
        </div>

        <div className="h-px bg-black/10 my-4" />

        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#4a5565] text-sm font-medium hover:bg-gray-50">
            <img
              src="/assets/c2fd7a7308e28ed684a5f5392a35f554e5a5e9cd.svg"
              alt=""
              className="w-4 h-4"
            />
            FAQ & Help
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#4a5565] text-sm font-medium hover:bg-gray-50">
            <img
              src="/assets/7e187711dac8dba400baff787c183bcc5cebc2fe.svg"
              alt=""
              className="w-4 h-4"
            />
            Settings
          </button>
        </div>
      </div>

      {/* User Profile & Sign Out */}
      <div className="border-t border-gray-200 px-4 py-4">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="w-10 h-10 bg-[#101828] rounded-full flex items-center justify-center text-white font-medium">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm">{getUserInitials(currentUser)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[#101828] truncate font-medium">
              {getUserDisplayName(currentUser)}
            </p>
            <p className="text-xs text-[#717182] truncate">
              {currentUser?.email || 'user@company.com'}
            </p>
          </div>
        </div>
        <LogoutButton className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#4a5565] text-sm font-medium hover:bg-gray-50">
          <img
            src="/assets/fab12f232bbb3c666849a981e9234d87ca4e3c92.svg"
            alt=""
            className="w-4 h-4"
          />
          Sign Out
        </LogoutButton>
      </div>
    </div>
    </>
  );
}
