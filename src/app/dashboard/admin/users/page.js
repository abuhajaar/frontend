'use client';

import { useState, useEffect } from 'react';
import { getAllUsers } from '@/services/userService';
import { Search, UserCircle2, Star, Circle, Edit2, Trash2 } from 'lucide-react';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Mock data for fallback
const mockUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    department: 'Engineering',
    role: 'user',
    bookings: 24,
    joinedDate: 'Jan 15, 2024',
    status: 'active'
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    department: 'Marketing',
    role: 'manager',
    bookings: 18,
    joinedDate: 'Feb 20, 2024',
    status: 'active'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    department: 'Sales',
    role: 'user',
    bookings: 31,
    joinedDate: 'Mar 10, 2024',
    status: 'active'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    department: 'IT',
    role: 'admin',
    bookings: 12,
    joinedDate: 'Jan 5, 2024',
    status: 'active'
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david.brown@company.com',
    department: 'Design',
    role: 'user',
    bookings: 8,
    joinedDate: 'Apr 12, 2024',
    status: 'inactive'
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    department: 'HR',
    role: 'manager',
    bookings: 15,
    joinedDate: 'May 8, 2024',
    status: 'active'
  },
  {
    id: 7,
    name: 'Robert Garcia',
    email: 'robert.garcia@company.com',
    department: 'Finance',
    role: 'user',
    bookings: 22,
    joinedDate: 'Jun 18, 2024',
    status: 'active'
  },
  {
    id: 8,
    name: 'Jennifer Martinez',
    email: 'jennifer.martinez@company.com',
    department: 'Operations',
    role: 'user',
    bookings: 19,
    joinedDate: 'Jul 22, 2024',
    status: 'active'
  },
];

const getRoleConfig = (role) => {
  const configs = {
    user: {
      bg: 'bg-gray-100',
      text: 'text-[#364153]',
      icon: null
    },
    manager: {
      bg: 'bg-blue-100',
      text: 'text-[#1447e6]',
      icon: <Star className="w-[12px] h-[12px]" fill="currentColor" strokeWidth={0} />
    },
    admin: {
      bg: 'bg-purple-100',
      text: 'text-[#8200db]',
      icon: <Circle className="w-[12px] h-[12px]" fill="currentColor" strokeWidth={0} />
    },
    superadmin: {
      bg: 'bg-purple-100',
      text: 'text-[#8200db]',
      icon: <Circle className="w-[12px] h-[12px]" fill="currentColor" strokeWidth={0} />
    }
  };
  return configs[role] || configs.user;
};

const getStatusConfig = (status) => {
  const configs = {
    active: {
      bg: 'bg-green-100',
      text: 'text-[#016630]',
      label: 'active'
    },
    inactive: {
      bg: 'bg-[#ffe2e2]',
      text: 'text-[#e7000b]',
      label: 'inactive'
    }
  };
  return configs[status] || configs.active;
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getAllUsers();
        if (response.success && response.data) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        // Use mock data as fallback
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.is_active).length;
  const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'superadmin').length;
  const managerUsers = users.filter(u => u.role === 'manager').length;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.is_active) ||
                         (statusFilter === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-[30px] leading-[45px] font-bold tracking-[-0.2045px] text-neutral-950">
            User Management
          </h1>
          <p className="text-[16px] leading-[24px] tracking-[-0.625px] text-[#717182]">
            Manage user accounts and permissions
          </p>
        </div>
        <button className="flex items-center gap-2 h-[36px] px-3 bg-black text-white rounded-[14px] hover:bg-neutral-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-[14px] leading-[20px] tracking-[-0.1504px] font-medium">Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-[14px] p-[21px] flex flex-col gap-1">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">Total Users</p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-neutral-950">{totalUsers}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[14px] p-[21px] flex flex-col gap-1">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">Active</p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-[#016630]">{activeUsers}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[14px] p-[21px] flex flex-col gap-1">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">Admins</p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-[#9810fa]">{adminUsers}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-[14px] p-[21px] flex flex-col gap-1">
          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">Managers</p>
          <p className="text-[24px] leading-[36px] tracking-[-0.4097px] text-[#155dfc]">{managerUsers}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]">
            <Search className="w-[16px] h-[16px]" strokeWidth={1.5} />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[42px] pl-11 pr-3 bg-[#f3f3f5] border border-gray-200 rounded-[14px] text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-neutral-950"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-[42px] px-3 bg-white border border-gray-200 rounded-[14px] text-[14px] tracking-[-0.3008px] text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-[42px] px-3 bg-white border border-gray-200 rounded-[14px] text-[14px] tracking-[-0.3008px] text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-[16px] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#717182]">Loading users...</div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#717182]">No users found</div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="h-[45.5px]">
                <th className="text-left pl-[25px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                  User
                </th>
                <th className="text-left pl-[25px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                  Department
                </th>
                <th className="text-left pl-[25px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                  Role
                </th>
                <th className="text-left pl-[25px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                  Bookings
                </th>
                <th className="text-left pl-[25px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                  Joined
                </th>
                <th className="text-left pl-[25px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                  Status
                </th>
                <th className="text-left pl-[25px] text-[14px] leading-[21px] tracking-[-0.3008px] font-bold text-[#717182]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const roleConfig = getRoleConfig(user.role);
                const statusConfig = getStatusConfig(user.is_active ? 'active' : 'inactive');

                return (
                  <tr key={user.id} className="border-t border-gray-200 h-[73px]">
                    <td className="pl-[25px]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="7" r="3" stroke="#717182" strokeWidth="1.5"/>
                            <path d="M4 18C4 15 6.5 13 10 13C13.5 13 16 15 16 18" stroke="#717182" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                            {user.username || 'N/A'}
                          </p>
                          <div className="flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="1" y="3" width="10" height="7" rx="1" stroke="#717182" strokeWidth="1"/>
                              <path d="M3 3V2C3 1.5 3.5 1 4 1H8C8.5 1 9 1.5 9 2V3" stroke="#717182" strokeWidth="1"/>
                            </svg>
                            <p className="text-[12px] leading-[18px] text-[#717182]">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="pl-[25px]">
                      <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                        {user.department_name || 'N/A'}
                      </p>
                    </td>
                    <td className="pl-[25px]">
                      <div className={`inline-flex items-center gap-2 h-6 px-[9px] rounded-lg ${roleConfig.bg}`}>
                        {roleConfig.icon && <span className={roleConfig.text}>{roleConfig.icon}</span>}
                        <span className={`text-[12px] leading-[18px] tracking-[-0.12px] ${roleConfig.text}`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="pl-[25px]">
                      <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                        {user.total_bookings || 0}
                      </p>
                    </td>
                    <td className="pl-[25px]">
                      <p className="text-[14px] leading-[21px] tracking-[-0.3008px] text-[#717182]">
                        {user.created_at ? formatDate(user.created_at) : 'N/A'}
                      </p>
                    </td>
                    <td className="pl-[25px]">
                      <div className={`inline-flex h-6 px-[9px] rounded-lg ${statusConfig.bg}`}>
                        <span className={`text-[12px] leading-[18px] tracking-[-0.12px] ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </td>
                    <td className="pl-[25px]">
                      <div className="flex gap-2">
                        <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                          <Edit2 className="w-[16px] h-[16px] text-[#364153]" strokeWidth={1.5} />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
                          <Trash2 className="w-[16px] h-[16px] text-[#e7000b]" strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
