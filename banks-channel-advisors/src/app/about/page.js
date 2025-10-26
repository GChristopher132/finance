"use client"; // Add this directive

import Image from 'next/image';
import Link from 'next/link'; // Import Link if needed for contact info
// Import icons from lucide-react
import { Mail, Phone, Printer } from 'lucide-react';

export default function AboutPage() {
  // --- Placeholder Advisor Data ---
  // Replace with actual data and image paths
  // Added phone and fax fields
  const advisors = [
    {
      name: "Andrew Sherman, CFP",
      title: "President",
      imageSrc: "/images/banks-channel-logo.png", // Replace with actual path in /public/images
      bio: "With over [X] years of experience, Andrew founded Banks Channel Advisors with a vision to provide personalized, conflict-free financial guidance. [Add more details about experience, qualifications (CFP®, etc.), and passion for helping clients.]",
      email: "andrew@bankschanneladvisors.com", // Replace
      phone: "540-915-2991", // Placeholder Phone
      fax: "703-636-0308", // Placeholder Fax
      // linkedin: "#" // Optional: Add LinkedIn profile URL
    },
    {
      name: "Advisor Two Name",
      title: "Financial Advisor",
      imageSrc: "/images/banks-channel-logo.png", // Replace with actual path in /public/images
      bio: "Advisor Two brings [Y] years of expertise in [specific areas like retirement planning, investment management] to the team. They are committed to building strong client relationships based on trust and clear communication. [Add more details.]",
      email: "advisor.two@bankschanneladvisors.com", // Replace
      phone: "555-123-4568", // Placeholder Phone
      fax: "555-987-6543", // Placeholder Fax (assuming shared fax?)
      // linkedin: "#" // Optional: Add LinkedIn profile URL
    }
  ];

  return (
    <main className="flex flex-col items-center bg-white text-[#0A437B]"> {/* Use white background for content readability */}

      {/* --- Page Header --- */}
      <section className="w-full bg-gray-100 py-12 px-6 sm:px-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#0A437B]">About Banks Channel Advisors</h1>
        <p className="mt-2 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
          Your dedicated partners in navigating the complexities of your financial life.
        </p>
      </section>

      {/* --- Our Story --- */}
      {/* Updated section to use a grid layout */}
      <section className="w-full max-w-5xl mx-auto py-16 px-6 sm:px-10">
         <h2 className="text-3xl font-bold mb-8 text-center text-[#0A437B]">Our Story</h2>
         {/* Grid container */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
             {/* Column 1: Image (Order first on mobile) */}
             <div className="order-1 md:order-2"> {/* Image on right on desktop */}
                 <Image
                     src="/images/avenham-ave.png" // Use the relevant boat image
                     alt="Sailboat navigating Banks Channel, symbolizing financial guidance"
                     width={600} // Adjust size as desired
                     height={400} // Adjust size as desired
                     className="rounded-lg shadow-md w-full h-auto object-cover" // Ensure responsiveness and styling
                 />
             </div>
             {/* Column 2: Text (Order second on mobile) */}
             <div className="order-2 md:order-1"> {/* Text on left on desktop */}
                 <p className="text-lg text-gray-700 leading-relaxed mb-4">
                     Banks Channel Advisors was founded on the principle that everyone deserves access to objective, expert financial advice tailored to their unique circumstances. We saw a need for a firm that prioritizes long-term relationships and genuine client success over product sales.
                 </p>
                 <p className="text-lg text-gray-700 leading-relaxed">
                     Located in Roanoke, VA, we are inspired by the resilience and natural beauty of the Roanoke Valley and the nearby Blue Ridge Mountains. Just as a channel guides vessels safely through changing waters, our name reflects steady navigation. We aim to guide our clients securely toward their financial destinations. [Expand on the firm's founding, mission, and connection to the name/location.]
                 </p>
             </div>
         </div>
      </section>

      {/* --- Our Philosophy --- */}
      <section className="w-full bg-gray-50 py-16 px-6 sm:px-10"> {/* Alternating background */}
         <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-[#0A437B]">Our Philosophy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {/* Value 1 */}
              <div>
                 <h3 className="text-xl font-semibold mb-2 text-[#0A437B]">Client-First Approach</h3>
                 <p className="text-gray-600">As fiduciaries, your best interests always come first. Our recommendations are unbiased and solely focused on helping you achieve your goals.</p>
              </div>
              {/* Value 2 */}
              <div>
                 <h3 className="text-xl font-semibold mb-2 text-[#0A437B]">Transparency</h3>
                 <p className="text-gray-600">We believe in clear communication about our services, strategies, and fees. You'll always understand the 'why' behind our advice.</p>
              </div>
              {/* Value 3 */}
              <div>
                 <h3 className="text-xl font-semibold mb-2 text-[#0A437B]">Long-Term Partnership</h3>
                 <p className="text-gray-600">Financial planning is a journey. We build lasting relationships, adapting your plan as your life and the markets evolve.</p>
              </div>
            </div>
         </div>
      </section>

      {/* --- Meet Our Team --- */}
      <section className="w-full max-w-5xl mx-auto py-16 px-6 sm:px-10">
        <h2 className="text-3xl font-bold mb-12 text-center text-[#0A437B]">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {advisors.map((advisor) => (
            <div key={advisor.name} className="flex flex-col items-center text-center md:text-left md:flex-row md:items-start md:space-x-8">
              {/* Circular Image */}
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <Image
                  src={advisor.imageSrc}
                  alt={`Photo of ${advisor.name}`}
                  width={150} // Adjust size as needed
                  height={150} // Adjust size as needed
                  className="rounded-full object-cover border-4 border-gray-200 shadow-md"
                  // Add placeholder image handling if needed
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/150x150/E2E8F0/AAAAAA?text=Photo'; }} // Basic placeholder
                />
              </div>
              {/* Bio and Contact */}
              <div>
                <h3 className="text-2xl font-semibold text-[#0A437B]">{advisor.name}</h3>
                <p className="text-md font-medium text-[#5097C9] mb-3">{advisor.title}</p> {/* Light blue title */}
                <p className="text-base text-gray-600 leading-relaxed mb-3">
                  {advisor.bio}
                </p>
                {/* Contact Info - Changed to flex-col */}
                <div className="flex flex-col items-center md:items-start space-y-2 text-sm text-gray-600">
                   {/* Email */}
                   <a href={`mailto:${advisor.email}`} className="inline-flex items-center hover:text-[#5097C9] transition-colors">
                     <Mail className="h-4 w-4 mr-2" />
                     {advisor.email}
                   </a>
                   {/* Phone */}
                   {advisor.phone && (
                      <a href={`tel:${advisor.phone.replace(/-/g, '')}`} className="inline-flex items-center hover:text-[#5097C9] transition-colors">
                        <Phone className="h-4 w-4 mr-2" />
                        {advisor.phone}
                      </a>
                   )}
                   {/* Fax */}
                   {advisor.fax && (
                      <span className="inline-flex items-center"> {/* Use span as fax isn't typically linked */}
                        <Printer className="h-4 w-4 mr-2" />
                        Fax: {advisor.fax}
                      </span>
                   )}
                   {/* Add LinkedIn or other links similarly if needed */}
                   {/* {advisor.linkedin && (
                      <a href={advisor.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#5097C9] transition-colors"> LinkedIn </a>
                   )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}

