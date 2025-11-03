'use client';

/**
 * COMPLETE EXAMPLE: Mixed Space Cards (Booked + Available)
 * This shows a realistic scenario with both booked and available spaces
 */

import { useState } from 'react';
import SpaceCard from './SpaceCard';
import BookedSpaceCard from './BookedSpaceCard';

export default function MixedSpacesExample() {
  // Example data with mixed booked and available spaces
  const [spaces] = useState([
    // BOOKED SPACES (3 variations)
    {
      id: 1,
      name: 'Desk A1',
      type: 'Hot Desk',
      capacity: 1,
      amenities: ['Monitor', 'Power Outlet'],
      isBooked: true,
      bookingTime: '08:00-18:00'
    },
    {
      id: 2,
      name: 'Room B2',
      type: 'Private Room',
      capacity: 4,
      amenities: ['Monitor', 'Whiteboard'],
      isBooked: true,
      bookingTime: '09:00-17:00'
    },
    {
      id: 3,
      name: 'Conference A',
      type: 'Conference Room',
      capacity: 12,
      amenities: ['Projector', 'Video Conference'],
      isBooked: true,
      bookingTime: '14:00-16:00'
    },
    
    // AVAILABLE SPACES
    {
      id: 4,
      name: 'Desk C3',
      type: 'Hot Desk',
      capacity: 1,
      amenities: ['Monitor', 'Power Outlet'],
      isBooked: false,
      icon: '/assets/e9a8acb8b17cb2cce7386825cc93d8c3562d4e74.svg',
      bgColor: '#FFF7ED',
      typeColor: '#EA580C',
      borderColor: '#FB923C',
      badgeColor: '#FFF7ED',
      badgeTextColor: '#EA580C',
      buttonColor: '#EA580C',
      time: '08:00-18:00',
      floor: '3rd'
    },
    {
      id: 5,
      name: 'Room D1',
      type: 'Private Room',
      capacity: 6,
      amenities: ['Whiteboard', 'Standing Desk'],
      isBooked: false,
      icon: '/assets/b63d2480399ef9af5bbee97a82bea049fa954449.svg',
      bgColor: '#F0FDF4',
      typeColor: '#16A34A',
      borderColor: '#4ADE80',
      badgeColor: '#F0FDF4',
      badgeTextColor: '#16A34A',
      buttonColor: '#16A34A',
      time: '09:00-17:00',
      floor: '2nd'
    },
  ]);

  const handleBookSpace = (space) => {
    console.log('Booking space:', space);
    // Handle booking logic here
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-950 mb-2">
            Workspace Booking
          </h1>
          <p className="text-lg text-gray-600">
            Your booked spaces and available options
          </p>
        </div>

        {/* Booked Spaces Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-neutral-950 mb-4">
            Your Bookings ({spaces.filter(s => s.isBooked).length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces
              .filter(space => space.isBooked)
              .map((space) => (
                <BookedSpaceCard
                  key={space.id}
                  space={space}
                  bookingTime={space.bookingTime}
                />
              ))}
          </div>
        </div>

        {/* Available Spaces Section */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-950 mb-4">
            Available Spaces ({spaces.filter(s => !s.isBooked).length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces
              .filter(space => !space.isBooked)
              .map((space) => (
                <SpaceCard
                  key={space.id}
                  space={space}
                  onBook={handleBookSpace}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
