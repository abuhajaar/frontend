/**
 * Booking Layout
 * Wraps booking route with sidebar and notification panel
 * Sidebar renders once and persists
 * Auth check handled by middleware
 */

'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import NotificationPanel from '@/components/NotificationPanel';

export default function BookingLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Listen to sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = (event) => {
      setIsSidebarOpen(event.detail.isOpen);
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    // Get initial state from localStorage
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setIsSidebarOpen(savedState === 'true');
    }

    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Renders once */}
      <Sidebar />
      
      {/* Main Content Area - Responsive to sidebar state */}
      <div 
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: isSidebarOpen ? '256px' : '0px'
        }}
      >
        {/* Top Notification Panel */}
        <NotificationPanel />
        
        {/* Page Content */}
        <main className="relative">
          {children}
        </main>
      </div>
    </div>
  );
}
