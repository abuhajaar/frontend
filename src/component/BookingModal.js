'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useCurrentUser, useCreateBooking } from '@/hooks';
import { useToast } from '@/contexts/ToastContext';

export default function BookingModal({ isOpen, onClose, space, bookingDetails }) {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { showToastMessage } = useToast();
  const { mutate: createBooking, isPending: isSubmitting } = useCreateBooking();
  
  const modalRef = useRef(null);
  const backdropRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);

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
  
  // Debug log to see the space data
  console.log('BookingModal - Space Data:', {
    name: space.name,
    is_available: space.is_available,
    unavailable_reason: space.unavailable_reason,
    fullSpace: space
  });

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

    console.log('Creating booking:', bookingPayload);
    
    createBooking(bookingPayload, {
      onSuccess: (response) => {
        console.log('Booking created successfully:', response);
        
        // Show success toast
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
        // Show error toast
        showToastMessage({
          type: 'error',
          title: 'Booking failed',
          message: err.message || 'Failed to create booking. Please try again.',
          duration: 5000
        });
      }
    });
  };

  const amenityIcons = {
    'Monitor': '/assets/f710a8532bb7f6be7023184b940c0b2b5746bc70.svg',
    'Power Outlet': '/assets/123375ea5e26ce44b7119cf0c7842bbfe3d1acf6.svg',
    'Standing Desk': '/assets/184edf44907e8ea4d64d9756ae4a72901920ea57.svg',
    'Whiteboard': '/assets/013426a4beb4fcc79d3fa615feda380fd8cc6599.svg',
    'Projector': '/assets/2470b495aa90fa962b67cb001b73a4573bb33800.svg',
    'Video Conference': '/assets/2470b495aa90fa962b67cb001b73a4573bb33800.svg',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-white border border-[rgba(0,0,0,0.1)] rounded-[24px] w-full max-w-[512px] shadow-xl"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-[17px] top-[17px] w-4 h-4 opacity-70 hover:opacity-100 transition-opacity"
        >
          <img src="/assets/9e12764e91cf36e92c672b4ceb011cb1b5c0cb56.svg" alt="Close" className="w-full h-full" />
        </button>

        <div className="p-[25px]">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="font-semibold text-[18px] leading-[18px] tracking-[-0.4395px] text-neutral-950">
              Confirm Booking
            </h2>
            <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
              Review your booking details before confirming
            </p>
          </div>

          {/* Booking Details Container */}
          <div className="flex flex-col gap-6 pt-4">
            {isUnavailable ? (
              /* Unavailable Space - Show Reason */
              <>
                {/* Space Info Box */}
                <div className="bg-gray-50 rounded-[16px] p-6 flex flex-col gap-3">
                  {/* Space Name & Capacity */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-neutral-950">
                        {space.name}
                      </h3>
                      <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
                        {space.type}
                      </p>
                    </div>
                    <div className="bg-red-100 border border-red-200 rounded-[8px] px-2 py-1 flex items-center gap-2 h-[22px]">
                      <p className="font-medium text-[12px] leading-[16px] text-red-700">
                        Unavailable
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <img src="/assets/b93a116f2f4d1a90e1d12e22f5c8011b996b9851.svg" alt="" className="w-4 h-4" />
                      <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
                        {bookingDetails.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="/assets/6c19041890678fea04354a56ac73a90d63546598.svg" alt="" className="w-4 h-4" />
                      <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
                        {bookingDetails.startTime} - {bookingDetails.endTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Unavailable Reason */}
                <div className="bg-red-50 border border-red-200 rounded-[16px] p-4">
                  <p className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-red-900 mb-2">
                    Space Not Available
                  </p>
                  <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-red-700">
                    {space.unavailable_reason ? (
                      // Parse and highlight user name and time in the unavailable reason
                      <span dangerouslySetInnerHTML={{
                        __html: space.unavailable_reason
                          .replace(/(\w+)(?=\s+mulai)/gi, '<strong>$1</strong>')  // Bold the user name before "mulai"
                          .replace(/(\d{2}:\d{2})/g, '<strong>$1</strong>')  // Bold all time patterns (HH:MM)
                      }} />
                    ) : (
                      'This space is currently unavailable for the selected time slot.'
                    )}
                  </p>
                </div>
              </>
            ) : (
              /* Available Space - Show Booking Details */
              <>
                {/* Space Info Box */}
                <div className="bg-gray-50 rounded-[16px] p-6 flex flex-col gap-3">
                  {/* Space Name & Capacity */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-neutral-950">
                        {space.name}
                      </h3>
                      <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
                        {space.type}
                      </p>
                    </div>
                    <div className="bg-gray-200 border border-transparent rounded-[8px] px-2 py-1 flex items-center gap-2 h-[22px]">
                      <img src="/assets/d5ce048667629374475c5e2698f94f4c7e50c11f.svg" alt="" className="w-3 h-3" />
                      <p className="font-medium text-[12px] leading-[16px] text-[#364153]">
                        {space.capacity}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <img src="/assets/b93a116f2f4d1a90e1d12e22f5c8011b996b9851.svg" alt="" className="w-4 h-4" />
                      <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
                        {bookingDetails.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="/assets/6c19041890678fea04354a56ac73a90d63546598.svg" alt="" className="w-4 h-4" />
                      <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
                        {bookingDetails.startTime} - {bookingDetails.endTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-col gap-3">
                  <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
                    Amenities included
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {space.amenities && space.amenities.slice(0, 4).map((amenity, index) => {
                      // Handle both string and object formats
                      const amenityName = typeof amenity === 'string' ? amenity : amenity.name;
                      return (
                        <div key={index} className="bg-gray-100 rounded-[10px] px-3 py-1.5 h-[32px] flex items-center">
                          <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#4a5565]">
                            {amenityName}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Info Message */}
                <div className="bg-blue-50 border border-blue-100 rounded-[16px] p-4">
                  <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#1c398e]">
                    You'll receive a check-in code via notification once your booking is confirmed.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            {isUnavailable ? (
              /* Only show Close button for unavailable spaces */
              <button
                onClick={handleClose}
                className="w-full bg-black rounded-[14px] px-4 py-2 h-[36px] flex items-center justify-center"
              >
                <p className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-white">
                  Close
                </p>
              </button>
            ) : (
              /* Show Cancel and Confirm buttons for available spaces */
              <>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 bg-white border border-gray-200 rounded-[14px] px-4 py-2 h-[36px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <p className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-neutral-950">
                    Cancel
                  </p>
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="flex-1 bg-black rounded-[14px] px-4 py-2 h-[36px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <p className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-white">
                    {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                  </p>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
