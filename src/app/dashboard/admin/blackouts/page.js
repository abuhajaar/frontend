'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, CalendarX2 } from 'lucide-react';
import { getAllBlackouts, createBlackout, updateBlackout, deleteBlackout } from '@/services/blackoutService';
import BlackoutDialog from '@/component/BlackoutDialog';
import DeleteConfirmDialog from '@/component/DeleteConfirmDialog';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getBlackoutStatus = (startAt, endAt) => {
  const now = new Date();
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (now >= start && now <= end) return 'active';
  if (now < start) return 'upcoming';
  return 'completed';
};

export default function AdminBlackoutsPage() {
  const [blackouts, setBlackouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialog states
  const [isBlackoutDialogOpen, setIsBlackoutDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedBlackout, setSelectedBlackout] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blackoutToDelete, setBlackoutToDelete] = useState(null);

  useEffect(() => {
    fetchBlackouts();
  }, []);

  const fetchBlackouts = async () => {
    try {
      setLoading(true);
      const response = await getAllBlackouts();
      if (response.success) {
        setBlackouts(response.data);
      }
    } catch (error) {
      console.error('Error fetching blackouts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Blackout
  const handleAddBlackout = () => {
    setDialogMode('create');
    setSelectedBlackout(null);
    setIsBlackoutDialogOpen(true);
  };

  // Handle Edit Blackout
  const handleEditBlackout = (blackout) => {
    setDialogMode('edit');
    setSelectedBlackout(blackout);
    setIsBlackoutDialogOpen(true);
  };

  // Handle Delete Blackout
  const handleDeleteClick = (blackout) => {
    setBlackoutToDelete(blackout);
    setIsDeleteDialogOpen(true);
  };

  // Submit Blackout (Create or Update)
  const handleBlackoutSubmit = async (formData) => {
    try {
      if (dialogMode === 'create') {
        const response = await createBlackout(formData);
        if (response.success) {
          await fetchBlackouts();
          setIsBlackoutDialogOpen(false);
        }
      } else {
        const response = await updateBlackout(selectedBlackout.id, formData);
        if (response.success) {
          await fetchBlackouts();
          setIsBlackoutDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Error submitting blackout:', error);
      throw error;
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteBlackout(blackoutToDelete.id);
      if (response.success) {
        await fetchBlackouts();
        setIsDeleteDialogOpen(false);
        setBlackoutToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting blackout:', error);
    }
  };

  // Calculate stats
  const stats = blackouts.reduce(
    (acc, blackout) => {
      const status = getBlackoutStatus(blackout.start_at, blackout.end_at);
      acc.total++;
      if (status === 'active') acc.active++;
      if (status === 'upcoming') acc.upcoming++;
      if (status === 'completed') acc.completed++;
      return acc;
    },
    { total: 0, active: 0, upcoming: 0, completed: 0 }
  );

  // Filter blackouts
  const filteredBlackouts = blackouts.filter((blackout) => {
    const matchesSearch = blackout.title.toLowerCase().includes(searchQuery.toLowerCase());
    const status = getBlackoutStatus(blackout.start_at, blackout.end_at);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesStatus;
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
            Blackout Management
          </h1>
          <p className="text-[16px] leading-[24px] tracking-[-0.625px] text-[#717182]">
            Manage space unavailability and maintenance periods
          </p>
        </div>
        <button
          onClick={handleAddBlackout}
          className="bg-black text-white px-3 h-9 rounded-[14px] flex items-center gap-2 hover:bg-neutral-800 transition-colors"
        >
          <Plus size={16} />
          <span className="text-[14px] leading-[20px] tracking-[-0.1504px] font-medium">
            Add Blackout
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182] mb-1">
            Total Blackouts
          </p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-neutral-950">
            {stats.total}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182] mb-1">
            Active
          </p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-[#e7000b]">
            {stats.active}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182] mb-1">
            Upcoming
          </p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-[#f54900]">
            {stats.upcoming}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[14px] p-5">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182] mb-1">
            Completed
          </p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-[#4a5565]">
            {stats.completed}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-[13px] text-[#717182]" />
          <input
            type="text"
            placeholder="Search blackouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[42px] bg-[#f3f3f5] border border-gray-200 rounded-[14px] pl-11 pr-3 text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-neutral-950"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[42px] bg-white border border-gray-200 rounded-[14px] px-4 text-[14px] tracking-[-0.3008px] text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-[16px] overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="h-[66px]">
              <th className="text-left px-6 text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Title
              </th>
              <th className="text-left px-6 text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Duration
              </th>
              <th className="text-left px-6 text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Description
              </th>
              <th className="text-left px-6 text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Created By
              </th>
              <th className="text-left px-6 text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBlackouts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-[#717182]">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No blackouts found matching your filters.'
                    : 'No blackouts available.'}
                </td>
              </tr>
            ) : (
              filteredBlackouts.map((blackout) => (
                <tr key={blackout.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <CalendarX2 size={16} className="text-neutral-950" />
                      <span className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                        {blackout.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                        {formatDate(blackout.start_at)}
                      </span>
                      <span className="text-[12px] leading-[18px] text-[#717182]">
                        to {formatDate(blackout.end_at)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182] truncate max-w-[250px]">
                      {blackout.description}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                      {blackout.created_by_name}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditBlackout(blackout)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 size={16} className="text-neutral-950" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(blackout)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 size={16} className="text-[#e7000b]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Blackout Dialog */}
      <BlackoutDialog
        isOpen={isBlackoutDialogOpen}
        onClose={() => setIsBlackoutDialogOpen(false)}
        mode={dialogMode}
        blackoutData={selectedBlackout}
        onSubmit={handleBlackoutSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Blackout"
        message="Are you sure to delete this blackout?"
      />
    </div>
  );
}
