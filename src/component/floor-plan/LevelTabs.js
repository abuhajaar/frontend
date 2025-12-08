'use client';

import { useRef } from 'react';
import { hapticClick } from '@/utils/animations';

/**
 * LevelTabs Component
 * Navigation tabs for selecting floor levels with availability indicators
 * 
 * @param {string} selectedLevel - Currently selected floor ID ('lantai1', 'lantai2', 'lantai3')
 * @param {Function} onSelectLevel - Handler for floor selection
 * @param {Object} availability - Availability counts for each floor { lantai1, lantai2, lantai3 }
 */
export default function LevelTabs({
    selectedLevel,
    onSelectLevel,
    availability = { lantai1: 0, lantai2: 0, lantai3: 0 }
}) {
    const tabs = [
        { id: 'lantai1', label: 'Lantai 1', count: availability.lantai1 },
        { id: 'lantai2', label: 'Lantai 2', count: availability.lantai2 },
        { id: 'lantai3', label: 'Lantai 3', count: availability.lantai3 }
    ];

    // Refs for animation
    const tabRefs = useRef([]);

    const handleTabClick = (index, floorId) => {
        if (floorId === selectedLevel) return;

        hapticClick(tabRefs.current[index], () => {
            onSelectLevel(floorId);
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm inline-flex gap-1 h-[44px]">
            {tabs.map((tab, index) => {
                const isActive = selectedLevel === tab.id;

                return (
                    <button
                        key={tab.id}
                        ref={el => tabRefs.current[index] = el}
                        onClick={() => handleTabClick(index, tab.id)}
                        className={`
              relative px-5 py-2 text-sm font-bold rounded-xl transition-all duration-200 flex items-center gap-3
              ${isActive
                                ? 'bg-neutral-900 text-white shadow-md scale-100'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-neutral-900'
                            }
            `}
                    >
                        <span>{tab.label}</span>

                        {/* Availability Badge */}
                        <span className={`
              px-2 py-0.5 text-[10px] bg-green-200 font-bold rounded-full transition-colors
              ${isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-green-100 text-green-700'
                            }
            `}>
                            {tab.count} Available
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
