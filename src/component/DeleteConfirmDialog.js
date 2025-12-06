'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function DeleteConfirmDialog({ isOpen, onClose, userName, onConfirm }) {
    const modalRef = useRef(null);
    const backdropRef = useRef(null);
    const [isClosing, setIsClosing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();

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
            console.error('Delete error:', error);
            setIsDeleting(false);
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
                className="relative bg-white border border-[rgba(0,0,0,0.1)] rounded-[16px] w-full max-w-[420px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
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

                <div className="p-[25px]">
                    {/* Header */}
                    <div className="flex flex-col gap-2 mb-4">
                        <h2 className="font-semibold text-[20px] leading-[30px] tracking-[-0.8984px] text-neutral-950">
                            Delete User
                        </h2>
                        <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-[#717182]">
                            This action cannot be undone
                        </p>
                    </div>

                    {/* Warning Message */}
                    <div className="bg-red-50 border border-red-200 rounded-[12px] p-4 mb-6">
                        <p className="font-normal text-[14px] leading-[20px] tracking-[-0.1504px] text-red-900">
                            Are you sure you want to delete <span className="font-semibold">{userName}</span>? This will permanently remove the user and all associated data.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isDeleting}
                            className="flex-1 bg-white border border-gray-200 rounded-[14px] px-4 py-2 h-[36px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-neutral-950">
                                Cancel
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isDeleting}
                            className="flex-1 bg-red-600 rounded-[14px] px-4 py-2 h-[36px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
                        >
                            <span className="font-medium text-[14px] leading-[20px] tracking-[-0.1504px] text-white">
                                {isDeleting ? 'Deleting...' : 'Delete User'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
