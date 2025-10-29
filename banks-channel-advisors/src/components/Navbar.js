"use client"; // Keep this directive for useState

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react'; // Import useState and useEffect

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State for mobile hamburger menu
  const [isMobile, setIsMobile] = useState(false); // State to track mobile viewport

  // Effect to check screen width
  useEffect(() => {
    const checkMobile = () => {
      // Tailwind's md breakpoint is 768px
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile(); // Check on initial mount
    window.addEventListener('resize', checkMobile); // Check on resize
    return () => window.removeEventListener('resize', checkMobile); // Cleanup listener
  }, []);

  // Define navigation structure with dropdowns
  const navLinks = [
    { href: '/about', label: 'About Us' },
    {
      href: '/services', // Parent link
      label: 'Services',
      children: [ // Dropdown items
        { href: '/services', label: 'Overview' }, // Add an overview link
        { href: '/portfolios', label: 'Our Portfolios' },
        { href: '/fees', label: 'Our Fees' },
      ],
    },
    {
      label: 'Resources', // No direct link for the parent, just a dropdown trigger
      children: [
        { href: '/blog', label: 'Blog' },
        { href: '/disclosures', label: 'Disclosures' },
      ],
    },
    { href: '/contact', label: 'Contact Us' },
  ];

  // Define logo dimensions based on isMobile state
  const logoWidth = isMobile ? 72 : 126; // Smaller width for mobile (e.g., 80% of 180)
  const logoHeight = isMobile ? 18 : 31.5; // Smaller height for mobile (maintaining aspect ratio)

  return (
    // Increased z-index slightly just in case, kept sticky
    <nav className="w-full bg-[#0A2342] shadow-md sticky top-0 z-[60]"> {/* Brand dark blue */}
      {/* Container for logo and menu items */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Relative positioning to contain absolutely positioned elements if needed */}
        {/* Reverted height back to h-16 */}
        <div className="relative flex justify-between items-start h-16"> {/* items-start aligns logo to top */}

          {/* Logo - Positioned higher, size depends on isMobile state */}
          <div className="flex-shrink-0 flex items-start pt-1 z-10"> {/* Ensure logo has z-index if needed */}
            <Link href="/" className="flex items-center">
              {/* Use dynamic width and height */}
              <Image
                src="/images/banks-channel-logo.png"
                alt="Banks Channel Advisors Logo"
                width={logoWidth} // Use state variable
                height={logoHeight} // Use state variable
                priority
                className={`rounded-b-lg transition-all duration-300 ease-in-out`} // Added transition for smoother resize change
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered vertically */}
          {/* Removed wrapping div, added self-center h-full back */}
          <div className="hidden md:flex items-center self-center h-full">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group"> {/* Use group for hover effects */}
                {link.children ? (
                  // Item with Dropdown Trigger
                  <button className="text-gray-300 hover:text-[#5097C9] px-3 py-2 rounded-md text-sm font-medium focus:outline-none inline-flex items-center transition-colors duration-200">
                    {link.label}
                    {/* Dropdown Arrow */}
                    <svg className="ml-1 h-5 w-5 text-gray-400 group-hover:text-[#5097C9]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                ) : (
                  // Regular Link
                  <Link href={link.href} className="text-gray-300 hover:text-[#5097C9] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                    {link.label}
                  </Link>
                )}

                {/* Dropdown Menu Panel (Desktop) */}
                {link.children && (
                  // Increased z-index for dropdown
                  <div className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[70]">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#0A437B]" // Dark blue text on hover
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* --- NEW CLIENT RESOURCES BUTTON --- */}
            <Link
              href="/client-resources"
              className="ml-4 rounded-md bg-[#5097C9] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0A437B] focus:outline-none focus:ring-2 focus:ring-[#5097C9] focus:ring-offset-2 transition-colors duration-200"
            >
              Client Resources
            </Link>
            {/* --- END NEW BUTTON --- */}
          </div>

          {/* Mobile Menu Button - Centered vertically */}
          {/* Removed wrapping div, added self-center h-full back */}
          <div className="md:hidden flex items-center self-center h-full">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon changes based on state */}
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Added transition classes and padding-top */}
      {/* Use max-height for smooth transition, along with opacity and transform */}
      {/* Adjusting pt based on smaller logo height (36px). pt-2 should be enough */}
      <div
        className={`md:hidden bg-[#0A2342] overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[32rem] opacity-100 pt-2' : 'max-h-0 opacity-0 pt-0' // Increased max-h from 96 to [32rem]
        }`}
        id="mobile-menu"
      >
        {/* Adjusted padding inside the animated container */}
        <div className="px-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            // Render parent links and then children links directly for mobile
            link.children ? (
              // Render parent label (not clickable if no direct href) + children
              <div key={link.label}>
                 {/* Reduced top padding here since it's added to the container */}
                 <span className="text-gray-400 block px-3 py-1 rounded-md text-base font-medium">{link.label}</span>
                 {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="text-gray-300 hover:text-[#5097C9] block pl-6 pr-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                      onClick={() => setIsOpen(false)} // Close menu on click
                    >
                      {child.label}
                    </Link>
                 ))}
              </div>
            ) : (
              // Regular Link
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-300 hover:text-[#5097C9] block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)} // Close menu on click
              >
                 {link.label}
              </Link>
            )
          ))}
          
          {/* --- NEW CLIENT RESOURCES LINK (MOBILE) --- */}
          <Link
            href="/client-resources"
            className="mt-2 inline-block rounded-md bg-[#5097C9] px-3 py-2 text-base font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#0A2342] transition-colors duration-200"
            onClick={() => setIsOpen(false)} // Close menu on click
          >
            Client Resources
          </Link>
          {/* --- END NEW LINK --- */}

        </div>
      </div>
    </nav>
  );
}

