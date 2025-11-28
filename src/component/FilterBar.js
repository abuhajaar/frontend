/**
 * FilterBar component
 * Floor and type filter controls
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { FILTER_OPTIONS } from '@/constants/booking';

// GSAP registration
gsap.registerPlugin(CustomEase);

// Custom eases (created once)
if (!CustomEase.get("circleEase")) {
  CustomEase.create("circleEase", "0.68, -0.55, 0.265, 1.55");
}

// Expanding Circles animation config
const animationConfigs = {
  "expanding-circles": {
    init: (element) => {
      const circles = element.querySelectorAll(
        ".circle:not(.extra):not(.micro)"
      );
      const extraCircles = element.querySelectorAll(".circle.extra");
      const microCircles = element.querySelectorAll(".circle.micro");

      const centerX = 30; // Center X position
      const centerY = 30; // Center Y position
      const radius = 15;  // Radius for the initial circle

      // Position the initial 6 circles in a perfect circle
      circles.forEach((circle, i) => {
        const angle = (i * 60 * Math.PI) / 180; // 60 degrees apart
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        gsap.set(circle, {
          left: x,
          top: y,
          xPercent: -50,
          yPercent: -50
        });
      });

      // Hide the extra circles initially
      gsap.set(extraCircles, {
        opacity: 0,
        scale: 0
      });

      // Hide the micro circles initially
      gsap.set(microCircles, {
        opacity: 0,
        scale: 0
      });
    },

    activate: (element) => {
      const circles = element.querySelectorAll(
        ".circle:not(.extra):not(.micro)"
      );
      const extraCircles = element.querySelectorAll(".circle.extra");
      const microCircles = element.querySelectorAll(".circle.micro");

      const centerX = 30; // Center X position
      const centerY = 30; // Center Y position

      // Kill any existing animations
      gsap.killTweensOf(circles);
      gsap.killTweensOf(extraCircles);
      gsap.killTweensOf(microCircles);
      gsap.killTweensOf(element);

      // Create a timeline for the animation
      const tl = gsap.timeline();

      // STEP 1: Start rotating the initial circle formation with acceleration
      tl.to(element, {
        rotation: 360,         // Full rotation
        duration: 1.2,         // Longer duration for more control
        ease: "power1.inOut"   // Slow start, fast middle, slow end
      });

      // STEP 2: During the fastest part of the rotation (middle), add the extra circles
      const radius = 15; // Same radius as initial circles

      // Position the extra circles at 30, 90, 150, 210, 270, 330 degrees
      extraCircles.forEach((circle, index) => {
        const angle = ((index * 60 + 30) * Math.PI) / 180; // offset by 30°
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        tl.to(
          circle,
          {
            left: x,
            top: y,
            xPercent: -50,
            yPercent: -50,
            opacity: 1,
            scale: 1,
            duration: 0.1,      // Very fast appearance
            ease: "power1.out"
          },
          0.5 // middle of the rotation (fastest part)
        );
      });

      // STEP 3: Very quickly show the micro circles to fill the gaps
      microCircles.forEach((circle, index) => {
        const angle = (index * 30 * Math.PI) / 180; // 30° apart for density
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        tl.to(
          circle,
          {
            left: x,
            top: y,
            xPercent: -50,
            yPercent: -50,
            opacity: 0.8,
            scale: 1,
            duration: 0.05,     // Extremely fast appearance
            ease: "power1.out"
          },
          0.55 // right after extra circles
        );
      });

      // STEP 4: Scale down all circles slightly to make room
      tl.to(
        [...circles, ...extraCircles],
        {
          scale: 0.8,
          duration: 0.1,        // Very fast scale
          ease: "power1.inOut"
        },
        0.55 // same time as micro circles
      );
    },

    deactivate: (element) => {
      const circles = element.querySelectorAll(
        ".circle:not(.extra):not(.micro)"
      );
      const extraCircles = element.querySelectorAll(".circle.extra");
      const microCircles = element.querySelectorAll(".circle.micro");

      // Create a timeline for the reverse animation
      const tl = gsap.timeline();

      // STEP 1: Start rotating back (two full rotations)
      tl.to(element, {
        rotation: 720,
        duration: 1.2,
        ease: "power1.inOut"
      });

      // STEP 2: Hide the micro circles first
      tl.to(
        microCircles,
        {
          opacity: 0,
          scale: 0,
          duration: 0.2,
          ease: "power1.in"
        },
        0.3
      );

      // STEP 3: Scale up the remaining circles back to original size
      tl.to(
        [...circles, ...extraCircles],
        {
          scale: 1,
          duration: 0.2,
          ease: "power1.out"
        },
        0.4
      );

      // STEP 4: Hide the extra circles
      tl.to(
        extraCircles,
        {
          opacity: 0,
          scale: 0,
          duration: 0.2,
          ease: "power1.in"
        },
        0.5
      );
    }
  }
};

export default function FilterBar({
  selectedFloor,
  selectedType,
  availableFloors,
  onFloorChange,
  onTypeChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const dotsRef = useRef(null);

  // Initialize expanding circles animation
  useEffect(() => {
    if (!dotsRef.current) return;
    animationConfigs["expanding-circles"].init(dotsRef.current);
  }, []);

  // Animate dropdown open/close
  useEffect(() => {
    if (!dropdownRef.current) return;

    if (isOpen) {
      // Open animation
      gsap.set(dropdownRef.current, { display: 'flex', opacity: 0, x: -20 });
      gsap.to(dropdownRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else {
      // Close animation
      gsap.to(dropdownRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(dropdownRef.current, { display: 'none' });
        }
      });
    }
  }, [isOpen]);

  // Animate expanding circles on toggle
  useEffect(() => {
    if (!dotsRef.current) return;
    
    if (isOpen) {
      animationConfigs["expanding-circles"].activate(dotsRef.current);
    } else {
      animationConfigs["expanding-circles"].deactivate(dotsRef.current);
    }
  }, [isOpen]);

  const handleFilterChange = (type, value) => {
    if (type === 'floor') {
      onFloorChange(value);
    } else {
      onTypeChange(value);
    }
  };

  return (
    <div className="relative flex items-center gap-3">
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium tracking-[-0.1504px] leading-5 bg-transparent text-black p-0 m-0 shadow-none border-none hover:bg-transparent"
      >
        <div 
          ref={dotsRef}
          className="expanding-circles relative w-[60px] h-[60px] flex justify-center items-center"
        >
          {/* Initial 6 circles */}
          <div className="circle absolute w-2 h-2 bg-black rounded-full"></div>
          <div className="circle absolute w-2 h-2 bg-black rounded-full"></div>
          <div className="circle absolute w-2 h-2 bg-black rounded-full"></div>
          <div className="circle absolute w-2 h-2 bg-black rounded-full"></div>
          <div className="circle absolute w-2 h-2 bg-black rounded-full"></div>
          <div className="circle absolute w-2 h-2 bg-black rounded-full"></div>
          {/* Extra 6 circles that appear during animation */}
          <div className="circle extra absolute w-2 h-2 bg-black rounded-full"></div>
          <div className="circle extra absolute w-2 h-2 bg-black rounded-full"></div>
          <div className="circle extra absolute w-2 h-2 bg-black rounded-full"></div>
          <div className="circle extra absolute w-2 h-2 bg-black rounded-full"></div>
          <div className="circle extra absolute w-2 h-2 bg-black rounded-full"></div>
          <div className="circle extra absolute w-2 h-2 bg-black rounded-full"></div>
          {/* Micro circles that fill the gaps */}
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
          <div className="circle micro absolute w-1 h-1 bg-black rounded-full"></div>
        </div>
        Filters
      </button>

      {/* Dropdown Panel */}
      <div
        ref={dropdownRef}
        className="hidden flex-col md:flex-row gap-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-lg"
        style={{ display: 'none' }}
      >
        {/* Floor Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => handleFilterChange('floor', FILTER_OPTIONS.FLOORS.ALL)}
            className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 transition-all ${
              selectedFloor === FILTER_OPTIONS.FLOORS.ALL 
                ? 'bg-black text-white' 
                : 'bg-gray-100 border border-gray-200 text-neutral-950 hover:bg-gray-200'
            }`}
          >
            All Floors
          </button>
          
          {availableFloors.map(floor => (
            <button 
              key={floor}
              onClick={() => handleFilterChange('floor', floor)}
              className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 flex items-center gap-2 transition-all ${
                selectedFloor === floor 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 border border-gray-200 text-neutral-950 hover:bg-gray-200'
              }`}
            >
              <img 
                src="/assets/7fefcd1b6d178ca5760daf13e3c0ffe13bd03081.svg" 
                alt="" 
                className="w-4 h-4" 
              />
              {floor} Floor
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-200 hidden md:block"></div>

        {/* Type Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => handleFilterChange('type', FILTER_OPTIONS.TYPES.ALL)}
            className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 transition-all ${
              selectedType === FILTER_OPTIONS.TYPES.ALL 
                ? 'bg-black text-white' 
                : 'bg-gray-100 border border-gray-200 text-neutral-950 hover:bg-gray-200'
            }`}
          >
            All Types
          </button>
          
          <button 
            onClick={() => handleFilterChange('type', FILTER_OPTIONS.TYPES.HOT_DESK)}
            className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 flex items-center gap-2 transition-all ${
              selectedType === FILTER_OPTIONS.TYPES.HOT_DESK 
                ? 'bg-black text-white' 
                : 'bg-gray-100 border border-gray-200 text-neutral-950 hover:bg-gray-200'
            }`}
          >
            <img 
              src="/assets/e9a8acb8b17cb2cce7386825cc93d8c3562d4e74.svg" 
              alt="" 
              className="w-4 h-4" 
            />
            Hot Desks
          </button>
          
          <button 
            onClick={() => handleFilterChange('type', FILTER_OPTIONS.TYPES.PRIVATE)}
            className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 flex items-center gap-2 transition-all ${
              selectedType === FILTER_OPTIONS.TYPES.PRIVATE 
                ? 'bg-black text-white' 
                : 'bg-gray-100 border border-gray-200 text-neutral-950 hover:bg-gray-200'
            }`}
          >
            <img 
              src="/assets/b277a61a694aff124f107ca648d2a70df5cc1d10.svg" 
              alt="" 
              className="w-4 h-4" 
            />
            Private Rooms
          </button>
          
          <button 
            onClick={() => handleFilterChange('type', FILTER_OPTIONS.TYPES.MEETING)}
            className={`px-4 py-2 rounded-[14px] text-sm font-medium tracking-[-0.1504px] leading-5 flex items-center gap-2 transition-all ${
              selectedType === FILTER_OPTIONS.TYPES.MEETING 
                ? 'bg-black text-white' 
                : 'bg-gray-100 border border-gray-200 text-neutral-950 hover:bg-gray-200'
            }`}
          >
            <img 
              src="/assets/2f942f19516ee84dd5c5646164f23bcd8aa2a546.svg" 
              alt="" 
              className="w-4 h-4" 
            />
            Meeting Rooms
          </button>
        </div>
      </div>
    </div>
  );
}
