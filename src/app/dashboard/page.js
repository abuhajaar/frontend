'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/component/ProtectedRoute';
import LogoutButton from '@/component/LogoutButton';
import { useAuth } from '@/lib/useAuth';

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Log user data for debugging
  useEffect(() => {
    console.log('Dashboard - Current user:', user);
  }, [user]);

  // Helper function to get user display name
  const getUserDisplayName = (user) => {
    if (!user) return 'User';
    // Priority: name > username > email username part
    if (user.name) return user.name;
    if (user.username) return user.username;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  // Helper function to get user initials for avatar
  const getUserInitials = (user) => {
    if (!user) return 'U';
    const displayName = getUserDisplayName(user);
    
    // If it's a full name with spaces
    const names = displayName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    // Otherwise take first 2 characters
    return displayName.substring(0, 2).toUpperCase();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-20 transition-transform duration-500 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Branding */}
        <div className="h-28 px-6 pt-8 pb-0 sidebar-content">
          <h1 className="text-base font-normal text-[#101828] tracking-tight mb-1">
            Workspace
          </h1>
          <p className="text-sm text-[#717182]">Book your space</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 sidebar-content">
          <div className="space-y-1 mb-4">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-100 text-[#101828] text-sm font-medium">
              <img
                src="/assets/a24f59b1afa77a0af0fd52d01319957c8c1816ef.svg"
                alt=""
                className="w-4 h-4"
              />
              Dashboard
            </button>
            <button 
              onClick={() => router.push('/booking')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#4a5565] text-sm font-medium hover:bg-gray-50"
            >
              <img
                src="/assets/d328689530a20f442c7a125bf97d5dc2a61fff01.svg"
                alt=""
                className="w-4 h-4"
              />
              Browse Spaces
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#4a5565] text-sm font-medium hover:bg-gray-50">
              <img
                src="/assets/60e4e55d9bb30bcf44214b60c31e3794ae6f3c4a.svg"
                alt=""
                className="w-4 h-4"
              />
              My Bookings
            </button>
          </div>

          <div className="h-px bg-black/10 my-4" />

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#4a5565] text-sm font-medium hover:bg-gray-50">
              <img
                src="/assets/c2fd7a7308e28ed684a5f5392a35f554e5a5e9cd.svg"
                alt=""
                className="w-4 h-4"
              />
              FAQ & Help
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#4a5565] text-sm font-medium hover:bg-gray-50">
              <img
                src="/assets/7e187711dac8dba400baff787c183bcc5cebc2fe.svg"
                alt=""
                className="w-4 h-4"
              />
              Settings
            </button>
          </div>
        </div>

        {/* User Profile & Sign Out */}
        <div className="border-t border-gray-200 px-4 py-4 sidebar-content">
          <div className="flex items-center gap-3 px-2 mb-2">
            <div className="w-10 h-10 bg-[#101828] rounded-full flex items-center justify-center text-white font-medium">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm">{getUserInitials(user)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#101828] truncate font-medium">
                {getUserDisplayName(user)}
              </p>
              <p className="text-xs text-[#717182] truncate">
                {user?.email || 'user@company.com'}
              </p>
            </div>
          </div>
          <LogoutButton className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#4a5565] text-sm font-medium hover:bg-gray-50">
            <img
              src="/assets/fab12f232bbb3c666849a981e9234d87ca4e3c92.svg"
              alt=""
              className="w-4 h-4"
            />
            Sign Out
          </LogoutButton>
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative transition-all duration-500 ease-in-out ${
        sidebarOpen ? 'md:ml-64' : 'ml-0'
      }`}>
        {/* Hamburger Toggle & Notification Bell */}
        <button
          onClick={toggleSidebar}
          className={`fixed top-6 w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center hover:bg-gray-50 z-10 transition-all duration-500 ease-in-out ${
            sidebarOpen ? 'left-[280px]' : 'left-6'
          }`}
        >
          <img
            src="/assets/32ac3a0299bf4fe858ee844c270aff8e418a9583.svg"
            alt="Toggle sidebar"
            className="w-5 h-5"
          />
        </button>

        <button
          onClick={toggleNotification}
          className="fixed top-6 right-6 w-12 h-12 bg-white border border-gray-200/80 rounded-2xl flex items-center justify-center hover:bg-gray-50 z-10 transition-all duration-500 ease-in-out"
        >
          <img
            src="/assets/2cce2494b226fc1bccb273938d368812616a41cf.svg"
            alt="Notifications"
            className="w-5 h-5"
          />
        </button>

        {/* Notification Panel */}
        {notificationOpen && (
          <div
            className="fixed right-6 top-[76px] w-full max-w-96 bg-white border border-gray-200/80 rounded-3xl shadow-lg z-20 overflow-hidden animate-slideDown"
          >
            {/* Header */}
            <div className="border-b border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-normal text-neutral-950">
                  Notifications
                </h3>
                <button
                  onClick={toggleNotification}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-gray-50"
                >
                  <img
                    src="/assets/aabeb93e4a2118741e46ae15bd2919918a78fcf7.svg"
                    alt="Close"
                    className="w-4 h-4"
                  />
                </button>
              </div>
              <p className="text-sm text-[#6a7282]">You're all caught up</p>
            </div>

            {/* Notifications List */}
            <div className="p-3 space-y-2 max-h-96 overflow-y-auto">
              {/* Booking Confirmed */}
              <button className="w-full p-4 rounded-2xl hover:bg-gray-50 text-left">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <img
                      src="/assets/8536599b974169b6450772e6512c7682735a03be.svg"
                      alt=""
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-950 mb-1">
                      Booking Confirmed
                    </p>
                    <p className="text-xs text-[#4a5565] mb-2 line-clamp-2">
                      Your booking for Desk A1 on October 27 has been confirmed.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#99a1af]">
                      <img
                        src="/assets/a406003f9e768ad46d9256962cac080f403e55c8.svg"
                        alt=""
                        className="w-3 h-3"
                      />
                      <span>2 hours ago</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Reminder */}
              <button className="w-full p-4 rounded-2xl hover:bg-gray-50 text-left">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <img
                      src="/assets/b0344f2aea6a050cac3a431dad631966cd2098b2.svg"
                      alt=""
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-950 mb-1">
                      Reminder
                    </p>
                    <p className="text-xs text-[#4a5565] mb-2 line-clamp-2">
                      Your booking starts in 1 hour. Check-in code: ABC123
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#99a1af]">
                      <img
                        src="/assets/a406003f9e768ad46d9256962cac080f403e55c8.svg"
                        alt=""
                        className="w-3 h-3"
                      />
                      <span>5 hours ago</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Booking Cancelled */}
              <button className="w-full p-4 rounded-2xl hover:bg-gray-50 text-left">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#ffedd4] rounded-xl flex items-center justify-center flex-shrink-0">
                    <img
                      src="/assets/888f77712f017ecd5d243ad3c1391c9d92567909.svg"
                      alt=""
                      className="w-5 h-5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-950 mb-1">
                      Booking Cancelled
                    </p>
                    <p className="text-xs text-[#4a5565] mb-2 line-clamp-2">
                      Conference A booking for October 28 has been cancelled.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#99a1af]">
                      <img
                        src="/assets/a406003f9e768ad46d9256962cac080f403e55c8.svg"
                        alt=""
                        className="w-3 h-3"
                      />
                      <span>1 day ago</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 md:px-8 lg:px-12 pt-20 md:pt-12 pb-16">
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
            <p className="text-base md:text-lg text-[#717182]">You have 1 booking today</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
            <div className="stat-card bg-white border border-[rgba(229,231,235,0.5)] border-solid rounded-3xl p-6 relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(0,201,80,0.2),0px_4px_6px_-4px_rgba(0,201,80,0.2)] mb-4">
                <img
                  src="/assets/da4f5fa18b22cd13d4f71102120baa5af7fe77e8.svg"
                  alt=""
                  className="w-6 h-6"
                />
              </div>
              <p className="text-xs text-[#6a7282] uppercase tracking-[0.3px] mb-1">
                Today
              </p>
              <p className="text-4xl font-normal text-neutral-950 tracking-[-0.5309px] mb-1">1</p>
              <p className="text-xs text-[#99a1af]">active bookings</p>
            </div>

            <div className="stat-card bg-white border border-[rgba(229,231,235,0.5)] border-solid rounded-3xl p-6 relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(43,127,255,0.2),0px_4px_6px_-4px_rgba(43,127,255,0.2)] mb-4">
                <img
                  src="/assets/e88e0f4df734d42bd7283994158bdc4d594b8b18.svg"
                  alt=""
                  className="w-6 h-6"
                />
              </div>
              <p className="text-xs text-[#6a7282] uppercase tracking-[0.3px] mb-1">
                Upcoming
              </p>
              <p className="text-4xl font-normal text-neutral-950 tracking-[-0.5309px] mb-1">1</p>
              <p className="text-xs text-[#99a1af]">scheduled</p>
            </div>

            <div className="stat-card bg-white border border-[rgba(229,231,235,0.5)] border-solid rounded-3xl p-6 relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(173,70,255,0.2),0px_4px_6px_-4px_rgba(173,70,255,0.2)] mb-4">
                <img
                  src="/assets/e9aa9032ab2e50fc64c3d5c46f3590100507f1e0.svg"
                  alt=""
                  className="w-6 h-6"
                />
              </div>
              <p className="text-xs text-[#6a7282] uppercase tracking-[0.3px] mb-1">
                This Week
              </p>
              <p className="text-4xl font-normal text-neutral-950 tracking-[-0.5309px] mb-1">13.0</p>
              <p className="text-xs text-[#99a1af]">hours booked</p>
            </div>

            <div className="stat-card bg-white border border-[rgba(229,231,235,0.5)] border-solid rounded-3xl p-6 relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(255,105,0,0.2),0px_4px_6px_-4px_rgba(255,105,0,0.2)] mb-4">
                <img
                  src="/assets/782e096da2a1ec8dc40baa81f21270e2cc2e826c.svg"
                  alt=""
                  className="w-6 h-6"
                />
              </div>
              <p className="text-xs text-[#6a7282] uppercase tracking-[0.3px] mb-1">
                Total
              </p>
              <p className="text-4xl font-normal text-neutral-950 tracking-[-0.5309px] mb-1">2</p>
              <p className="text-xs text-[#99a1af]">all time</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Next Up */}
              <div className="dashboard-section">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-normal text-neutral-950 tracking-[-0.4492px]">
                    Next Up
                  </h2>
                  <button className="flex items-center gap-1 text-sm text-[#6a7282] tracking-[-0.1504px]">
                    View all
                    <img
                      src="/assets/055adda25f28c8754bcbe5456a42615fe519fb84.svg"
                      alt=""
                      className="w-4 h-4"
                    />
                  </button>
                </div>

                <div className="bg-white border border-[rgba(185,248,207,0.6)] border-solid rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100/50">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
                      <img
                        src="/assets/ce4b197313a06beb48b8e160140677b961334ff3.svg"
                        alt=""
                        className="w-8 h-8"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-normal text-neutral-950 mb-3 tracking-[-0.4492px]">
                        Desk A1
                      </h3>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <div className="bg-[rgba(255,255,255,0.6)] px-3 py-2 rounded-xl flex items-center gap-2">
                          <img
                            src="/assets/60e4e55d9bb30bcf44214b60c31e3794ae6f3c4a.svg"
                            alt=""
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-[#4a5565] tracking-[-0.1504px]">
                            Mon, Oct 27
                          </span>
                        </div>
                        <div className="bg-[rgba(255,255,255,0.6)] px-3 py-2 rounded-xl flex items-center gap-2">
                          <img
                            src="/assets/5a3f62bb39b954f739f8985182a1414d09bd6c77.svg"
                            alt=""
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-[#4a5565] tracking-[-0.1504px]">
                            10:00 AM - 6:00 PM
                          </span>
                        </div>
                        <div className="bg-[rgba(255,255,255,0.6)] px-3 py-2 rounded-xl flex items-center gap-2">
                          <img
                            src="/assets/9dfd53f8d8631f8d393852ebc7e1c4f9e9130c62.svg"
                            alt=""
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-[#4a5565] tracking-[-0.1504px]">Floor 1</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <span className="bg-[#00a63e] border border-[rgba(0,0,0,0)] border-solid text-white text-xs font-medium px-4 py-2 rounded-xl">
                          Check-in: ABC123
                        </span>
                        <span className="bg-[rgba(255,255,255,0.8)] border border-[rgba(0,0,0,0)] border-solid text-[#364153] text-xs font-medium px-4 py-2 rounded-xl capitalize">
                          hot desk
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Pattern */}
              <div className="dashboard-section">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-normal text-neutral-950 tracking-[-0.4492px]">
                    Booking Pattern
                  </h2>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm border border-[rgba(0,0,0,0)] border-solid tracking-[-0.1504px]">
                      Weekly
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-[rgba(229,231,235,0.6)] border-solid text-[#6a7282] text-sm bg-white tracking-[-0.1504px]">
                      Monthly
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-[rgba(229,231,235,0.6)] border-solid rounded-3xl p-8">
                  <div className="h-64 flex items-end gap-4">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day, index) => {
                        const heights = [70, 90, 60, 100, 75, 50, 65];
                        return (
                          <div key={day} className="flex-1 flex flex-col items-center gap-3">
                            <div className="w-full bg-blue-100 rounded-t-xl relative" style={{ height: `${heights[index]}%` }}>
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                {[12, 16, 10, 20, 15, 8, 11][index]}
                              </div>
                            </div>
                            <span className="text-sm text-[#6a7282] tracking-[-0.1504px]">{day}</span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* This Week */}
              <div className="dashboard-section">
                <h2 className="text-xl font-normal text-neutral-950 mb-4 tracking-[-0.4492px]">
                  This Week
                </h2>
                <div className="bg-white border border-[rgba(229,231,235,0.6)] border-solid rounded-3xl p-6 space-y-2">
                  {/* Today */}
                  <div className="bg-blue-50 border border-[#bedbff] border-solid rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#155dfc] rounded-lg flex flex-col items-center justify-center text-white">
                        <span className="text-xs uppercase tracking-[0.3px]">Sun</span>
                        <span className="text-sm tracking-[-0.1504px]">26</span>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-950 tracking-[-0.1504px]">Today</p>
                        <p className="text-xs text-[#6a7282] tracking-[-0.1504px]">1 booking</p>
                      </div>
                    </div>
                    <div className="w-7 h-7 bg-[#ffedd4] border-2 border-white border-solid rounded-lg flex items-center justify-center">
                      <img
                        src="/assets/a67211be77d4ea84e0ddb965f77fd4e441f9af50.svg"
                        alt=""
                        className="w-4 h-4"
                      />
                    </div>
                  </div>

                  {/* Mon */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-[#364153]">
                        <span className="text-xs uppercase tracking-[0.3px]">Mon</span>
                        <span className="text-sm tracking-[-0.1504px]">27</span>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-950 tracking-[-0.1504px]">Oct 27</p>
                        <p className="text-xs text-[#6a7282] tracking-[-0.1504px]">1 booking</p>
                      </div>
                    </div>
                    <div className="w-7 h-7 bg-blue-100 border-2 border-white border-solid rounded-lg flex items-center justify-center">
                      <img
                        src="/assets/ce4b197313a06beb48b8e160140677b961334ff3.svg"
                        alt=""
                        className="w-4 h-4"
                      />
                    </div>
                  </div>

                  {/* Tue-Sat */}
                  {[
                    { day: 'Tue', date: '28' },
                    { day: 'Wed', date: '29' },
                    { day: 'Thu', date: '30' },
                    { day: 'Fri', date: '31' },
                    { day: 'Sat', date: '1', month: 'Nov' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-[#364153]">
                          <span className="text-xs uppercase tracking-[0.3px]">{item.day}</span>
                          <span className="text-sm tracking-[-0.1504px]">{item.date}</span>
                        </div>
                        <p className="text-sm text-neutral-950 tracking-[-0.1504px]">
                          {item.month ? `${item.month} ${item.date}` : `Oct ${item.date}`}
                        </p>
                      </div>
                      <span className="text-xs text-[#99a1af] tracking-[-0.1504px]">Free</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discover New Spaces */}
              <div className="dashboard-section">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-normal text-neutral-950 tracking-[-0.4492px]">
                    Discover New Spaces
                  </h2>
                  <img
                    src="/assets/7de8bf2ec490afd8adfd8c458c13c65c51a34045.svg"
                    alt=""
                    className="w-5 h-5"
                  />
                </div>
                <div className="space-y-3">
                  {/* Desk A2 */}
                  <button className="w-full bg-white border border-[rgba(229,231,235,0.6)] border-solid rounded-2xl p-4 flex items-center gap-4 hover:border-gray-300 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
                      <img
                        src="/assets/ed5338071c4f2077d526211236ee62a6973399dc.svg"
                        alt=""
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-neutral-950 mb-1 tracking-[-0.1504px]">Desk A2</p>
                      <div className="flex items-center gap-2 text-xs text-[#6a7282] tracking-[-0.1504px]">
                        <span className="capitalize">hot desk</span>
                        <span>•</span>
                        <span>Floor 1</span>
                      </div>
                    </div>
                    <img
                      src="/assets/338877c3f5864efeafebac8906fb9ca3ccfb3fb3.svg"
                      alt=""
                      className="w-5 h-5"
                    />
                  </button>

                  {/* Desk B1 */}
                  <button className="w-full bg-white border border-[rgba(229,231,235,0.6)] border-solid rounded-2xl p-4 flex items-center gap-4 hover:border-gray-300 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
                      <img
                        src="/assets/ed5338071c4f2077d526211236ee62a6973399dc.svg"
                        alt=""
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-neutral-950 mb-1 tracking-[-0.1504px]">Desk B1</p>
                      <div className="flex items-center gap-2 text-xs text-[#6a7282] tracking-[-0.1504px]">
                        <span className="capitalize">hot desk</span>
                        <span>•</span>
                        <span>Floor 2</span>
                      </div>
                    </div>
                    <img
                      src="/assets/338877c3f5864efeafebac8906fb9ca3ccfb3fb3.svg"
                      alt=""
                      className="w-5 h-5"
                    />
                  </button>

                  {/* Focus Room 1 */}
                  <button className="w-full bg-white border border-[rgba(229,231,235,0.6)] border-solid rounded-2xl p-4 flex items-center gap-4 hover:border-gray-300 transition-colors">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]">
                      <img
                        src="/assets/b6098960a0b01807b2f104f2ddb8b079f2e3896c.svg"
                        alt=""
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm text-neutral-950 mb-1 tracking-[-0.1504px]">
                        Focus Room 1
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[#6a7282] tracking-[-0.1504px]">
                        <span className="capitalize">private room</span>
                        <span>•</span>
                        <span>Floor 2</span>
                      </div>
                    </div>
                    <img
                      src="/assets/338877c3f5864efeafebac8906fb9ca3ccfb3fb3.svg"
                      alt=""
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>

              {/* View All */}
              <div className="dashboard-section">
                <button className="w-full bg-white border border-gray-200/80 rounded-3xl p-6 flex items-center justify-between hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <img
                        src="/assets/f232aeba506ee8fb210a50e4fe8dd4a6c2f42d2a.svg"
                        alt=""
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-neutral-950 mb-1">View All</p>
                      <p className="text-xs text-[#6a7282]">
                        Browse all bookings
                      </p>
                    </div>
                  </div>
                  <img
                    src="/assets/193a6c4f082a3c8961171b7f24c01aedf89a0944.svg"
                    alt=""
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
