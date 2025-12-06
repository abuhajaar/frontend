'use client';

import { useState, useEffect } from 'react';
import { getAllDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/services/departmentService';
import { Plus, Search, Edit2, Trash2, Building2, Users, ChevronUp, ChevronDown } from 'lucide-react';
import DepartmentDialog from '@/component/DepartmentDialog';
import DeleteConfirmDialog from '@/component/DeleteConfirmDialog';

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Dialog states
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await getAllDepartments();

      if (response.success && response.data) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
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

  // Filter and sort departments
  const filteredAndSortedDepartments = departments
    .filter(dept =>
      dept.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.manager_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;

      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Calculate stats
  const stats = {
    totalDepartments: departments.length,
    totalEmployees: departments.reduce((sum, dept) => sum + (dept.total_users || 0), 0),
    avgPerDepartment: departments.length > 0
      ? Math.round(departments.reduce((sum, dept) => sum + (dept.total_users || 0), 0) / departments.length)
      : 0,
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle Add Department
  const handleAddDepartment = () => {
    setDialogMode('create');
    setSelectedDepartment(null);
    setIsDepartmentDialogOpen(true);
  };

  // Handle Edit Department
  const handleEditDepartment = (department) => {
    setDialogMode('edit');
    setSelectedDepartment(department);
    setIsDepartmentDialogOpen(true);
  };

  // Handle Delete Department
  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setIsDeleteDialogOpen(true);
  };

  // Submit Department (Create or Update)
  const handleDepartmentSubmit = async (formData) => {
    try {
      if (dialogMode === 'create') {
        const response = await createDepartment(formData);
        if (response.success) {
          await fetchDepartments();
          setIsDepartmentDialogOpen(false);
        }
      } else {
        const response = await updateDepartment(selectedDepartment.id, formData);
        if (response.success) {
          await fetchDepartments();
          setIsDepartmentDialogOpen(false);
        }
      }
    } catch (error) {
      console.error('Error submitting department:', error);
      throw error;
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    try {
      const response = await deleteDepartment(departmentToDelete.id);
      if (response.success) {
        await fetchDepartments();
        setIsDeleteDialogOpen(false);
        setDepartmentToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-[#717182]">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-black text-[30px] leading-[45px] font-bold tracking-[-0.2045px]">
            Department Management
          </h1>
          <p className="text-[#717182] text-[16px] leading-[24px] tracking-[-0.625px]">
            Manage organizational departments and managers
          </p>
        </div>
        <button
          onClick={handleAddDepartment}
          className="bg-black text-white px-5 h-[36px] rounded-[14px] text-[14px] font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          Add Department
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-[14px] p-[21px] border border-gray-200">
          <p className="text-[#717182] text-[14px] leading-[21px] tracking-[-0.3008px]">Total Departments</p>
          <p className="text-[24px] font-normal leading-[36px] tracking-[-0.4097px] text-neutral-950">{stats.totalDepartments}</p>
        </div>
        <div className="bg-white rounded-[14px] p-[21px] border border-gray-200">
          <p className="text-[#717182] text-[14px] leading-[21px] tracking-[-0.3008px]">Total Employees</p>
          <p className="text-[24px] font-normal leading-[36px] tracking-[-0.4097px] text-neutral-950">{stats.totalEmployees}</p>
        </div>
        <div className="bg-white rounded-[14px] p-[21px] border border-gray-200">
          <p className="text-[#717182] text-[14px] leading-[21px] tracking-[-0.3008px]">Avg per Department</p>
          <p className="text-[24px] font-normal leading-[36px] tracking-[-0.4097px] text-neutral-950">{stats.avgPerDepartment}</p>
        </div>
      </div>

      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717182]" size={16} />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[42px] pl-11 pr-3 bg-[#f3f3f5] rounded-[14px] text-[14px] leading-normal tracking-[-0.1504px] text-[#717182] outline-none focus:ring-2 focus:ring-gray-300 border border-gray-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[16px] border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-6 py-3 text-[14px] font-bold leading-[21px] tracking-[-0.3008px] text-[#717182]">Department</th>
              <th className="text-left px-6 py-3 text-[14px] font-bold leading-[21px] tracking-[-0.3008px] text-[#717182]">Manager</th>
              <th
                className="text-left px-6 py-3 text-[14px] font-bold leading-[21px] tracking-[-0.3008px] text-[#717182] cursor-pointer hover:text-neutral-950 transition-colors"
                onClick={() => handleSort('total_employees')}
              >
                <div className="flex items-center gap-1">
                  Employees
                  {sortField === 'total_employees' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th className="text-left px-6 py-3 text-[14px] font-bold leading-[21px] tracking-[-0.3008px] text-[#717182]">Description</th>
              <th
                className="text-left px-6 py-3 text-[14px] font-bold leading-[21px] tracking-[-0.3008px] text-[#717182] cursor-pointer hover:text-neutral-950 transition-colors"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-1">
                  Created
                  {sortField === 'created_at' && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
              <th className="text-left px-6 py-3 text-[14px] font-bold leading-[21px] tracking-[-0.3008px] text-[#717182]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedDepartments.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-[#717182]">
                  {searchQuery ? 'No departments found matching your search' : 'No departments available'}
                </td>
              </tr>
            ) : (
              filteredAndSortedDepartments.map((dept, index) => (
                <tr
                  key={dept.id || index}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  {/* Department Name */}
                  <td className="px-6 py-[27px]">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-neutral-950 flex-shrink-0" />
                      <span className="text-[14px] leading-[21px] tracking-[-0.3008px] font-normal text-neutral-950">
                        {dept.name}
                      </span>
                    </div>
                  </td>

                  {/* Manager */}
                  <td className="px-6 py-[18px]">
                    <div className="flex flex-col gap-0">
                      <span className="text-[14px] leading-[21px] tracking-[-0.3008px] font-normal text-neutral-950">
                        {dept.manager_name || 'Not assigned'}
                      </span>
                      {dept.manager_email && (
                        <span className="text-[12px] leading-[18px] text-[#717182]">
                          {dept.manager_email}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Employees */}
                  <td className="px-6 py-[27px]">
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-neutral-950" />
                      <span className="text-[14px] leading-[21px] tracking-[-0.3008px] font-normal text-neutral-950">
                        {dept.total_users || 0}
                      </span>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-[27px]">
                    <div className="max-w-[300px] overflow-hidden">
                      <p className="text-[14px] leading-[21px] tracking-[-0.3008px] font-normal text-[#717182] truncate">
                        {dept.description || 'No description'}
                      </p>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-[27px]">
                    <span className="text-[14px] leading-[21px] tracking-[-0.3008px] font-normal text-[#717182]">
                      {formatDate(dept.created_at)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-[23.5px]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditDepartment(dept)}
                        className="p-[6px] rounded-lg hover:bg-gray-100 transition-colors"
                        title="Edit department"
                      >
                        <Edit2 size={16} className="text-neutral-950" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(dept)}
                        className="p-[6px] rounded-lg hover:bg-gray-100 transition-colors"
                        title="Delete department"
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

      {/* Department Dialog */}
      <DepartmentDialog
        isOpen={isDepartmentDialogOpen}
        onClose={() => setIsDepartmentDialogOpen(false)}
        mode={dialogMode}
        departmentData={selectedDepartment}
        onSubmit={handleDepartmentSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        message={`Are you sure to delete this department?`}
      />
    </div>
  );
}

