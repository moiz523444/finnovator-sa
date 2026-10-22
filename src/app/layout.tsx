import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Effects from "@/components/Effects";
import Preloader from "@/components/Preloader";
import "./globals.css";

const display = DM_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "Finnovator | Fintech Built for What's Next",
  description:
    "Finnovator builds payments, lending and open-banking infrastructure for banks, merchants and fintechs across Saudi Arabia and the region.",
};

// Runs before first paint: restores the saved theme and skips the intro on repeat visits in a session.
const bootScript = `(function(){var d=document.documentElement;try{if(localStorage.getItem("fn-theme")==="light")d.setAttribute("data-theme","light")}catch(e){}var seen=false;try{seen=sessionStorage.getItem("fn-intro")==="1"}catch(e){}if(seen||matchMedia("(prefers-reduced-motion: reduce)").matches)d.setAttribute("data-intro","done");else d.setAttribute("data-intro","pending")})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        <Preloader />
        <SmoothScroll />
        <Effects />
        {children}
      </body>
    </html>
  );
}
