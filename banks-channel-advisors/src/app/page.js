"use client"; // Keep this if using client-side features

// Import React hooks
import { useRef, useEffect } from 'react';
// Import Lucide icons
import { Target, Handshake, TrendingUp, Briefcase, Users, PiggyBank } from 'lucide-react';

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
          <button className="mt-10 px-10 py-4 bg-[#0A437B] text-white text-xl font-semibold rounded-full shadow-xl hover:bg-[#5097C9] transition duration-300 ease-in-out transform hover:scale-105"> {/* Dark Blue Button */}
            Schedule Your Consultation
          </button>
        </div>
      </section>

      {/* --- "Why Choose Us" Section --- */}
      <section className="relative z-20 w-full bg-white text-[#0A437B] py-16 sm:py-20"> {/* Updated Dark Blue Text & Padding */}
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">Why Choose Banks Channel Advisors?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {/* Feature 1: Holistic Approach */}
            <div className="flex flex-col items-center">
              <Target size={48} className="text-[#5097C9] mb-4" strokeWidth={1.5} /> {/* Light Blue Icon */}
              <h3 className="text-xl font-semibold mb-2">Holistic Approach</h3>
              <p className="text-gray-600 text-center">
                We craft bespoke financial plans that adapt to your evolving needs, ensuring every aspect of your financial life is optimized.
              </p>
            </div>
            {/* Feature 2: Lasting Relationships */}
            <div className="flex flex-col items-center">
              <Handshake size={48} className="text-[#5097C9] mb-4" strokeWidth={1.5} /> {/* Light Blue Icon */}
              <h3 className="text-xl font-semibold mb-2">Lasting Relationships</h3>
              <p className="text-gray-600 text-center">
                We are dedicated to building long-term partnerships based on trust, transparency, and a deep understanding of your personal goals.
              </p>
            </div>
            {/* Feature 3: Clarity & Confidence */}
            <div className="flex flex-col items-center">
              <TrendingUp size={48} className="text-[#5097C9] mb-4" strokeWidth={1.5} /> {/* Light Blue Icon */}
              <h3 className="text-xl font-semibold mb-2">Clarity & Confidence</h3>
              <p className="text-gray-600 text-center">
                Whether planning for retirement or securing a legacy, we provide clarity and confidence every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- "Who We Serve" Section --- */}
      <section className="relative z-20 w-full bg-gray-50 text-[#0A437B] py-16 sm:py-20"> {/* Updated Dark Blue Text & Padding */}
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-10">Who We Serve</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-10">
            We specialize in providing comprehensive financial planning and investment management for individuals, families, and business owners seeking personalized guidance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {/* Target Client 1 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <Users size={48} className="text-[#5097C9] mb-4" strokeWidth={1.5} /> {/* Light Blue Icon */}
              <h3 className="text-xl font-semibold mb-2">Individuals & Families</h3>
              <p className="text-gray-600 text-center">
                Guiding you through life's transitions, from accumulating wealth to planning for retirement and legacy.
              </p>
            </div>
            {/* Target Client 2 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
              <Briefcase size={48} className="text-[#5097C9] mb-4" strokeWidth={1.5} /> {/* Light Blue Icon */}
              <h3 className="text-xl font-semibold mb-2">Business Owners</h3>
              <p className="text-gray-600 text-center">
                Integrating your business and personal financial goals, including succession planning and benefits optimization.
              </p>
            </div>
            {/* Target Client 3 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
               <PiggyBank size={48} className="text-[#5097C9] mb-4" strokeWidth={1.5} /> {/* Light Blue Icon */}
              <h3 className="text-xl font-semibold mb-2">Retirees & Pre-Retirees</h3>
              <p className="text-gray-600 text-center">
                Developing sustainable income strategies and managing assets to support your desired retirement lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

       {/* --- "Our Services" Preview Section --- */}
       <section className="relative z-20 w-full bg-white text-[#0A437B] py-16 sm:py-20"> {/* Updated Dark Blue Text & Padding */}
         <div className="max-w-6xl mx-auto px-6 text-center">
           <h2 className="text-3xl sm:text-4xl font-bold mb-10">Our Services</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Service Card 1 */}
             <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
               <h3 className="text-xl font-semibold mb-2">Comprehensive Planning</h3>
               <p className="text-gray-600 mb-4">Integrating all aspects of your financial life into one cohesive strategy.</p>
               <a href="/services" className="text-[#5097C9] hover:underline font-medium">Learn More →</a> {/* Light Blue Link */}
             </div>
             {/* Service Card 2 */}
             <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
               <h3 className="text-xl font-semibold mb-2">Investment Management</h3>
               <p className="text-gray-600 mb-4">Tailored portfolio construction and ongoing management aligned with your goals.</p>
               <a href="/services" className="text-[#5097C9] hover:underline font-medium">Learn More →</a> {/* Light Blue Link */}
             </div>
             {/* Service Card 3 */}
             <div className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
               <h3 className="text-xl font-semibold mb-2">Retirement Strategies</h3>
               <p className="text-gray-600 mb-4">Developing clear paths to and through retirement with confidence.</p>
               <a href="/services" className="text-[#5097C9] hover:underline font-medium">Learn More →</a> {/* Light Blue Link */}
             </div>
           </div>
           <a href="/services" className="mt-12 inline-block px-8 py-3 bg-[#5097C9] text-white font-semibold rounded-lg shadow-lg hover:bg-[#0A437B] transition duration-300 ease-in-out"> {/* Light Blue Button */}
             View All Services
           </a>
         </div>
       </section>
    </main>
  );
}

