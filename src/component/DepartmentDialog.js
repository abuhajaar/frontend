'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function DepartmentDialog({ isOpen, onClose, mode = 'create', departmentData = null, onSubmit }) {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    // Populate form data when editing
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && departmentData) {
                setFormData({
                    name: departmentData.name || '',
                    description: departmentData.description || ''
                });
            } else {
                // Reset form for create mode - completely empty
                setFormData({
                    name: '',
                    description: ''
                });
            }
            setErrors({});
        }
    }, [mode, departmentData, isOpen]);

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

        if (!formData.name.trim()) {
            newErrors.name = 'Department name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
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
            await onSubmit(formData);

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
                        {mode === 'create' ? 'Add New Department' : 'Edit Department'}
                    </h2>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-[25px] pt-[20px] pb-[25px]">
                    <div className="flex flex-col gap-[20px]">
                        {/* Name */}
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-medium text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                                Department Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`h-[42px] px-3 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-[8px] text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-neutral-950`}
                                placeholder="Enter department name"
                                autoComplete="off"
                            />
                            {errors.name && (
                                <p className="text-[12px] text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-[8px]">
                            <label className="font-medium text-[14px] leading-[21px] tracking-[-0.3008px] text-neutral-950">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className={`min-h-[100px] px-3 py-2 bg-white border ${errors.description ? 'border-red-500' : 'border-gray-200'} rounded-[8px] text-[14px] tracking-[-0.1504px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-vertical`}
                                placeholder="Enter department description"
                                rows={4}
                            />
                            {errors.description && (
                                <p className="text-[12px] text-red-500">{errors.description}</p>
                            )}
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
                                {isSubmitting ? (mode === 'create' ? 'Creating...' : 'Updating...') : (mode === 'create' ? 'Create Department' : 'Update Department')}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
