import { Users, BookOpen, AlertCircle, TrendingUp, Plus, Settings } from 'lucide-react';
import StatsCard from '@/component/StatsCard';

export default function AdminOverviewPage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Header */}
      <div>
        <h1 className="text-5xl md:text-7xl font-black text-black tracking-widest uppercase mb-4" style={{ fontFamily: 'Tanker-Regular, sans-serif' }}>
          Admin Overview
        </h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl">
          Global system status and quick actions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<Users size={24} strokeWidth={3} />}
          label="Total Users"
          value="156"
          description="Active accounts"
          shadowColor="#3B82F6"
        />
        <StatsCard
          icon={<BookOpen size={24} strokeWidth={3} />}
          label="Total Bookings"
          value="1,248"
          description="All time"
          shadowColor="#A855F7"
        />
        <StatsCard
          icon={<TrendingUp size={24} strokeWidth={3} />}
          label="Utilization"
          value="78%"
          description="Average daily occ."
          shadowColor="#F97316"
        />
        <StatsCard
          icon={<AlertCircle size={24} strokeWidth={3} />}
          label="System Health"
          value="99.9%"
          description="Uptime status"
          shadowColor="#22C55E"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Actions */}
        <div className="bg-white border-[3px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-2">
            <Users size={24} strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-black text-black uppercase">Manage Users</h3>
          <p className="text-gray-500 font-medium mb-4">Add, remove, or update user permissions and roles.</p>
          <button className="w-full py-3 bg-gray-100 hover:bg-black hover:text-white border-2 border-black rounded-xl font-bold transition-all">
            Go to Users
          </button>
        </div>

        {/* Space Actions */}
        <div className="bg-white border-[3px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-2">
            <Settings size={24} strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-black text-black uppercase">Configure Spaces</h3>
          <p className="text-gray-500 font-medium mb-4">Edit floor plans, amenities, and seating arrangements.</p>
          <button className="w-full py-3 bg-gray-100 hover:bg-black hover:text-white border-2 border-black rounded-xl font-bold transition-all">
            Manage Spaces
          </button>
        </div>

        {/* Create New */}
        <div className="bg-yellow-100 border-[3px] border-black rounded-2xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-2">
            <Plus size={24} strokeWidth={2.5} />
          </div>
          <h3 className="text-2xl font-black text-black uppercase">Quick Add</h3>
          <p className="text-gray-700 font-medium mb-4">Fast track new resource creation.</p>
          <div className="flex gap-2 w-full">
            <button className="flex-1 py-3 bg-white hover:bg-black hover:text-white border-2 border-black rounded-xl font-bold transition-all text-sm">
              User
            </button>
            <button className="flex-1 py-3 bg-white hover:bg-black hover:text-white border-2 border-black rounded-xl font-bold transition-all text-sm">
              Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
