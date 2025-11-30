/**
 * Dashboard Layout
 * Wraps all dashboard routes with sidebar and notification panel
 * Sidebar renders once and persists across all dashboard pages
 * Auth check handled by middleware
 */

'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/component/Sidebar';
import NotificationPanel from '@/component/NotificationPanel';

export default function DashboardLayout({ children }) {
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
    <div className="flex min-h-screen bg-white">
      {/* Sidebar - Renders once for all dashboard pages */}
      <Sidebar />
      
      {/* Main Content Area - Responsive to sidebar state */}
      <div 
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: isSidebarOpen ? '256px' : '72px'
        }}
      >
        {/* Top Notification Panel - Hidden for now */}
        {/* <NotificationPanel /> */}
        
        {/* Page Content - This changes when navigating between dashboard pages */}
        <main className="relative">
          {children}
        </main>
      </div>
    </div>
  );
}
