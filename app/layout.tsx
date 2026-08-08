import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import SmoothScroll from "../components/SmoothScroll";
import { CartProvider } from "../context/CartContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lux Resin Impression — Handcrafted Resin Jewellery & Art",
    template: "%s | Lux Resin Impression",
  },
  description:
    "Handcrafted resin jewellery and art, made one piece at a time in Karachi. Pressed flowers, gold leaf, and custom keepsakes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <SmoothScroll>
            <Navbar />
            {children}
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
