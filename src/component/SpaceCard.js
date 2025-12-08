import { useRef } from 'react';
import { hapticClick } from '@/utils/animations';
import {
  Wifi,
  Monitor,
  Plug,
  Presentation,
  Video,
  Users,
  User,
  Clock,
  Timer,
  Armchair,
  DoorOpen
} from 'lucide-react';

export default function SpaceCard({ space, onBook }) {
  const buttonRef = useRef(null); // Ref for the button

  // Map amenities to Lucide icons
  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'Wi-Fi': Wifi,
      'Monitor': Monitor,
      'Power Outlet': Plug,
      'Standing Desk': Armchair,
      'Whiteboard': Presentation,
      'Projector': Presentation,
      'Video Conference': Video,
    };
    return iconMap[amenity] || null;
  };

  // Get icon and color scheme based on space type
  const getTypeConfig = () => {
    if (space.type === 'Hot Desk') {
      return {
        icon: Armchair,
        iconBg: 'bg-blue-600',
        iconBgHover: 'group-hover:bg-blue-700',
      };
    }
    if (space.type === 'Private Room') {
      return {
        icon: DoorOpen,
        iconBg: 'bg-purple-600',
        iconBgHover: 'group-hover:bg-purple-700',
      };
    }
    // Meeting Room
    return {
      icon: Users,
      iconBg: 'bg-orange-600',
      iconBgHover: 'group-hover:bg-orange-700',
    };
  };

  const typeConfig = getTypeConfig();
  const TypeIcon = typeConfig.icon;

  const handleBookClick = (e) => {
    e.stopPropagation();
    hapticClick(buttonRef.current, () => {
      onBook && onBook(space);
    });
  };

  return (
    <div className="group relative z-0 hover:z-10 bg-white border-2 border-b-[6px] border-gray-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-xl active:translate-y-[2px] active:shadow-sm transition-all duration-200 flex flex-col h-full">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start gap-4 mb-4">
          {/* Icon */}
          <div className={`w-12 h-12 rounded-xl ${typeConfig.iconBg} ${typeConfig.iconBgHover} flex items-center justify-center flex-shrink-0 transition-colors duration-200 shadow-sm group-hover:scale-105 transform`}>
            <TypeIcon className="w-6 h-6 text-white" strokeWidth={2} />
          </div>

          {/* Name and Type */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-neutral-950 tracking-tight mb-1 truncate">
              {space.name}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              {space.type}
            </p>
          </div>
        </div>

        {/* Capacity Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-transparent group-hover:border-gray-200 transition-colors duration-200">
          {space.capacity === 1 ? (
            <User className="w-4 h-4 text-gray-500" strokeWidth={2} />
          ) : (
            <Users className="w-4 h-4 text-gray-500" strokeWidth={2} />
          )}
          <span className="text-sm font-bold text-gray-600">
            {space.capacity} {space.capacity === 1 ? 'person' : 'people'}
          </span>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Opening Hours & Duration */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <Clock className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
            <span>Hours: {space.opening_hours || '00:00-18:00'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <Timer className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
            <span>Max: {space.max_duration} minutes</span>
          </div>
        </div>

        {/* Amenities */}
        {space.amenities && space.amenities.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Amenities
            </h4>
            <div className="flex flex-wrap gap-2">
              {space.amenities.map((amenity, index) => {
                const Icon = getAmenityIcon(amenity);
                return (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border-2 border-gray-100 font-medium text-xs text-gray-600"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 text-gray-500" strokeWidth={2.5} />}
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Book Button */}
        <button
          ref={buttonRef}
          onClick={handleBookClick}
          className="w-full mt-auto bg-neutral-900 text-white text-sm font-bold px-4 py-3 rounded-xl border-b-4 border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600 active:border-b-0 active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2"
        >
          <span>{space.buttonText || 'Book Space'}</span>
        </button>
      </div>
    </div>
  );
}
