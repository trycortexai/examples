import type { Metadata } from "next";
import { DM_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});
const geistMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Cortex Examples",
  description: "Examples of using Cortex API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
