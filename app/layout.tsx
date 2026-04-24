import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "WatchFury — Stream K-Dramas Free",
    template: "%s | WatchFury",
  },
  description:
    "Watch the latest Korean dramas, C-dramas, anime and more — free streaming, no subscription required. Educational project.",
  keywords: [
    "kdrama",
    "korean drama",
    "streaming",
    "watch online",
    "cdrama",
    "anime",
    "free streaming",
  ],
  authors: [{ name: "WatchFury" }],
  creator: "WatchFury",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "WatchFury",
    title: "WatchFury — Stream K-Dramas Free",
    description:
      "Watch the latest Korean dramas, C-dramas, anime and more — free streaming.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WatchFury — Stream K-Dramas Free",
    description:
      "Watch the latest Korean dramas, C-dramas, anime and more — free streaming.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-white antialiased min-h-screen flex flex-col">
        {/* Top Navigation */}
        <Navbar />

        {/* Page Content — padded top to account for fixed navbar (h-14) */}
        <main className="flex-1 pt-14">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
