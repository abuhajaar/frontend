/**
 * StatsCard Component
 * Reusable card for displaying statistics
 */

export default function StatsCard({ icon, label, value, description, shadowColor, className = "" }) {
  // Determine if value is a number or string for styling
  const isNumeric = typeof value === 'number' || !isNaN(value);
  const displayValue = isNumeric ? value : value;

  return (
    <div className={`bg-white rounded-[24px] p-6 relative group overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${className}`}>
      {/* Subtle Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${shadowColor || '#e5e7eb'} 0%, transparent 100%)` }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:rotate-6"
            style={{
              boxShadow: shadowColor ? `0px 8px 16px -4px ${shadowColor}40` : 'none',
              backgroundColor: 'white',
              border: '1px solid rgba(0,0,0,0.02)'
            }}
          >
            <img src={icon} alt="" className="w-6 h-6 transform transition-transform group-hover:scale-110" />
          </div>
          {/* Artsy decorative dot */}
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: shadowColor || '#e5e7eb' }} />
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 pl-1 border-l-2 border-transparent group-hover:border-current transition-all" style={{ color: shadowColor }}>
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tighter">
              {displayValue}
            </h3>
          </div>
          <p className="text-sm text-gray-500 font-medium opacity-80 mt-1 pl-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
