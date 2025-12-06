/**
 * FilterBar component
 * Floor and type filter controls
 */

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
        className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium transition-all border ${
          isOpen 
            ? 'bg-neutral-900 text-white border-neutral-900' 
            : 'bg-white text-neutral-900 border-gray-200 hover:bg-gray-50'
        }`}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
        >
          <path 
            d="M4 6h12M4 10h12M4 14h12" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
        Filters
      </button>

      {/* Dropdown Panel */}
      <div
        className={`flex flex-col md:flex-row gap-4 bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm transition-all duration-300 origin-left ${
          isOpen 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Floor Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => handleFilterChange('floor', FILTER_OPTIONS.FLOORS.ALL)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedFloor === FILTER_OPTIONS.FLOORS.ALL 
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
              className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                selectedFloor === floor 
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
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 hidden md:block"></div>

        {/* Type Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => handleFilterChange('type', FILTER_OPTIONS.TYPES.ALL)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedType === FILTER_OPTIONS.TYPES.ALL 
                ? 'bg-neutral-900 text-white shadow-sm' 
                : 'bg-gray-50 text-neutral-900 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            All Types
          </button>
          
          <button 
            onClick={() => handleFilterChange('type', FILTER_OPTIONS.TYPES.HOT_DESK)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              selectedType === FILTER_OPTIONS.TYPES.HOT_DESK 
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
            className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              selectedType === FILTER_OPTIONS.TYPES.PRIVATE 
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
            className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
              selectedType === FILTER_OPTIONS.TYPES.MEETING 
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
  );
}
