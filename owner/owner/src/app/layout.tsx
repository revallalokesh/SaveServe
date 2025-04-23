import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { OwnerNavBar } from "./components/OwnerNavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Save Serve",
  description: "Hostel Food Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black min-h-screen`}>
        <div className="relative">
          <OwnerNavBar />
          <main className="pt-24 px-4 sm:px-6 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
