/**
 * My Bookings Page
 * Content only - Sidebar and NotificationPanel from layout
 */

'use client';

import { useState } from 'react';
import BookingCard from '@/component/BookingCard';
import { useCurrentUser, useUserBookings, useCheckInBooking, useCheckOutBooking, useCancelBooking } from '@/hooks';
import { useToast } from '@/contexts/ToastContext';
import { formatDateWithDay } from '@/utils/date';

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
  const { currentUser } = useCurrentUser();
  const { showToastMessage } = useToast();
  
  const { data: response, isLoading: loading, refetch } = useUserBookings();
  const { mutate: checkIn } = useCheckInBooking();
  const { mutate: checkOut } = useCheckOutBooking();
  const { mutate: cancel } = useCancelBooking();

  // Extract bookings data from response and format
  const bookingsData = response?.data || [];
  const bookings = bookingsData
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .map(booking => ({
      ...booking,
      date: formatDateWithDay(booking.date)
    }));

  const handleCheckIn = async (booking) => {
    checkIn(
      { bookingId: booking.id, checkinCode: booking.checkin_code },
      {
        onSuccess: (response) => {
          showToastMessage({
            type: 'success',
            title: 'Checked In!',
            message: response.message || `You've successfully checked in to ${booking.space_name}`,
            duration: 5000
          });
          refetch();
        },
        onError: (error) => {
          console.error('Check-in error:', error);
          showToastMessage({
            type: 'error',
            title: 'Check-in Failed',
            message: error.message || 'Failed to check in',
            duration: 5000
          });
        }
      }
    );
  };

  const handleCheckOut = async (booking) => {
    checkOut(booking.id, {
      onSuccess: (response) => {
        showToastMessage({
          type: 'success',
          title: 'Checked Out!',
          message: response.message || `You've successfully checked out from ${booking.space_name}`,
          duration: 5000
        });
        refetch();
      },
      onError: (error) => {
        console.error('Check-out error:', error);
        showToastMessage({
          type: 'error',
          title: 'Check-out Failed',
          message: error.message || 'Failed to check out',
          duration: 5000
        });
      }
    });
  };

  const handleCancel = async (booking) => {
    cancel(booking.id, {
      onSuccess: (response) => {
        showToastMessage({
          type: 'success',
          title: 'Booking Cancelled',
          message: response.message || `Your booking for ${booking.space_name} has been cancelled`,
          duration: 5000
        });
        refetch();
      },
      onError: (error) => {
        console.error('Cancel booking error:', error);
        showToastMessage({
          type: 'error',
          title: 'Cancellation Failed',
          message: error.message || 'Failed to cancel booking',
          duration: 5000
        });
      }
    });
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
        <div className="rounded-2xl p-12 text-center">
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
