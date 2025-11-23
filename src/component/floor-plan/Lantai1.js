/**
 * Lantai1 Component
 * Office floor plan background with room labels for Lantai 1
 */

'use client';

export default function Lantai1() {
  return (
    <svg 
      width="1551" 
      height="1018" 
      viewBox="0 0 1551 1018" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
    >
      {/* Main border */}
      <rect 
        x="37" 
        y="80" 
        width="1200" 
        height="720" 
        stroke="#E2E8F0" 
        strokeWidth="3" 
        fill="none"
        rx="8"
      />
      
      {/* Vertical dividers */}
      <line x1="150" y1="80" x2="150" y2="800" stroke="#E2E8F0" strokeWidth="2" />
      <line x1="250" y1="80" x2="250" y2="640" stroke="#E2E8F0" strokeWidth="2" />
      <line x1="1137" y1="80" x2="1137" y2="800" stroke="#E2E8F0" strokeWidth="2" />
      
      {/* Horizontal dividers */}
      <line x1="37" y1="260" x2="250" y2="260" stroke="#E2E8F0" strokeWidth="2" />
      <line x1="37" y1="500" x2="1237" y2="500" stroke="#E2E8F0" strokeWidth="2" />
      <line x1="37" y1="640" x2="250" y2="640" stroke="#E2E8F0" strokeWidth="2" />
      <line x1="1137" y1="260" x2="1237" y2="260" stroke="#E2E8F0" strokeWidth="2" />
      
      {/* Conference room dividers */}
      <line x1="490" y1="500" x2="490" y2="800" stroke="#E2E8F0" strokeWidth="2" />
      <line x1="890" y1="500" x2="890" y2="800" stroke="#E2E8F0" strokeWidth="2" />
      
      {/* Door openings (gaps in walls) */}
      <rect x="688" y="500" width="100" height="3" fill="white" />
      
      {/* Elevator shafts */}
      <rect x="130" y="540" width="40" height="100" stroke="#CBD5E1" strokeWidth="1" fill="#F8FAFC" rx="4" />
      <rect x="130" y="720" width="40" height="60" stroke="#CBD5E1" strokeWidth="1" fill="#F8FAFC" rx="4" />
      
      {/* Room Labels */}
      <text x="90" y="150" fontSize="11" fill="#9CA3AF" textAnchor="middle" fontFamily="Inter, sans-serif">
        LOBBY
      </text>
      
      <text x="90" y="380" fontSize="11" fill="#9CA3AF" textAnchor="middle" fontFamily="Inter, sans-serif">
        BREAK ROOM
      </text>
      
      <text x="1187" y="150" fontSize="11" fill="#9CA3AF" textAnchor="middle" fontFamily="Inter, sans-serif">
        STORAGE
      </text>
      
      <text x="1187" y="380" fontSize="11" fill="#9CA3AF" textAnchor="middle" fontFamily="Inter, sans-serif">
        RESTROOMS
      </text>
      
      <text x="694" y="60" fontSize="12" fill="#6B7280" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="500">
        OPEN WORKSPACE
      </text>
      
      <text x="260" y="750" fontSize="10" fill="#9CA3AF" textAnchor="middle" fontFamily="Inter, sans-serif">
        CONFERENCE A
      </text>
      
      <text x="690" y="750" fontSize="10" fill="#9CA3AF" textAnchor="middle" fontFamily="Inter, sans-serif">
        CONFERENCE B
      </text>
      
      <text x="1065" y="750" fontSize="10" fill="#9CA3AF" textAnchor="middle" fontFamily="Inter, sans-serif">
        EXECUTIVE
      </text>
      
      {/* Scale indicator */}
      <g transform="translate(1300, 842)">
        <line x1="0" y1="0" x2="50" y2="0" stroke="#90A1B9" strokeWidth="1" />
        <text x="60" y="5" fontSize="10" fill="#62748E" fontFamily="Arimo, sans-serif" fontWeight="700" letterSpacing="0.5">
          10M
        </text>
      </g>
      
      {/* Desk work area markers (light background rectangles) */}
      <rect x="300" y="90" width="280" height="180" fill="#F9FAFB" opacity="0.5" rx="8" />
      <rect x="300" y="258" width="280" height="180" fill="#F9FAFB" opacity="0.5" rx="8" />
      <rect x="870" y="90" width="250" height="180" fill="#F9FAFB" opacity="0.5" rx="8" />
      <rect x="870" y="258" width="280" height="180" fill="#F9FAFB" opacity="0.5" rx="8" />
    </svg>
  );
}
