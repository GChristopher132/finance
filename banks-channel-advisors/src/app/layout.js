import { Inter, Newsreader, Lora, Playfair_Display, EB_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-ebgaramond',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

// Updated metadata to include the icon link
export const metadata = {
  title: "Banks Channel Advisors, LLC",
  description: "Your trusted partner for financial planning.",
  icons: {
    icon: '/images/banks-channel-logo-no-text.png', // Path relative to the 'public' folder
    // You could add other icon types here if needed, e.g., apple: '/apple-icon.png'
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${lora.variable} ${playfair.variable} ${ebGaramond.variable}`}>
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

