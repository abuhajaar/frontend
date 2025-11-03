/**
 * My Bookings Page
 * Content only - Sidebar and NotificationPanel from layout
 */

'use client';

import { useState, useEffect } from 'react';
import BookingCard from '@/components/mybooking/BookingCard';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useToast } from '@/contexts/ToastContext';
import { formatDateWithDay } from '@/utils/date';
import { getUserBookings, checkInBooking, checkOutBooking, cancelBooking } from '@/services/bookingService';

// Map API status values to UI status values
const mapStatusToUI = (status) => {
  const statusMap = {
    'active': 'active',
    'checkin': 'checkin',         // Keep as 'checkin' for blue badge
    'checkout': 'finished',       // Map to 'finished' for gray badge
    'finished': 'finished',       // Keep as 'finished' for gray badge
    'completed': 'finished',      // Map to 'finished' for gray badge
    'cancel': 'cancelled',
    'cancelled': 'cancelled'
  };
  
  return statusMap[status?.toLowerCase()] || status;
};

export default function MyBookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { currentUser } = useCurrentUser();
  const { showToastMessage } = useToast();

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      // Wait for user data to be available
      if (!currentUser || !currentUser.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch bookings from API
        const response = await getUserBookings(currentUser.id);
        
        // Extract bookings data from API response
        const bookingsData = response.data || [];
        
        // Sort bookings by created_at descending (newest first)
        const sortedBookings = bookingsData.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA; // Descending order (newest first)
        });
        
        // Format dates for display
        const formattedBookings = sortedBookings.map(booking => ({
          ...booking,
          date: formatDateWithDay(booking.date)
        }));
        
        setBookings(formattedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        showToastMessage({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to load bookings',
          duration: 5000
        });
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser, showToastMessage]);

  const handleCheckIn = async (booking) => {
    try {
      // Call check-in API
      const response = await checkInBooking(booking.id, booking.checkin_code);
      
      // Update booking in state with status and checkin_at
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.id === booking.id 
            ? { 
                ...b, 
                checkin_at: response.data?.checkin_at || new Date().toISOString(),
                status: mapStatusToUI(response.data?.status) || 'checkin'
              }
            : b
        )
      );
      
      showToastMessage({
        type: 'success',
        title: 'Checked In!',
        message: response.message || `You've successfully checked in to ${booking.space_name}`,
        duration: 5000
      });
    } catch (error) {
      console.error('Check-in error:', error);
      showToastMessage({
        type: 'error',
        title: 'Check-in Failed',
        message: error.message || 'Failed to check in',
        duration: 5000
      });
    }
  };

  const handleCheckOut = async (booking) => {
    try {
      // Call check-out API
      const response = await checkOutBooking(booking.id);
      
      // Update booking in state with status and checkout_at
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.id === booking.id 
            ? { 
                ...b, 
                checkout_at: response.data?.checkout_at || new Date().toISOString(), 
                status: mapStatusToUI(response.data?.status) || 'finished'
              }
            : b
        )
      );
      
      showToastMessage({
        type: 'success',
        title: 'Checked Out!',
        message: response.message || `You've successfully checked out from ${booking.space_name}`,
        duration: 5000
      });
    } catch (error) {
      console.error('Check-out error:', error);
      showToastMessage({
        type: 'error',
        title: 'Check-out Failed',
        message: error.message || 'Failed to check out',
        duration: 5000
      });
    }
  };

  const handleCancel = async (booking) => {
    try {
      // Call cancel booking API
      const response = await cancelBooking(booking.id);
      
      // Update booking status in state
      setBookings(prevBookings => 
        prevBookings.map(b => 
          b.id === booking.id 
            ? { ...b, status: mapStatusToUI(response.data?.status) || 'cancelled' }
            : b
        )
      );
      
      showToastMessage({
        type: 'success',
        title: 'Booking Cancelled',
        message: response.message || `Your booking for ${booking.space_name} has been cancelled`,
        duration: 5000
      });
    } catch (error) {
      console.error('Cancel booking error:', error);
      showToastMessage({
        type: 'error',
        title: 'Cancellation Failed',
        message: error.message || 'Failed to cancel booking',
        duration: 5000
      });
    }
  };

  const handleShowQR = (booking) => {
    // TODO: Show QR code modal
    showToastMessage({
      type: 'success',
      title: 'QR Code',
      message: 'QR code feature coming soon',
      duration: 3000
    });
  };

  return (
    <div className="px-6 pt-20 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-neutral-950 mb-2">
          My Bookings
        </h1>
        <p className="text-gray-600">
          View and manage your space reservations
        </p>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <p className="text-gray-600 mb-4">No bookings found</p>
          <p className="text-sm text-gray-500">
            Book a space to see it here
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              onCancel={handleCancel}
              onShowQR={handleShowQR}
            />
          ))}
        </div>
      )}
    </div>
  );
}
