import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminNavBar } from "./components/AdminNavBar"
import { AuthProvider } from "./components/AuthContext"
import { RouteGuard } from "./components/RouteGuard"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard - Save Serve",
  description: "Admin dashboard for Save Serve Hostel Food Management System",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/saveserve_icon.ico" }
    ],
    shortcut: "/saveserve_icon.ico",
    apple: "/saveserve_icon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <RouteGuard>
            <div className="min-h-screen bg-background">
              <AdminNavBar />
              <main className="pt-24 px-4">
                {children}
              </main>
            </div>
          </RouteGuard>
        </AuthProvider>
      </body>
    </html>
  )
}
