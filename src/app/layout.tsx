import type { Metadata } from "next";
import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { PublicationHeader, Footer, ElectronNavigation } from "@/components";

const newsreader = Newsreader({
  weight: ["400", "500", "600"],
  variable: "--font-heading",
  subsets: ["latin"],
  style: ['normal', 'italic'],
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inner Margins",
  description: "A personal archive of things I couldn't leave unwritten.",
  keywords: ["journal", "editorial", "writing", "archive"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col font-sans bg-paper text-ink selection:bg-ink selection:text-paper relative`}
      >
        <ElectronNavigation />
        <PublicationHeader />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
