'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/component/ProtectedRoute';
import LogoutButton from '@/component/LogoutButton';
import SpaceCard from '@/component/SpaceCard';
import BookingModal from '@/component/BookingModal';
import { auth } from '@/lib/auth';

function BookingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('2025-10-26'); // YYYY-MM-DD format for API
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user on mount
  useEffect(() => {
    const user = auth.getUser();
    console.log('Booking page - Current user:', user);
    setCurrentUser(user);
  }, []);

  // Helper function to get user display name
  const getUserDisplayName = (user) => {
    if (!user) return 'User';
    // Priority: name > username > email username part
    if (user.name) return user.name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  // Helper function to get user initials for avatar
  const getUserInitials = (user) => {
    if (!user) return 'U';
    const displayName = getUserDisplayName(user);
    
    // If it's a full name with spaces
    const names = displayName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    // Otherwise take first 2 characters
    return displayName.substring(0, 2).toUpperCase();
  };

  // Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) {
      return 'st';
    }
    if (j === 2 && k !== 12) {
      return 'nd';
    }
    if (j === 3 && k !== 13) {
      return 'rd';
    }
    return 'th';
  };

  // Helper function to format date for display (e.g., "October 16th, 2025")
  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const monthName = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();
    
    // Add ordinal suffix (1st, 2nd, 3rd, etc.)
    const suffix = getOrdinalSuffix(dayNum);
    
    return `${monthName} ${dayNum}${suffix}, ${year}`;
  };

  // Check if date is weekend or if API returns no spaces
  const isWeekendOrHoliday = (dateStr) => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();
    // 0 = Sunday, 6 = Saturday
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  // Fetch spaces from API with date and time parameters
  const fetchSpaces = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        date: selectedDate,
        start_time: startTime,
        end_time: endTime,
      });
      
      const response = await fetch(`http://192.168.1.101:5000/api/spaces?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch spaces');
      }
      
      const result = await response.json();
      const apiData = result.data || [];
      
      // Map API data to include UI properties
      const mappedSpaces = apiData.map(space => {
        // Determine type label and colors based on space type
        let type, typeColor, bgColor, icon, badgeColor, badgeTextColor, buttonColor, borderColor;
        
        if (space.type === 'hot_desk') {
          type = 'Hot Desk';
          typeColor = '#1447E6';
          bgColor = '#DBEAFE';
          icon = '/assets/e9a8acb8b17cb2cce7386825cc93d8c3562d4e74.svg';
          badgeColor = '#DBEAFE';
          badgeTextColor = '#1447E6';
          buttonColor = '#2563EB';
          borderColor = '#2B7FFF';
        } else if (space.type === 'private_room') {
          type = 'Private Room';
          typeColor = '#8200DB';
          bgColor = '#F3E8FF';
          icon = '/assets/b277a61a694aff124f107ca648d2a70df5cc1d10.svg';
          badgeColor = '#F3E8FF';
          badgeTextColor = '#8200DB';
          buttonColor = '#9333EA';
          borderColor = '#AD46FF';
        } else if (space.type === 'meeting_room') {
          type = 'Meeting Room';
          typeColor = '#CA3500';
          bgColor = '#FFEDD4';
          icon = '/assets/2f942f19516ee84dd5c5646164f23bcd8aa2a546.svg';
          badgeColor = '#FFEDD4';
          badgeTextColor = '#CA3500';
          buttonColor = '#EA580C';
          borderColor = '#FF6900';
        } else {
          // Default fallback
          type = space.type;
          typeColor = '#4A5565';
          bgColor = '#F3F4F6';
          icon = '/assets/e9a8acb8b17cb2cce7386825cc93d8c3562d4e74.svg';
          badgeColor = '#F3F4F6';
          badgeTextColor = '#4A5565';
          buttonColor = '#6B7280';
          borderColor = '#D1D5DB';
        }
        
        // Extract floor from location (e.g., "Lantai 12" -> "12th")
        const floorMatch = space.location?.match(/\d+/);
        const floor = floorMatch ? `${floorMatch[0]}${getOrdinalSuffix(floorMatch[0])}` : space.location;
        
        // Get opening hours for today (Monday as default)
        const today = 'mon';
        const hours = space.opening_hours?.[today];
        const time = hours ? `${hours.start}-${hours.end}` : '08:00-18:00';
        
        // Map amenities to just names array
        const amenities = space.amenities?.map(a => a.name) || [];
        
        return {
          id: space.id,
          name: space.name,
          type: type,
          typeColor,
          bgColor,
          icon,
          capacity: space.capacity,
          badgeColor,
          badgeTextColor,
          time,
          amenities,
          buttonColor,
          borderColor,
          floor,
          location: space.location,
          status: space.status,
        };
      });
      
      setSpaces(mappedSpaces);
      setError(null);
      setHasSearched(true);
    } catch (err) {
      console.error('Error fetching spaces:', err);
      setError(err.message);
      setSpaces([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAvailability = () => {
    fetchSpaces();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    if (notificationOpen) setNotificationOpen(false);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
    if (sidebarOpen) setSidebarOpen(false);
  };

  const handleBookSpace = (space) => {
    setSelectedSpace(space);
    setModalOpen(true);
  };

  // Get unique floors from spaces data
  const getAvailableFloors = () => {
    const floors = spaces.map(space => space.floor).filter(Boolean);
    const uniqueFloors = [...new Set(floors)].sort((a, b) => {
      // Extract numbers for proper sorting
      const numA = parseInt(a.match(/\d+/)?.[0] || 0);
      const numB = parseInt(b.match(/\d+/)?.[0] || 0);
      return numA - numB;
    });
    return uniqueFloors;
  };

  const filteredSpaces = spaces.filter(space => {
    const floorMatch = selectedFloor === 'all' || space.floor === selectedFloor;
    const typeMatch = selectedType === 'all' || 
      (selectedType === 'hot-desk' && space.type === 'Hot Desk') ||
      (selectedType === 'private' && space.type === 'Private Room') ||
      (selectedType === 'meeting' && space.type === 'Meeting Room');
    return floorMatch && typeMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Mobile backdrop overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-20 transition-transform duration-500 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-4">
          <h1 className="text-base font-normal text-[#101828] tracking-[-0.3125px] leading-6">
            Workspace
          </h1>
          <p className="text-sm text-[#717182] tracking-[-0.1504px] leading-5 mt-1">
            Book your space
          </p>
        </div>

        {/* Navigation */}
        <div className="px-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Link href="/dashboard">
              <div className="flex items-center gap-3 px-3 py-2 rounded-[14px] cursor-pointer hover:bg-gray-100 transition-all">
                <img src="/assets/0017529fcef5d0806211e60979cf6abeace23513.svg" alt="" className="w-4 h-4" />
                <span className="text-sm font-medium text-[#4A5565] tracking-[-0.1504px] leading-5">Dashboard</span>
              </div>
            </Link>
            <div className="flex items-center gap-3 px-3 py-2 rounded-[14px] bg-gray-100">
              <img src="/assets/606d798c90388595cd27041dedc0abd588d99737.svg" alt="" className="w-4 h-4" />
              <span className="text-sm font-medium text-[#101828] tracking-[-0.1504px] leading-5">Browse Spaces</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-[14px] cursor-pointer hover:bg-gray-100 transition-all">
              <img src="/assets/60e4e55d9bb30bcf44214b60c31e3794ae6f3c4a.svg" alt="" className="w-4 h-4" />
              <span className="text-sm font-medium text-[#4A5565] tracking-[-0.1504px] leading-5">My Bookings</span>
            </div>
          </div>

          <div className="h-px bg-[rgba(0,0,0,0.1)]" />

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 px-3 py-2 rounded-[14px] cursor-pointer hover:bg-gray-100 transition-all">
              <img src="/assets/c2fd7a7308e28ed684a5f5392a35f554e5a5e9cd.svg" alt="" className="w-4 h-4" />
              <span className="text-sm font-medium text-[#4A5565] tracking-[-0.1504px] leading-5">FAQ & Help</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-[14px] cursor-pointer hover:bg-gray-100 transition-all">
              <img src="/assets/7e187711dac8dba400baff787c183bcc5cebc2fe.svg" alt="" className="w-4 h-4" />
              <span className="text-sm font-medium text-[#4A5565] tracking-[-0.1504px] leading-5">Settings</span>
            </div>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 px-4 pt-4 pb-4">
          <div className="flex items-center gap-3 px-2 py-2 rounded-[14px] mb-2">
            <div className="w-10 h-10 rounded-full bg-[#101828] flex items-center justify-center text-white font-medium">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-sm">{getUserInitials(currentUser)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#101828] tracking-[-0.1504px] leading-5 truncate font-medium">
                {getUserDisplayName(currentUser)}
              </p>
              <p className="text-xs text-[#717182] leading-4 truncate">
                {currentUser?.email || 'user@company.com'}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>

      {/* Hamburger button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-6 z-10 w-10 h-10 bg-white border border-gray-200 rounded-[14px] flex items-center justify-center transition-all duration-500 ease-in-out ${
          sidebarOpen ? 'left-[280px]' : 'left-6'
        }`}
      >
        <img src="/assets/32ac3a0299bf4fe858ee844c270aff8e418a9583.svg" alt="" className="w-5 h-5" />
      </button>

      {/* Notification button */}
      <button
        onClick={toggleNotification}
        className="fixed top-6 right-6 z-10 w-12 h-12 bg-white border border-[rgba(229,231,235,0.8)] rounded-2xl flex items-center justify-center"
      >
        <img src="/assets/2cce2494b226fc1bccb273938d368812616a41cf.svg" alt="" className="w-5 h-5" />
      </button>

      {/* Notification panel */}
      {notificationOpen && (
        <div className="fixed right-6 top-[76px] w-full max-w-96 bg-white rounded-2xl shadow-lg border border-gray-200 z-20 animate-slideDown">
          <div className="p-6">
            <h3 className="text-base font-medium text-neutral-950 tracking-[-0.3125px] leading-6 mb-4">
              Notifications
            </h3>
            <p className="text-sm text-[#717182] tracking-[-0.1504px] leading-5">
              No new notifications
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`transition-all duration-500 ease-in-out ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 pt-20 md:pt-12 pb-12">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-xl font-medium text-neutral-950 tracking-[-0.4492px] leading-[30px] mb-2">
              Find Your Space
            </h2>
            <p className="text-base text-[#717182] tracking-[-0.3125px] leading-6">
              Select your preferred date and time to see available workspaces
            </p>
          </div>

          {/* Date & Time Selector */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
            <div className="mb-6">
              <h3 className="text-base font-normal text-neutral-950 tracking-[-0.3125px] leading-6 mb-1">
                Select Date & Time
              </h3>
              <p className="text-sm text-[#717182] tracking-[-0.1504px] leading-5">
                Choose when you need a workspace to see availability
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-neutral-950 tracking-[-0.1504px] leading-[14px] mb-2">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-3 text-base text-neutral-950 tracking-[-0.3125px] leading-6 cursor-pointer"
                  />
                </div>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-neutral-950 tracking-[-0.1504px] leading-[14px] mb-2">
                  Start Time
                </label>
                <select 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-3 text-base text-neutral-950 tracking-[-0.3125px] leading-6 cursor-pointer"
                >
                  {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-neutral-950 tracking-[-0.1504px] leading-[14px] mb-2">
                  End Time
                </label>
                <select 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-3 text-base text-neutral-950 tracking-[-0.3125px] leading-6 cursor-pointer"
                >
                  {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              onClick={handleSearchAvailability}
              disabled={loading}
              className="bg-black text-white text-sm font-medium tracking-[-0.1504px] leading-5 px-8 py-2 rounded-[14px] ml-auto block hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search Availability'}
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Floor Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => setSelectedFloor('all')}
                className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 transition-all ${
                  selectedFloor === 'all' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-neutral-950'
                }`}
              >
                All Floors
              </button>
              {getAvailableFloors().map(floor => (
                <button 
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 flex items-center gap-2 transition-all ${
                    selectedFloor === floor ? 'bg-black text-white' : 'bg-white border border-gray-200 text-neutral-950'
                  }`}
                >
                  <img src="/assets/7fefcd1b6d178ca5760daf13e3c0ffe13bd03081.svg" alt="" className="w-4 h-4" />
                  {floor} Floor
                </button>
              ))}
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-2 md:border-l md:border-gray-200 md:pl-4">
              <button 
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 transition-all ${
                  selectedType === 'all' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-neutral-950'
                }`}
              >
                All Types
              </button>
              <button 
                onClick={() => setSelectedType('hot-desk')}
                className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 transition-all ${
                  selectedType === 'hot-desk' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-neutral-950'
                }`}
              >
                Hot Desks
              </button>
              <button 
                onClick={() => setSelectedType('private')}
                className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 transition-all ${
                  selectedType === 'private' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-neutral-950'
                }`}
              >
                Private Rooms
              </button>
              <button 
                onClick={() => setSelectedType('meeting')}
                className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 transition-all ${
                  selectedType === 'meeting' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-neutral-950'
                }`}
              >
                Meeting Rooms
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-base text-[#717182] tracking-[-0.3125px] leading-6">
                  Loading spaces...
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-base text-red-600 tracking-[-0.3125px] leading-6 mb-2">
                Failed to load spaces
              </p>
              <p className="text-sm text-red-500 tracking-[-0.1504px] leading-5">
                {error}
              </p>
            </div>
          )}

          {/* Spaces Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {!hasSearched ? (
                <div className="col-span-full text-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <img src="/assets/e989417bb1ce761a34ffa1b2d4ae037ff1890258.svg" alt="" className="w-16 h-16 opacity-30" />
                    <div>
                      <p className="text-base text-neutral-950 tracking-[-0.3125px] leading-6 mb-2">
                        Ready to find your perfect workspace?
                      </p>
                      <p className="text-sm text-[#717182] tracking-[-0.1504px] leading-5">
                        Select your date and time above, then click "Search Availability" to see available spaces
                      </p>
                    </div>
                  </div>
                </div>
              ) : spaces.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    {isWeekendOrHoliday(selectedDate) ? (
                      <>
                        <div className="text-6xl mb-2">🏖️</div>
                        <div>
                          <p className="text-xl text-neutral-950 tracking-[-0.3125px] leading-6 mb-2 font-medium">
                            Who works on weekends? C'mon now! 😄
                          </p>
                          <p className="text-sm text-[#717182] tracking-[-0.1504px] leading-5">
                            Try selecting a weekday to find available spaces
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-6xl mb-2">🎉</div>
                        <div>
                          <p className="text-xl text-neutral-950 tracking-[-0.3125px] leading-6 mb-2 font-medium">
                            Looks like a holiday! Time to relax 🌴
                          </p>
                          <p className="text-sm text-[#717182] tracking-[-0.1504px] leading-5">
                            No spaces available for this date. Maybe try a different day?
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : filteredSpaces.length > 0 ? (
                filteredSpaces.map(space => (
                  <SpaceCard key={space.id} space={space} onBook={handleBookSpace} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-base text-[#717182] tracking-[-0.3125px] leading-6">
                    No spaces found matching your criteria. Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        space={selectedSpace}
        bookingDetails={{
          date: formatDateForDisplay(selectedDate),
          startTime: startTime,
          endTime: endTime,
        }}
      />
    </div>
  );
}

export default function Booking() {
  return (
    <ProtectedRoute>
      <BookingPage />
    </ProtectedRoute>
  );
}
