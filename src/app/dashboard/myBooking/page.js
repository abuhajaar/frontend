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

  // Separate bookings into active and past
  const activeBookings = bookings.filter(b => 
    b.status === 'active' || b.status === 'checkin'
  );
  
  const pastBookings = bookings.filter(b => 
    b.status === 'cancelled' || b.status === 'finished' || b.status === 'completed' || b.status === 'checkout'
  );

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
    <div className="min-h-full px-4 sm:px-6 md:px-8 py-8 md:py-10 bg-[#FFFFFF]">
      {/* Background Aesthetics */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-purple-200/40 to-blue-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-orange-200/30 to-rose-100/30 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-2">Your Reservations</p>
            <h1 className="text-4xl md:text-5xl font-light text-neutral-900 tracking-tight" style={{ fontFamily: 'Tanker-Regular, sans-serif' }}>
              My <span className="font-normal relative inline-block after:content-[''] after:absolute after:bottom-2 after:left-0 after:w-full after:h-3 after:bg-blue-100/50 after:-z-10">Bookings</span>
            </h1>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-4xl mx-auto">📅</div>
              <p className="text-gray-600 mb-4 text-lg font-medium">No bookings found</p>
              <p className="text-sm text-gray-500">
                Book a space to see it here
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Left Column: Active Bookings */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <h2 className="text-xl font-medium text-gray-900">Active Bookings</h2>
                <span className="text-sm text-gray-400">({activeBookings.length})</span>
              </div>
              
              {activeBookings.length === 0 ? (
                <div className="bg-white rounded-[24px] p-8 text-center border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-2xl mx-auto">✨</div>
                    <p className="text-gray-500 text-sm">No active bookings</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {activeBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCheckIn={handleCheckIn}
                      onCheckOut={handleCheckOut}
                      onCancel={handleCancel}
                      onShowQR={handleShowQR}
                      compact={true}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Past Bookings */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <h2 className="text-xl font-medium text-gray-900">Past Bookings</h2>
                <span className="text-sm text-gray-400">({pastBookings.length})</span>
              </div>
              
              {pastBookings.length === 0 ? (
                <div className="bg-white rounded-[24px] p-8 text-center border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-2xl mx-auto">📋</div>
                    <p className="text-gray-500 text-sm">No past bookings</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {pastBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCheckIn={handleCheckIn}
                      onCheckOut={handleCheckOut}
                      onCancel={handleCancel}
                      onShowQR={handleShowQR}
                      compact={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
