/**
 * FloorPlan Component
 * Interactive floor plan view for desk selection - Lantai 1
 * Uses the SVG file from /public/lantai1.svg
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { isWeekend } from '@/utils/date';

export default function FloorPlan({ 
  occupiedDesks = [], 
  onDeskSelect, 
  selectedDeskId,
  selectedDate
}) {
  const [selectedLevel, setSelectedLevel] = useState('lantai1');
  const svgContainerRef = useRef(null);
  const [svgLoaded, setSvgLoaded] = useState(false);

  // Desk and room metadata
  const deskInfo = {
    hotDesk01: { number: 1, type: 'hotDesk' },
    hotDesk02: { number: 2, type: 'hotDesk' },
    hotDesk03: { number: 3, type: 'hotDesk' },
    hotDesk04: { number: 4, type: 'hotDesk' },
    hotDesk05: { number: 5, type: 'hotDesk' },
    hotDesk06: { number: 6, type: 'hotDesk' },
    hotDesk07: { number: 7, type: 'hotDesk' },
    hotDesk08: { number: 8, type: 'hotDesk' },
    hotDesk09: { number: 9, type: 'hotDesk' },
    hotDesk10: { number: 10, type: 'hotDesk' },
    hotDesk11: { number: 11, type: 'hotDesk' },
    hotDesk12: { number: 12, type: 'hotDesk' },
    meetingRoom01: { number: 1, type: 'meetingRoom'},
    meetingRoom02: { number: 2, type: 'meetingRoom'},
    meetingRoom03: { number: 3, type: 'meetingRoom'}
  };

  // Calculate available desks count (hot desks + meeting rooms)
  const totalSpaces = Object.keys(deskInfo).length;
  const availableSpaces = totalSpaces - occupiedDesks.length;

  useEffect(() => {
    if (!svgContainerRef.current || !svgLoaded) return;

    const objectElement = svgContainerRef.current.querySelector('object');
    if (!objectElement || !objectElement.contentDocument) return;

    const svgDoc = objectElement.contentDocument;
    
    // Get all hotDesk and meetingRoom elements from the SVG
    const hotDeskElements = Array.from(svgDoc.querySelectorAll('[id^="hotDesk"]'));
    const meetingRoomElements = Array.from(svgDoc.querySelectorAll('[id^="meetingRoom"]'));
    const allSpaceElements = [...hotDeskElements, ...meetingRoomElements];

    allSpaceElements.forEach((spaceElement) => {
      const spaceId = spaceElement.id;
      const isOccupied = occupiedDesks.includes(spaceId);
      const isSelected = selectedDeskId === spaceId;
      const spaceMetadata = deskInfo[spaceId];

      // Add click handler
      spaceElement.style.cursor = isOccupied ? 'not-allowed' : 'pointer';
      
      const handleClick = (e) => {
        e.preventDefault();
        if (!isOccupied && onDeskSelect && spaceMetadata) {
          const spaceName = spaceMetadata.type === 'meetingRoom' 
            ? spaceMetadata.name 
            : `Hot Desk ${spaceMetadata.number}`;
          
          onDeskSelect({
            id: spaceId,
            name: spaceName,
            number: spaceMetadata.number,
            type: spaceMetadata.type
          });
        }
      };

      // Remove existing listeners
      spaceElement.replaceWith(spaceElement.cloneNode(true));
      const newSpaceElement = svgDoc.getElementById(spaceId);
      newSpaceElement.addEventListener('click', handleClick);

      // Visual state management
      if (isSelected && !isOccupied) {
        // Add selected state styling with a blue glow
        newSpaceElement.style.filter = 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))';
        
        // Change the green indicator to blue for selected state
        const greenCircle = newSpaceElement.querySelector('[fill="#10B981"]');
        if (greenCircle) {
          greenCircle.setAttribute('fill', '#3B82F6');
        }
      } else {
        newSpaceElement.style.filter = '';
        
        // Reset green indicator if not selected
        const blueCircle = newSpaceElement.querySelector('[fill="#3B82F6"]');
        if (blueCircle && !isOccupied) {
          blueCircle.setAttribute('fill', '#10B981');
        }
      }

      // Handle occupied state
      if (isOccupied) {
        // Hide green availability indicator
        const greenCircles = newSpaceElement.querySelectorAll('[fill="#10B981"]');
        greenCircles.forEach(circle => {
          circle.style.display = 'none';
        });

        // Check if this is a meeting room or hot desk
        const isMeetingRoom = spaceMetadata?.type === 'meetingRoom';
        
        if (isMeetingRoom) {
          // Grey out the room background (ellipse with white fill)
          const roomBg = newSpaceElement.querySelector('path[fill="white"]');
          if (roomBg) {
            roomBg.setAttribute('fill', '#F8FAFC');
            roomBg.setAttribute('stroke', '#94A3B8');
          }

          // Grey out chairs
          const chairs = newSpaceElement.querySelectorAll('[fill="#1E293B"]');
          chairs.forEach(chair => chair.setAttribute('fill', '#94A3B8'));
          
          const chairDetails = newSpaceElement.querySelectorAll('[fill="#334155"]');
          chairDetails.forEach(detail => detail.setAttribute('fill', '#CBD5E1'));

          // Reduce opacity of chair group
          const chairGroup = newSpaceElement.querySelector('g[opacity="0.9"]');
          if (chairGroup) {
            chairGroup.setAttribute('opacity', '0.4');
          }

          // Add grey overlay and OCCUPIED text if not already added
          let overlay = newSpaceElement.querySelector('.occupied-overlay');
          if (!overlay) {
            const svgNS = "http://www.w3.org/2000/svg";
            
            // Get the ellipse dimensions from the room background
            const roomBg = newSpaceElement.querySelector('path[d*="C"]');
            if (roomBg) {
              // Create overlay group
              overlay = svgDoc.createElementNS(svgNS, 'g');
              overlay.setAttribute('class', 'occupied-overlay');
              
              // Extract center position from the path (approximate center)
              const bbox = roomBg.getBBox();
              const cx = bbox.x + bbox.width / 2;
              const cy = bbox.y + bbox.height / 2;
              const rx = bbox.width / 2;
              const ry = bbox.height / 2;
              
              // Create grey overlay ellipse
              const overlayEllipse = svgDoc.createElementNS(svgNS, 'ellipse');
              overlayEllipse.setAttribute('cx', cx);
              overlayEllipse.setAttribute('cy', cy);
              overlayEllipse.setAttribute('rx', rx);
              overlayEllipse.setAttribute('ry', ry);
              overlayEllipse.setAttribute('fill', 'rgba(148, 163, 184, 0.3)');
              
              // Create OCCUPIED text
              const text = svgDoc.createElementNS(svgNS, 'text');
              text.setAttribute('x', cx);
              text.setAttribute('y', cy + 5);
              text.setAttribute('text-anchor', 'middle');
              text.setAttribute('font-size', '14');
              text.setAttribute('font-weight', '700');
              text.setAttribute('fill', '#64748B');
              text.setAttribute('font-family', 'Inter, sans-serif');
              text.textContent = 'OCCUPIED';
              
              overlay.appendChild(overlayEllipse);
              overlay.appendChild(text);
              newSpaceElement.appendChild(overlay);
            }
          }
        } else {
          // Handle hot desk occupied state
          // Grey out desk elements
          const deskPaths = newSpaceElement.querySelectorAll('path[fill="white"]');
          deskPaths.forEach(path => path.setAttribute('fill', '#F8FAFC'));
          
          const monitorPaths = newSpaceElement.querySelectorAll('path[fill="#1E293B"]');
          monitorPaths.forEach(path => path.setAttribute('fill', '#94A3B8'));
          
          const monitorScreens = newSpaceElement.querySelectorAll('path[fill="#334155"]');
          monitorScreens.forEach(path => path.setAttribute('fill', '#CBD5E1'));

          // Add occupied overlay if not already added
          let overlay = newSpaceElement.querySelector('.occupied-overlay-desk');
          if (!overlay) {
            const svgNS = "http://www.w3.org/2000/svg";
            
            // Get bounding box of the entire desk group
            const bbox = newSpaceElement.getBBox();
            const cx = bbox.x + bbox.width / 2;
            const cy = bbox.y + bbox.height / 2;
            
            // Create overlay group
            overlay = svgDoc.createElementNS(svgNS, 'g');
            overlay.setAttribute('class', 'occupied-overlay-desk');
            
            // Create grey overlay rectangle
            const overlayRect = svgDoc.createElementNS(svgNS, 'rect');
            overlayRect.setAttribute('x', bbox.x);
            overlayRect.setAttribute('y', bbox.y);
            overlayRect.setAttribute('width', bbox.width);
            overlayRect.setAttribute('height', bbox.height);
            overlayRect.setAttribute('rx', '4');
            overlayRect.setAttribute('fill', 'rgba(148, 163, 184, 0.3)');
            
            // Create badge background
            const badgeRect = svgDoc.createElementNS(svgNS, 'rect');
            badgeRect.setAttribute('x', cx - 15);
            badgeRect.setAttribute('y', cy - 6);
            badgeRect.setAttribute('width', '30');
            badgeRect.setAttribute('height', '12');
            badgeRect.setAttribute('rx', '2');
            badgeRect.setAttribute('fill', '#F1F5F9');
            badgeRect.setAttribute('stroke', '#CBD5E1');
            badgeRect.setAttribute('stroke-width', '0.5');
            
            // Create OCCUPIED text
            const text = svgDoc.createElementNS(svgNS, 'text');
            text.setAttribute('x', cx);
            text.setAttribute('y', cy + 2);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '5');
            text.setAttribute('font-weight', '700');
            text.setAttribute('fill', '#64748B');
            text.setAttribute('font-family', 'Arial, sans-serif');
            text.textContent = 'OCCUPIED';
            
            overlay.appendChild(overlayRect);
            overlay.appendChild(badgeRect);
            overlay.appendChild(text);
            newSpaceElement.appendChild(overlay);
          }
        }
      } else {
        // Reset to available state
        const greenCircles = newSpaceElement.querySelectorAll('[fill="#10B981"]');
        greenCircles.forEach(circle => {
          circle.style.display = '';
        });

        // Remove occupied overlays if they exist
        const overlay = newSpaceElement.querySelector('.occupied-overlay');
        if (overlay) {
          overlay.remove();
        }
        
        const deskOverlay = newSpaceElement.querySelector('.occupied-overlay-desk');
        if (deskOverlay) {
          deskOverlay.remove();
        }

        // Reset meeting room colors
        const isMeetingRoom = spaceMetadata?.type === 'meetingRoom';
        if (isMeetingRoom) {
          const roomBg = newSpaceElement.querySelector('path[fill="#F8FAFC"]');
          if (roomBg) {
            roomBg.setAttribute('fill', 'white');
            roomBg.setAttribute('stroke', '#CBD5E1');
          }

          const chairs = newSpaceElement.querySelectorAll('[fill="#94A3B8"]');
          chairs.forEach(chair => chair.setAttribute('fill', '#1E293B'));
          
          const chairDetails = newSpaceElement.querySelectorAll('[fill="#CBD5E1"]');
          chairDetails.forEach(detail => detail.setAttribute('fill', '#334155'));

          const chairGroup = newSpaceElement.querySelector('g[opacity="0.4"]');
          if (chairGroup) {
            chairGroup.setAttribute('opacity', '0.9');
          }
        } else {
          // Reset hot desk colors
          const greyDesks = newSpaceElement.querySelectorAll('path[fill="#F8FAFC"]');
          greyDesks.forEach(path => path.setAttribute('fill', 'white'));
          
          const greyMonitors = newSpaceElement.querySelectorAll('path[fill="#94A3B8"]');
          greyMonitors.forEach(path => path.setAttribute('fill', '#1E293B'));
          
          const greyScreens = newSpaceElement.querySelectorAll('path[fill="#CBD5E1"]');
          greyScreens.forEach(path => path.setAttribute('fill', '#334155'));
        }
      }
    });
  }, [selectedDeskId, occupiedDesks, onDeskSelect, svgLoaded]);

  const handleSvgLoad = () => {
    setSvgLoaded(true);
  };

  return (
    <div className="bg-white border border-[rgba(226,232,240,0.8)] rounded-3xl overflow-hidden">
      {/* Level Tabs */}
      <div className="p-8 pb-0">
        <div className="inline-flex items-center bg-white border border-[rgba(226,232,240,0.8)] rounded-2xl p-0.5">
          <button
            onClick={() => setSelectedLevel('lantai1')}
            className={`px-6 py-2 text-sm font-normal rounded-[14px] transition-all ${
              selectedLevel === 'lantai1'
                ? 'bg-[#0f172b] text-white'
                : 'text-neutral-950 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>Lantai 1</span>
              <span className="px-2 py-0.5 text-[10px] leading-[14.286px] font-normal bg-[rgba(0,188,125,0.1)] text-[#009966] rounded-full">
                {availableSpaces} Available
              </span>
            </div>
          </button>
          <button
            onClick={() => setSelectedLevel('lantai2')}
            className={`px-6 py-2 text-sm font-normal rounded-[14px] transition-all ${
              selectedLevel === 'lantai2'
                ? 'bg-[#0f172b] text-white'
                : 'text-neutral-950 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>Lantai 2</span>
              <span className="px-2 py-0.5 text-[10px] leading-[14.286px] font-normal bg-[rgba(0,188,125,0.1)] text-[#009966] rounded-full">
                0 Available
              </span>
            </div>
          </button>
          <button
            onClick={() => setSelectedLevel('lantai3')}
            className={`px-6 py-2 text-sm font-normal rounded-[14px] transition-all ${
              selectedLevel === 'lantai3'
                ? 'bg-[#0f172b] text-white'
                : 'text-neutral-950 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>Lantai 3</span>
              <span className="px-2 py-0.5 text-[10px] leading-[14.286px] font-normal bg-[rgba(0,188,125,0.1)] text-[#009966] rounded-full">
                0 Available
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Floor Plan Container */}
      <div className="p-8">
        {selectedLevel === 'lantai1' ? (
          <div 
            ref={svgContainerRef}
            className="relative w-full bg-white border border-[rgba(226,232,240,0.8)] rounded-3xl overflow-auto"
          >
            <object
              data="/lantai1.svg"
              type="image/svg+xml"
              className="w-full h-auto"
              style={{ maxWidth: '1551px', display: 'block' }}
              onLoad={handleSvgLoad}
            >
              Your browser does not support SVG
            </object>
          </div>
        ) : (
          <div className="w-full h-[900px] bg-white border border-[rgba(226,232,240,0.8)] rounded-3xl flex items-center justify-center">
            <p className="text-slate-500">Lantai {selectedLevel === 'lantai2' ? '2' : '3'} floor plan coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
