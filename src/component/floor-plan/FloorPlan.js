/**
 * FloorPlan Component
 * Interactive floor plan view for desk selection - Lantai 1
 * Uses the SVG file from /public/lantai1.svg
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { isWeekend } from '@/utils/date';

export default function FloorPlan({
  occupiedDesks = [],
  onDeskSelect,
  selectedDeskId,
  selectedDate,
  selectedLevel,
  onLevelChange
}) {
  const svgContainerRef = useRef(null);
  const svgInnerRef = useRef(null);
  const [svgLoaded, setSvgLoaded] = useState(false);
  const [occupiedSvgDoc, setOccupiedSvgDoc] = useState(null);
  const [currentFloorSvg, setCurrentFloorSvg] = useState('lantai1');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Desk and room metadata
  const deskInfo = {
    // Lantai 1: hotDesk01-12
    hotDesk01: { number: 1, type: 'hotDesk', floor: 1 },
    hotDesk02: { number: 2, type: 'hotDesk', floor: 1 },
    hotDesk03: { number: 3, type: 'hotDesk', floor: 1 },
    hotDesk04: { number: 4, type: 'hotDesk', floor: 1 },
    hotDesk05: { number: 5, type: 'hotDesk', floor: 1 },
    hotDesk06: { number: 6, type: 'hotDesk', floor: 1 },
    hotDesk07: { number: 7, type: 'hotDesk', floor: 1 },
    hotDesk08: { number: 8, type: 'hotDesk', floor: 1 },
    hotDesk09: { number: 9, type: 'hotDesk', floor: 1 },
    hotDesk10: { number: 10, type: 'hotDesk', floor: 1 },
    hotDesk11: { number: 11, type: 'hotDesk', floor: 1 },
    hotDesk12: { number: 12, type: 'hotDesk', floor: 1 },
    // Lantai 2: hotDesk13-20
    hotDesk13: { number: 13, type: 'hotDesk', floor: 2 },
    hotDesk14: { number: 14, type: 'hotDesk', floor: 2 },
    hotDesk15: { number: 15, type: 'hotDesk', floor: 2 },
    hotDesk16: { number: 16, type: 'hotDesk', floor: 2 },
    hotDesk17: { number: 17, type: 'hotDesk', floor: 2 },
    hotDesk18: { number: 18, type: 'hotDesk', floor: 2 },
    hotDesk19: { number: 19, type: 'hotDesk', floor: 2 },
    hotDesk20: { number: 20, type: 'hotDesk', floor: 2 },
    // Lantai 1: meetingRoom01-03
    meetingRoom01: { number: 1, type: 'meetingRoom', floor: 1 },
    meetingRoom02: { number: 2, type: 'meetingRoom', floor: 1 },
    meetingRoom03: { number: 3, type: 'meetingRoom', floor: 1 },
    // Lantai 2: meetingRoom04-06
    meetingRoom04: { number: 4, type: 'meetingRoom', floor: 2 },
    meetingRoom05: { number: 5, type: 'meetingRoom', floor: 2 },
    meetingRoom06: { number: 6, type: 'meetingRoom', floor: 2 },
    // Lantai 3: meetingRoom07-08
    meetingRoom07: { number: 7, type: 'meetingRoom', floor: 3 },
    meetingRoom08: { number: 8, type: 'meetingRoom', floor: 3 },
    // Lantai 1: privateRoom01-02
    privateRoom01: { number: 1, type: 'privateRoom', floor: 1 },
    privateRoom02: { number: 2, type: 'privateRoom', floor: 1 },
    // Lantai 3: privateRoom03-08
    privateRoom03: { number: 3, type: 'privateRoom', floor: 3 },
    privateRoom04: { number: 4, type: 'privateRoom', floor: 3 },
    privateRoom05: { number: 5, type: 'privateRoom', floor: 3 },
    privateRoom06: { number: 6, type: 'privateRoom', floor: 3 },
    privateRoom07: { number: 7, type: 'privateRoom', floor: 3 },
    privateRoom08: { number: 8, type: 'privateRoom', floor: 3 }
  };

  // Calculate available desks count (hot desks + meeting rooms + private rooms)
  const totalSpaces = Object.keys(deskInfo).length;
  const availableSpaces = totalSpaces - occupiedDesks.length;

  // Load the occupied SVG document based on selected floor
  useEffect(function loadOccupiedSvg() {
    const occupiedSvgFile = selectedLevel === 'lantai1'
      ? '/lantai1v2isOccupied.svg'
      : selectedLevel === 'lantai2'
        ? '/lantai2isOccupied.svg'
        : selectedLevel === 'lantai3'
          ? '/lantai3isOccupied.svg'
          : null;

    if (!occupiedSvgFile) return;

    fetch(occupiedSvgFile)
      .then(function (response) {
        return response.text();
      })
      .then(function (svgText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        setOccupiedSvgDoc(doc);
        setCurrentFloorSvg(selectedLevel);
      })
      .catch(function (err) {
        console.error('Failed to load occupied SVG:', err);
      });
  }, [selectedLevel]);

  useEffect(function handleSvgInteraction() {
    if (!svgContainerRef.current || !svgLoaded || !occupiedSvgDoc) return;

    const objectElement = svgContainerRef.current.querySelector('object');
    if (!objectElement || !objectElement.contentDocument) return;

    const svgDoc = objectElement.contentDocument;

    // Get all hotDesk, meetingRoom, and privateRoom elements from the SVG
    // Only get top-level elements (not nested ones) by checking if parent is the root svg or a direct group
    const hotDeskElements = Array.from(svgDoc.querySelectorAll('[id^="hotDesk"]')).filter(el => {
      // Exclude nested elements by ensuring we only get elements whose id matches exactly the pattern
      return /^hotDesk\d{2}$/.test(el.id);
    });
    const meetingRoomElements = Array.from(svgDoc.querySelectorAll('[id^="meetingRoom"]')).filter(el => {
      return /^meetingRoom\d{2}$/.test(el.id);
    });
    const privateRoomElements = Array.from(svgDoc.querySelectorAll('[id^="privateRoom"]')).filter(el => {
      return /^privateRoom\d{2}$/.test(el.id);
    });
    const allSpaceElements = [...hotDeskElements, ...meetingRoomElements, ...privateRoomElements];

    allSpaceElements.forEach((spaceElement) => {
      const spaceId = spaceElement.id;
      const isOccupied = occupiedDesks.includes(spaceId);
      const isSelected = selectedDeskId === spaceId;
      const spaceMetadata = deskInfo[spaceId];

      // Add click handler - allow clicking even if occupied
      spaceElement.style.cursor = 'pointer';

      const handleClick = (e) => {
        e.preventDefault();
        if (onDeskSelect && spaceMetadata) {
          let spaceName;
          if (spaceMetadata.type === 'meetingRoom') {
            spaceName = spaceMetadata.name;
          } else if (spaceMetadata.type === 'privateRoom') {
            spaceName = `Private Room ${spaceMetadata.number}`;
          } else {
            spaceName = `Hot Desk ${spaceMetadata.number}`;
          }

          onDeskSelect({
            id: spaceId,
            name: spaceName,
            number: spaceMetadata.number,
            type: spaceMetadata.type,
            isOccupied: isOccupied
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
        // Get the occupied version of this element from the occupied SVG
        const occupiedElement = occupiedSvgDoc.getElementById(spaceId);

        if (occupiedElement) {
          // Clone the occupied element
          const occupiedClone = occupiedElement.cloneNode(true);

          // Replace the current element's innerHTML with the occupied version's innerHTML
          while (newSpaceElement.firstChild) {
            newSpaceElement.removeChild(newSpaceElement.firstChild);
          }

          // Copy all children from occupied version
          while (occupiedClone.firstChild) {
            newSpaceElement.appendChild(occupiedClone.firstChild);
          }

          // Mark as replaced so we can track it
          newSpaceElement.setAttribute('data-occupied-replaced', 'true');
        }
      } else {
        // Reset to available state - check if it was previously replaced
        if (newSpaceElement.getAttribute('data-occupied-replaced') === 'true') {
          // Need to reload from the original SVG
          // Get the original element from a fresh load
          const originalSvgFile = selectedLevel === 'lantai1'
            ? '/lantai1v2.svg'
            : selectedLevel === 'lantai2'
              ? '/lantai2.svg'
              : '/lantai3.svg';
          fetch(originalSvgFile)
            .then(response => response.text())
            .then(svgText => {
              const parser = new DOMParser();
              const originalDoc = parser.parseFromString(svgText, 'image/svg+xml');
              const originalElement = originalDoc.getElementById(spaceId);

              if (originalElement) {
                // Replace with original content
                while (newSpaceElement.firstChild) {
                  newSpaceElement.removeChild(newSpaceElement.firstChild);
                }

                const originalClone = originalElement.cloneNode(true);
                while (originalClone.firstChild) {
                  newSpaceElement.appendChild(originalClone.firstChild);
                }

                // Remove the marker
                newSpaceElement.removeAttribute('data-occupied-replaced');
              }
            });
        }
      }
    });
  }, [selectedDeskId, occupiedDesks, onDeskSelect, svgLoaded, occupiedSvgDoc]);

  // Handle floor changes from parent component with animation
  useEffect(() => {
    if (!currentFloorSvg || currentFloorSvg === selectedLevel) return;
    if (isTransitioning) return;

    setIsTransitioning(true);
    const svgInner = svgInnerRef.current;

    if (svgInner) {
      // Determine slide direction based on floor numbers
      const currentFloorNum = currentFloorSvg === 'lantai1' ? 1 : currentFloorSvg === 'lantai2' ? 2 : 3;
      const newFloorNum = selectedLevel === 'lantai1' ? 1 : selectedLevel === 'lantai2' ? 2 : 3;
      const direction = newFloorNum > currentFloorNum ? 1 : -1; // 1 = slide left, -1 = slide right

      // Fade out and slide out animation
      gsap.to(svgInner, {
        x: `${direction * -5}%`,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.inOut',
        onComplete: () => {
          // Update floor and reset loaded state
          setSvgLoaded(false);
          setCurrentFloorSvg(selectedLevel);

          // Reset position for slide in from opposite side
          gsap.set(svgInner, { x: `${direction * 5}%`, opacity: 0 });
        }
      });
    } else {
      setSvgLoaded(false);
      setCurrentFloorSvg(selectedLevel);
      setIsTransitioning(false);
    }
  }, [selectedLevel, currentFloorSvg, isTransitioning]);

  // Handle SVG load and trigger slide-in animation
  const handleSvgLoad = () => {
    setSvgLoaded(true);

    // Only animate if we're transitioning between floors
    if (isTransitioning) {
      const svgInner = svgInnerRef.current;
      if (svgInner) {
        // Slide in animation - triggered after SVG is loaded
        gsap.to(svgInner, {
          x: 0,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
          delay: 0.05, // Small delay to ensure SVG is rendered
          onComplete: () => {
            setIsTransitioning(false);
          }
        });
      } else {
        setIsTransitioning(false);
      }
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Floor Plan Container */}
      <div>
        <div
          ref={svgContainerRef}
          className="relative w-full overflow-hidden min-h-[600px]"
        >
          <div ref={svgInnerRef} className="w-full h-full">
            {selectedLevel === 'lantai1' && (
              <object
                key="lantai1"
                data="/lantai1v2.svg"
                type="image/svg+xml"
                className="w-full h-auto"
                style={{ maxWidth: '1551px', display: 'block' }}
                onLoad={handleSvgLoad}
              >
                Your browser does not support SVG
              </object>
            )}
            {selectedLevel === 'lantai2' && (
              <object
                key="lantai2"
                data="/lantai2.svg"
                type="image/svg+xml"
                className="w-full h-auto"
                style={{ maxWidth: '1551px', display: 'block' }}
                onLoad={handleSvgLoad}
              >
                Your browser does not support SVG
              </object>
            )}
            {selectedLevel === 'lantai3' && (
              <object
                key="lantai3"
                data="/lantai3.svg"
                type="image/svg+xml"
                className="w-full h-auto"
                style={{ maxWidth: '1551px', display: 'block' }}
                onLoad={handleSvgLoad}
              >
                Your browser does not support SVG
              </object>
            )}
            {!['lantai1', 'lantai2', 'lantai3'].includes(selectedLevel) && (
              <div className="w-full h-[600px] flex items-center justify-center">
                <p className="text-slate-500">Floor plan not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
