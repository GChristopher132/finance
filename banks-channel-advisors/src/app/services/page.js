export default function ServicesPage() {
    return (
      // Standardized padding and background
      <main className="flex flex-col items-center py-16 sm:py-20 px-6 sm:px-10 bg-gray-50 min-h-screen">
         {/* Use arbitrary value syntax for text color */}
        <h1 className="text-5xl font-bold text-[#0A2342] mb-6 text-center">Our Services</h1>
        <p className="mt-4 text-xl text-gray-700 max-w-3xl text-center">
          At Banks Channel Advisors, we provide comprehensive financial planning to help you navigate your unique financial journey with confidence.
        </p>

        {/* Changed to a grid layout for cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">

          {/* Service Card 1 */}
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
             {/* Use arbitrary value syntax for text color */}
            <span className="text-[#007BFF] text-4xl mb-4">🏦</span> {/* Example: Replace with actual icon */}
            <h3 className="text-xl font-semibold text-[#0A2342] mb-3">Retirement Planning & Income Strategies</h3>
            <p className="text-gray-600">Secure your future with personalized retirement roadmaps and reliable income streams.</p>
          </div>

          {/* Service Card 2 */}
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
             {/* Use arbitrary value syntax for text color */}
            <span className="text-[#007BFF] text-4xl mb-4">📈</span> {/* Example: Replace with actual icon */}
            <h3 className="text-xl font-semibold text-[#0A2342] mb-3">Investment Management & Portfolio Optimization</h3>
            <p className="text-gray-600">Grow your wealth through strategic investment management tailored to your risk tolerance.</p>
          </div>

          {/* Service Card 3 */}
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
            {/* Use arbitrary value syntax for text color */}
            <span className="text-[#007BFF] text-4xl mb-4">📜</span> {/* Example: Replace with actual icon */}
            <h3 className="text-xl font-semibold text-[#0A2342] mb-3">Estate Planning & Wealth Transfer</h3>
            <p className="text-gray-600">Protect your legacy and ensure seamless wealth transfer for future generations.</p>
          </div>

          {/* Service Card 4 */}
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
            {/* Use arbitrary value syntax for text color */}
            <span className="text-[#007BFF] text-4xl mb-4">🎓</span> {/* Example: Replace with actual icon */}
            <h3 className="text-xl font-semibold text-[#0A2342] mb-3">Education Funding Strategies</h3>
            <p className="text-gray-600">Plan effectively for education costs with dedicated savings and investment strategies.</p>
          </div>

          {/* Service Card 5 */}
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
             {/* Use arbitrary value syntax for text color */}
            <span className="text-[#007BFF] text-4xl mb-4">🛡️</span> {/* Example: Replace with actual icon */}
            <h3 className="text-xl font-semibold text-[#0A2342] mb-3">Risk Management & Insurance Analysis</h3>
            <p className="text-gray-600">Safeguard your assets and loved ones with comprehensive risk assessment and insurance solutions.</p>
          </div>

           {/* You might want a 6th card or adjust layout if you have fewer */}
           <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center border-2 border-dashed border-gray-300 justify-center">
             <span className="text-gray-400 text-4xl mb-4">+</span>
             <h3 className="text-xl font-semibold text-gray-500 mb-3">More Services Available</h3>
             <p className="text-gray-500">Contact us to discuss your specific needs.</p>
           </div>

        </div> {/* End grid */}

        {/* Button - Use arbitrary value syntax */}
        <button className="mt-16 px-10 py-4 bg-[#007BFF] text-white text-xl font-semibold rounded-full shadow-xl hover:bg-[#0A2342] transition duration-300 ease-in-out transform hover:scale-105">
           Let's Get Started
        </button>
      </main>
    );
  }

