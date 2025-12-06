'use client';

import { useState, useEffect } from 'react';
import { getAllSpacesForManage, updateSpaceStatus } from '@/services/spaceService';
import { Search, ChevronUp, ChevronDown, RefreshCw, Save } from 'lucide-react';
import { HotDeskIcon, MeetingRoomIcon, PrivateRoomIcon } from '@/component/icons/SpaceTypeIcons';
import AnimatedStatusToggle from '@/component/AnimatedStatusToggle';

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [updatingSpaceId, setUpdatingSpaceId] = useState(null);
  const [pendingChanges, setPendingChanges] = useState({});
  const [isSaving, setIsSaving] = useState(false);

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

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort spaces
  const filteredAndSortedSpaces = spaces
    .filter(space => {
      const matchesSearch = space.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || space.type === typeFilter;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special cases
      if (sortField === 'type') {
        aValue = formatSpaceType(a.type);
        bValue = formatSpaceType(b.type);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Handle status toggle (stores pending changes)
  const handleToggleStatus = (space) => {
    const currentStatus = pendingChanges[space.id]?.status || space.status;
    const newStatus = currentStatus === 'available' ? 'maintenance' : 'available';

    setPendingChanges(prev => ({
      ...prev,
      [space.id]: {
        ...space,
        status: newStatus
      }
    }));
  };

  // Get effective status (pending or original)
  const getEffectiveStatus = (space) => {
    return pendingChanges[space.id]?.status || space.status;
  };

  // Save all pending changes
  const handleSaveChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) return;

    try {
      setIsSaving(true);

      // Update all changed spaces
      const updatePromises = Object.values(pendingChanges).map(space =>
        updateSpaceStatus(space.id, space.status)
      );

      await Promise.all(updatePromises);

      // Refresh the list
      await fetchSpaces();

      // Clear pending changes
      setPendingChanges({});
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save some changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
            className="w-full text-black h-[42px] pl-11 pr-4 bg-[#f3f3f5] rounded-[14px] text-[14px] tracking-[-0.3008px] outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-black w-[200px] h-[42px] px-4 bg-white border border-gray-200 rounded-[14px] text-[14px] tracking-[-0.3008px] outline-none focus:ring-2 focus:ring-gray-300"
        >
          <option value="all">All Types</option>
          <option value="hot_desk">Hot Desk</option>
          <option value="meeting_room">Meeting Room</option>
          <option value="private_room">Private Room</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[16px] border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182]">Name</th>
              <th
                className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182] cursor-pointer hover:text-neutral-950 transition-colors"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-1">
                  Type
                  {sortField === 'type' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182] cursor-pointer hover:text-neutral-950 transition-colors"
                onClick={() => handleSort('floor_name')}
              >
                <div className="flex items-center gap-1">
                  Floor
                  {sortField === 'floor_name' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th
                className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182] cursor-pointer hover:text-neutral-950 transition-colors"
                onClick={() => handleSort('capacity')}
              >
                <div className="flex items-center gap-1">
                  Capacity
                  {sortField === 'capacity' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182]">Amenities</th>
              <th className="text-left px-6 py-4 text-[14px] font-bold tracking-[-0.3008px] text-[#717182]">
                Status
              </th>
              <th className="text-right pl-2 pr-6 py-4">
                <button
                  onClick={handleSaveChanges}
                  disabled={Object.keys(pendingChanges).length === 0 || isSaving}
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-[8px] transition-all relative ${Object.keys(pendingChanges).length > 0
                    ? 'bg-black text-white hover:bg-neutral-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  title={`Save ${Object.keys(pendingChanges).length} pending change${Object.keys(pendingChanges).length !== 1 ? 's' : ''}`}
                >
                  {isSaving ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Save size={16} />
                      {Object.keys(pendingChanges).length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {Object.keys(pendingChanges).length}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedSpaces.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12 text-[#717182]">
                  {searchQuery || typeFilter !== 'all'
                    ? 'No spaces found matching your filters'
                    : 'No spaces available'}
                </td>
              </tr>
            ) : (
              filteredAndSortedSpaces.map((space, index) => {
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
                      <AnimatedStatusToggle
                        status={getEffectiveStatus(space)}
                        onClick={() => handleToggleStatus(space)}
                        isPending={!!pendingChanges[space.id]}
                      />
                    </td>
                    <td className="pl-2 pr-6 py-4"></td>
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
