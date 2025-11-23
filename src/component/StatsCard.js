/**
 * StatsCard Component
 * Reusable card for displaying statistics
 */

export default function StatsCard({ icon, label, value, description, shadowColor }) {
  // Determine if value is a number or string for styling
  const isNumeric = typeof value === 'number' || !isNaN(value);
  const displayValue = isNumeric ? value : value;
  const fontSize = isNumeric ? 'text-4xl' : 'text-2xl';
  
  return (
    <div className="stat-card bg-white border border-[rgba(229,231,235,0.5)] border-solid rounded-3xl p-6 relative">
      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ 
          boxShadow: `0px 10px 15px -3px ${shadowColor}33, 0px 4px 6px -4px ${shadowColor}33` 
        }}
      >
        <img
          src={icon}
          alt=""
          className="w-6 h-6"
        />
      </div>
      <p className="text-xs text-[#6a7282] uppercase tracking-[0.3px] mb-1">
        {label}
      </p>
      <p className={`${fontSize} font-normal text-neutral-950 tracking-[-0.5309px] mb-1 truncate`}>
        {displayValue}
      </p>
      <p className="text-xs text-[#99a1af]">{description}</p>
    </div>
  );
}
