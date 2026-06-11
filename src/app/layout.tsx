import type { Metadata } from "next";
import { Press_Start_2P, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "@/components";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500", "700"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${pressStart2P.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col font-body bg-retro-bg text-retro-text selection:bg-retro-primary selection:text-retro-bg relative`}
      >
        {/* Grain overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-10 mix-blend-overlay noise-bg"></div>
        {/* Scanlines overlay */}
        <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>
        
        <svg className="absolute w-0 h-0 pointer-events-none" style={{ position: 'absolute', pointerEvents: 'none' }}>
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
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
