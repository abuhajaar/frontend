'use client';

import { useState, useRef } from 'react';
import StatsCard from '@/component/StatsCard';
import { useAuth } from '@/lib/useAuth';
import { useCurrentUser, useDashboardStats } from '@/hooks';
import { useToast } from '@/contexts/ToastContext';
import { getUserDisplayName } from '@/utils/user';
import { useRouter } from 'next/navigation';
import { Activity, Calendar, Clock, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Pomodoro to prevent SSR issues
const PomodoroOverlay = dynamic(() => import('@/component/PomodoroOverlay'), { ssr: false });

export default function DashboardPage() {
  const { user } = useAuth();
  const { currentUser } = useCurrentUser();
  const { showToastMessage } = useToast();
  const router = useRouter();
  const pomodoroButtonRef = useRef(null);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [pomodoroPosition, setPomodoroPosition] = useState({ x: 50, y: 50 });

  const { data: response, isLoading: loading, error } = useDashboardStats(currentUser?.id);
  const stats = response?.data;

  // Mock data for the visual demo (replace with real data hook later)
  const scheduleItems = [
    { id: 1, time: '10:00 AM', title: 'Team Sync', space: 'Meeting Room A', type: 'meeting' },
    { id: 2, time: '01:30 PM', title: 'Focus Time', space: 'Booth 4', type: 'focus' },
    { id: 3, time: '04:00 PM', title: 'Client Call', space: 'Conference Room', type: 'meeting' },
  ];

  const workModes = [
    { id: 'focus', title: 'Deep Focus', desc: 'Pomodoro Timer & Zen Mode', icon: '⏱️', color: 'bg-black text-white border-black' },
    { id: 'collab', title: 'Team Sync', desc: 'Meeting rooms with TV', icon: '👥', color: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:border-blue-200' },
    { id: 'creative', title: 'Brainstorm', desc: 'Whiteboards & open space', icon: '🎨', color: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:border-amber-200' },
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
    <div className="min-h-full px-4 sm:px-6 md:px-8 py-8 md:py-10 bg-[#FFFEF8]" style={{ backgroundImage: 'radial-gradient(#E5E5E5 1px, transparent 1px)', backgroundSize: '24px 24px' }}>

      <div className="relative z-10 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-gray-500 font-medium mb-1 pl-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight" style={{ fontFamily: 'Tanker-Regular, sans-serif' }}>
              Good morning, <span className="text-gray-400 font-bold">{getUserDisplayName(user).split(' ')[0]}</span>
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/dashboard/booking')}
              className="group relative px-6 py-3 bg-white text-black rounded-xl font-bold text-base overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none border-2 border-black"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start a New Booking <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
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
                [1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border-2 border-black" />)
              ) : (
                <>
                  <StatsCard
                    icon={<Activity size={24} strokeWidth={3} />}
                    label="Today by Numbers"
                    value={stats?.today_bookings || 0}
                    description="Active sessions today"
                    shadowColor="#FFD028" // Yellowish
                  />
                  <StatsCard
                    icon={<Calendar size={24} strokeWidth={3} />}
                    label="Upcoming Plan"
                    value={stats?.upcoming_bookings || 0}
                    description="Future bookings scheduled"
                    shadowColor="#3B82F6" // Blue
                  />
                  <StatsCard
                    icon={<Clock size={24} strokeWidth={3} />}
                    label="Weekly Focus"
                    value={stats?.weekly_booking_hours.toFixed(1)}
                    description="Hours dedicated this week"
                    shadowColor="#A855F7" // Purple
                  />
                  <StatsCard
                    icon={<MapPin size={24} strokeWidth={3} />}
                    label="Go-To Space"
                    value={stats?.favorite_space ? stats.favorite_space.space_name : 'Explore'}
                    description={stats?.favorite_space ? `Most visited (${stats.favorite_space.booking_count})` : 'Find your favorite spot'}
                    shadowColor="#F97316" // Orange
                  />
                </>
              )}
            </div>

            {/* Work Mode Selector */}
            <div className="bg-white rounded-[32px] p-8 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                  <h2 className="text-3xl font-black text-black uppercase tracking-tight">Pick Your Vibe</h2>
                  <p className="text-gray-500 font-medium mt-1">What's on the agenda today?</p>
                </div>
                <button onClick={() => router.push('/dashboard/booking')} className="px-4 py-2 bg-gray-100 rounded-xl border-2 border-black font-bold text-sm hover:bg-yellow-300 transition-colors">View Map</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                {workModes.map(mode => {
                  const isFocus = mode.id === 'focus';
                  return (
                    <button
                      key={mode.id}
                      ref={isFocus ? pomodoroButtonRef : null}
                      onClick={(e) => {
                        if (isFocus) {
                          const buttonElement = e.currentTarget;
                          const rect = buttonElement.getBoundingClientRect();
                          const xPercent = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
                          const yPercent = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
                          setPomodoroPosition({ x: xPercent, y: yPercent });
                          setShowPomodoro(true);
                        } else {
                          router.push(`/dashboard/booking?mode=${mode.id}`);
                        }
                      }}
                      className={`flex flex-col p-5 rounded-2xl border-[3px] border-black transition-all duration-300 group hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left
                        ${isFocus ? 'bg-black text-white' : 'bg-white text-black'}
                      `}
                    >
                      <div className={`w-12 h-12 rounded-full border-2 border-black flex items-center justify-center text-2xl mb-4 
                        ${isFocus ? 'bg-white text-black' :
                          mode.id === 'collab' ? 'bg-blue-100' :
                            mode.id === 'creative' ? 'bg-amber-100' : 'bg-rose-100'}
                      `}>
                        {mode.icon}
                      </div>
                      <span className={`font-bold text-lg mb-1 ${isFocus ? 'text-white' : 'text-black'}`}>{mode.title}</span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${isFocus ? 'text-gray-400' : 'text-gray-500'}`}>{mode.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Timeline & Activity (4/12) */}
          <div className="xl:col-span-4 flex flex-col gap-8 h-full">

            {/* Today's Schedule - Notebook Style */}
            <div className="bg-[#FFFDF5] rounded-[24px] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full overflow-hidden flex flex-col relative px-8 py-10"
              style={{
                backgroundImage: `linear-gradient(#E5E7EB 1px, transparent 1px)`,
                backgroundSize: '100% 32px',
                backgroundPosition: '0 24px' // Align lines
              }}>

              {/* Paper Holes Decoration */}
              <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-evenly py-6 pointer-events-none">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="w-4 h-4 rounded-full bg-[#1a1a1a] shadow-inner mb-8" />
                ))}
              </div>

              <div className="pl-6 relative z-10 flex-1 flex flex-col">
                <h2 className="text-3xl font-black text-black mb-6 rotate-[-1deg] inline-block border-b-4 border-yellow-300 w-fit">TODAY'S PLAN</h2>

                {loading ? (
                  <div className="space-y-6 mt-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-12 bg-black/5 rounded-lg animate-pulse" />)}
                  </div>
                ) : (stats?.today_bookings > 0 ? (
                  <div className="space-y-6 mt-2">
                    {scheduleItems.map((item, idx) => (
                      <div key={item.id} className="relative group cursor-pointer" onClick={() => router.push('/dashboard/booking')}>
                        {/* Handwritten-style check box */}
                        <div className="flex items-start gap-4">
                          <div className={`mt-1 w-6 h-6 border-2 border-black rounded-md flex items-center justify-center flex-shrink-0 ${idx === 0 ? 'bg-green-400' : 'bg-white'}`}>
                            {idx === 0 && <span className="text-black font-bold">✓</span>}
                          </div>

                          <div className={`flex-1 transition-all ${idx === 0 ? 'opacity-50 line-through decoration-black decoration-2' : ''}`}>
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-bold text-lg text-black leading-none">{item.title}</h4>
                              <span className="text-sm font-bold bg-black text-white px-2 py-0.5 rounded-md -rotate-2">{item.time}</span>
                            </div>
                            <p className="text-sm font-medium text-gray-600 mt-1 flex items-center gap-1">
                              📍 {item.space}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {stats.today_bookings > 3 && (
                      <button className="w-full py-2 text-sm font-bold text-gray-500 hover:text-black border-2 border-dashed border-gray-300 hover:border-black rounded-xl mt-4 transition-all">
                        + {stats.today_bookings - 3} MORE TASKS
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
                    <div className="w-24 h-24 border-[3px] border-black rounded-full flex items-center justify-center mb-4 text-4xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">✨</div>
                    <p className="font-bold text-xl text-black">Nothing scheduled!</p>
                    <p className="text-base text-gray-500 font-medium">Time to create something new.</p>
                    <button onClick={() => router.push('/dashboard/booking')} className="mt-6 px-6 py-2 bg-blue-500 text-white font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
                      Book a spot
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini-Promo Canvas - Artsy Style */}
            <div className="bg-[#1D1D1F] rounded-[24px] p-6 text-white relative overflow-hidden min-h-[200px] flex flex-col justify-end group cursor-pointer border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" onClick={() => router.push('/dashboard/booking')}>
              <img src="https://images.unsplash.com/photo-1519752594763-2633d8d4ea29?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Workspace" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              <div className="relative z-20 transform group-hover:translate-x-1 transition-transform">
                <span className="inline-block px-2 py-1 bg-yellow-400 text-black text-xs font-black uppercase tracking-wider mb-2 border border-black transform -rotate-2">Featured Space</span>
                <h3 className="text-3xl font-black mb-1">THE STUDIO</h3>
                <p className="text-gray-300 text-sm font-medium">For the makers & creators.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Pomodoro Overlay - renders on top without unmounting dashboard */}
      {showPomodoro && (
        <PomodoroOverlay
          position={pomodoroPosition}
          onClose={() => setShowPomodoro(false)}
        />
      )}
    </div>
  );
}
