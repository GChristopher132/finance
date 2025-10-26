import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Use logo's dark blue
    <footer className="bg-[#0A2342] text-white py-12 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Column 1: Logo and Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="mb-4">
            <Image
              src="/images/banks-channel-logo.png" // Path to your logo
              alt="Banks Channel Advisors Logo"
              width={250}
              height={70}
              // Removed the filter class causing the white box
            />
          </Link>
          <p className="text-sm text-gray-300">
            Registered Investment Advisor.
          </p>
          <p className="text-sm text-gray-300 mt-2">
            2710 Avenham Ave. SW<br />
            Roanoke, VA 24014
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
           {/* Use logo's light blue */}
          <h3 className="text-lg font-semibold text-[#5097C9] mb-4 uppercase">Quick Links</h3>
          <ul className="space-y-3">
             {/* Use logo's light blue for hover */}
            <li><Link href="/" className="hover:text-[#5097C9] transition-colors">Home</Link></li>
            <li><Link href="/services" className="hover:text-[#5097C9] transition-colors">Services</Link></li>
            <li><Link href="/about" className="hover:text-[#5097C9] transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[#5097C9] transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Column 3: Legal / Disclaimer */}
        <div>
           {/* Use logo's light blue */}
          <h3 className="text-lg font-semibold text-[#5097C9] mb-4 uppercase">Legal</h3>
          <p className="text-sm text-gray-300">
            Advisory services offered through Banks Channel Advisors, LLC,
            a Registered Investment Advisor. This website is for informational
            purposes only and does not constitute a complete description of
            our investment services or performance.
          </p>
        </div>
      </div>

      {/* Bottom Bar: Copyright */}
      <div className="mt-10 pt-8 border-t border-gray-700 text-center">
        <p className="text-sm text-gray-400">
          &copy; {currentYear} Banks Channel Advisors, LLC. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

