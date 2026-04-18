import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maria — Anime Assistant",
  description: "Аниме ассистент",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="ru" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js" />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-white">
      {children}
      </body>
      </html>
  )
}