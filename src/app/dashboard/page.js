'use client';

import { useState } from 'react';
import StatsCard from '@/component/StatsCard';
import { useAuth } from '@/lib/useAuth';
import { useCurrentUser, useDashboardStats } from '@/hooks';
import { useToast } from '@/contexts/ToastContext';
import { getUserDisplayName } from '@/utils/user';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentUser } = useCurrentUser();
  const { showToastMessage } = useToast();
  const router = useRouter();

  const { data: response, isLoading: loading, error } = useDashboardStats(currentUser?.id);
  const stats = response?.data;

  // Mock data for the visual demo (replace with real data hook later)
  const scheduleItems = [
    { id: 1, time: '10:00 AM', title: 'Team Sync', space: 'Meeting Room A', type: 'meeting' },
    { id: 2, time: '01:30 PM', title: 'Focus Time', space: 'Booth 4', type: 'focus' },
    { id: 3, time: '04:00 PM', title: 'Client Call', space: 'Conference Room', type: 'meeting' },
  ];

  const workModes = [
    { id: 'focus', title: 'Deep Focus', desc: 'Quiet soundproof booths', icon: '🤫', color: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:border-indigo-200' },
    { id: 'collab', title: 'Team Sync', desc: 'Meeting rooms with TV', icon: '👥', color: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:border-blue-200' },
    { id: 'creative', title: 'Brainstorm', desc: 'Whiteboards & open space', icon: '�', color: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:border-amber-200' },
    { id: 'social', title: 'Socialize', desc: 'Coffee bar & lounge', icon: '☕️', color: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:border-rose-200' },
  ];

  if (error) {
    showToastMessage({
      type: 'error',
      title: 'Error',
      message: error.message || 'Failed to load statistics',
      duration: 5000
    });
  }

  return (
    <div className="min-h-full px-4 sm:px-6 md:px-8 py-8 md:py-10 bg-[#FFFFFF]">
      {/* Background Aesthetics */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-purple-200/40 to-blue-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-gradient-to-tr from-orange-200/30 to-rose-100/30 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase mb-2">Workspace Overview</p>
            <h1 className="text-4xl md:text-5xl font-light text-neutral-900 tracking-tight" style={{ fontFamily: 'Tanker-Regular, sans-serif' }}>
              Good Morning, <span className="font-normal relative inline-block after:content-[''] after:absolute after:bottom-2 after:left-0 after:w-full after:h-3 after:bg-blue-100/50 after:-z-10">{getUserDisplayName(user).split(' ')[0]}</span>
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard/booking')}
              className="group relative px-6 py-3 bg-neutral-900 text-white rounded-full font-medium overflow-hidden transition-all hover:pr-9"
            >
              <span className="relative z-10">New Booking</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
            </button>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* Left Column: Stats & Schedule (8/12) */}
          <div className="xl:col-span-8 flex flex-col gap-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {loading ? (
                [1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse" />)
              ) : (
                <>
                  <StatsCard
                    icon="/assets/da4f5fa18b22cd13d4f71102120baa5af7fe77e8.svg"
                    label="Today by Numbers"
                    value={stats?.today_bookings || 0}
                    description="Active sessions today"
                    shadowColor="#22c55e"
                  />
                  <StatsCard
                    icon="/assets/e88e0f4df734d42bd7283994158bdc4d594b8b18.svg"
                    label="Upcoming Plan"
                    value={stats?.upcoming_bookings || 0}
                    description="Future bookings scheduled"
                    shadowColor="#3b82f6"
                  />
                  <StatsCard
                    icon="/assets/e9aa9032ab2e50fc64c3d5c46f3590100507f1e0.svg"
                    label="Weekly Focus"
                    value={stats?.weekly_booking_hours.toFixed(1)}
                    description="Hours dedicated this week"
                    shadowColor="#a855f7"
                  />
                  <StatsCard
                    icon="/assets/782e096da2a1ec8dc40baa81f21270e2cc2e826c.svg"
                    label="Go-To Space"
                    value={stats?.favorite_space ? stats.favorite_space.space_name : 'Explore'}
                    description={stats?.favorite_space ? `Most visited (${stats.favorite_space.booking_count})` : 'Find your favorite spot'}
                    shadowColor="#f97316"
                  />
                </>
              )}
            </div>

            {/* Work Mode Selector (Replaces 'Find your zone') */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

              <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                  <h2 className="text-xl font-medium text-gray-900">What's your work vibe?</h2>
                  <p className="text-gray-400 text-sm mt-1">Select a mode to find the perfect space</p>
                </div>
                <button onClick={() => router.push('/dashboard/booking')} className="text-sm text-gray-400 hover:text-gray-900 transition-colors">View map</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                {workModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => router.push(`/dashboard/booking?mode=${mode.id}`)}
                    className={`flex flex-col p-5 rounded-2xl border transition-all duration-300 group hover:shadow-md text-left ${mode.color} bg-opacity-30 border-opacity-50 hover:bg-opacity-40`}
                  >
                    <span className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300 origin-left inline-block">{mode.icon}</span>
                    <span className="font-semibold text-gray-900 mb-1">{mode.title}</span>
                    <span className="text-xs text-gray-500 font-medium">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Timeline & Activity (4/12) */}
          <div className="xl:col-span-4 flex flex-col gap-8">

            {/* Today's Schedule */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm h-full max-h-[600px] flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-3xl -mr-10 -mt-10" />
              <h2 className="text-xl font-medium text-gray-900 mb-6 relative z-10">Today's Schedule</h2>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
                </div>
              ) : (stats?.today_bookings > 0 ? (
                <div className="space-y-0 relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {scheduleItems.map((item, idx) => (
                    <div key={item.id} className="relative pl-6 pb-8 last:pb-0 border-l border-gray-100">
                      <div className={`absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full border-2 border-white ring-1 ring-gray-200 ${idx === 0 ? 'bg-green-500 ring-green-100' : 'bg-gray-300'}`} />
                      <div className="bg-gray-50 rounded-2xl p-4 hover:bg-blue-50 transition-colors group cursor-pointer border border-transparent hover:border-blue-100">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-semibold text-gray-400 group-hover:text-blue-400">{item.time}</span>
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-gray-500 border border-gray-100">{item.type}</span>
                        </div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {item.space}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* If real stats show more bookings than mock items, show a 'View All' */}
                  {stats.today_bookings > 3 && (
                    <button className="w-full py-3 text-sm text-gray-500 font-medium hover:text-blue-600 transition-colors mt-2">
                      + {stats.today_bookings - 3} more sessions
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-2xl">☕️</div>
                  <p>No more bookings today.</p>
                  <button onClick={() => router.push('/dashboard/booking')} className="mt-4 text-blue-600 font-medium text-sm hover:underline">Book a space</button>
                </div>
              ))}
            </div>

            {/* Mini-Promo Canvas - For filler content/artsy touch */}
            <div className="bg-[#1D1D1F] rounded-[32px] p-8 text-white relative overflow-hidden min-h-[240px] flex flex-col justify-end group cursor-pointer" onClick={() => router.push('/dashboard/booking')}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" alt="Workspace" />

              <div className="relative z-20">
                <p className="text-xs font-medium text-blue-300 uppercase tracking-widest mb-2">Featured</p>
                <h3 className="text-2xl font-light mb-1">Creative Suite B</h3>
                <p className="text-gray-300 text-sm">Quiet, natural light, 4k monitor.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
