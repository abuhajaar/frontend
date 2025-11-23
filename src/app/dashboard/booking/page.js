/**
 * Booking Page
 * Content only - Sidebar and NotificationPanel from layout
 */

'use client';

import { useState, useEffect } from 'react';
import BookingModal from '@/component/BookingModal';
import DateTimeSelector from '@/component/DateTimeSelector';
import FilterBar from '@/component/FilterBar';
import SpacesGrid from '@/component/SpacesGrid';
import FloorPlan from '@/component/floor-plan/FloorPlan';
import { useBookingSearch } from '@/hooks/useBookingSearch';
import { getUniqueFloors, filterSpaces } from '@/utils/space';

export default function BookingPage() {
  // UI State
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('floorplan'); // 'grid' or 'floorplan'
  const [selectedDeskId, setSelectedDeskId] = useState(null);

  // Set default date to today on mount
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setSelectedDate(formattedDate);
  }, []);

  // Custom hooks for data management
  const { spaces, loading, error, hasSearched, searchSpaces } = useBookingSearch();

  // Derived state
  const availableFloors = getUniqueFloors(spaces);
  const filteredSpaces = filterSpaces(spaces, selectedFloor, selectedType);

  // Filter spaces for Lantai 1 - both hot desks and meeting rooms
  const floor1HotDesks = spaces.filter(space => {
    const isFloor1 = space.location?.includes('Lantai 1') || space.floor === '1st';
    const isHotDesk = space.rawType === 'hot_desk' || space.type === 'Hot Desk';
    return isFloor1 && isHotDesk;
  });

  const floor1MeetingRooms = spaces.filter(space => {
    const isFloor1 = space.location?.includes('Lantai 1') || space.floor === '1st';
    const isMeetingRoom = space.rawType === 'meeting_room' || space.type === 'Meeting Room';
    return isFloor1 && isMeetingRoom;
  });

  // Map API spaces to SVG element IDs
  // Hot Desks: Assign sequential SVG IDs (hotDesk01, hotDesk02, etc.) to hot desk spaces
  // Meeting Rooms: Assign sequential SVG IDs (meetingRoom01, meetingRoom02, meetingRoom03) to meeting room spaces
  const deskSpaceMap = {};
  const occupiedDesks = [];
  
  // Map hot desks sequentially
  floor1HotDesks.forEach((space, index) => {
    const deskId = `hotDesk${String(index + 1).padStart(2, '0')}`;
    deskSpaceMap[deskId] = space;
    
    // Only mark as occupied if explicitly set to unavailable by the API for this time slot
    // is_available: false means there's a booking conflict for the selected time
    const isNotAvailable = space.is_available === false;
    if (isNotAvailable) {
      occupiedDesks.push(deskId);
    }
  });

  // Map meeting rooms sequentially
  floor1MeetingRooms.forEach((space, index) => {
    const roomId = `meetingRoom${String(index + 1).padStart(2, '0')}`;
    deskSpaceMap[roomId] = space;
    
    // Only mark as occupied if explicitly set to unavailable by the API for this time slot
    const isNotAvailable = space.is_available === false;
    if (isNotAvailable) {
      occupiedDesks.push(roomId);
    }
  });

  // Debug log to verify mapping
  console.log('Floor 1 Spaces Mapping:', {
    totalHotDesks: floor1HotDesks.length,
    totalMeetingRooms: floor1MeetingRooms.length,
    hotDeskMappings: floor1HotDesks.map((space, index) => ({
      apiId: space.id,
      apiName: space.name,
      svgId: `hotDesk${String(index + 1).padStart(2, '0')}`,
      isAvailable: space.is_available,
      status: space.status
    })),
    meetingRoomMappings: floor1MeetingRooms.map((space, index) => ({
      apiId: space.id,
      apiName: space.name,
      svgId: `meetingRoom${String(index + 1).padStart(2, '0')}`,
      isAvailable: space.is_available,
      status: space.status
    })),
    deskSpaceMap: Object.keys(deskSpaceMap),
    occupiedDesks,
    availableSpaces: Object.keys(deskSpaceMap).filter(id => !occupiedDesks.includes(id))
  });

  // Event handlers
  const handleSearch = () => {
    searchSpaces(selectedDate, startTime, endTime);
  };

  const handleBookSpace = (space) => {
    setSelectedSpace(space);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpace(null);
    setSelectedDeskId(null);
  };

  const handleDeskSelect = (desk) => {
    setSelectedDeskId(desk.id);
    
    // Get the space data from API based on desk ID
    const deskSpace = deskSpaceMap[desk.id];
    
    if (deskSpace) {
      // Use the actual space data from API
      handleBookSpace(deskSpace);
    } else {
      // Fallback if space not found in API data (shouldn't happen if API is correct)
      const isMeetingRoom = desk.type === 'meetingRoom';
      const fallbackSpace = {
        id: desk.id,
        name: desk.name || (isMeetingRoom ? `Meeting Room ${desk.number}` : `Hot Desk ${desk.number}`),
        type: isMeetingRoom ? 'Meeting Room' : 'Hot Desk',
        floor: '1st',
        capacity: isMeetingRoom ? 8 : 1,
        amenities: isMeetingRoom 
          ? ['Whiteboard', 'Projector', 'Conference Phone', 'WiFi']
          : ['Monitor', 'Desk Lamp', 'Ergonomic Chair'],
        opening_hours: '09:00-18:00',
        max_duration: 480,
        status: 'available'
      };
      handleBookSpace(fallbackSpace);
    }
  };

  return (
    <div className="p-8 pt-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[2rem] text-neutral-950 font-semibold tracking-[-0.05em] leading-10 mb-2">
          Browse Available Spaces
        </h1>
        <p className="text-base text-[#717182] tracking-[-0.3125px] leading-6">
          Find and book your perfect workspace
        </p>
      </div>

      {/* Date and Time Selector */}
      <DateTimeSelector
        selectedDate={selectedDate}
        startTime={startTime}
        endTime={endTime}
        onDateChange={setSelectedDate}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* View Mode Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <FilterBar
          selectedFloor={selectedFloor}
          selectedType={selectedType}
          availableFloors={availableFloors}
          onFloorChange={setSelectedFloor}
          onTypeChange={setSelectedType}
        />
        
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-neutral-950 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="2" y="2" width="5" height="5" rx="1"/>
                <rect x="9" y="2" width="5" height="5" rx="1"/>
                <rect x="2" y="9" width="5" height="5" rx="1"/>
                <rect x="9" y="9" width="5" height="5" rx="1"/>
              </svg>
              Grid View
            </div>
          </button>
          <button
            onClick={() => setViewMode('floorplan')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              viewMode === 'floorplan'
                ? 'bg-neutral-950 text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="14" height="14" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M1 5h14M5 1v14" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Floor Plan
            </div>
          </button>
        </div>
      </div>

      {/* Conditional rendering based on view mode */}
      {viewMode === 'floorplan' ? (
        hasSearched ? (
          <FloorPlan
            occupiedDesks={occupiedDesks}
            onDeskSelect={handleDeskSelect}
            selectedDeskId={selectedDeskId}
            selectedDate={selectedDate}
          />
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl p-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <path d="M3 9h18M9 3v18"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-950 mb-2">
                Select Date and Time
              </h3>
              <p className="text-sm text-slate-600">
                Please select your preferred date and time, then click "Search" to view available spaces on the floor plan.
              </p>
            </div>
          </div>
        )
      ) : (
        <SpacesGrid
          spaces={spaces}
          filteredSpaces={filteredSpaces}
          loading={loading}
          error={error}
          hasSearched={hasSearched}
          selectedDate={selectedDate}
          onBookSpace={handleBookSpace}
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        space={selectedSpace}
        bookingDetails={{
          date: selectedDate,
          startTime: startTime,
          endTime: endTime
        }}
      />
    </div>
  );
}
