// app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Maple - Rent Outdoor Gear",
  description: "Peer-to-peer outdoor equipment rental marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Top Navigation */}
          <Navbar />

          <div className="flex">
            {/* Side Navigation */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
