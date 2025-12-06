'use client';

import React, { useState, useEffect } from 'react';
import { getAllAmenities } from '@/services';
import {
  Plus, Search, Edit2, Trash2, Grid3x3, Wifi, Snowflake, Monitor,
  Cable, Video, Tv, Printer, BarChart3, Armchair, Presentation,
  Lock, Phone, Wrench
} from 'lucide-react';

// Icon and category mapping based on API icon field
const getAmenityConfig = (icon) => {
  const configs = {
    wifi: { icon: Wifi, category: 'Technology', color: '#155dfc', bg: 'bg-blue-100', text: 'text-[#1447e6]' },
    ac: { icon: Snowflake, category: 'Technology', color: '#155dfc', bg: 'bg-blue-100', text: 'text-[#1447e6]' },
    monitor: { icon: Monitor, category: 'Technology', color: '#155dfc', bg: 'bg-blue-100', text: 'text-[#1447e6]' },
    usbc: { icon: Cable, category: 'Technology', color: '#155dfc', bg: 'bg-blue-100', text: 'text-[#1447e6]' },
    video_conference: { icon: Video, category: 'Technology', color: '#155dfc', bg: 'bg-blue-100', text: 'text-[#1447e6]' },
    tv_display: { icon: Tv, category: 'Technology', color: '#155dfc', bg: 'bg-blue-100', text: 'text-[#1447e6]' },
    printer: { icon: Printer, category: 'Technology', color: '#155dfc', bg: 'bg-blue-100', text: 'text-[#1447e6]' },
    standing_desk: { icon: BarChart3, category: 'Furniture', color: '#00a63e', bg: 'bg-green-100', text: 'text-[#008236]' },
    ergonomic_chair: { icon: Armchair, category: 'Furniture', color: '#00a63e', bg: 'bg-green-100', text: 'text-[#008236]' },
    whiteboard: { icon: Presentation, category: 'Facilities', color: '#9810fa', bg: 'bg-purple-100', text: 'text-[#8200db]' },
    locker: { icon: Lock, category: 'Facilities', color: '#9810fa', bg: 'bg-purple-100', text: 'text-[#8200db]' },
    phone_booth: { icon: Phone, category: 'Facilities', color: '#9810fa', bg: 'bg-purple-100', text: 'text-[#8200db]' },
  };

  return configs[icon] || { icon: Wrench, category: 'Other', color: '#717182', bg: 'bg-gray-100', text: 'text-[#717182]' };
};

export default function AdminAmenitiesPage() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAmenity, setExpandedAmenity] = useState(null);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const response = await getAllAmenities();
      if (response.success) {
        setAmenities(response.data);
      }
    } catch (error) {
      console.error('Error fetching amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group amenities by space to get unique amenities with space count
  const uniqueAmenities = amenities.reduce((acc, amenity) => {
    const existing = acc.find(a => a.name === amenity.name);
    if (existing) {
      existing.spaces.push({
        id: amenity.space_id,
        name: amenity.space_name
      });
    } else {
      acc.push({
        ...amenity,
        spaces: [{
          id: amenity.space_id,
          name: amenity.space_name
        }]
      });
    }
    return acc;
  }, []);

  // Calculate stats
  const stats = {
    total: uniqueAmenities.length,
    totalSpaces: amenities.length,
  };

  // Filter amenities
  const filteredAmenities = uniqueAmenities.filter(amenity => {
    const matchesSearch = amenity.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-950"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[30px] leading-[45px] font-bold tracking-[-0.2045px] text-neutral-950">
            Amenities Management
          </h1>
          <p className="text-[16px] leading-[24px] tracking-[-0.625px] text-[#717182]">
            Manage workspace amenities and features
          </p>
        </div>
        <button className="bg-black text-white px-[12px] h-[36px] rounded-[14px] flex items-center gap-[8px] hover:bg-neutral-800 transition-colors">
          <Plus size={16} />
          <span className="text-[14px] leading-[20px] tracking-[-0.1504px] font-medium">
            Add Amenity
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
            Total Amenities
          </p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-neutral-950">
            {stats.total}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
            Total Assignments
          </p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-neutral-950">
            {stats.totalSpaces}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-[16px] top-[13px] text-[#717182]" />
        <input
          type="text"
          placeholder="Search amenities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-[42px] bg-[#f3f3f5] border border-gray-200 rounded-[14px] pl-[44px] pr-[12px] text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-neutral-950"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-[16px] overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="h-[45.5px]">
              <th className="text-left px-[25px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Amenity
              </th>
              <th className="text-left px-[25px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Spaces Using
              </th>
              <th className="text-left px-[25px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAmenities.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-[40px] text-[#717182]">
                  {searchQuery ? 'No amenities found matching your search.' : 'No amenities available.'}
                </td>
              </tr>
            ) : (
              filteredAmenities.map((amenity) => {
                const config = getAmenityConfig(amenity.icon);
                const IconComponent = config.icon;
                const isExpanded = expandedAmenity === amenity.id;

                return (
                  <React.Fragment key={amenity.id}>
                    <tr
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setExpandedAmenity(isExpanded ? null : amenity.id)}
                    >
                      <td className="px-[25px] py-[16.5px]">
                        <div className="flex items-center gap-[12px]">
                          <div className="bg-gray-100 rounded-[8px] size-[36px] flex items-center justify-center">
                            <IconComponent size={18} className="text-neutral-950" />
                          </div>
                          <span className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                            {amenity.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-[25px] py-[16.5px]">
                        <div className="flex items-center gap-[8px]">
                          <Grid3x3 size={14} className="text-neutral-950" />
                          <span className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                            {amenity.spaces.length} {amenity.spaces.length === 1 ? 'space' : 'spaces'}
                          </span>
                        </div>
                      </td>
                      <td className="px-[25px] py-[16.5px]">
                        <div className="flex items-center gap-[8px]">
                          <button
                            className="p-[6px] rounded-[8px] hover:bg-gray-100 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Edit amenity:', amenity.id);
                            }}
                          >
                            <Edit2 size={16} className="text-neutral-950" />
                          </button>
                          <button
                            className="p-[6px] rounded-[8px] hover:bg-gray-100 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('Delete amenity:', amenity.id);
                            }}
                          >
                            <Trash2 size={16} className="text-[#e7000b]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="border-t border-gray-200 bg-gray-50">
                        <td colSpan="3" className="px-6 py-4">
                          <div className="ml-12">
                            <p className="text-[12px] leading-[18px] tracking-[-0.12px] text-[#717182] font-medium mb-3">
                              SPACES USING THIS AMENITY
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                              {amenity.spaces.map((space) => (
                                <div
                                  key={space.id}
                                  className="bg-white border border-gray-200 rounded-[8px] px-[12px] py-[8px]"
                                >
                                  <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                                    {space.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
