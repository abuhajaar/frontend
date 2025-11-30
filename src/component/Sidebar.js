/**
 * Reusable Sidebar component
 * Can be shown/hidden with toggle button
 * Matches Figma design with open/collapsed states
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import LogoutButton from '@/component/LogoutButton';
import { getUserDisplayName, getUserInitials } from '@/utils/user';
import { gsap } from 'gsap';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useCurrentUser();
  
  // Refs for GSAP animations
  const sidebarRef = useRef(null);
  const headerTextRef = useRef(null);
  const navigationLabelsRef = useRef([]);
  const userProfileRef = useRef(null);
  
  // Manage sidebar open/close state with localStorage persistence
  const [isOpen, setIsOpen] = useState(true);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setIsOpen(savedState === 'true');
    }
  }, []);

  // Save state to localStorage when it changes
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarOpen', String(newState));
    
    // Dispatch custom event for layout to listen
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { isOpen: newState } }));
  };

  // GSAP Animation Effect
  useEffect(() => {
    if (!sidebarRef.current) return;

    const tl = gsap.timeline();

    if (isOpen) {
      // Opening animation
      tl.to(sidebarRef.current, {
        width: '256px',
        duration: 0.4,
        ease: 'power2.out'
      });

      // Animate in text elements after width change
      if (headerTextRef.current) {
        tl.fromTo(headerTextRef.current, {
          opacity: 0,
          x: -20
        }, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: 'power2.out'
        }, '-=0.2');
      }

      // Animate navigation labels
      const validLabels = navigationLabelsRef.current.filter(Boolean);
      if (validLabels.length > 0) {
        tl.fromTo(validLabels, {
          opacity: 0,
          x: -15
        }, {
          opacity: 1,
          x: 0,
          duration: 0.3,
          ease: 'power2.out',
          stagger: 0.05
        }, '-=0.2');
      }

      // Animate user profile
      if (userProfileRef.current) {
        tl.fromTo(userProfileRef.current, {
          opacity: 0,
          y: 10
        }, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        }, '-=0.1');
      }
    } else {
      // Closing animation - hide content first, then shrink width
      const elementsToHide = [
        headerTextRef.current,
        ...navigationLabelsRef.current.filter(Boolean),
        userProfileRef.current
      ].filter(Boolean);

      if (elementsToHide.length > 0) {
        tl.to(elementsToHide, {
          opacity: 0,
          x: -10,
          duration: 0.2,
          ease: 'power2.in'
        });
      }

      tl.to(sidebarRef.current, {
        width: '72px',
        duration: 0.3,
        ease: 'power2.inOut'
      }, '-=0.1');
    }

    return () => {
      tl.kill();
    };
  }, [isOpen]);

  // Dispatch initial state on mount
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { isOpen } }));
  }, [isOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-20 ${
        isOpen ? 'w-64' : 'w-[72px]'
      }`}
      style={{ overflow: 'hidden' }}
    >
      {/* Header with Toggle */}
      <div className="absolute top-8 left-6 z-30">
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Header Text */}
      <div className="h-[100px] flex items-center justify-center px-6">
        {isOpen && (
          <h1 
            ref={headerTextRef}
            className="text-[20px] font-normal text-neutral-950 tracking-[-0.8492px] leading-[30px] text-center" 
            style={{ fontFamily: 'Tanker-Regular, sans-serif' }}
          >
            OpenBO
          </h1>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 pt-4 flex flex-col gap-4">
        {/* Main Navigation */}
        <div className="flex flex-col gap-1">
          <button 
            onClick={() => router.push('/dashboard')}
            className={`h-[41px] rounded-lg flex items-center transition-colors ${
              isOpen ? 'px-3 gap-3' : 'justify-center'
            } ${
              pathname === '/dashboard' 
                ? 'bg-gray-100 text-neutral-950' 
                : 'text-[#717182] hover:bg-gray-50'
            }`}
          >
            <img
              src="/assets/a24f59b1afa77a0af0fd52d01319957c8c1816ef.svg"
              alt=""
              className="w-[15px] h-[15px]"
            />
            {isOpen && (
              <span 
                ref={el => navigationLabelsRef.current[0] = el}
                className="text-sm font-normal tracking-[-0.3008px] leading-[21px]"
              >
                Overview
              </span>
            )}
          </button>

          <button 
            onClick={() => router.push('/dashboard/booking')}
            className={`h-[41px] rounded-lg flex items-center transition-colors ${
              isOpen ? 'px-3 gap-3' : 'justify-center'
            } ${
              pathname === '/dashboard/booking' 
                ? 'bg-gray-100 text-neutral-950' 
                : 'text-[#717182] hover:bg-gray-50'
            }`}
          >
            <img
              src="/assets/d328689530a20f442c7a125bf97d5dc2a61fff01.svg"
              alt=""
              className="w-[15px] h-[15px]"
            />
            {isOpen && (
              <span 
                ref={el => navigationLabelsRef.current[1] = el}
                className="text-sm font-normal tracking-[-0.3008px] leading-[21px]"
              >
                Spaces
              </span>
            )}
          </button>

          <button 
            onClick={() => router.push('/dashboard/myBooking')}
            className={`h-[41px] rounded-lg flex items-center transition-colors ${
              isOpen ? 'px-3 gap-3' : 'justify-center'
            } ${
              pathname === '/dashboard/myBooking' 
                ? 'bg-gray-100 text-neutral-950' 
                : 'text-[#717182] hover:bg-gray-50'
            }`}
          >
            <img
              src="/assets/60e4e55d9bb30bcf44214b60c31e3794ae6f3c4a.svg"
              alt=""
              className="w-[15px] h-[15px]"
            />
            {isOpen && (
              <span 
                ref={el => navigationLabelsRef.current[2] = el}
                className="text-sm font-normal tracking-[-0.3008px] leading-[21px]"
              >
                Bookings
              </span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200" />

        {/* Settings Navigation */}
        <div className="flex flex-col gap-1">
          <button 
            className={`h-[41px] rounded-lg flex items-center text-[#717182] hover:bg-gray-50 transition-colors ${
              isOpen ? 'px-3 gap-3' : 'justify-center'
            }`}
          >
            <img
              src="/assets/c2fd7a7308e28ed684a5f5392a35f554e5a5e9cd.svg"
              alt=""
              className="w-[15px] h-[15px]"
            />
            {isOpen && (
              <span 
                ref={el => navigationLabelsRef.current[3] = el}
                className="text-sm font-normal tracking-[-0.3008px] leading-[21px]"
              >
                Support
              </span>
            )}
          </button>

          <button 
            className={`h-[41px] rounded-lg flex items-center text-[#717182] hover:bg-gray-50 transition-colors ${
              isOpen ? 'px-3 gap-3' : 'justify-center'
            }`}
          >
            <img
              src="/assets/7e187711dac8dba400baff787c183bcc5cebc2fe.svg"
              alt=""
              className="w-[15px] h-[15px]"
            />
            {isOpen && (
              <span 
                ref={el => navigationLabelsRef.current[4] = el}
                className="text-sm font-normal tracking-[-0.3008px] leading-[21px]"
              >
                Settings
              </span>
            )}
          </button>
        </div>
      </div>

      {/* User Profile & Sign Out */}
      <div className="border-t border-gray-200 px-4 py-[17px] flex flex-col gap-2">
        {isOpen ? (
          <div ref={userProfileRef}>
            {/* User Profile */}
            <div className="flex items-center gap-3 px-2 rounded-[14px]">
              <div className="w-10 h-10 bg-[#101828] rounded-full flex items-center justify-center text-white shrink-0">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm">{getUserInitials(currentUser)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-normal text-[#101828] truncate leading-[20px] tracking-[-0.1504px]">
                  {getUserDisplayName(currentUser)}
                </p>
                <p className="text-xs font-normal text-[#717182] truncate leading-[16px] tracking-[-0.1504px]">
                  {currentUser?.email || 'user@company.com'}
                </p>
              </div>
            </div>
            {/* Sign Out Button */}
            <LogoutButton className="h-9 rounded-[14px] flex items-center gap-3 px-3 text-[#4a5565] hover:bg-gray-50 transition-colors">
              <img
                src="/assets/fab12f232bbb3c666849a981e9234d87ca4e3c92.svg"
                alt=""
                className="w-[27px] h-[27px]"
              />
              <span className="text-sm font-medium tracking-[-0.1504px] leading-[20px]">
                Sign Out
              </span>
            </LogoutButton>
          </div>
        ) : (
          <>
            {/* User Avatar Only */}
            <div className="w-10 h-10 bg-[#101828] rounded-full flex items-center justify-center text-white mx-auto">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm">{getUserInitials(currentUser)}</span>
              )}
            </div>
            {/* Sign Out Icon Only */}
            <LogoutButton className="w-[26px] h-[26px] flex items-center justify-center mx-auto hover:opacity-70 transition-opacity">
              <img
                src="/assets/fab12f232bbb3c666849a981e9234d87ca4e3c92.svg"
                alt=""
                className="w-full h-full"
              />
            </LogoutButton>
          </>
        )}
      </div>
    </div>
  );
}
