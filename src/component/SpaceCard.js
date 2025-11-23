export default function SpaceCard({ space, onBook }) {
  const amenityIcons = {
    'Wi-Fi': '/assets/wifi-icon.svg', // Add Wi-Fi icon
    'Monitor': '/assets/f710a8532bb7f6be7023184b940c0b2b5746bc70.svg',
    'Power Outlet': '/assets/76c797ffeb4d86d3692d6527e4b870857d452ded.svg',
    'Standing Desk': '/assets/184edf44907e8ea4d64d9756ae4a72901920ea57.svg',
    'Whiteboard': '/assets/013426a4beb4fcc79d3fa615feda380fd8cc6599.svg',
    'Projector': '/assets/2470b495aa90fa962b67cb001b73a4573bb33800.svg',
    'Video Conference': '/assets/2470b495aa90fa962b67cb001b73a4573bb33800.svg',
  };

  const getCapacityIcon = () => {
    if (space.type === 'Hot Desk') {
      return '/assets/9e69ac9b819b5b1c88afa4f6e7b8406777e7c0b9.svg';
    } else if (space.type === 'Private Room') {
      return '/assets/b63d2480399ef9af5bbee97a82bea049fa954449.svg';
    } else {
      return '/assets/6efc2681542d8e95ea9d5079af33757db2573221.svg';
    }
  };

  return (
    <div 
      className="bg-white border-2 rounded-[16px] overflow-hidden flex flex-col"
      style={{ borderColor: space.borderColor }}
    >
      {/* Top spacing */}
      <div className="h-[8px]" />

      <div className="px-[24px] pb-[24px] flex flex-col flex-1">
        {/* Header with Icon and Name */}
        <div className="flex items-start gap-[12px] mb-[17px]">
          <div 
            className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: space.bgColor }}
          >
            <img src={space.icon} alt="" className="w-[24px] h-[24px]" />
          </div>
          <div className="flex-1 flex flex-col gap-[4px]">
            <h3 className="text-[16px] font-normal text-neutral-950 tracking-[-0.3125px] leading-[24px]">
              {space.name}
            </h3>
            <p 
              className="text-[14px] tracking-[-0.1504px] leading-[20px]"
              style={{ color: space.typeColor }}
            >
              {space.type}
            </p>
          </div>
        </div>

        {/* Capacity badge */}
        <div 
          className="inline-flex items-center gap-[8px] h-[22px] rounded-[8px] mb-[17px] self-start"
          style={{ backgroundColor: space.badgeColor }}
        >
          <div className="flex items-center justify-center pl-[9px]">
            <img 
              src={getCapacityIcon()} 
              alt="" 
              className="w-[12px] h-[12px]" 
            />
          </div>
          <span 
            className="text-[12px] font-medium leading-[16px] pr-[9px]"
            style={{ color: space.badgeTextColor }}
          >
            {space.capacity} {space.capacity === 1 ? 'person' : 'people'}
          </span>
        </div>

        {/* Opening hours and Max duration */}
        <div className="flex flex-col gap-[8px] mb-[16px]">
          {/* Opening hours */}
          <div className="flex items-center gap-[8px] h-[20px]">
            <img src="/assets/df185e711c54528a4371171a43de1718c7d42403.svg" alt="" className="w-[16px] h-[16px]" />
            <span className="text-[14px] text-[#717182] tracking-[-0.1504px] leading-[20px]">
              Opening hours: {space.opening_hours || '00:00-18:00'}
            </span>
          </div>

          {/* Max duration */}
          <div className="flex items-center gap-[8px] h-[20px]">
            <img src="/assets/6c19041890678fea04354a56ac73a90d63546598.svg" alt="" className="w-[16px] h-[16px]" />
            <span className="text-[14px] text-[#717182] tracking-[-0.1504px] leading-[20px]">
              Max duration: {space.max_duration} minutes
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-[8px] mb-[24px]">
          {space.amenities && space.amenities.map((amenity, index) => {
            const iconPath = amenityIcons[amenity];
            
            return (
              <div 
                key={index}
                className="bg-gray-50 px-[12px] rounded-[10px] flex items-center gap-[6px] h-[32px]"
              >
                {iconPath ? (
                  <img src={iconPath} alt="" className="w-[14px] h-[14px]" />
                ) : (
                  <div className="w-[14px] h-[14px] flex items-center justify-center">
                    <span className="text-[10px]">✓</span>
                  </div>
                )}
                <span className="text-[14px] text-[#4a5565] tracking-[-0.1504px] leading-[20px]">
                  {amenity}
                </span>
              </div>
            );
          })}
        </div>

        {/* Book button */}
        <button 
          onClick={() => onBook && onBook(space)}
          className="w-full text-white text-[14px] font-medium tracking-[-0.1504px] leading-[20px] px-[16px] py-[8px] rounded-[14px] h-[36px] flex items-center justify-center mt-auto"
          style={{ backgroundColor: space.buttonColor }}
        >
          {space.buttonText || 'Book Space'}
        </button>
      </div>
    </div>
  );
}
