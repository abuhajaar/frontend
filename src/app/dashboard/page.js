'use client';

import { useState, useRef } from 'react';
import StatsCard from '@/component/StatsCard';
import { useAuth } from '@/lib/useAuth';
import { useCurrentUser, useDashboardStats } from '@/hooks';
import { useAnnouncements } from '@/hooks/useAnnouncements';
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

  const { data: response, isLoading: loading, error } = useDashboardStats();
  const stats = response?.data;

  // Get real data from API with WebSocket for announcements
  const { announcements, isConnected: wsConnected, hasNewAnnouncement } = useAnnouncements(stats?.announcements || []);
  const todoTasks = stats?.todo_list?.tasks || [];
  const incompleteTasks = todoTasks.filter(task => !task.is_done);

  // Helper function to format relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  // Helper function to get announcement priority
  const getAnnouncementPriority = (index) => {
    if (index === 0) return 'high';
    if (index <= 2) return 'medium';
    return 'low';
  };

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
              ref={pomodoroButtonRef}
              onClick={(e) => {
                const buttonElement = e.currentTarget;
                const rect = buttonElement.getBoundingClientRect();
                const xPercent = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
                const yPercent = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
                setPomodoroPosition({ x: xPercent, y: yPercent });
                setShowPomodoro(true);
              }}
              className="group relative px-6 py-3 bg-black text-white rounded-xl font-bold text-base overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none border-2 border-black"
            >
              <span className="relative z-10 flex items-center gap-2">
                ⏱️ Pomodoro Timer
              </span>
            </button>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* Left Column: Stats & Schedule (8/12) */}
          <div className="xl:col-span-8 flex flex-col gap-8">

            {/* Announcements */}
            <div className="bg-yellow-300 rounded-3xl p-8 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
              <div className="mb-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-black tracking-tight">Announcements</h2>
                    <p className="text-black/60 font-medium text-sm mt-1">Stay updated with the latest news</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${wsConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    <span className="text-xs font-bold text-black/70">
                      {wsConnected ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                {announcements.length > 0 ? (
                  announcements.slice(0, 5).map((announcement, idx) => {
                    const priority = getAnnouncementPriority(idx);
                    return (
                      <div 
                        key={announcement.id} 
                        className="bg-white rounded-xl p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              {priority === 'high' && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold uppercase rounded border border-black">Urgent</span>
                              )}
                              {priority === 'medium' && (
                                <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold uppercase rounded border border-black">Info</span>
                              )}
                              <span className="text-[11px] font-semibold text-gray-400">{getRelativeTime(announcement.created_at)}</span>
                              <span className="text-[10px] text-gray-400">by {announcement.creator_name}</span>
                            </div>
                            <h3 className="font-bold text-base text-black mb-1 group-hover:underline">{announcement.title}</h3>
                            <p className="text-sm font-medium text-gray-600 leading-relaxed">{announcement.description}</p>
                          </div>
                          <span className="text-xl opacity-70">{idx === 0 ? '📢' : idx === 1 ? '📅' : '📋'}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-black/50 font-medium">
                    No announcements at the moment
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse border-2 border-black" />)
              ) : (
                <>
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

          {/* Right Column: Timeline & Activity (4/12) */}
          <div className="xl:col-span-4 flex flex-col">

            {/* Today's Schedule - Notebook Style */}
            <div className="bg-[#FFFDF5] rounded-[24px] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex-1 overflow-hidden flex flex-col relative px-8 py-10"
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
                ) : (incompleteTasks.length > 0 ? (
                  <div className="space-y-6 mt-2">
                    {incompleteTasks.slice(0, 3).map((task, idx) => {
                      const dueDate = new Date(task.assignment_due_date);
                      const formattedTime = dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                      const priorityColor = task.task_priority === 'high' ? 'bg-red-100' : task.task_priority === 'medium' ? 'bg-yellow-100' : 'bg-gray-50';
                      
                      return (
                        <div key={task.task_id} className="relative group cursor-pointer">
                          {/* Handwritten-style check box */}
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 w-6 h-6 border-2 border-black rounded-md flex items-center justify-center flex-shrink-0 ${task.is_done ? 'bg-green-400' : 'bg-white'}`}>
                              {task.is_done && <span className="text-black font-bold">✓</span>}
                            </div>

                            <div className={`flex-1 transition-all ${task.is_done ? 'opacity-50 line-through decoration-black decoration-2' : ''}`}>
                              <div className="flex justify-between items-baseline gap-2">
                                <h4 className="font-bold text-lg text-black leading-none">{task.task_title}</h4>
                                <span className="text-sm font-bold bg-black text-white px-2 py-0.5 rounded-md -rotate-2 flex-shrink-0">{formattedTime}</span>
                              </div>
                              <p className="text-sm font-medium text-gray-600 mt-1 flex items-center gap-1">
                                📋 {task.assignment_title}
                              </p>
                              <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded ${priorityColor} border border-black/20`}>
                                {task.task_priority}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {incompleteTasks.length > 3 && (
                      <button className="w-full py-2 text-sm font-bold text-gray-500 hover:text-black border-2 border-dashed border-gray-300 hover:border-black rounded-xl mt-4 transition-all">
                        + {incompleteTasks.length - 3} MORE TASKS
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
                    <div className="w-24 h-24 border-[3px] border-black rounded-full flex items-center justify-center mb-4 text-4xl bg-white">✨</div>
                    <p className="font-bold text-xl text-black">Nothing scheduled!</p>
                    <p className="text-base text-gray-500 font-medium">Time to create something new.</p>
                    <button onClick={() => router.push('/dashboard/booking')} className="mt-6 px-6 py-2 bg-blue-500 text-white font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all">
                      Book a spot
                    </button>
                  </div>
                ))}
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
