/**
 * Dashboard Page
 * Content only - Sidebar and NotificationPanel from layout
 */

'use client';

import StatsCard from '@/component/StatsCard';
import { useAuth } from '@/lib/useAuth';
import { useCurrentUser, useDashboardStats } from '@/hooks';
import { useToast } from '@/contexts/ToastContext';
import { getUserDisplayName } from '@/utils/user';

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentUser } = useCurrentUser();
  const { showToastMessage } = useToast();
  
  const { data: response, isLoading: loading, error } = useDashboardStats(currentUser?.id);
  
  // Extract stats data from response
  const stats = response?.data;

  // Show error toast if stats fetch fails
  if (error) {
    showToastMessage({
      type: 'error',
      title: 'Error',
      message: error.message || 'Failed to load statistics',
      duration: 5000
    });
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 pt-20 md:pt-12 pb-16">
      {/* Header */}
      <div className="mb-8 dashboard-section">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal text-neutral-950">
            Welcome back, {getUserDisplayName(user)}
          </h1>
          <img
            src="/assets/26f007377255a2dc487ccde63b6bf1c54245ba2a.svg"
            alt=""
            className="w-5 h-5 md:w-6 md:h-6"
          />
        </div>
        <p className="text-base md:text-lg text-[#717182]">
          {loading ? 'Loading...' : `You have ${stats?.today_bookings || 0} booking${stats?.today_bookings !== 1 ? 's' : ''} today`}
        </p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-[rgba(229,231,235,0.5)] rounded-3xl p-6 h-40 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
          <StatsCard
            icon="/assets/da4f5fa18b22cd13d4f71102120baa5af7fe77e8.svg"
            label="Today"
            value={stats.today_bookings}
            description="active bookings"
            shadowColor="rgba(0,201,80,0.2)"
          />
          
          <StatsCard
            icon="/assets/e88e0f4df734d42bd7283994158bdc4d594b8b18.svg"
            label="Upcoming"
            value={stats.upcoming_bookings}
            description="scheduled"
            shadowColor="rgba(43,127,255,0.2)"
          />
          
          <StatsCard
            icon="/assets/e9aa9032ab2e50fc64c3d5c46f3590100507f1e0.svg"
            label="This Week"
            value={stats.weekly_booking_hours.toFixed(1)}
            description="hours booked"
            shadowColor="rgba(173,70,255,0.2)"
          />
          
          <StatsCard
            icon="/assets/782e096da2a1ec8dc40baa81f21270e2cc2e826c.svg"
            label="Favorite"
            value={stats.favorite_space ? stats.favorite_space.space_name : 'None'}
            description={stats.favorite_space ? `${stats.favorite_space.booking_count} times` : 'No favorite yet'}
            shadowColor="rgba(255,105,0,0.2)"
          />
        </div>
      ) : null}

      {/* Placeholder for rest of dashboard content */}
      <div className="bg-white rounded-2xl p-8 text-center text-gray-500">
        Dashboard content continues here...
      </div>
    </div>
  );
}
