/**
 * Reusable NotificationPanel component
 * Professional implementation that can be used across all pages
 */

'use client';

export default function NotificationPanel({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed right-6 top-[76px] w-full max-w-96 bg-white border border-gray-200/80 rounded-3xl shadow-lg z-20 overflow-hidden animate-slideDown">
      {/* Header */}
      <div className="border-b border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-normal text-neutral-950">
            Notifications
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-50"
          >
            <img
              src="/assets/aabeb93e4a2118741e46ae15bd2919918a78fcf7.svg"
              alt="Close"
              className="w-4 h-4"
            />
          </button>
        </div>
        <p className="text-sm text-[#6a7282]">You're all caught up</p>
      </div>

      {/* Notifications List */}
      <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
        {/* Booking Confirmed */}
        <button className="w-full p-4 rounded-2xl hover:bg-gray-50 text-left">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/8536599b974169b6450772e6512c7682735a03be.svg"
                alt=""
                className="w-5 h-5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-950 mb-1">
                Booking Confirmed
              </p>
              <p className="text-xs text-[#4a5565] mb-2 line-clamp-2">
                Your booking for Desk A1 on October 27 has been confirmed.
              </p>
              <div className="flex items-center gap-1 text-xs text-[#99a1af]">
                <img
                  src="/assets/a406003f9e768ad46d9256962cac080f403e55c8.svg"
                  alt=""
                  className="w-3 h-3"
                />
                <span>2 hours ago</span>
              </div>
            </div>
          </div>
        </button>

        {/* Reminder */}
        <button className="w-full p-4 rounded-2xl hover:bg-gray-50 text-left">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/b0344f2aea6a050cac3a431dad631966cd2098b2.svg"
                alt=""
                className="w-5 h-5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-950 mb-1">
                Reminder
              </p>
              <p className="text-xs text-[#4a5565] mb-2 line-clamp-2">
                Your booking starts in 1 hour. Check-in code: ABC123
              </p>
              <div className="flex items-center gap-1 text-xs text-[#99a1af]">
                <img
                  src="/assets/a406003f9e768ad46d9256962cac080f403e55c8.svg"
                  alt=""
                  className="w-3 h-3"
                />
                <span>5 hours ago</span>
              </div>
            </div>
          </div>
        </button>

        {/* Booking Cancelled */}
        <button className="w-full p-4 rounded-2xl hover:bg-gray-50 text-left">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-[#ffedd4] rounded-xl flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/888f77712f017ecd5d243ad3c1391c9d92567909.svg"
                alt=""
                className="w-5 h-5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-950 mb-1">
                Booking Cancelled
              </p>
              <p className="text-xs text-[#4a5565] mb-2 line-clamp-2">
                Conference A booking for October 28 has been cancelled.
              </p>
              <div className="flex items-center gap-1 text-xs text-[#99a1af]">
                <img
                  src="/assets/a406003f9e768ad46d9256962cac080f403e55c8.svg"
                  alt=""
                  className="w-3 h-3"
                />
                <span>1 day ago</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
