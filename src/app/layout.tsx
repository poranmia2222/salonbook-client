import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Chrome from "@/components/Chrome";
import { ToastProvider } from "@/components/ui/use-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "SalonBook — Premium Salon Booking",
  description: "Book premium salon services online. SalonBook.",
  openGraph: {
    title: "SalonBook — Premium Salon Booking",
    description: "Book premium salon services online.",
    siteName: "SalonBook",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <ToastProvider>
          <Chrome>
            <main className="flex-1 w-full">{children}</main>
          </Chrome>
        </ToastProvider>
      </body>
    </html>
  );
}
