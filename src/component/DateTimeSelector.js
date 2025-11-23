/**
 * DateTimeSelector component
 * Date and time input controls with search button
 */

import { TIME_SLOTS } from '@/constants/booking';

export default function DateTimeSelector({
  selectedDate,
  startTime,
  endTime,
  onDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onSearch,
  loading,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
      <div className="mb-6">
        <h3 className="text-base font-normal text-neutral-950 tracking-[-0.3125px] leading-6 mb-1">
          Select Date & Time
        </h3>
        <p className="text-sm text-[#717182] tracking-[-0.1504px] leading-5">
          Choose when you need a workspace to see availability
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-neutral-950 tracking-[-0.1504px] leading-[14px] mb-2">
            Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-3 text-base text-neutral-950 tracking-[-0.3125px] leading-6 cursor-pointer"
          />
        </div>

        {/* Start Time Select */}
        <div>
          <label className="block text-sm font-medium text-neutral-950 tracking-[-0.1504px] leading-[14px] mb-2">
            Start Time
          </label>
          <select 
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-3 text-base text-neutral-950 tracking-[-0.3125px] leading-6 cursor-pointer"
          >
            {TIME_SLOTS.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        {/* End Time Select */}
        <div>
          <label className="block text-sm font-medium text-neutral-950 tracking-[-0.1504px] leading-[14px] mb-2">
            End Time
          </label>
          <select 
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-[14px] px-4 py-3 text-base text-neutral-950 tracking-[-0.3125px] leading-6 cursor-pointer"
          >
            {TIME_SLOTS.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button 
        onClick={onSearch}
        disabled={loading}
        className="bg-black text-white text-sm font-medium tracking-[-0.1504px] leading-5 px-8 py-2 rounded-[14px] ml-auto block hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Searching...' : 'Search Availability'}
      </button>
    </div>
  );
}
