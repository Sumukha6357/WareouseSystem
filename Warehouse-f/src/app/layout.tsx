import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { AuthProvider } from "@/context/AuthContext";
import ToastProvider from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WarehouseMS - Warehouse Management System",
  description: "Comprehensive warehouse management solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <div className="min-h-screen flex flex-col">
          <AuthProvider>
            <ToastProvider />
            <ConditionalNavbar />
            <main className="flex-grow">
              {children}
            </main>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
