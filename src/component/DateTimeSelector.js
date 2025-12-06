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
    <div className="bg-white border border-gray-100 rounded-[32px] p-8 mb-8 shadow-sm relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-60" />
      
      <div className="relative z-10">
        <div className="mb-8">
          <h3 className="text-xl font-medium text-neutral-950 tracking-tight mb-1">
            Select Date & Time
          </h3>
          <p className="text-sm text-gray-500">
            Choose when you need a workspace to see availability
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Date and Time Inputs Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all cursor-pointer hover:bg-gray-100"
              />
            </div>

            {/* Start Time Select */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Start Time
              </label>
              <select 
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all cursor-pointer hover:bg-gray-100 appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem 1.25rem'
                }}
              >
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            {/* End Time Select */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                End Time
              </label>
              <select 
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-neutral-950 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all cursor-pointer hover:bg-gray-100 appearance-none bg-no-repeat bg-right pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.75rem center',
                  backgroundSize: '1.25rem 1.25rem'
                }}
              >
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-end">
            <button 
              onClick={onSearch}
              disabled={loading}
              className="group relative px-8 py-3 bg-neutral-900 text-white text-sm font-medium rounded-full overflow-hidden transition-all hover:pr-11 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:pr-8"
            >
              <span className="relative z-10">{loading ? 'Searching...' : 'Search Availability'}</span>
              {!loading && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
