'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { getAllDepartments } from '@/services/departmentService';

export default function UserDialog({ isOpen, onClose, mode = 'create', userData = null, onSubmit }) {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const [countryCode, setCountryCode] = useState('+49');

    // Country codes with flags
    const countryCodes = [
        { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
        { code: '+62', country: 'ID', flag: '🇮🇩', name: 'Indonesia' },
        { code: '+1', country: 'US', flag: '🇺🇸', name: 'USA' },
        { code: '+44', country: 'GB', flag: '🇬🇧', name: 'UK' },
        { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
    ];

    // Form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        role: 'employee',
        department_id: '',
        status: true
    });

    // Fetch departments on mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await getAllDepartments();
                if (response.success && response.data) {
                    setDepartments(response.data);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();
    }, []);

    // Populate form data when editing
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && userData) {
                // Extract country code from phone number
                const userPhone = userData.phone || '';
                const matchedCountry = countryCodes.find(c => userPhone.startsWith(c.code));
                if (matchedCountry) {
                    setCountryCode(matchedCountry.code);
                    setFormData({
                        username: userData.username || '',
                        email: userData.email || '',
                        password: '', // Password not included in edit mode
                        phone: userPhone.replace(matchedCountry.code, '').trim(),
                        role: userData.role || 'employee',
                        department_id: userData.department_id || '',
                        status: userData.is_active !== undefined ? userData.is_active : true
                    });
                } else {
                    setFormData({
                        username: userData.username || '',
                        email: userData.email || '',
                        password: '',
                        phone: userPhone,
                        role: userData.role || 'employee',
                        department_id: userData.department_id || '',
                        status: userData.is_active !== undefined ? userData.is_active : true
                    });
                }
            } else {
                // Reset form for create mode - completely empty
                setCountryCode('+49');
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    phone: '',
                    role: 'employee',
                    department_id: '',
                    status: true
                });
            }
            setErrors({});
        }
    }, [mode, userData, isOpen]);

    // Animate modal entrance
    useEffect(() => {
        if (isOpen && modalRef.current && backdropRef.current) {
            setIsClosing(false);

            gsap.set(backdropRef.current, { opacity: 0 });
            gsap.set(modalRef.current, { scale: 0.95, opacity: 0, y: 10 });

            const tl = gsap.timeline();
            tl.to(backdropRef.current, {
                opacity: 1,
                duration: 0.25,
                ease: 'power1.out'
            })
                .to(modalRef.current, {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.35,
                    ease: 'power2.out'
                }, '-=0.15');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        if (isClosing) return;

        setIsClosing(true);

        const tl = gsap.timeline({
            onComplete: () => {
                onClose();
                setIsClosing(false);
            }
        });

        tl.to(modalRef.current, {
            scale: 0.95,
            opacity: 0,
            y: 10,
            duration: 0.25,
            ease: 'power1.in'
        })
            .to(backdropRef.current, {
                opacity: 0,
                duration: 0.2,
                ease: 'power1.in'
            }, '-=0.15');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (mode === 'create' && !formData.password.trim()) {
            newErrors.password = 'Password is required';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        }

        if (!formData.department_id) {
            newErrors.department_id = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare data based on mode
            const submitData = {
                username: formData.username,
                email: formData.email,
                phone: `${countryCode}${formData.phone}`, // Combine country code with phone
                role: formData.role,
                department_id: parseInt(formData.department_id),
                status: formData.status
            };

            // Only include password in create mode
            if (mode === 'create') {
                submitData.password = formData.password;
            }

            await onSubmit(submitData);

            // Success animation
            if (modalRef.current) {
                gsap.to(modalRef.current, {
                    scale: 1.03,
                    duration: 0.3,
                    ease: 'power1.inOut',
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        handleClose();
                    }
                });
            }
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                ref={backdropRef}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative bg-white border border-[rgba(0,0,0,0.1)] rounded-[16px] w-full max-w-[510px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
            >
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 top-4 w-4 h-4 opacity-70 hover:opacity-100 transition-opacity z-10"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>

                {/* Header */}
                <div className="border-b border-gray-200 px-[25px] pt-[25px] pb-[24px]">
                    <h2 className="font-semibold text-[20px] leading-[30px] tracking-[-0.8984px] text-neutral-950">
                        {mode === 'create' ? 'Add New User' : 'Edit User'}
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-[25px] pt-[20px] pb-[25px]">
                    <div className="flex flex-col gap-[20px]">
                        {/* Username */}
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-medium text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                                Username
                            </label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className={`h-[42px] px-3 bg-white border ${errors.username ? 'border-red-500' : 'border-gray-200'} rounded-[8px] text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-neutral-950`}
                                placeholder="Enter username"
                                autoComplete="off"
                            />
                            {errors.username && (
                                <p className="text-[12px] text-red-500">{errors.username}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-medium text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`h-[42px] px-3 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-[8px] text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-neutral-950`}
                                placeholder="Enter email"
                            />
                            {errors.email && (
                                <p className="text-[12px] text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* Password - Only show in create mode */}
                        {mode === 'create' && (
                            <div className="flex flex-col gap-[8px]">
                                <label className="font-medium text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`h-[42px] px-3 bg-white border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-[8px] text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-neutral-950`}
                                    placeholder="Enter password"
                                    autoComplete="new-password"
                                />
                                {errors.password && (
                                    <p className="text-[12px] text-red-500">{errors.password}</p>
                                )}
                            </div>
                        )}

                        {/* Phone */}
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-medium text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                                Phone
                            </label>
                            <div className="flex gap-2">
                                {/* Country Code Selector */}
                                <select
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    className="h-[42px] px-2 bg-white border border-gray-200 rounded-[8px] text-[14px] tracking-[-0.1504px] text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 w-[100px]"
                                >
                                    {countryCodes.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.flag} {country.code}
                                        </option>
                                    ))}
                                </select>
                                {/* Phone Number Input */}
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={`flex-1 h-[42px] px-3 bg-white border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-[8px] text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-neutral-950`}
                                    placeholder="Enter phone number"
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-[12px] text-red-500">{errors.phone}</p>
                            )}
                        </div>
                        {/* Role */}
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-medium text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                                Role
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                className="h-[42px] px-3 bg-white border border-gray-200 rounded-[8px] text-[14px] tracking-[-0.1504px] text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950"
                            >
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                            </select>
                        </div>

                        {/* Department */}
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-medium text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                                Department
                            </label>
                            <select
                                value={formData.department_id}
                                onChange={(e) => handleInputChange('department_id', e.target.value)}
                                className={`h-[42px] px-3 bg-white border ${errors.department_id ? 'border-red-500' : 'border-gray-200'} rounded-[8px] text-[14px] tracking-[-0.1504px] text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950`}
                            >
                                <option value="">Select department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            {errors.department_id && (
                                <p className="text-[12px] text-red-500">{errors.department_id}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-medium text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                                Status
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleInputChange('status', true)}
                                    className={`flex-1 h-[42px] px-3 border rounded-[8px] text-[14px] tracking-[-0.1504px] font-medium transition-colors ${formData.status
                                        ? 'bg-green-50 border-green-500 text-green-700'
                                        : 'bg-white border-gray-200 text-[#717182]'
                                        }`}
                                >
                                    Active
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleInputChange('status', false)}
                                    className={`flex-1 h-[42px] px-3 border rounded-[8px] text-[14px] tracking-[-0.1504px] font-medium transition-colors ${!formData.status
                                        ? 'bg-red-50 border-red-500 text-red-700'
                                        : 'bg-white border-gray-200 text-[#717182]'
                                        }`}
                                >
                                    Inactive
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-[24px]">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 bg-white border border-gray-200 rounded-[14px] px-4 py-2 h-[36px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-neutral-950">
                                Cancel
                            </span>
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-black rounded-[14px] px-4 py-2 h-[36px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
                        >
                            <span className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-white">
                                {isSubmitting ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create User' : 'Update User')}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
