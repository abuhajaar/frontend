/**
 * Booking Page
 * Content only - Sidebar and NotificationPanel from layout
 */

'use client';

import { useState, useEffect } from 'react';
import BookingModal from '@/component/BookingModal';
import DateTimeSelector from '@/components/booking/DateTimeSelector';
import FilterBar from '@/components/booking/FilterBar';
import SpacesGrid from '@/components/booking/SpacesGrid';
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

      {/* Filter Bar */}
      <FilterBar
        selectedFloor={selectedFloor}
        selectedType={selectedType}
        availableFloors={availableFloors}
        onFloorChange={setSelectedFloor}
        onTypeChange={setSelectedType}
      />

      {/* Spaces Grid */}
      <SpacesGrid
        spaces={spaces}
        filteredSpaces={filteredSpaces}
        loading={loading}
        error={error}
        hasSearched={hasSearched}
        selectedDate={selectedDate}
        onBookSpace={handleBookSpace}
      />

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
