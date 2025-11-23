/**
 * MeetingRoom Component
 * Individual meeting room SVG with available/occupied states
 */

'use client';

export default function MeetingRoom({ id, isOccupied, isSelected, onClick, roomName, roomNumber }) {
  return (
    <div 
      className="relative cursor-pointer group"
      onClick={() => onClick && onClick(id)}
    >
      {/* Meeting Room SVG */}
      <svg 
        width="140" 
        height="120" 
        viewBox="0 0 140 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-all duration-200 ${
          isSelected 
            ? 'drop-shadow-[0_0_8px_rgba(15,23,43,0.6)]' 
            : isOccupied 
              ? 'opacity-70' 
              : 'group-hover:drop-shadow-[0_0_8px_rgba(15,23,43,0.3)]'
        }`}
      >
        {/* Room Border */}
        <ellipse
          cx="70"
          cy="60"
          rx="60"
          ry="45"
          fill={isOccupied ? "#F8FAFC" : "white"}
          stroke={isOccupied ? "#94A3B8" : "#CBD5E1"}
          strokeWidth="4"
        />
        
        {/* Conference Table */}
        <ellipse
          cx="70"
          cy="60"
          rx="45"
          ry="30"
          fill={isOccupied ? "#E2E8F0" : "#F1F5F9"}
          stroke={isOccupied ? "#94A3B8" : "#CBD5E1"}
          strokeWidth="2"
        />
        
        {/* Chairs around table (8 chairs) */}
        {/* Top chairs */}
        <g opacity={isOccupied ? "0.4" : "0.9"}>
          {/* Chair 1 - Top */}
          <rect x="45" y="20" width="10" height="8" rx="2" fill={isOccupied ? "#94A3B8" : "#1E293B"} />
          <rect x="46" y="28" width="8" height="3" fill={isOccupied ? "#CBD5E1" : "#334155"} />
          
          {/* Chair 2 - Top Right */}
          <rect x="75" y="20" width="10" height="8" rx="2" fill={isOccupied ? "#94A3B8" : "#1E293B"} />
          <rect x="76" y="28" width="8" height="3" fill={isOccupied ? "#CBD5E1" : "#334155"} />
          
          {/* Chair 3 - Right */}
          <rect x="105" y="45" width="8" height="10" rx="2" fill={isOccupied ? "#94A3B8" : "#1E293B"} />
          <rect x="102" y="46" width="3" height="8" fill={isOccupied ? "#CBD5E1" : "#334155"} />
          
          {/* Chair 4 - Right Bottom */}
          <rect x="105" y="65" width="8" height="10" rx="2" fill={isOccupied ? "#94A3B8" : "#1E293B"} />
          <rect x="102" y="66" width="3" height="8" fill={isOccupied ? "#CBD5E1" : "#334155"} />
          
          {/* Chair 5 - Bottom */}
          <rect x="45" y="92" width="10" height="8" rx="2" fill={isOccupied ? "#94A3B8" : "#1E293B"} />
          <rect x="46" y="89" width="8" height="3" fill={isOccupied ? "#CBD5E1" : "#334155"} />
          
          {/* Chair 6 - Bottom Right */}
          <rect x="75" y="92" width="10" height="8" rx="2" fill={isOccupied ? "#94A3B8" : "#1E293B"} />
          <rect x="76" y="89" width="8" height="3" fill={isOccupied ? "#CBD5E1" : "#334155"} />
          
          {/* Chair 7 - Left */}
          <rect x="27" y="45" width="8" height="10" rx="2" fill={isOccupied ? "#94A3B8" : "#1E293B"} />
          <rect x="35" y="46" width="3" height="8" fill={isOccupied ? "#CBD5E1" : "#334155"} />
          
          {/* Chair 8 - Left Bottom */}
          <rect x="27" y="65" width="8" height="10" rx="2" fill={isOccupied ? "#94A3B8" : "#1E293B"} />
          <rect x="35" y="66" width="3" height="8" fill={isOccupied ? "#CBD5E1" : "#334155"} />
        </g>
        
        {/* Available indicator (green circle in center) */}
        {!isOccupied && (
          <>
            <circle cx="70" cy="60" r="8" fill="#10B981" />
            <circle cx="70" cy="60" r="12" fill="#10B981" opacity="0.2" />
          </>
        )}
        
        {/* Occupied Overlay (if occupied) */}
        {isOccupied && (
          <>
            {/* Grey overlay on entire room */}
            <ellipse
              cx="70"
              cy="60"
              rx="60"
              ry="45"
              fill="rgba(148, 163, 184, 0.3)"
            />
            {/* OCCUPIED text in center */}
            <text
              x="70"
              y="63"
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#64748B"
              fontFamily="Inter, sans-serif"
            >
              OCCUPIED
            </text>
          </>
        )}
      </svg>

      {/* Hover Label */}
      <div 
        className={`absolute top-[115px] left-1/2 -translate-x-1/2 ${
          isOccupied 
            ? 'bg-slate-400 border border-slate-500' 
            : 'bg-neutral-950 border border-[#314158]'
        } rounded-[14px] px-[17px] pt-[14px] pb-[1px] transition-opacity duration-200 whitespace-nowrap ${
          isSelected 
            ? 'opacity-100' 
            : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <p className={`font-bold text-[12px] leading-4 tracking-[0.3px] ${
          isOccupied ? 'text-slate-700' : 'text-white'
        }`}>
          {roomName || `Meeting Room ${roomNumber}`}
        </p>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
  );
}
