import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "bootstrap/dist/css/bootstrap-grid.min.css"; // Hanya Grid System
import "bootstrap/dist/css/bootstrap-utilities.min.css"; // Hanya Utility (margin, padding, gap, d-flex) tanpa komponen kaku
import "../globals.css";
import BootstrapClient from "@/components/BootstrapClient";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "EduNusa - Platform E-Learning Terbaik Indonesia",
  description: "Belajar dari instruktur terbaik dengan ribuan kursus online berkualitas tinggi.",
  icons: {
    icon: [
      { url: "/icon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/icon.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body className={plusJakartaSans.variable}>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}

