import React from 'react'
import Link from 'next/link'
import { ExternalLink, CalendarDays } from 'lucide-react' // Import icons
import Image from 'next/image' // Import Next.js Image component

// Re-styled button to match your site's aesthetic
function SiteButton({ href, children, targetBlank = true }) {
  return (
    <Link
      href={href}
      target={targetBlank ? '_blank' : '_self'}
      rel={targetBlank ? 'noopener noreferrer' : ''}
      className="mt-6 inline-block rounded-lg bg-[#5097C9] px-8 py-3 text-base font-medium text-white shadow-md hover:bg-[#0A437B] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#5097C9] focus:ring-offset-2"
    >
      {children}
    </Link>
  )
}

// A reusable card component matching your site's style
// Updated to handle image URLs or Icons
function ResourceCard({
  title,
  description,
  buttonText,
  buttonHref,
  Icon,
  imageUrl,
  imageAlt,
}) {
  return (
    <div className="flex flex-col rounded-lg bg-white p-8 text-center shadow-lg">
      {/* Container for Icon or Image, with fixed height for alignment */}
      <div className="flex h-20 items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || `${title} logo`}
            width={180} // Set a base width
            height={80} // Set a base height
            className="h-auto w-auto max-h-16 max-w-[180px] object-contain"
            unoptimized // Required for external SVGs like wikimedia
          />
        ) : Icon ? (
          <Icon
            className="mx-auto h-12 w-12 text-[#5097C9]"
            aria-hidden="true"
          />
        ) : (
          <div className="h-12 w-12" /> // Placeholder for alignment
        )}
      </div>

      {/* Render title only if there's an Icon (since logos have text) */}
      {Icon && !imageUrl && title && (
        <h3 className="mt-4 text-2xl font-semibold text-[#0A2342]">
          {title}
        </h3>
      )}

      {/* Description and Button */}
      <div className="flex flex-1 flex-col justify-between pt-4">
        <p className="mt-4 text-sm text-gray-600">{description}</p>
        <div className="mt-6">
          <SiteButton href={buttonHref}>{buttonText}</SiteButton>
        </div>
      </div>
    </div>
  )
}

export default function ClientResourcesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50">
      {/* --- Page Header (styled like your other pages) --- */}
      <section className="w-full bg-gray-100 py-12 px-6 sm:px-10 text-center shadow-sm">
        <h1 className="text-4xl font-bold text-[#0A437B] md:text-5xl">
          Client Resources
        </h1>
        <p className="mt-2 text-lg text-gray-700 md:text-xl">
          Access your portals and schedule appointments.
        </p>
      </section>

      {/* --- Content Section --- */}
      <div className="w-full max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
        {/* --- Client Portals --- */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#0A2342] sm:text-4xl">
            Client Portals
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Links to your Charles Schwab and eMoney websites.
          </p>
        </div>

        {/* Updated Grid for Portals (2-col) */}
        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-12 md:grid-cols-2">
          {/* Charles Schwab */}
          <ResourceCard
            title="Charles Schwab"
            description="(Login to the Charles Schwab website to view your Schwab accounts, download monthly statements, tax reports, trade confirmations, etc)"
            buttonText="Schwab Login"
            buttonHref="https://www.schwab.com/"
            imageUrl="https://upload.wikimedia.org/wikipedia/commons/4/4b/Charles_Schwab_Corporation_logo.svg"
            imageAlt="Charles Schwab logo"
          />

          {/* eMoney */}
          <ResourceCard
            title="eMoney"
            description="(Login to the eMoney portal to access your secure file sharing vault, view your net worth summary, cash flow report, port, investment allocations, tc)"
            buttonText="eMoney Login"
            buttonHref="https://www.emoneyadvisor.com/"
            imageUrl="https://emoneyadvisor.com/wp-content/uploads/2023/03/emoney-nav-logo.svg"
            imageAlt="eMoney logo"
          />
        </div>

        {/* --- Divider --- */}
        <hr className="my-16 border-gray-300" />

        {/* --- Scheduling Section --- */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#0A2342] sm:text-4xl">
            Schedule an Appointment
          </h2>
          <p className="mt-4 text-lg text-gray-700">
            Use the link below to schedule a call or Zoom meeting with Andrew.
          </p>
        </div>

        {/* Centered container for the single scheduling card */}
        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-sm">
            <ResourceCard
              title="Schedule a Call"
              description="Use the link below to schedule a call or Zoom meeting with Andrew."
              buttonText="Schedule with Andrew"
              buttonHref="#" // Add Andrew's scheduling link here
              Icon={CalendarDays}
              targetBlank={true} // Or false if it's not an external link
            />
          </div>
        </div>
      </div>
    </main>
  )
}


