'use client';

import { useState } from 'react';
import { Plus, Search, ClipboardList, Calendar, Users, Edit2, Trash2, CheckCircle, ChevronDown, ChevronUp, Check, Clock, CheckSquare, Square } from 'lucide-react';
import StatsCard from '@/component/StatsCard';

export default function ManagerAssignmentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'completed'
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);

    // Mock stats
    const stats = {
        totalAssignments: 8,
        activeAssignments: 5,
        completedAssignments: 3,
        thisWeek: 2
    };

    // Mock assignments data
    const mockAssignments = [
        {
            id: 1,
            title: 'Q4 Report Submission',
            description: 'Please submit your quarterly reports by end of this week.',
            author: 'Sarah Manager',
            date: '2024-12-08',
            priority: 'urgent',
            dueDate: '2024-12-15',
            assignedTo: 15,
            completedBy: 8,
            status: 'active',
            tasks: [
                { id: 1, title: 'Collect departmental data', completed: true },
                { id: 2, title: 'Draft initial summary', completed: true },
                { id: 3, title: 'Review with team leads', completed: false },
                { id: 4, title: 'Finalize financial metrics', completed: false },
                { id: 5, title: 'Upload to portal', completed: false },
            ]
        },
        {
            id: 2,
            title: 'Team Building Survey',
            description: 'Complete the team building activity preferences survey.',
            author: 'John Manager',
            date: '2024-12-05',
            priority: 'normal',
            dueDate: '2024-12-12',
            assignedTo: 12,
            completedBy: 12,
            status: 'completed',
            tasks: [
                { id: 1, title: 'Design survey questions', completed: true },
                { id: 2, title: 'Distribute to staff', completed: true },
                { id: 3, title: 'Analyze responses', completed: true },
            ]
        },
        {
            id: 3,
            title: 'Safety Training Module',
            description: 'Complete the mandatory workplace safety training online.',
            author: 'HR Manager',
            date: '2024-12-07',
            priority: 'high',
            dueDate: '2024-12-20',
            assignedTo: 20,
            completedBy: 6,
            status: 'active',
            tasks: [
                { id: 1, title: 'Watch safety video', completed: true },
                { id: 2, title: 'Score 80% on quiz', completed: false },
                { id: 3, title: 'Sign acknowledgement', completed: false },
            ]
        },
    ];

    const [assignments, setAssignments] = useState(mockAssignments);

    const toggleTask = (assignmentId, taskId) => {
        setAssignments(prev => prev.map(assignment => {
            if (assignment.id !== assignmentId) return assignment;
            return {
                ...assignment,
                tasks: assignment.tasks.map(task =>
                    task.id === taskId ? { ...task, completed: !task.completed } : task
                )
            };
        }));
    };

    const getPriorityConfig = (priority) => {
        const configs = {
            urgent: { bg: 'bg-red-100', text: 'text-[#e7000b]', label: 'URGENT' },
            high: { bg: 'bg-orange-100', text: 'text-[#f97316]', label: 'HIGH' },
            normal: { bg: 'bg-blue-100', text: 'text-[#1447e6]', label: 'NORMAL' },
            low: { bg: 'bg-gray-100', text: 'text-[#364153]', label: 'LOW' }
        };
        return configs[priority] || configs.normal;
    };

    const getStatusConfig = (status) => {
        const configs = {
            active: { bg: 'bg-yellow-100', text: 'text-[#f59e0b]', label: 'ACTIVE' },
            completed: { bg: 'bg-green-100', text: 'text-[#016630]', label: 'COMPLETED' }
        };
        return configs[status] || configs.active;
    };

    const filteredAssignments = assignments.filter(assignment => {
        const matchesSearch =
            assignment.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-5xl font-black text-black tracking-tighter uppercase mb-2" style={{ fontFamily: 'Tanker-Regular, sans-serif' }}>
                        Assignments
                    </h1>
                    <p className="text-lg text-gray-500 font-medium">
                        Create and manage team assignments.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-3 bg-black text-white border-[3px] border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all flex items-center gap-2"
                >
                    <Plus size={20} strokeWidth={3} />
                    <span>New Assignment</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    icon={<ClipboardList size={24} strokeWidth={3} />}
                    label="Total Assignments"
                    value={stats.totalAssignments}
                    description="All assignments"
                    shadowColor="#000000"
                />
                <StatsCard
                    icon={<Users size={24} strokeWidth={3} />}
                    label="Active Assignments"
                    value={stats.activeAssignments}
                    description="Pending completion"
                    shadowColor="#F59E0B"
                />
                <StatsCard
                    icon={<CheckCircle size={24} strokeWidth={3} />}
                    label="Completed"
                    value={stats.completedAssignments}
                    description="Finished assignments"
                    shadowColor="#22C55E"
                />
                <StatsCard
                    icon={<Calendar size={24} strokeWidth={3} />}
                    label="This Week"
                    value={stats.thisWeek}
                    description="Created this week"
                    shadowColor="#3B82F6"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex-1 relative w-full">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-gray-50 border-2 border-black rounded-xl font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:bg-white transition-colors"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-12 px-4 bg-gray-50 border-2 border-black rounded-xl font-bold text-black focus:outline-none focus:ring-0 focus:bg-white transition-colors"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Assignments List */}
            <div className="flex flex-col gap-4">
                {filteredAssignments.length === 0 ? (
                    <div className="bg-white border-[3px] border-black rounded-2xl p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 border-2 border-black mx-auto">
                            <Search size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-black uppercase text-black">No assignments found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your search or create a new assignment.</p>
                    </div>
                ) : (
                    filteredAssignments.map((assignment) => {
                        const priorityConfig = getPriorityConfig(assignment.priority);
                        const statusConfig = getStatusConfig(assignment.status);
                        const completionPercentage = Math.round((assignment.completedBy / assignment.assignedTo) * 100);
                        const isExpanded = expandedAssignmentId === assignment.id;

                        return (
                            <div
                                key={assignment.id}
                                className={`bg-white border-[3px] border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all group ${isExpanded ? 'translate-y-[-2px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : ''}`}
                            >
                                <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpandedAssignmentId(isExpanded ? null : assignment.id)}>
                                    <div className="flex-1">
                                        {/* Header */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="p-2 bg-purple-100 border-2 border-black rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                <ClipboardList size={20} className="text-purple-600" strokeWidth={2.5} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className="text-xl font-black text-black">{assignment.title}</h3>
                                                    <div className={`inline-flex items-center px-2 py-1 rounded-lg border-2 border-black ${priorityConfig.bg} ${priorityConfig.text} font-bold text-xs`}>
                                                        {priorityConfig.label}
                                                    </div>
                                                    <div className={`inline-flex items-center px-2 py-1 rounded-lg border-2 border-black ${statusConfig.bg} ${statusConfig.text} font-bold text-xs`}>
                                                        {statusConfig.label}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 font-medium text-sm mb-3">{assignment.description}</p>

                                                {/* Progress Bar */}
                                                <div className="mb-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-bold text-gray-600 uppercase">Completion Progress</span>
                                                        <span className="text-xs font-black text-black">{completionPercentage}%</span>
                                                    </div>
                                                    <div className="w-full h-3 bg-gray-100 border-2 border-black rounded-lg overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                                                            style={{ width: `${completionPercentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Meta Info */}
                                        <div className="flex items-center gap-6 text-sm font-medium text-gray-500 flex-wrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} strokeWidth={2.5} />
                                                <span>Created: {assignment.date}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Users size={14} strokeWidth={2.5} />
                                                <span>{assignment.author}</span>
                                            </div>
                                            <span className="text-blue-600 font-bold">Due: {assignment.dueDate}</span>
                                            <span className="text-purple-600 font-bold">{assignment.completedBy}/{assignment.assignedTo} completed</span>
                                        </div>
                                    </div>

                                    {/* Actions & Expand Toggle */}
                                    <div className="flex flex-col gap-2 items-end">
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button className="p-2 bg-white text-black border-2 border-black rounded-lg transition-all hover:bg-black hover:text-white">
                                                <Edit2 size={16} strokeWidth={2.5} />
                                            </button>
                                            <button className="p-2 bg-white text-black border-2 border-black rounded-lg transition-all hover:bg-[#e7000b] hover:text-white hover:border-[#e7000b]">
                                                <Trash2 size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                        <div className="mt-2">
                                            {isExpanded ? <ChevronUp size={24} strokeWidth={2.5} /> : <ChevronDown size={24} strokeWidth={2.5} />}
                                        </div>
                                    </div>
                                </div>

                                {/* Checklist / Tasks Dropdown */}
                                {isExpanded && (
                                    <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-200">
                                        <h4 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <ClipboardList size={16} />
                                            Tasks Checklist
                                        </h4>
                                        <div className="flex flex-col gap-3">
                                            {assignment.tasks?.map((task) => (
                                                <div
                                                    key={task.id}
                                                    className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-4 cursor-pointer group/task ${task.completed
                                                        ? 'bg-green-50 border-green-200 hover:bg-green-100'
                                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                    onClick={() => toggleTask(assignment.id, task.id)}
                                                >
                                                    <div className="flex-1">
                                                        <p className={`font-bold text-sm transition-colors ${task.completed ? 'text-green-900 line-through decoration-2 decoration-green-500/50' : 'text-gray-900'
                                                            }`}>
                                                            {task.title}
                                                        </p>
                                                    </div>
                                                    <div className={`transition-all transform duration-200 ${task.completed ? 'text-green-600 scale-110' : 'text-gray-300 group-hover/task:text-gray-400'
                                                        }`}>
                                                        {task.completed ? (
                                                            <CheckSquare size={24} strokeWidth={2.5} />
                                                        ) : (
                                                            <Square size={24} strokeWidth={2.5} />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {(!assignment.tasks || assignment.tasks.length === 0) && (
                                                <p className="text-gray-500 italic text-sm">No tasks available.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Create Modal Placeholder */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white border-[3px] border-black rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-3xl font-black text-black mb-6 uppercase" style={{ fontFamily: 'Tanker-Regular, sans-serif' }}>
                            Create Assignment
                        </h2>
                        <p className="text-gray-500 font-medium mb-6">
                            Form will be implemented here...
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-6 py-3 bg-white text-black border-2 border-black rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-3 bg-black text-white border-[3px] border-black rounded-xl font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
