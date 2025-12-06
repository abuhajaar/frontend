'use client';

import { useState, useEffect } from 'react';
import { getAllFloors } from '@/services';
import { Plus, Layers, Grid3x3, CheckCircle, TrendingUp, Search, Edit2, Trash2 } from 'lucide-react';

export default function AdminFloorsPage() {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const response = await getAllFloors();
      if (response.success) {
        setFloors(response.data);
      }
    } catch (error) {
      console.error('Error fetching floors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    totalFloors: floors.length,
    totalSpaces: floors.reduce((sum, floor) => sum + (floor.total_spaces || 0), 0),
    // Mock data for available and occupancy since API doesn't provide it
    available: 50,
    occupancy: '72%'
  };

  // Filter floors based on search
  const filteredFloors = floors.filter(floor => 
    floor.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Floor Management
          </h1>
          <p className="text-[16px] leading-[24px] tracking-[-0.625px] text-[#717182]">
            Manage building floors and capacity
          </p>
        </div>
        <button className="bg-black text-white px-[12px] h-[36px] rounded-[14px] flex items-center gap-[8px] hover:bg-neutral-800 transition-colors">
          <Plus size={16} />
          <span className="text-[14px] leading-[20px] tracking-[-0.1504px] font-medium">
            Add Floor
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
            Total Floors
          </p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-neutral-950">
            {stats.totalFloors}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
            Total Spaces
          </p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-neutral-950">
            {stats.totalSpaces}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
            Available
          </p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-[#00a63e]">
            {stats.available}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
            Occupancy
          </p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-neutral-950">
            {stats.occupancy}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-[16px] top-[13px] text-[#717182]" />
        <input
          type="text"
          placeholder="Search floors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-[42px] bg-[#f3f3f5] border border-gray-200 rounded-[14px] pl-[44px] pr-[12px] text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-neutral-950"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-[16px] overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="text-left px-[25px] py-[12px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Floor
              </th>
              <th className="text-left px-[25px] py-[12px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Building
              </th>
              <th className="text-left px-[25px] py-[12px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Total Spaces
              </th>
              <th className="text-left px-[25px] py-[12px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Available
              </th>
              <th className="text-left px-[25px] py-[12px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Capacity
              </th>
              <th className="text-left px-[25px] py-[12px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Description
              </th>
              <th className="text-left px-[25px] py-[12px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFloors.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-[40px] text-[#717182]">
                  {searchQuery ? 'No floors found matching your search.' : 'No floors available.'}
                </td>
              </tr>
            ) : (
              filteredFloors.map((floor) => (
                <tr key={floor.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-[25px] py-[20px]">
                    <div className="flex items-center gap-[8px]">
                      <Layers size={16} className="text-neutral-950" />
                      <span className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                        {floor.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-[25px] py-[20px]">
                    <span className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                      Main Building
                    </span>
                  </td>
                  <td className="px-[25px] py-[20px]">
                    <div className="flex items-center gap-[8px]">
                      <Grid3x3 size={14} className="text-neutral-950" />
                      <span className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                        {floor.total_spaces}
                      </span>
                    </div>
                  </td>
                  <td className="px-[25px] py-[20px]">
                    <span className="bg-green-100 text-[#016630] text-[12px] leading-[18px] px-[9px] py-[4px] rounded-[8px]">
                      {/* Mock available count - would come from API */}
                      {Math.floor(floor.total_spaces * 0.3)}
                    </span>
                  </td>
                  <td className="px-[25px] py-[20px]">
                    <span className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                      {/* Mock capacity - would come from API */}
                      {floor.total_spaces + 15}
                    </span>
                  </td>
                  <td className="px-[25px] py-[20px]">
                    <div className="max-w-[283px] overflow-hidden">
                      <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182] truncate">
                        {/* Mock description - would come from API */}
                        Floor with various workspace types
                      </p>
                    </div>
                  </td>
                  <td className="px-[25px] py-[20px]">
                    <div className="flex items-center gap-[8px]">
                      <button 
                        className="p-[6px] rounded-[8px] hover:bg-gray-100 transition-colors"
                        onClick={() => console.log('Edit floor:', floor.id)}
                      >
                        <Edit2 size={16} className="text-neutral-950" />
                      </button>
                      <button 
                        className="p-[6px] rounded-[8px] hover:bg-gray-100 transition-colors"
                        onClick={() => console.log('Delete floor:', floor.id)}
                      >
                        <Trash2 size={16} className="text-neutral-950" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
