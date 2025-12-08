/**
 * BookingCard Component
 * Displays individual booking details with actions
 * Active bookings have green background (from Figma)
 */

'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import {
  Calendar,
  Clock,
  LogIn,
  LogOut,
  XCircle,
  QrCode,
  MoreHorizontal
} from 'lucide-react';
import { hapticClick } from '@/utils/animations';
import { useRef } from 'react';

export default function BookingCard({ booking, onCheckIn, onCheckOut, onCancel, onShowQR, compact = false }) {
  const [showQRCode, setShowQRCode] = useState(false);

  // Refs for animation
  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const cancelRef = useRef(null);
  const qrRef = useRef(null);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: 'Active'
      },
      checkin: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        label: 'Checked In'
      },
      finished: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        label: 'Finished'
      },
      completed: {
        bg: 'bg-gray-100',
        text: 'text-gray-600',
        label: 'Finished'
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        label: 'Cancelled'
      }
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <div className={`${config.bg} rounded-lg px-2.5 py-1 flex items-center justify-center`}>
        <span className={`text-xs font-bold ${config.text} uppercase tracking-wide`}>
          {config.label}
        </span>
      </div>
    );
  };

  // Get card background and border based on status
  const getCardStyle = (status) => {
    if (status === 'active') {
      return {
        bg: 'bg-green-50',
        border: 'border-green-200'
      };
    }
    if (status === 'checkin') {
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200'
      };
    }
    if (status === 'cancelled') {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200'
      };
    }
    if (status === 'finished' || status === 'completed') {
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200'
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

  // Animation handlers
  const handleCheckInClick = () => hapticClick(checkInRef.current, () => onCheckIn(booking));
  const handleCheckOutClick = () => hapticClick(checkOutRef.current, () => onCheckOut(booking));
  const handleCancelClick = () => hapticClick(cancelRef.current, () => onCancel(booking));
  const handleQRClick = () => hapticClick(qrRef.current, () => setShowQRCode(!showQRCode));

  // Compact mode rendering
  if (compact) {
    return (
      <div className={`${cardStyle.bg} border-2 ${cardStyle.border} rounded-2xl p-4 flex flex-col gap-3 h-full transition-all hover:shadow-sm`}>
        {/* Header: Space Name & Status */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h3 className="font-bold text-sm text-neutral-950 line-clamp-1">
              {booking.space_name}
            </h3>
            <p className="text-xs font-medium text-gray-500">
              {booking.space_type}
            </p>
          </div>
          {getStatusBadge(booking.status)}
        </div>

        {/* Date & Time Info */}
        <div className="flex flex-col gap-2">
          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-neutral-950" />
            <p className="text-xs font-medium text-gray-600">
              {booking.date}
            </p>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-neutral-950" />
            <p className="text-xs font-medium text-gray-600">
              {booking.start_time} - {booking.end_time}
            </p>
          </div>
        </div>

        {/* Check-in Code */}
        {hasButtons && booking.checkin_code && (
          <div className="bg-white/60 border border-gray-200/50 rounded-xl p-2.5 flex flex-col gap-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Check-in Code
            </p>
            <p className="text-sm font-bold text-neutral-950 font-mono">
              {booking.checkin_code}
            </p>
          </div>
        )}

        {/* Actions */}
        {hasButtons && (
          <div className="flex flex-col gap-2 mt-auto">
            {/* Primary Action */}
            {!booking.checkin_at ? (
              <button
                ref={checkInRef}
                onClick={handleCheckInClick}
                disabled={booking.status !== 'active'}
                className="bg-white border-2 border-green-200 text-green-700 rounded-xl px-3 py-2 text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-50 active:scale-95 transition-all w-full shadow-sm"
              >
                <LogIn size={14} />
                <span>Check In</span>
              </button>
            ) : (
              <button
                ref={checkOutRef}
                onClick={handleCheckOutClick}
                disabled={booking.status === 'finished' || booking.status === 'cancelled' || booking.checkout_at !== null}
                className="bg-white border-2 border-orange-200 text-orange-700 rounded-xl px-3 py-2 text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-50 active:scale-95 transition-all w-full shadow-sm"
              >
                <LogOut size={14} />
                <span>Check Out</span>
              </button>
            )}

            {/* Secondary Actions */}
            <div className="flex gap-2">
              <button
                ref={cancelRef}
                onClick={handleCancelClick}
                disabled={booking.status === 'finished' || booking.status === 'cancelled'}
                className="flex-1 bg-white border-2 border-red-200 text-red-600 rounded-xl px-3 py-2 text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-red-50 active:scale-95 transition-all shadow-sm"
              >
                <XCircle size={14} />
                <span>Cancel</span>
              </button>
              <button
                ref={qrRef}
                onClick={handleQRClick}
                disabled={booking.status === 'finished' || booking.status === 'cancelled'}
                className="flex-1 bg-white border-2 border-gray-200 text-gray-700 rounded-xl px-3 py-2 text-[11px] font-bold flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                <QrCode size={14} />
                <span>QR</span>
              </button>
            </div>
          </div>
        )}

        {/* QR Code Section - Compact */}
        {hasButtons && showQRCode && (
          <div className="bg-white border-2 border-gray-100 rounded-xl p-4 flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-200">
            <p className="text-[10px] font-medium text-gray-500">
              Scan to check in
            </p>
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <QRCode
                value={booking.checkin_code || 'N/A'}
                size={120}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular mode rendering
  return (
    <div className={`${cardStyle.bg} border-2 ${cardStyle.border} rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-md`}>
      {/* Header: Space Name & Status */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="font-bold text-lg text-neutral-950 tracking-tight">
            {booking.space_name}
          </h3>
          <p className="text-sm font-medium text-gray-500">
            {booking.space_type}
          </p>
        </div>
        {getStatusBadge(booking.status)}
      </div>

      {/* Date & Time Info */}
      <div className="flex flex-col gap-2">
        {/* Date */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-neutral-950" />
          <p className="text-sm font-medium text-gray-700">
            {booking.date}
          </p>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-neutral-950" />
          <p className="text-sm font-medium text-gray-700">
            {booking.start_time} - {booking.end_time}
          </p>
        </div>
      </div>

      {/* Check-in Code & Actions */}
      {hasButtons && (
        <div className="flex flex-col gap-3 pt-2">
          {/* Check-in Code Box and Action Buttons Row 1 */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            {/* Check-in Code Box */}
            <div className="flex-1 bg-white/60 border border-gray-200/50 rounded-xl p-3 flex flex-col justify-center gap-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Check-in Code
              </p>
              <p className="text-lg font-bold text-neutral-950 font-mono tracking-wide">
                {booking.checkin_code || 'N/A'}
              </p>
            </div>

            {/* Check In / Check Out Button */}
            {!booking.checkin_at ? (
              // Check In Button
              <button
                ref={checkInRef}
                onClick={handleCheckInClick}
                disabled={booking.status !== 'active'}
                className="flex-1 bg-white border-2 border-green-200 text-green-700 rounded-xl px-4 py-3 font-bold flex items-center justify-center gap-2 hover:bg-green-50 active:scale-95 transition-all shadow-sm"
              >
                <LogIn size={18} />
                <span>Check In</span>
              </button>
            ) : (
              // Check Out Button
              <button
                ref={checkOutRef}
                onClick={handleCheckOutClick}
                disabled={booking.status === 'finished' || booking.status === 'cancelled' || booking.checkout_at !== null}
                className="flex-1 bg-white border-2 border-orange-200 text-orange-700 rounded-xl px-4 py-3 font-bold flex items-center justify-center gap-2 hover:bg-orange-50 active:scale-95 transition-all shadow-sm"
              >
                <LogOut size={18} />
                <span>Check Out</span>
              </button>
            )}

            {/* Cancel Button */}
            <button
              ref={cancelRef}
              onClick={handleCancelClick}
              disabled={booking.status === 'finished' || booking.status === 'cancelled'}
              className="bg-white border-2 border-red-200 text-red-600 rounded-xl px-4 py-3 font-bold flex items-center justify-center gap-2 hover:bg-red-50 active:scale-95 transition-all shadow-sm"
            >
              <XCircle size={18} />
              <span>Cancel</span>
            </button>
          </div>

          {/* Show QR Button Row 2 */}
          <div className="flex justify-center">
            <button
              ref={qrRef}
              onClick={handleQRClick}
              disabled={booking.status === 'finished' || booking.status === 'cancelled'}
              className="bg-white border-2 border-gray-200 text-gray-600 rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
            >
              <QrCode size={14} />
              <span>{showQRCode ? 'Hide QR Code' : 'Show QR Code'}</span>
            </button>
          </div>
        </div>
      )}

      {/* QR Code Section - Shown when showQRCode is true */}
      {hasButtons && showQRCode && (
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 flex flex-col items-center gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Title */}
          <p className="text-base font-medium text-gray-500">
            Scan to check in
          </p>

          {/* QR Code Container */}
          <div className="bg-white border-2 border-gray-100 rounded-xl p-6 flex items-center justify-center shadow-inner">
            <QRCode
              value={booking.checkin_code || 'N/A'}
              size={240}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
          </div>

          {/* Code Text */}
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Code:
            </p>
            <p className="text-base font-bold text-neural-950 font-mono">
              {booking.checkin_code || 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
