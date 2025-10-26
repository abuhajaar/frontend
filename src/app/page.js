'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // Hero Section Animation
    const heroElements = heroRef.current.querySelectorAll('.animate-hero');
    gsap.fromTo(heroElements, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      }
    );

    // Hero Image Animation
    const heroImage = heroRef.current.querySelector('.hero-image');
    gsap.fromTo(heroImage,
      { opacity: 0, scale: 0.95, x: 50 },
      { 
        opacity: 1, 
        scale: 1, 
        x: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
      }
    );

    // Features Cards Animation
    const featureCards = featuresRef.current.querySelectorAll('.feature-card');
    gsap.fromTo(featureCards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
        }
      }
    );

    // How It Works Animation
    const steps = howItWorksRef.current.querySelectorAll('.step-item');
    gsap.fromTo(steps,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top 70%',
        }
      }
    );

    const howItWorksImage = howItWorksRef.current.querySelector('.how-it-works-image');
    gsap.fromTo(howItWorksImage,
      { opacity: 0, x: 50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top 70%',
        }
      }
    );

    // CTA Section Animation
    const ctaElements = ctaRef.current.querySelectorAll('.animate-cta');
    gsap.fromTo(ctaElements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 80%',
        }
      }
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  return (
    <div className="bg-white relative w-full min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-black/5 px-[119px] py-px">
        <div className="flex h-16 items-center justify-between w-full">
          <div className="h-9">
            <h1 className="font-sans font-medium text-2xl text-neutral-950 tracking-[0.0703px]">
              openBO
            </h1>
          </div>
          
          <div className="flex gap-8 items-center">
            <Link href="#features" className="font-sans font-normal text-base text-black/60 hover:text-black transition-colors tracking-[-0.3125px]">
              Features
            </Link>
            <Link href="#how-it-works" className="font-sans font-normal text-base text-black/60 hover:text-black transition-colors tracking-[-0.3125px]">
              How it works
            </Link>
            <Link href="#pricing" className="font-sans font-normal text-base text-black/60 hover:text-black transition-colors tracking-[-0.3125px]">
              Pricing
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            <Link href="/login">
              <button className="h-9 px-4 py-2 rounded-lg font-sans font-medium text-sm text-neutral-950 tracking-[-0.1504px] hover:bg-gray-50 transition-colors">
                Sign in
              </button>
            </Link>
            <Link href="/login">
              <button className="h-9 px-4 py-2 bg-[#030213] rounded-lg font-sans font-medium text-sm text-white tracking-[-0.1504px] hover:bg-[#1a1a2e] transition-colors">
                Get started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="flex items-center justify-center overflow-hidden pt-24 pb-32">
        <div className="w-full max-w-[1216px] px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-10">
              <div className="inline-flex items-center bg-[#e9ebef] px-4 py-1.5 rounded-full animate-hero">
                <p className="font-sans font-normal text-sm text-black/70 tracking-[-0.1504px]">
                  Workspace booking reimagined
                </p>
              </div>
              
              <div className="space-y-6 animate-hero">
                <h1 className="font-sans font-normal text-base text-neutral-950 tracking-[-0.3125px]">
                  Book your perfect workspace in seconds
                </h1>
                
                <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px] max-w-[530px]">
                  OpenBO makes it effortless to find and reserve desks in your open-space office. Simple, intuitive, and designed for the modern workplace.
                </p>
              </div>

              <div className="flex gap-4 animate-hero">
                <Link href="/login">
                  <button className="h-10 px-4 bg-[#030213] rounded-lg font-sans font-medium text-sm text-white tracking-[-0.1504px] hover:bg-[#1a1a2e] transition-colors flex items-center gap-2">
                    Start booking now
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </Link>
                <button className="h-10 px-6 bg-white border border-black/10 rounded-lg font-sans font-medium text-sm text-neutral-950 tracking-[-0.1504px] hover:bg-gray-50 transition-colors">
                  Watch demo
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl shadow-2xl overflow-hidden hero-image">
              <Image 
                src="/hero-image.png" 
                alt="Modern workspace" 
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} id="features" className="bg-[rgba(236,236,240,0.3)] py-16 px-[119px]">
        <div className="max-w-[1280px] mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <h2 className="font-sans font-medium text-xl text-neutral-950 tracking-[-0.4492px]">
              Everything you need to manage your workspace
            </h2>
            <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px]">
              Built for modern teams who value flexibility, collaboration, and efficiency.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white border border-black/5 rounded-2xl p-8 space-y-4 feature-card hover:shadow-lg transition-shadow">
              <div className="bg-[#030213] w-12 h-12 rounded-[14px] flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h3 className="font-sans font-normal text-base text-neutral-950 tracking-[-0.3125px]">
                Smart booking
              </h3>
              <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px]">
                Reserve your desk in seconds with our intuitive calendar interface. Plan ahead or book on the go.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white border border-black/5 rounded-2xl p-8 space-y-4 feature-card hover:shadow-lg transition-shadow">
              <div className="bg-[#030213] w-12 h-12 rounded-[14px] flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3 className="font-sans font-normal text-base text-neutral-950 tracking-[-0.3125px]">
                Interactive floor plans
              </h3>
              <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px]">
                Visualize your office layout and choose the perfect spot based on location and amenities.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white border border-black/5 rounded-2xl p-8 space-y-4 feature-card hover:shadow-lg transition-shadow">
              <div className="bg-[#030213] w-12 h-12 rounded-[14px] flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="font-sans font-normal text-base text-neutral-950 tracking-[-0.3125px]">
                Instant confirmation
              </h3>
              <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px]">
                Get immediate booking confirmation with automatic calendar integration and notifications.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white border border-black/5 rounded-2xl p-8 space-y-4 feature-card hover:shadow-lg transition-shadow">
              <div className="bg-[#030213] w-12 h-12 rounded-[14px] flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 className="font-sans font-normal text-base text-neutral-950 tracking-[-0.3125px]">
                Secure & reliable
              </h3>
              <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px]">
                Enterprise-grade security ensures your data and bookings are always protected.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white border border-black/5 rounded-2xl p-8 space-y-4 feature-card hover:shadow-lg transition-shadow">
              <div className="bg-[#030213] w-12 h-12 rounded-[14px] flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h3 className="font-sans font-normal text-base text-neutral-950 tracking-[-0.3125px]">
                Flexible scheduling
              </h3>
              <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px]">
                Book by the hour, day, or week. Modify or cancel reservations with ease.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white border border-black/5 rounded-2xl p-8 space-y-4 feature-card hover:shadow-lg transition-shadow">
              <div className="bg-[#030213] w-12 h-12 rounded-[14px] flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="font-sans font-normal text-base text-neutral-950 tracking-[-0.3125px]">
                Team coordination
              </h3>
              <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px]">
                See where your teammates are sitting and book nearby desks for better collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} id="how-it-works" className="py-24 px-[119px]">
        <div className="max-w-[1280px] mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <h2 className="font-sans font-medium text-xl text-neutral-950 tracking-[-0.4492px]">
              Simple by design
            </h2>
            <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px] max-w-[665px] mx-auto">
              Booking a workspace shouldn't be complicated. We've streamlined the process to just three easy steps.
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Steps */}
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex gap-6 step-item">
                <div className="bg-[#030213] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <p className="font-sans font-normal text-base text-white tracking-[-0.3125px]">01</p>
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-sans font-medium text-lg text-neutral-950 tracking-[-0.4395px]">
                    View available spaces
                  </h3>
                  <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px]">
                    Browse your office layout and see which desks are available in real-time.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 step-item">
                <div className="bg-[#030213] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <p className="font-sans font-normal text-base text-white tracking-[-0.3125px]">02</p>
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-sans font-medium text-lg text-neutral-950 tracking-[-0.4395px]">
                    Select your spot
                  </h3>
                  <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px]">
                    Choose your preferred desk based on location, amenities, and team proximity.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 step-item">
                <div className="bg-[#030213] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <p className="font-sans font-normal text-base text-white tracking-[-0.3125px]">03</p>
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-sans font-medium text-lg text-neutral-950 tracking-[-0.4395px]">
                    Confirm booking
                  </h3>
                  <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px]">
                    Complete your reservation in one click and receive instant confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-96 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl shadow-2xl overflow-hidden how-it-works-image">
              <Image 
                src="/how-it-works-image.png" 
                alt="Office booking interface" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="bg-[#030213] py-24">
        <div className="max-w-[832px] mx-auto px-4 text-center space-y-8">
          <h2 className="font-sans font-normal text-base text-white tracking-[-0.3125px] animate-cta">
            Ready to transform your workspace?
          </h2>
          <p className="font-sans font-normal text-base text-white/80 tracking-[-0.3125px] animate-cta">
            Join forward-thinking companies who have already simplified their office booking experience with openBO.
          </p>
          <div className="flex gap-4 justify-center animate-cta">
            <Link href="/login">
              <button className="h-10 px-4 bg-[#eceef2] rounded-lg font-sans font-medium text-sm text-[#030213] tracking-[-0.1504px] hover:bg-white transition-colors flex items-center gap-2">
                Get started for free
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </Link>
            <button className="h-10 px-6 border border-white/20 rounded-lg font-sans font-medium text-sm text-white tracking-[-0.1504px] hover:bg-white/10 transition-colors">
              Schedule a demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 px-[119px] pt-12 pb-8">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1 - Brand */}
            <div className="space-y-4">
              <h3 className="font-sans font-medium text-lg text-neutral-950 tracking-[-0.4395px]">
                openBO
              </h3>
              <p className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px]">
                Workspace booking made simple for modern offices.
              </p>
            </div>

            {/* Column 2 - Product */}
            <div className="space-y-4">
              <h4 className="font-sans font-medium text-base text-neutral-950 tracking-[-0.3125px]">
                Product
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px] hover:text-black transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px] hover:text-black transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#security" className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px] hover:text-black transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Company */}
            <div className="space-y-4">
              <h4 className="font-sans font-medium text-base text-neutral-950 tracking-[-0.3125px]">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#about" className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px] hover:text-black transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#blog" className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px] hover:text-black transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#careers" className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px] hover:text-black transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 - Legal */}
            <div className="space-y-4">
              <h4 className="font-sans font-medium text-base text-neutral-950 tracking-[-0.3125px]">
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#privacy" className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px] hover:text-black transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px] hover:text-black transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="font-sans font-normal text-base text-black/60 tracking-[-0.3125px] hover:text-black transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-black/5 pt-8">
            <p className="font-sans font-normal text-base text-black/60 text-center tracking-[-0.3125px]">
              © 2025 openBO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
