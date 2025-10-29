"use client"; // This page needs to be a Client Component for form state

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin, CalendarDays, Loader2 } from 'lucide-react';
import { sendEmail } from './sendEmail'; // Import the new Server Action

export default function ContactPage() {
  // State for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [howHear, setHowHear] = useState('');
  const [message, setMessage] = useState('');
  // const [isVerified, setIsVerified] = useState(false); // Removed
  
  // State for form submission
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'success', 'error', or null

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true);
    setFormStatus(null);

    // Get form data
    const formData = new FormData(e.currentTarget);

    // Simple client-side validation (optional, but good for UX)
    if (!formData.get('fullName') || !formData.get('email') || !formData.get('message') || !formData.get('howHear')) {
      setFormStatus({ type: 'error', message: 'Please fill out all required fields.' });
      setIsLoading(false);
      return;
    }

    // Call the Server Action
    const result = await sendEmail(formData);

    if (result.success) {
      setIsLoading(false);
      setFormStatus({ type: 'success', message: 'Thank you! Your message has been sent.' });
      
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setHowHear('');
      setMessage('');
    } else {
      setIsLoading(false);
      setFormStatus({ type: 'error', message: result.error || 'An unknown error occurred.' });
    }
  };

  // Reusable form input component
  const FormInput = ({ id, label, type, value, onChange, required }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5097C9] focus:border-transparent"
      />
    </div>
  );

  return (
    <main className="flex flex-col bg-gray-50 text-[#0A437B]">
      
      {/* --- Page Header --- */}
      <section className="relative h-[50vh] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/avenham-ave.png" // Using this image from your about page
          alt="Contact Banks Channel Advisors"
          fill
          style={{ objectFit: 'cover' }}
          className="z-0"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0A2342] opacity-70 z-10"></div>
        {/* Text Content */}
        <div className="relative z-20 text-center p-6">
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-lg">
            Contact Us
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-200 drop-shadow">
            We're here to help you get started.
          </p>
        </div>
      </section>

      {/* --- Main Content Section --- */}
      <section className="w-full max-w-7xl mx-auto py-16 sm:py-20 px-6 sm:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* --- Left Column: Intro, Contact Info & Map --- */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-[#0A2342] mb-4">
                Ready to take the first step?
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                If you would like to learn more about Banks Channel Advisors, have questions, or would like to schedule a complimentary call, please contact us today!
              </p>
              <Link
                href="/client-resources"
                className="inline-flex items-center px-8 py-3 bg-[#5097C9] text-white font-semibold rounded-lg shadow-lg hover:bg-[#0A437B] transition duration-300 ease-in-out"
              >
                <CalendarDays className="mr-2 h-5 w-5" />
                Schedule a Call
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-2xl font-semibold text-[#0A2342] mb-4 border-b pb-2">
                Our Information
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 mr-3 mt-1 flex-shrink-0 text-[#5097C9]" />
                  <div>
                    <span className="font-semibold">Address:</span>
                    <br />
                    2710 Avenham Ave. SW
                    <br />
                    Roanoke, VA 24014
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-[#5097C9]" />
                  <div>
                    <span className="font-semibold">Phone:</span>{' '}
                    <a href="tel:540-915-2991" className="hover:text-[#5097C9]">540-915-2991</a>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-[#5097C9]" />
                  <div>
                    <span className="font-semibold">Email:</span>{' '}
                    <a href="mailto:andrew@bankschanneladvisors.com" className="hover:text-[#5097C9]">andrew@bankschanneladvisors.com</a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* --- NEW Map Location --- */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                {/* Using an iframe for the map, similar to the example */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3183.056132800473!2d-79.9709724846999!3d37.24584987985955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x884d0300a6e0f2b9%3A0xe10e4f160f6f04f2!2s2710%20Avenham%20Ave%20SW%2C%20Roanoke%2C%20VA%2024014!5e0!3m2!1sen!2sus!4v1678888888888!5m2!1sen!2sus" 
                  width="100%" 
                  height="350" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* --- Right Column: Contact Form --- */}
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h3 className="text-2xl font-semibold text-[#0A2342] mb-6">
              Send Us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput 
                id="fullName" 
                label="Full Name" 
                type="text" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
              />
              <FormInput 
                id="email" 
                label="Email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              <FormInput 
                id="phone" 
                label="Phone" 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
              />
              <div>
                <label htmlFor="howHear" className="block text-sm font-medium text-gray-700 mb-1">
                  How did you hear about us? <span className="text-red-500">*</span>
                </label>
                <select
                  id="howHear"
                  name="howHear"
                  value={howHear}
                  onChange={(e) => setHowHear(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5097C9] focus:border-transparent bg-white"
                >
                  <option value="" disabled>Please Select</option>
                  <option value="Referral">Referral</option>
                  <option value="Web Search">Web Search</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5097C9] focus:border-transparent"
                ></textarea>
              </div>

              {/* Form Status Messages */}
              {formStatus && (
                <div 
                  className={`p-4 rounded-lg text-sm ${
                    formStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {formStatus.message}
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center px-8 py-3 bg-[#0A437B] text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-[#5097C9] transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}


