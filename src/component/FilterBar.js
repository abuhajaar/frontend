
'use client';

import { useState } from 'react';
import { FILTER_OPTIONS } from '@/constants/booking';

export default function FilterBar({
  selectedFloor,
  selectedType,
  availableFloors,
  onFloorChange,
  onTypeChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (type, value) => {
    if (type === 'floor') {
      onFloorChange(value);
    } else {
      onTypeChange(value);
    }
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all border h-[44px] ${isOpen
          ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
          : 'bg-white text-neutral-900 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M4 6h12M7 10h10M4 14h12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Filters
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        >
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Side Panel */}
      <div
        className={`absolute left-full top-0 ml-3 z-10 w-max bg-white border border-gray-200 rounded-[20px] shadow-xl overflow-hidden transition-all duration-300 ease-out ${isOpen
          ? 'opacity-100 translate-x-0 visible'
          : 'opacity-0 -translate-x-2 invisible'
          }`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 flex-wrap max-w-3xl">
            {/* Floor Filters */}
            <button
              onClick={() => handleFilterChange('floor', FILTER_OPTIONS.FLOORS.ALL)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedFloor === FILTER_OPTIONS.FLOORS.ALL
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-gray-50 text-neutral-900 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              All Floors
            </button>

            {availableFloors.map(floor => (
              <button
                key={floor}
                onClick={() => handleFilterChange('floor', floor)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${selectedFloor === floor
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-gray-50 text-neutral-900 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                <img
                  src="/assets/7fefcd1b6d178ca5760daf13e3c0ffe13bd03081.svg"
                  alt=""
                  className="w-4 h-4"
                />
                {floor} Floor
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-8 bg-gray-300 mx-2"></div>

            {/* Type Filters */}
            <button
              onClick={() => handleFilterChange('type', FILTER_OPTIONS.TYPES.ALL)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedType === FILTER_OPTIONS.TYPES.ALL
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-gray-50 text-neutral-900 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              All Types
            </button>

            <button
              onClick={() => handleFilterChange('type', FILTER_OPTIONS.TYPES.HOT_DESK)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${selectedType === FILTER_OPTIONS.TYPES.HOT_DESK
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-gray-50 text-neutral-900 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              <img
                src="/assets/e9a8acb8b17cb2cce7386825cc93d8c3562d4e74.svg"
                alt=""
                className="w-4 h-4"
              />
              Hot Desks
            </button>

            <button
              onClick={() => handleFilterChange('type', FILTER_OPTIONS.TYPES.PRIVATE)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${selectedType === FILTER_OPTIONS.TYPES.PRIVATE
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-gray-50 text-neutral-900 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              <img
                src="/assets/b277a61a694aff124f107ca648d2a70df5cc1d10.svg"
                alt=""
                className="w-4 h-4"
              />
              Private Rooms
            </button>

            <button
              onClick={() => handleFilterChange('type', FILTER_OPTIONS.TYPES.MEETING)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${selectedType === FILTER_OPTIONS.TYPES.MEETING
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-gray-50 text-neutral-900 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              <img
                src="/assets/2f942f19516ee84dd5c5646164f23bcd8aa2a546.svg"
                alt=""
                className="w-4 h-4"
              />
              Meeting Rooms
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
