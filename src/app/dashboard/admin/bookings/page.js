'use client';

import { useEffect, useState } from 'react';
import { Search, Calendar, Clock, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { getAllBookingsForManage } from '@/services/bookingService';

// Mock data matching Figma
const mockBookings = [
  {
    id: 1,
    user_name: 'John Smith',
    user_email: 'john.smith@company.com',
    space_name: 'Desk A1',
    space_type: 'Hot Desk',
    booking_date: '2025-11-24',
    start_time: '10:00',
    end_time: '18:00',
    check_in_code: 'ABC123',
    status: 'active',
    checked_in: true,
  },
  {
    id: 2,
    user_name: 'Sarah Wilson',
    user_email: 'sarah.wilson@company.com',
    space_name: 'Meeting Room B',
    space_type: 'Meeting Room',
    booking_date: '2025-11-24',
    start_time: '09:00',
    end_time: '11:00',
    check_in_code: 'XYZ789',
    status: 'active',
    checked_in: false,
  },
  {
    id: 3,
    user_name: 'Mike Johnson',
    user_email: 'mike.johnson@company.com',
    space_name: 'Desk C3',
    space_type: 'Fixed Desk',
    booking_date: '2025-11-23',
    start_time: '08:00',
    end_time: '17:00',
    check_in_code: 'DEF456',
    status: 'completed',
    checked_in: false,
  },
  {
    id: 4,
    user_name: 'Emily Davis',
    user_email: 'emily.davis@company.com',
    space_name: 'Hot Desk 5',
    space_type: 'Hot Desk',
    booking_date: '2025-11-23',
    start_time: '13:00',
    end_time: '19:00',
    check_in_code: 'GHI789',
    status: 'completed',
    checked_in: false,
  },
  {
    id: 5,
    user_name: 'David Brown',
    user_email: 'david.brown@company.com',
    space_name: 'Desk B2',
    space_type: 'Hot Desk',
    booking_date: '2025-11-22',
    start_time: '10:00',
    end_time: '14:00',
    check_in_code: 'JKL012',
    status: 'cancelled',
    checked_in: false,
  },
  {
    id: 6,
    user_name: 'Lisa Anderson',
    user_email: 'lisa.anderson@company.com',
    space_name: 'Private Office D1',
    space_type: 'Private Office',
    booking_date: '2025-11-25',
    start_time: '09:00',
    end_time: '17:00',
    check_in_code: 'MNO345',
    status: 'pending',
    checked_in: false,
  },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getAllBookingsForManage();
        
        if (response.success && response.data) {
          setBookings(response.data);
        } else {
          console.error('Failed to fetch bookings:', response.message);
          // Fallback to mock data on error
          setBookings(mockBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        // Fallback to mock data on error
        setBookings(mockBookings);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatSpaceType = (type) => {
    if (!type) return 'N/A';
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const isCheckedIn = (booking) => {
    return booking.checkin_at !== null && booking.checkin_at !== undefined;
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        bg: 'bg-green-100',
        text: 'text-[#016630]',
        label: 'active',
      },
      pending: {
        bg: 'bg-[#ffedd4]',
        text: 'text-[#f54900]',
        label: 'pending',
      },
      completed: {
        bg: 'bg-blue-100',
        text: 'text-[#0066cc]',
        label: 'completed',
      },
      cancelled: {
        bg: 'bg-[#ffe2e2]',
        text: 'text-[#e7000b]',
        label: 'cancelled',
      },
    };
    return configs[status] || configs.pending;
  };

  // Calculate stats
  const stats = {
    total: bookings.length,
    active: bookings.filter((b) => b.status === 'active').length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  };

  // Filter bookings
  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        (booking.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.user_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (booking.space_name || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || booking.status === statusFilter;

      // Date filtering
      const matchesDate = (() => {
        if (dateFilter === 'all') return true;
        
        const bookingDate = new Date(booking.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        bookingDate.setHours(0, 0, 0, 0);
        
        if (dateFilter === 'past') {
          return bookingDate < today;
        } else if (dateFilter === 'today') {
          return bookingDate.getTime() === today.getTime();
        } else if (dateFilter === 'upcoming') {
          return bookingDate > today;
        }
        return true;
      })();

      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => {
      // Sort by date: oldest to newest
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB; // Ascending order (oldest first)
    });

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-['Inter'] text-[30px] leading-[45px] font-bold tracking-[-0.2045px] text-neutral-950">
          Booking Management
        </h1>
        <p className="font-['Inter'] font-normal text-[16px] leading-[24px] tracking-[-0.625px] text-[#717182]">
          View and manage all workspace bookings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-[16px]">
        {/* Total Bookings */}
        <div className="bg-white border border-gray-200 rounded-[14px] px-[21px] pt-[21px] pb-px flex flex-col gap-[4px]">
          <p className="font-['Inter'] font-normal text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
            Total Bookings
          </p>
          <p className="font-['Inter'] font-normal text-[24px] leading-[36px] tracking-[-0.4097px] text-neutral-950">
            {stats.total}
          </p>
        </div>

        {/* Active */}
        <div className="bg-white border border-gray-200 rounded-[14px] px-[21px] pt-[21px] pb-px flex flex-col gap-[4px]">
          <p className="font-['Inter'] font-normal text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
            Active
          </p>
          <p className="font-['Inter'] font-normal text-[24px] leading-[36px] tracking-[-0.4097px] text-[#016630]">
            {stats.active}
          </p>
        </div>

        {/* Pending */}
        <div className="bg-white border border-gray-200 rounded-[14px] px-[21px] pt-[21px] pb-px flex flex-col gap-[4px]">
          <p className="font-['Inter'] font-normal text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
            Pending
          </p>
          <p className="font-['Inter'] font-normal text-[24px] leading-[36px] tracking-[-0.4097px] text-[#f54900]">
            {stats.pending}
          </p>
        </div>

        {/* Completed */}
        <div className="bg-white border border-gray-200 rounded-[14px] px-[21px] pt-[21px] pb-px flex flex-col gap-[4px]">
          <p className="font-['Inter'] font-normal text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
            Completed
          </p>
          <p className="font-['Inter'] font-normal text-[24px] leading-[36px] tracking-[-0.4097px] text-[#0066cc]">
            {stats.completed}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-[16px]">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[42px] bg-[#f3f3f5] border border-gray-200 rounded-[14px] pl-[44px] pr-[12px] font-['Inter'] font-normal text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182]"
          />
          <Search className="absolute left-[16px] top-[13px] w-[16px] h-[16px] text-[#717182]" strokeWidth={1.5} />
        </div>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="h-[42px] bg-white border border-gray-200 rounded-[14px] px-[16px] font-['Inter'] font-normal text-[14px] tracking-[-0.3008px] text-neutral-950"
        >
          <option value="all">All Dates</option>
          <option value="past">Past</option>
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[42px] bg-white border border-gray-200 rounded-[14px] px-[16px] font-['Inter'] font-normal text-[14px] tracking-[-0.3008px] text-neutral-950"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-[16px] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-950 border-r-transparent"></div>
              <p className="mt-4 text-[14px] text-[#717182]">Loading bookings...</p>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-[14px] text-[#717182]">No bookings found</p>
          </div>
        ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="h-[45.5px]">
              <th className="text-left px-[25px] font-['Inter'] font-bold text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
                User
              </th>
              <th className="text-left px-[25px] font-['Inter'] font-bold text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
                Workspace
              </th>
              <th className="text-left px-[25px] font-['Inter'] font-bold text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
                Date
              </th>
              <th className="text-left px-[25px] font-['Inter'] font-bold text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
                Time
              </th>
              <th className="text-left px-[25px] font-['Inter'] font-bold text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
                Check-in Code
              </th>
              <th className="text-left px-[25px] font-['Inter'] font-bold text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
                Status
              </th>
              <th className="text-left px-[25px] font-['Inter'] font-bold text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => {
              const statusConfig = getStatusConfig(booking.status);
              return (
                <tr
                  key={booking.id}
                  className="border-t border-gray-200 h-[72px]"
                >
                  {/* User */}
                  <td className="px-[25px]">
                    <div className="flex flex-col gap-0">
                      <p className="font-['Inter'] font-normal text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                        {booking.username || 'N/A'}
                      </p>
                      <p className="font-['Inter'] font-normal text-[12px] leading-[18px] text-[#717182]">
                        {booking.user_email || 'N/A'}
                      </p>
                    </div>
                  </td>

                  {/* Workspace */}
                  <td className="px-[25px]">
                    <div className="flex flex-col gap-0">
                      <p className="font-['Inter'] font-normal text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                        {booking.space_name || 'N/A'}
                      </p>
                      <p className="font-['Inter'] font-normal text-[12px] leading-[18px] text-[#717182]">
                        {formatSpaceType(booking.space_type)}
                      </p>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-[25px]">
                    <div className="flex items-center gap-[8px]">
                      <Calendar className="w-[16px] h-[16px] text-[#717182]" strokeWidth={1.5} />
                      <p className="font-['Inter'] font-normal text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
                        {formatDate(booking.date)}
                      </p>
                    </div>
                  </td>

                  {/* Time */}
                  <td className="px-[25px]">
                    <div className="flex items-center gap-[8px]">
                      <Clock className="w-[16px] h-[16px] text-[#717182]" strokeWidth={1.5} />
                      <p className="font-['Inter'] font-normal text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
                        {booking.start_time || 'N/A'} - {booking.end_time || 'N/A'}
                      </p>
                    </div>
                  </td>

                  {/* Check-in Code */}
                  <td className="px-[25px]">
                    <div className="bg-gray-50 rounded-[8px] px-[12px] py-[10.5px] inline-flex">
                      <p className="font-['Inter'] font-normal text-[14px] leading-[16.5px] tracking-[-0.3008px] text-neutral-950">
                        {booking.checkin_code || 'N/A'}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-[25px]">
                    <div className="flex flex-col gap-[4px]">
                      <div
                        className={`${statusConfig.bg} ${statusConfig.text} rounded-[8px] px-[9px] py-[3px] inline-flex w-fit`}
                      >
                        <p className="font-['Inter'] font-normal text-[12px] leading-[18px] tracking-[-0.12px]">
                          {statusConfig.label}
                        </p>
                      </div>
                      {booking.status === 'active' && isCheckedIn(booking) && (
                        <p className="font-['Inter'] font-normal text-[11px] leading-[16.5px] tracking-[0.0645px] text-[#00a63e]">
                          ✓ Checked In
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-[25px]">
                    <div className="flex gap-[8px]">
                      {booking.status === 'active' && !isCheckedIn(booking) && (
                        <button className="w-[28px] h-[28px] rounded-[8px] hover:bg-gray-100 flex items-center justify-center">
                          <CheckCircle className="w-[16px] h-[16px] text-[#717182]" strokeWidth={1.5} />
                        </button>
                      )}
                      {(booking.status === 'active' ||
                        booking.status === 'pending') && (
                        <>
                          <button className="w-[28px] h-[28px] rounded-[8px] hover:bg-gray-100 flex items-center justify-center">
                            <Edit2 className="w-[16px] h-[16px] text-[#717182]" strokeWidth={1.5} />
                          </button>
                          <button className="w-[28px] h-[28px] rounded-[8px] hover:bg-gray-100 flex items-center justify-center">
                            <Trash2 className="w-[16px] h-[16px] text-[#717182]" strokeWidth={1.5} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
