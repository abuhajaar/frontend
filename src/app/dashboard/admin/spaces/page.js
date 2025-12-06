'use client';

import { useState, useEffect } from 'react';
import { getAllSpacesForManage } from '@/services/spaceService';
import { Search, Edit2, Trash2 } from 'lucide-react';
import { HotDeskIcon, MeetingRoomIcon, PrivateRoomIcon } from '@/component/icons/SpaceTypeIcons';

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const response = await getAllSpacesForManage();
      
      if (response.success && response.data) {
        setSpaces(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch spaces:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format space type from snake_case
  const formatSpaceType = (type) => {
    return type
      ?.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || type;
  };

  // Get icon component based on space type
  const getSpaceIcon = (type) => {
    switch (type) {
      case 'hot_desk':
      case 'fixed_desk':
        return HotDeskIcon;
      case 'meeting_room':
        return MeetingRoomIcon;
      case 'private_office':
        return PrivateRoomIcon;
      default:
        return HotDeskIcon; // Fallback to HotDesk icon
    }
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      available: { 
        bgColor: 'bg-green-100', 
        textColor: 'text-[#016630]', 
        label: 'available' 
      },
      occupied: { 
        bgColor: 'bg-[#ffedd4]', 
        textColor: 'text-[#f54900]', 
        label: 'occupied' 
      },
      maintenance: { 
        bgColor: 'bg-[#ffe2e2]', 
        textColor: 'text-[#e7000b]', 
        label: 'maintenance' 
      },
    };
    return configs[status] || configs.available;
  };

  // Filter spaces
  const filteredSpaces = spaces.filter(space => {
    const matchesSearch = space.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || space.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const stats = {
    total: spaces.length,
    available: spaces.filter(s => s.status === 'available').length,
    occupied: spaces.filter(s => s.status === 'occupied').length,
    maintenance: spaces.filter(s => s.status === 'maintenance').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-[#717182]">Loading spaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-black text-[30px] font-bold tracking-[-0.2045px]">
            Workspace Management
          </h1>
          <p className="text-[#717182] text-[16px] tracking-[-0.625px]">
            Manage all workspace inventory
          </p>
        </div>
        <button className="bg-black text-white px-5 h-[36px] rounded-[14px] text-[14px] font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <span className="text-[18px] leading-none">+</span>
          Add Workspace
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-[14px] p-[21px] border border-gray-200">
          <p className="text-[#717182] text-[14px] tracking-[-0.3008px] mb-1">Total Spaces</p>
          <p className="text-[24px] font-bold text-neutral-950">{stats.total}</p>
        </div>
        <div className="bg-white rounded-[14px] p-[21px] border border-gray-200">
          <p className="text-[#717182] text-[14px] tracking-[-0.3008px] mb-1">Available</p>
          <p className="text-[24px] font-bold text-[#016630]">{stats.available}</p>
        </div>
        <div className="bg-white rounded-[14px] p-[21px] border border-gray-200">
          <p className="text-[#717182] text-[14px] tracking-[-0.3008px] mb-1">Occupied</p>
          <p className="text-[24px] font-bold text-[#f54900]">{stats.occupied}</p>
        </div>
        <div className="bg-white rounded-[14px] p-[21px] border border-gray-200">
          <p className="text-[#717182] text-[14px] tracking-[-0.3008px] mb-1">Under Maintenance</p>
          <p className="text-[24px] font-bold text-[#e7000b]">{stats.maintenance}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717182]" size={16} />
          <input
            type="text"
            placeholder="Search workspaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[42px] pl-11 pr-4 bg-[#f3f3f5] rounded-[14px] text-[14px] tracking-[-0.3008px] outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-black w-[200px] h-[42px] px-4 bg-white border border-gray-200 rounded-[14px] text-[14px] tracking-[-0.3008px] outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="all">All Types</option>
          <option value="hot_desk">Hot Desk</option>
          <option value="fixed_desk">Fixed Desk</option>
          <option value="meeting_room">Meeting Room</option>
          <option value="private_office">Private Office</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[16px] border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182]">Name</th>
              <th className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182]">Type</th>
              <th className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182]">Floor</th>
              <th className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182]">Capacity</th>
              <th className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182]">Amenities</th>
              <th className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182]">Status</th>
              <th className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSpaces.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-[#717182]">
                  {searchQuery || typeFilter !== 'all' 
                    ? 'No spaces found matching your filters' 
                    : 'No spaces available'}
                </td>
              </tr>
            ) : (
              filteredSpaces.map((space, index) => {
                const statusConfig = getStatusConfig(space.status);
                const SpaceIcon = getSpaceIcon(space.type);
                
                return (
                  <tr 
                    key={space.id || index} 
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <SpaceIcon size={16} className="text-[#717182]" />
                        </div>
                        <span className="text-[14px] tracking-[-0.3008px] font-medium text-[#717182]">
                          {space.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] tracking-[-0.3008px] text-[#717182]">
                        {formatSpaceType(space.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] tracking-[-0.3008px] text-[#717182]">
                        {space.floor_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[14px] tracking-[-0.3008px] text-[#717182]">
                        {space.capacity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {space.total_amenities > 0 ? (
                          <span className="text-[14px] tracking-[-0.3008px] text-[#717182]">
                            {space.total_amenities} {space.total_amenities === 1 ? 'amenity' : 'amenities'}
                          </span>
                        ) : (
                          <span className="text-[14px] tracking-[-0.3008px] text-[#717182]">
                            No amenities
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span 
                        className={`inline-flex items-center px-3 py-1.5 rounded-[8px] text-[12px] font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
                      >
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-gray-100 transition-colors">
                          <Edit2 size={16} className="text-[#717182]" />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-gray-100 transition-colors">
                          <Trash2 size={16} className="text-[#e7000b]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
