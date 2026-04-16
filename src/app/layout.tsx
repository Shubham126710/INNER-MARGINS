import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";
import { Header, Footer, NotificationProvider } from "@/components";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inner Margins | Pixel Journal",
  description: "A retro pixel space for thoughts and stories.",
  keywords: ["journal", "blog", "retro", "pixel art", "writing"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.variable} ${vt323.variable} antialiased min-h-screen flex flex-col font-body bg-retro-bg text-retro-text selection:bg-retro-primary selection:text-white`}
      >
        <svg width="0" height="0" style={{ position: 'absolute', visibility: 'hidden' }}>
          <defs>
            <filter id="pixelate" x="-10%" y="-10%" width="120%" height="120%">
              <feFlood x="2" y="2" height="2" width="2" />
              <feComposite width="4" height="4" />
              <feTile result="a" />
              <feComposite in="SourceGraphic" in2="a" operator="in" />
              <feMorphology operator="dilate" radius="2" />
            </filter>
          </defs>
        </svg>
        <Header />
        <NotificationProvider />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
