/**
 * FilterBar component
 * Floor and type filter controls
 */

import { FILTER_OPTIONS } from '@/constants/booking';

export default function FilterBar({
  selectedFloor,
  selectedType,
  availableFloors,
  onFloorChange,
  onTypeChange,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Floor Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button 
          onClick={() => onFloorChange(FILTER_OPTIONS.FLOORS.ALL)}
          className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 transition-all ${
            selectedFloor === FILTER_OPTIONS.FLOORS.ALL 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-200 text-neutral-950'
          }`}
        >
          All Floors
        </button>
        
        {availableFloors.map(floor => (
          <button 
            key={floor}
            onClick={() => onFloorChange(floor)}
            className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 flex items-center gap-2 transition-all ${
              selectedFloor === floor 
                ? 'bg-black text-white' 
                : 'bg-white border border-gray-200 text-neutral-950'
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

      {/* Type Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button 
          onClick={() => onTypeChange(FILTER_OPTIONS.TYPES.ALL)}
          className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 transition-all ${
            selectedType === FILTER_OPTIONS.TYPES.ALL 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-200 text-neutral-950'
          }`}
        >
          All Types
        </button>
        
        <button 
          onClick={() => onTypeChange(FILTER_OPTIONS.TYPES.HOT_DESK)}
          className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 flex items-center gap-2 transition-all ${
            selectedType === FILTER_OPTIONS.TYPES.HOT_DESK 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-200 text-neutral-950'
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
          onClick={() => onTypeChange(FILTER_OPTIONS.TYPES.PRIVATE)}
          className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 flex items-center gap-2 transition-all ${
            selectedType === FILTER_OPTIONS.TYPES.PRIVATE 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-200 text-neutral-950'
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
          onClick={() => onTypeChange(FILTER_OPTIONS.TYPES.MEETING)}
          className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 flex items-center gap-2 transition-all ${
            selectedType === FILTER_OPTIONS.TYPES.MEETING 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-200 text-neutral-950'
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
  );
}
