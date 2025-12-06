/**
 * BookingCard Component
 * Displays individual booking details with actions
 * Active bookings have green background (from Figma)
 */

'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';

export default function BookingCard({ booking, onCheckIn, onCheckOut, onCancel, onShowQR, compact = false }) {
  const [showQRCode, setShowQRCode] = useState(false);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100',
        text: 'text-[#016630]',
        label: 'active'
      },
      checkin: {
        bg: 'bg-blue-100',
        text: 'text-[#193cb8]',
        label: 'checked-in'
      },
      finished: {
        bg: 'bg-[#fef9c2]',
        text: 'text-[#894b00]',
        label: 'finished'
      },
      completed: {
        bg: 'bg-[#fef9c2]',
        text: 'text-[#894b00]',
        label: 'finished'
      },
      cancelled: {
        bg: 'bg-gray-100',
        text: 'text-[#1e2939]',
        label: 'cancelled'
      }
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <div className={`${config.bg} border border-transparent rounded-[8px] px-[9px] py-[3px] h-[22px] flex items-center justify-center`}>
        <p className={`font-medium text-[12px] leading-[16px] ${config.text}`}>
          {config.label}
        </p>
      </div>
    );
  };

  // Get card background and border based on status
  const getCardStyle = (status) => {
    if (status === 'active') {
      return {
        bg: 'bg-green-50',
        border: 'border-[#b9f8cf]'
      };
    }
    if (status === 'checkin') {
      return {
        bg: 'bg-blue-50',
        border: 'border-[#bedbff]'
      };
    }
    if (status === 'cancelled') {
      return {
        bg: 'bg-red-50',
        border: 'border-[#ffc9c9]'
      };
    }
    if (status === 'finished' || status === 'completed') {
      return {
        bg: 'bg-yellow-50',
        border: 'border-[#fff085]'
      };
    }
    return {
      bg: 'bg-white',
      border: 'border-gray-200'
    };
  };

  const cardStyle = getCardStyle(booking.status);

  // Check if booking has buttons (not cancelled or finished)
  const hasButtons = booking.status !== 'cancelled' && booking.status !== 'finished' && booking.status !== 'completed';

  // Compact mode rendering
  if (compact) {
    return (
      <div className={`${cardStyle.bg} border ${cardStyle.border} rounded-[16px] p-[16px] flex flex-col gap-[12px] h-full`}>
        {/* Header: Space Name & Status */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[2px]">
            <h3 className="font-medium text-[14px] leading-[20px] tracking-[-0.3125px] text-neutral-950">
              {booking.space_name}
            </h3>
            <p className="font-normal text-[12px] leading-[16px] tracking-[-0.1504px] text-[#717182]">
              {booking.space_type}
            </p>
          </div>
          {getStatusBadge(booking.status)}
        </div>

        {/* Date & Time Info */}
        <div className="flex flex-col gap-[6px]">
          {/* Date */}
          <div className="flex items-center gap-[6px]">
            <img 
              src="/assets/d5ce048667629374475c5e2698f94f4c7e50c11f.svg" 
              alt="Calendar" 
              className="w-[14px] h-[14px]"
            />
            <p className="font-normal text-[12px] leading-[16px] tracking-[-0.1504px] text-[#717182]">
              {booking.date}
            </p>
          </div>

          {/* Time */}
          <div className="flex items-center gap-[6px]">
            <img 
              src="/assets/6c19041890678fea04354a56ac73a90d63546598.svg" 
              alt="Clock" 
              className="w-[14px] h-[14px]"
            />
            <p className="font-normal text-[12px] leading-[16px] tracking-[-0.1504px] text-[#717182]">
              {booking.start_time} - {booking.end_time}
            </p>
          </div>
        </div>

        {/* Check-in Code */}
        {hasButtons && booking.checkin_code && (
          <div className="bg-gray-50 rounded-[12px] p-[10px] flex flex-col gap-[2px]">
            <p className="font-normal text-[11px] leading-[16px] tracking-[-0.1504px] text-[#717182]">
              Check-in Code
            </p>
            <p className="font-medium text-[14px] leading-[20px] tracking-[-0.3125px] text-neutral-950">
              {booking.checkin_code}
            </p>
          </div>
        )}

        {/* Actions */}
        {hasButtons && (
          <div className="flex flex-col gap-[8px] mt-auto">
            {/* Primary Action */}
            {!booking.checkin_at ? (
              <button
                onClick={() => onCheckIn(booking)}
                disabled={booking.status !== 'active'}
                className="bg-white border border-[#b9f8cf] rounded-[12px] px-[12px] py-[6px] h-[32px] flex items-center justify-center gap-[6px] hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                <img 
                  src="/assets/e4565501cae2d05b318704f819e759a0d85af8ca.svg" 
                  alt="Check In" 
                  className="w-[14px] h-[14px]"
                />
                <p className="font-medium text-[12px] leading-[16px] tracking-[-0.1504px] text-[#00a63e]">
                  Check In
                </p>
              </button>
            ) : (
              <button
                onClick={() => onCheckOut(booking)}
                disabled={booking.status === 'finished' || booking.status === 'cancelled' || booking.checkout_at !== null}
                className="bg-white border border-[#ffd6a7] rounded-[12px] px-[12px] py-[6px] h-[32px] flex items-center justify-center gap-[6px] hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                <img 
                  src="/assets/bbc2ebf7d4f6de18ba37c605a96fd1a7bf3cb129.svg" 
                  alt="Check Out" 
                  className="w-[14px] h-[14px]"
                />
                <p className="font-medium text-[12px] leading-[16px] tracking-[-0.1504px] text-[#f54900]">
                  Check Out
                </p>
              </button>
            )}

            {/* Secondary Actions */}
            <div className="flex gap-[8px]">
              <button
                onClick={() => onCancel(booking)}
                disabled={booking.status === 'finished' || booking.status === 'cancelled'}
                className="flex-1 bg-white border border-[#ffc9c9] rounded-[12px] px-[10px] py-[6px] h-[32px] flex items-center justify-center gap-[4px] hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img 
                  src="/assets/12d525d50ab27e633f32f6b4a4a8dd8ead4212d5.svg" 
                  alt="Cancel" 
                  className="w-[14px] h-[14px]"
                />
                <p className="font-medium text-[11px] leading-[16px] tracking-[-0.1504px] text-[#e7000b]">
                  Cancel
                </p>
              </button>
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                disabled={booking.status === 'finished' || booking.status === 'cancelled'}
                className="flex-1 bg-white border border-gray-200 rounded-[12px] px-[10px] py-[6px] h-[32px] flex items-center justify-center gap-[4px] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img 
                  src="/assets/be29472a3c77c094973bbbadee9cfb2d65ae44f3.svg" 
                  alt="QR Code" 
                  className="w-[14px] h-[14px]"
                />
                <p className="font-medium text-[11px] leading-[16px] tracking-[-0.1504px] text-neutral-950">
                  QR
                </p>
              </button>
            </div>
          </div>
        )}

        {/* QR Code Section - Compact */}
        {hasButtons && showQRCode && (
          <div className="bg-white border border-gray-200 rounded-[12px] p-[12px] flex flex-col items-center gap-[8px]">
            <p className="font-normal text-[11px] leading-[16px] tracking-[-0.1504px] text-[#717182]">
              Scan to check in
            </p>
            <div className="bg-white border-2 border-gray-100 rounded-[10px] p-[8px] flex items-center justify-center">
              <QRCode 
                value={booking.checkin_code || 'N/A'}
                size={100}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>
            <p className="font-normal text-[11px] leading-[16px] text-[#717182]">
              Code: <span className="text-[#101828] font-medium">{booking.checkin_code || 'N/A'}</span>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Regular mode rendering
  return (
    <div className={`${cardStyle.bg} border ${cardStyle.border} rounded-[16px] p-[25px] flex flex-col gap-[16px]`}>
      {/* Header: Space Name & Status */}
      <div className="flex items-start justify-between h-[48px]">
        <div className="flex flex-col gap-[4px]">
          <h3 className="font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-neutral-950">
            {booking.space_name}
          </h3>
          <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
            {booking.space_type}
          </p>
        </div>
        {getStatusBadge(booking.status)}
      </div>

      {/* Date & Time Info */}
      <div className="flex flex-col gap-[8px] h-[48px]">
        {/* Date */}
        <div className="flex items-center gap-[8px] h-[20px]">
          <img 
            src="/assets/d5ce048667629374475c5e2698f94f4c7e50c11f.svg" 
            alt="Calendar" 
            className="w-[16px] h-[16px]"
          />
          <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
            {booking.date}
          </p>
        </div>

        {/* Time */}
        <div className="flex items-center gap-[8px] h-[20px]">
          <img 
            src="/assets/6c19041890678fea04354a56ac73a90d63546598.svg" 
            alt="Clock" 
            className="w-[16px] h-[16px]"
          />
          <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
            {booking.start_time} - {booking.end_time}
          </p>
        </div>
      </div>

      {/* Check-in Code & Actions */}
      {hasButtons && (
        <div className="flex flex-col gap-[12px]">
          {/* Check-in Code Box and Action Buttons Row 1 */}
          <div className="flex gap-[12px] items-start">
            {/* Check-in Code Box */}
            <div className="flex-1 bg-gray-50 rounded-[14px] p-[12px] flex flex-col gap-[4px] h-[72px]">
              <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
                Check-in Code
              </p>
              <p className="font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-neutral-950">
                {booking.checkin_code || 'N/A'}
              </p>
            </div>

            {/* Check In / Check Out Button */}
            {!booking.checkin_at ? (
              // Check In Button (when not checked in)
              <button
                onClick={() => onCheckIn(booking)}
                disabled={booking.status !== 'active'}
                className="bg-white border border-[#b9f8cf] rounded-[14px] px-[16px] py-[8px] h-[36px] flex items-center gap-[8px] hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img 
                  src="/assets/e4565501cae2d05b318704f819e759a0d85af8ca.svg" 
                  alt="Check In" 
                  className="w-[16px] h-[16px]"
                />
                <p className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-[#00a63e]">
                  Check In
                </p>
              </button>
            ) : (
              // Check Out Button (when already checked in)
              <button
                onClick={() => onCheckOut(booking)}
                disabled={booking.status === 'finished' || booking.status === 'cancelled' || booking.checkout_at !== null}
                className="bg-white border border-[#ffd6a7] rounded-[14px] px-[16px] py-[8px] h-[36px] flex items-center gap-[8px] hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img 
                  src="/assets/bbc2ebf7d4f6de18ba37c605a96fd1a7bf3cb129.svg" 
                  alt="Check Out" 
                  className="w-[16px] h-[16px]"
                />
                <p className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-[#f54900]">
                  Check Out
                </p>
              </button>
            )}

            {/* Cancel Button */}
            <button
              onClick={() => onCancel(booking)}
              disabled={booking.status === 'finished' || booking.status === 'cancelled'}
              className="bg-white border border-[#ffc9c9] rounded-[14px] px-[16px] py-[8px] h-[36px] flex items-center gap-[8px] hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img 
                src="/assets/12d525d50ab27e633f32f6b4a4a8dd8ead4212d5.svg" 
                alt="Cancel" 
                className="w-[16px] h-[16px]"
              />
              <p className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-[#e7000b]">
                Cancel
              </p>
            </button>
          </div>

          {/* Show QR Button Row 2 */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowQRCode(!showQRCode)}
              disabled={booking.status === 'finished' || booking.status === 'cancelled'}
              className="bg-white border border-gray-200 rounded-[14px] px-[16px] py-[8px] h-[36px] flex items-center gap-[8px] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img 
                src="/assets/be29472a3c77c094973bbbadee9cfb2d65ae44f3.svg" 
                alt="QR Code" 
                className="w-[16px] h-[16px]"
              />
              <p className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-neutral-950">
                {showQRCode ? 'Hide QR' : 'Show QR'}
              </p>
            </button>
          </div>
        </div>
      )}

      {/* QR Code Section - Shown when showQRCode is true */}
      {hasButtons && showQRCode && (
        <div className="bg-white border border-gray-200 rounded-[16px] p-[25px] flex flex-col items-center gap-[16px]">
          {/* Title */}
          <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
            Scan to check in
          </p>

          {/* QR Code Container */}
          <div className="bg-white border-2 border-gray-100 rounded-[14px] p-[18px] w-[236px] h-[236px] flex items-center justify-center">
            <QRCode 
              value={booking.checkin_code || 'N/A'}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>

          {/* Code Text */}
          <div className="flex items-center gap-[4px]">
            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
              Code:
            </p>
            <p className="font-normal text-[14px] leading-[20px] text-[#101828]">
              {booking.checkin_code || 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
