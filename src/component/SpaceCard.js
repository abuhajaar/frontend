export default function SpaceCard({ space, onBook }) {
  const amenityIcons = {
    'Monitor': '/assets/f710a8532bb7f6be7023184b940c0b2b5746bc70.svg',
    'Power Outlet': '/assets/123375ea5e26ce44b7119cf0c7842bbfe3d1acf6.svg',
    'Standing Desk': '/assets/184edf44907e8ea4d64d9756ae4a72901920ea57.svg',
    'Whiteboard': '/assets/013426a4beb4fcc79d3fa615feda380fd8cc6599.svg',
    'Projector': '/assets/2470b495aa90fa962b67cb001b73a4573bb33800.svg',
    'Video Conference': '/assets/2470b495aa90fa962b67cb001b73a4573bb33800.svg',
  };

  const getCapacityIcon = () => {
    if (space.type === 'Hot Desk') {
      return '/assets/d521322c92736d805d27213ea255b7c8195b5930.svg';
    } else if (space.type === 'Private Room') {
      return '/assets/b63d2480399ef9af5bbee97a82bea049fa954449.svg';
    } else {
      return '/assets/6efc2681542d8e95ea9d5079af33757db2573221.svg';
    }
  };

  return (
    <div 
      className="bg-white border-2 rounded-2xl overflow-hidden h-[332px] flex flex-col"
      style={{ borderColor: space.borderColor }}
    >
      {/* Top bar for booked spaces */}
      {space.topBar && (
        <div className="h-2 bg-[#05DF72] flex-shrink-0" />
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: space.bgColor }}
          >
            <img src={space.icon} alt="" className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-normal text-neutral-950 tracking-[-0.3125px] leading-6">
              {space.name}
            </h3>
            <p 
              className="text-sm tracking-[-0.1504px] leading-5"
              style={{ color: space.typeColor }}
            >
              {space.type}
            </p>
          </div>
        </div>

        {/* Capacity badge */}
        <div 
          className="inline-flex items-center gap-2 px-2 py-1 rounded-lg mb-4"
          style={{ backgroundColor: space.badgeColor }}
        >
          <img 
            src={getCapacityIcon()} 
            alt="" 
            className="w-3 h-3" 
          />
          <span 
            className="text-xs font-medium leading-4"
            style={{ color: space.badgeTextColor }}
          >
            {space.capacity} {space.capacity === 1 ? 'person' : 'people'}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 mb-2">
          <img src="/assets/6c19041890678fea04354a56ac73a90d63546598.svg" alt="" className="w-4 h-4" />
          <span className="text-sm text-[#717182] tracking-[-0.1504px] leading-5">
            {space.time}
          </span>
        </div>

        {/* Floor Location */}
        {space.floor && (
          <div className="flex items-center gap-2 mb-4">
            <img src="/assets/7fefcd1b6d178ca5760daf13e3c0ffe13bd03081.svg" alt="" className="w-4 h-4" />
            <span className="text-sm text-[#717182] tracking-[-0.1504px] leading-5">
              {space.floor} Floor
            </span>
          </div>
        )}

        {/* Amenities - with flex-grow to push button to bottom */}
        <div className="flex flex-wrap gap-2 mb-6 flex-grow">
          {space.amenities && space.amenities.map((amenity, index) => (
            <div 
              key={index}
              className="bg-gray-50 px-3 py-2 rounded-[10px] flex items-center gap-2 h-fit"
            >
              <img src={amenityIcons[amenity]} alt="" className="w-3.5 h-3.5" />
              <span className="text-sm text-[#4A5565] tracking-[-0.1504px] leading-5">
                {amenity}
              </span>
            </div>
          ))}
        </div>

        {/* Book button - anchored to bottom */}
        <button 
          onClick={() => onBook && onBook(space)}
          className={`w-full text-white text-sm font-medium tracking-[-0.1504px] leading-5 px-4 py-2 rounded-[14px] mt-auto ${
            space.buttonOpacity ? 'opacity-50' : ''
          }`}
          style={{ backgroundColor: space.buttonColor }}
        >
          {space.buttonText || 'Book Space'}
        </button>
      </div>
    </div>
  );
}
