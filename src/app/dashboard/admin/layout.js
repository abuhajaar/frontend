'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Calendar, Users, Building2, Layers, Boxes, CalendarOff } from 'lucide-react';

const adminTabs = [
  { name: 'Overview', path: '/dashboard/admin', icon: Home },
  { name: 'Spaces', path: '/dashboard/admin/spaces', icon: LayoutGrid },
  { name: 'Bookings', path: '/dashboard/admin/bookings', icon: Calendar },
  { name: 'Users', path: '/dashboard/admin/users', icon: Users },
  { name: 'Departments', path: '/dashboard/admin/departments', icon: Building2 },
  { name: 'Floors', path: '/dashboard/admin/floors', icon: Layers },
  { name: 'Amenities', path: '/dashboard/admin/amenities', icon: Boxes },
  { name: 'Blackouts', path: '/dashboard/admin/blackouts', icon: CalendarOff },
];

// Icon components as inline SVGs
const icons = {
  overview: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 8L9 2L16 8V16C16 16.5304 15.7893 17.0391 15.4142 17.4142C15.0391 17.7893 14.5304 18 14 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  spaces: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="2" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="10" y="10" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  bookings: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 2V6M12 2V6M3 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 16C3 13 5.5 11 9 11C12.5 11 15 13 15 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  departments: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 2V16M2 9H16" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  floors: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 4H16M2 9H16M2 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  amenities: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 2L11.5 7H16L12 10.5L13.5 16L9 12.5L4.5 16L6 10.5L2 7H6.5L9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  ),
  blackouts: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 5V9L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
};

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide">
            {adminTabs.map((tab) => {
              const isActive = pathname === tab.path;
              
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`
                    relative flex items-center gap-2.5 px-4 py-3.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'text-neutral-950 bg-gray-50' 
                      : 'text-[#717182] hover:text-neutral-950 hover:bg-gray-50/50'
                    }
                  `}
                >
                  <tab.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                  <span className={`font-['Inter'] text-[14px] leading-[20px] tracking-[-0.3008px] whitespace-nowrap ${isActive ? 'font-medium' : 'font-normal'}`}>
                    {tab.name}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-neutral-950 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 bg-white">
        {children}
      </div>
    </div>
  );
}
