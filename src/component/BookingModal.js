'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useCurrentUser, useCreateBooking } from '@/hooks';
import { useToast } from '@/contexts/ToastContext';
import { hapticClick } from '@/utils/animations';
import {
  X,
  Calendar,
  Clock,
  Users,
  Info,
  AlertCircle,
  CheckCircle2,
  Armchair,
  DoorOpen,
  Wifi,
  Monitor,
  Plug,
  Presentation,
  Video,
  Timer
} from 'lucide-react';

export default function BookingModal({ isOpen, onClose, space, bookingDetails }) {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { showToastMessage } = useToast();
  const { mutate: createBooking, isPending: isSubmitting } = useCreateBooking();

  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

  // Map amenities to Lucide icons
  const getAmenityIcon = (amenityName) => {
    const iconMap = {
      'Wi-Fi': Wifi,
      'Monitor': Monitor,
      'Power Outlet': Plug,
      'Standing Desk': Armchair,
      'Whiteboard': Presentation,
      'Projector': Presentation,
      'Video Conference': Video,
    };
    return iconMap[amenityName] || CheckCircle2;
  };

  // Get icon and color scheme based on space type
  const getTypeConfig = () => {
    if (!space) return {};

    if (space.type === 'Hot Desk') {
      return {
        icon: Armchair,
        iconBg: 'bg-blue-600',
        textAccent: 'text-blue-600',
        bgAccent: 'bg-blue-50',
      };
    }
    if (space.type === 'Private Room') {
      return {
        icon: DoorOpen,
        iconBg: 'bg-purple-600',
        textAccent: 'text-purple-600',
        bgAccent: 'bg-purple-50',
      };
    }
    // Meeting Room
    return {
      icon: Users,
      iconBg: 'bg-orange-600',
      textAccent: 'text-orange-600',
      bgAccent: 'bg-orange-50',
    };
  };

  const typeConfig = getTypeConfig();
  const TypeIcon = typeConfig.icon || Users;

  // Animate modal entrance
  useEffect(() => {
    if (isOpen && modalRef.current && backdropRef.current) {
      // Reset closing state
      setIsClosing(false);

      // Set initial state
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(modalRef.current, { scale: 0.95, opacity: 0, y: 10 });

      // Animate in
      const tl = gsap.timeline();
      tl.to(backdropRef.current, {
        opacity: 1,
        duration: 0.25,
        ease: 'power1.out'
      })
        .to(modalRef.current, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out'
        }, '-=0.15');
    }
  }, [isOpen]);

  if (!isOpen || !space) return null;

  // Check if space is unavailable
  const isUnavailable = space.is_available === false;

  /**
   * Reset all states when modal closes
   */
  const handleClose = () => {
    if (isClosing) return; // Prevent multiple close animations

    setIsClosing(true);

    // Animate out
    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        setIsClosing(false);
      }
    });

    tl.to(modalRef.current, {
      scale: 0.95,
      opacity: 0,
      y: 10,
      duration: 0.25,
      ease: 'power1.in'
    })
      .to(backdropRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power1.in'
      }, '-=0.15');
  };

  /**
   * Format datetime to "YYYY-MM-DD HH:MM:SS"
   */
  const formatDateTime = (date, time) => {
    return `${date} ${time}:00`;
  };

  const handleConfirmBooking = async () => {
    if (!currentUser?.id) {
      showToastMessage({
        type: 'error',
        title: 'Authentication required',
        message: 'You must be logged in to make a booking',
        duration: 5000
      });
      return;
    }

    const bookingPayload = {
      user_id: currentUser.id,
      space_id: space.id,
      start_at: formatDateTime(bookingDetails.date, bookingDetails.startTime),
      end_at: formatDateTime(bookingDetails.date, bookingDetails.endTime),
    };

    createBooking(bookingPayload, {
      onSuccess: (response) => {
        showToastMessage({
          type: 'success',
          title: 'Booking confirmed!',
          message: response.message || `${space.name} has been booked successfully.`,
          duration: 5000
        });

        // Success animation: smooth pulse effect
        if (modalRef.current) {
          gsap.to(modalRef.current, {
            scale: 1.03,
            duration: 0.3,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              handleClose();
            }
          });
        }
      },
      onError: (err) => {
        showToastMessage({
          type: 'error',
          title: 'Booking failed',
          message: err.message || 'Failed to create booking. Please try again.',
          duration: 5000
        });
      }
    });
  };

  const handleConfirmClick = () => {
    hapticClick(confirmButtonRef.current, handleConfirmBooking);
  };

  const handleCancelClick = () => {
    hapticClick(cancelButtonRef.current, handleClose);
  };

  const handleCloseClick = () => {
    hapticClick(closeButtonRef.current, handleClose);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-neutral-950 tracking-tight">
              {isUnavailable ? 'Space Unavailable' : 'Confirm Booking'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isUnavailable ? 'This space cannot be booked at this time' : 'Review details before confirming'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Space Info Card */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl mb-6 border border-gray-100">
            <div className={`w-12 h-12 rounded-xl ${typeConfig.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <TypeIcon className="w-6 h-6 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-neutral-950 text-lg">
                {space.name}
              </h3>
              <p className={`text-sm font-medium ${typeConfig.textAccent}`}>
                {space.type}
              </p>
            </div>
            <div className="px-2.5 py-1 bg-white rounded-md border border-gray-200 flex items-center gap-1.5 shadow-sm">
              <Users size={14} className="text-gray-600" />
              <span className="text-xs font-bold text-gray-700">{space.capacity}</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="space-y-4 mb-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Date & Time
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Date</p>
                  <p className="text-sm font-semibold text-gray-900">{bookingDetails.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Time</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {bookingDetails.startTime} - {bookingDetails.endTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isUnavailable ? (
            /* Unavailable Reason */
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 text-sm mb-1">Booking Conflict</h4>
                <p className="text-sm text-red-700 leading-relaxed">
                  {space.unavailable_reason ? (
                    <span dangerouslySetInnerHTML={{
                      __html: space.unavailable_reason
                        .replace(/(\w+)(?=\s+mulai)/gi, '<strong>$1</strong>')
                        .replace(/(\d{2}:\d{2})/g, '<strong>$1</strong>')
                    }} />
                  ) : (
                    'This space is currently unavailable for the selected time slot.'
                  )}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Amenities */}
              {space.amenities && space.amenities.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Included Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {space.amenities.map((amenity, index) => {
                      const amenityName = typeof amenity === 'string' ? amenity : amenity.name;
                      const Icon = getAmenityIcon(amenityName);
                      return (
                        <div key={index} className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg flex items-center gap-2">
                          <Icon size={14} className="text-gray-500" />
                          <span className="text-xs font-medium text-gray-700">{amenityName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Info Message */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800 leading-relaxed">
                  You'll receive a check-in code and instructions via notification once your booking is confirmed.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex gap-3">
            {isUnavailable ? (
              <button
                ref={closeButtonRef}
                onClick={handleCloseClick}
                className="w-full bg-neutral-900 text-white rounded-xl px-4 py-3 font-semibold text-sm hover:bg-neutral-800 transition-colors"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  ref={cancelButtonRef}
                  onClick={handleCancelClick}
                  disabled={isSubmitting}
                  className="flex-1 bg-white border border-gray-200 text-neutral-900 rounded-xl px-4 py-3 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  ref={confirmButtonRef}
                  onClick={handleConfirmClick}
                  disabled={isSubmitting}
                  className="flex-1 bg-neutral-900 text-white rounded-xl px-4 py-3 font-semibold text-sm hover:bg-neutral-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Booking</span>
                      {/* <CheckCircle2 size={16} /> */}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
