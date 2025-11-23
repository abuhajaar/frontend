/**
 * HotDesk Component
 * Individual desk SVG with available/occupied states
 */

'use client';

export default function HotDesk({ id, isOccupied, isSelected, onClick, deskNumber }) {
  return (
    <div 
      className="relative cursor-pointer group"
      onClick={() => onClick && onClick(id)}
    >
      {/* Desk SVG */}
      <svg 
        width="110" 
        height="90" 
        viewBox="0 0 110 90" 
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
        {/* Desk surface (monitor on top) */}
        <rect
          x="21"
          y="34"
          width="68"
          height="41"
          rx="2"
          fill={isOccupied ? "#E2E8F0" : "#0F172B"}
          stroke={isOccupied ? "#CBD5E1" : "#0F172B"}
          strokeWidth="2"
        />
        
        {/* Monitor */}
        <rect
          x="39"
          y="18"
          width="32"
          height="30"
          rx="2"
          fill={isOccupied ? "#94A3B8" : "#334155"}
          stroke={isOccupied ? "#64748B" : "#1E293B"}
          strokeWidth="2"
        />
        
        {/* Monitor stand */}
        <rect
          x="52"
          y="48"
          width="6"
          height="8"
          fill={isOccupied ? "#94A3B8" : "#334155"}
        />
        
        {/* Chair */}
        <ellipse
          cx="55"
          cy="63"
          rx="18"
          ry="14"
          fill={isOccupied ? "#CBD5E1" : "#475569"}
          stroke={isOccupied ? "#94A3B8" : "#334155"}
          strokeWidth="2"
        />
        
        {/* Keyboard */}
        <rect
          x="25"
          y="38"
          width="60"
          height="6"
          rx="1"
          fill={isOccupied ? "#F8FAFC" : "#64748B"}
        />
        
        {/* Mouse */}
        <ellipse
          cx="78"
          cy="41"
          rx="4"
          ry="6"
          fill={isOccupied ? "#F8FAFC" : "#64748B"}
        />
        
        {/* Occupied Badge (if occupied) */}
        {isOccupied && (
          <>
            <rect
              x="21"
              y="34"
              width="68"
              height="41"
              rx="2"
              fill="rgba(226, 232, 240, 0.7)"
            />
            <rect
              x="30"
              y="45"
              width="50"
              height="18"
              rx="4"
              fill="#F1F5F9"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <text
              x="55"
              y="57"
              textAnchor="middle"
              fontSize="6.3"
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
        className={`absolute top-[80px] left-1/2 -translate-x-1/2 bg-neutral-950 border border-[#314158] rounded-[14px] px-[17px] pt-[14px] pb-[1px] transition-opacity duration-200 ${
          isSelected 
            ? 'opacity-100' 
            : 'opacity-0 group-hover:opacity-100'
        }`}
      >
        <p className="text-white font-bold text-[12px] leading-4 tracking-[0.3px] whitespace-nowrap">
          Desk {deskNumber}
        </p>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
      )}
    </div>
  );
}
