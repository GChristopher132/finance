"use client"; // Keep this if using client-side features

// Import React hooks
import { useRef, useEffect, useState } from 'react'; // Added useState
import Link from 'next/link'; // Import Link for the new CTA
import Image from 'next/image'; // Import Image for new sections
// Import Lucide icons
import {
  Target,
  Handshake,
  TrendingUp,
  Briefcase,
  Users,
  PiggyBank,
  Coffee, // New icon for 'Next Steps'
  ClipboardList, // New icon for 'Next Steps'
  CheckCircle, // New icon for 'Next Steps'
} from 'lucide-react';

// Custom hook for fade-in-on-scroll
// Changed default threshold to 0.25
const useFadeIn = (options = { threshold: 0.25 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // If the element is intersecting (visible)
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Stop observing once it's visible (for the "once" behavior)
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup observer on component unmount
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, isVisible];
};

export default function Home() {
  // Create a ref for the video element
  const videoRef = useRef(null);

  // Use useEffect to set the playback rate after the component mounts
  useEffect(() => {
    if (videoRef.current) {
      // Set playback speed to 50%
      videoRef.current.playbackRate = 0.7; // Changed from 0.75 to 0.5
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Create refs for each section
  // Updated threshold in all calls to 0.25
  const [whoRef, isWhoVisible] = useFadeIn({ threshold: 0.25 });
  const [servicesRef, isServicesVisible] = useFadeIn({ threshold: 0.25 });
  const [whyRef, isWhyVisible] = useFadeIn({ threshold: 0.25 });
  const [pathRef, isPathVisible] = useFadeIn({ threshold: 0.25 });
  const [ctaRef, isCtaVisible] = useFadeIn({ threshold: 0.25 });

  return (
    <main className="flex flex-col">
      {/* --- Hero Section --- */}
      <section className="relative h-[70vh] flex flex-col items-center justify-center text-white overflow-hidden">
        {/* Container for Video Background */}
        <div className="absolute inset-0 z-0">
          {/* Video Element - Add the ref here */}
          <video
            ref={videoRef} // Assign the ref
            autoPlay
            loop
            muted
            playsInline // Important for mobile playback
            className="w-full h-full object-cover" // Style to cover the container
            src="/videos/sailboat.mp4" // Path to video in public folder
          >
            {/* Optional: Add fallback content or sources if needed */}
            Your browser does not support the video tag.
          </video>
          {/* Overlay remains the same */}
          <div className="absolute inset-0 bg-[#0A437B] opacity-70"></div>
        </div>
        {/* Text and Button Content remains the same */}
        <div className="relative z-10 text-center p-6 sm:p-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white drop-shadow-lg">
            Secure Your Financial Future
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-gray-200 drop-shadow">
            Personalized Strategies for Lasting Prosperity and Peace of Mind.
          </p>
          {/* Changed button to Link and increased margin-top */}
          <Link
            href="/contact"
            className="inline-block mt-16 px-10 py-4 bg-[#0A437B] text-white text-xl font-semibold rounded-full shadow-xl hover:bg-[#5097C9] transition duration-300 ease-in-out transform hover:scale-105"
          >
            Schedule Your Consultation
          </Link>
        </div>
      </section>

      {/* --- 1. "Who We Serve" Section (What We Do) --- */}
      <section
        ref={whoRef}
        className={`relative z-20 w-full bg-white text-[#0A437B] py-16 sm:py-20 transition-all duration-1000 ease-in-out ${
          isWhoVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Changed to 2-col grid, wider max-width, and items-center */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text Content (Order 2 on mobile, 1 on desktop) */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center md:text-left">
              Who We Serve
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto md:mx-0 mb-10 text-center md:text-left">
              We specialize in providing comprehensive financial planning and
              investment management for individuals, families, and business
              owners seeking personalized guidance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
              {/* Target Client 1 */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
                <Users
                  size={48}
                  className="text-[#5097C9] mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Individuals & Families
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Guiding you through life's transitions, from accumulating
                  wealth to planning for retirement and legacy.
                </p>
              </div>
              {/* Target Client 2 */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
                <Briefcase
                  size={48}
                  className="text-[#5097C9] mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Business Owners
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Integrating your business and personal financial goals,
                  including succession planning and benefits optimization.
                </p>
              </div>
              {/* Target Client 3 */}
              <div className="flex flex-col items-center p-6 bg-gray-50 rounded-lg shadow-md">
                <PiggyBank
                  size={48}
                  className="text-[#5097C9] mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Retirees & Pre-Retirees
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Developing sustainable income strategies and managing assets to
                  support your desired retirement lifestyle.
                </p>
              </div>
            </div>
          </div>
          {/* Image (Order 1 on mobile, 2 on desktop) */}
          <div className="order-1 md:order-2">
            <Image
              src="https://placehold.co/600x450/E2E8F0/AAAAAA?text=Family+Photo" // Replace with your /public/images/family.jpg
              alt="A family enjoying financial security"
              width={600}
              height={450}
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* --- 1b. "Our Services" Preview Section (What We Do) --- */}
      <section
        ref={servicesRef}
        className={`relative z-20 w-full bg-gray-50 text-[#0A437B] py-16 sm:py-20 transition-all duration-1000 ease-in-out ${
          isServicesVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">
                Comprehensive Planning
              </h3>
              <p className="text-gray-600 mb-4">
                Integrating all aspects of your financial life into one cohesive
                strategy.
              </p>
              <a
                href="/services"
                className="text-[#5097C9] hover:underline font-medium"
              >
                Learn More →
              </a>
            </div>
            {/* Service Card 2 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">
                Investment Management
              </h3>
              <p className="text-gray-600 mb-4">
                Tailored portfolio construction and ongoing management aligned
                with your goals.
              </p>
              <a
                href="/services"
                className="text-[#5097C9] hover:underline font-medium"
              >
                Learn More →
              </a>
            </div>
            {/* Service Card 3 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">
                Retirement Strategies
              </h3>
              <p className="text-gray-600 mb-4">
                Developing clear paths to and through retirement with
                confidence.
              </p>
              <a
                href="/services"
                className="text-[#5097C9] hover:underline font-medium"
              >
                Learn More →
              </a>
            </div>
          </div>
          <a
            href="/services"
            className="mt-12 inline-block px-8 py-3 bg-[#5097C9] text-white font-semibold rounded-lg shadow-lg hover:bg-[#0A437B] transition duration-300 ease-in-out"
          >
            View All Services
          </a>
        </div>
      </section>

      {/* --- 2. "Why Choose Us" Section --- */}
      <section
        ref={whyRef}
        className={`relative z-20 w-full bg-white text-[#0A437B] py-16 sm:py-20 transition-all duration-1000 ease-in-out ${
          isWhyVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Changed to 2-col grid, wider max-width, and items-center */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text Content (Order 2 on mobile, 1 on desktop) */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center md:text-left">
              Why Choose Banks Channel Advisors?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
              {/* Feature 1: Holistic Approach */}
              <div className="flex flex-col items-center">
                <Target
                  size={48}
                  className="text-[#5097C9] mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Holistic Approach
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  We craft bespoke financial plans that adapt to your evolving
                  needs, ensuring every aspect of your financial life is
                  optimized.
                </p>
              </div>
              {/* Feature 2: Lasting Relationships */}
              <div className="flex flex-col items-center">
                <Handshake
                  size={48}
                  className="text-[#5097C9] mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Lasting Relationships
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  We are dedicated to building long-term partnerships based on
                  trust, transparency, and a deep understanding of your personal
                  goals.
                </p>
              </div>
              {/* Feature 3: Clarity & Confidence */}
              <div className="flex flex-col items-center">
                <TrendingUp
                  size={48}
                  className="text-[#5097C9] mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-xl font-semibold mb-2 text-center">
                  Clarity & Confidence
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Whether planning for retirement or securing a legacy, we
                  provide clarity and confidence every step of the way.
                </p>
              </div>
            </div>
          </div>
          {/* Image (Order 1 on mobile, 2 on desktop) */}
          <div className="order-1 md:order-2">
            <Image
              src="https://placehold.co/600x450/E2E8F0/AAAAAA?text=Why+Us+Photo" // Replace with your /public/images/why-us.jpg
              alt="A confident person looking at a clear horizon"
              width={600}
              height={450}
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* --- 3. "Next Steps" Section (Call to Action) --- */}
      <section
        ref={pathRef}
        className={`relative z-20 w-full bg-gray-50 text-[#0A437B] py-16 sm:py-20 transition-all duration-1000 ease-in-out ${
          isPathVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">
            What's next?
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12">
            We follow a straightforward process to understand your goals and
            build your financial plan.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {/* Step 1: Discovery */}
            <div className="flex flex-col items-center p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#5097C9] text-white mb-4">
                <Coffee size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Give us a Call</h3>
              <p className="text-gray-600 text-center">
                A no-obligation chat to discuss your goals, answer your
                questions, and see if we're a good fit.
              </p>
            </div>
            {/* Step 2: Strategy */}
            <div className="flex flex-col items-center p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#5097C9] text-white mb-4">
                <ClipboardList size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Develop & Plan</h3>
              <p className="text-gray-600 text-center">
                We analyze your financial picture and present a comprehensive,
                personalized plan with actionable steps.
              </p>
            </div>
            {/* Step 3: Implementation */}
            <div className="flex flex-col items-center p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#5097C9] text-white mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                3. Implement & Monitor
              </h3>
              <p className="text-gray-600 text-center">
                We put your plan into action and meet regularly to ensure you
                stay on track as your life evolves.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3b. "Get in Touch" CTA Section (Call to Action) --- */}
      <section
        ref={ctaRef}
        className={`relative z-20 w-full bg-white text-[#0A437B] py-16 sm:py-20 transition-all duration-1000 ease-in-out ${
          isCtaVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Secure Your Financial Future?
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
            Let's start the conversation. Schedule your complimentary discovery
            call today to learn how we can help.
          </p>
          <Link
            href="/contact"
            className="mt-2 px-10 py-4 bg-[#0A437B] text-white text-xl font-semibold rounded-full shadow-xl hover:bg-[#5097C9] transition duration-300 ease-in-out transform hover:scale-105"
          >
            Schedule Your Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}


