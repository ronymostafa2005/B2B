import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { SiteFrame } from "@/components/site/SiteFrame";
import { agency } from "@/lib/content";
import "./globals.css";

const brand = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-brand",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "B2B. — Identity and campaigns",
    template: "%s — B2B.",
  },
  description: agency.description,
  openGraph: {
    title: "B2B. — Identity and campaigns",
    description: agency.description,
    images: ["/brand/identity.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#070709",
  colorScheme: "dark",
};

import { SiteConfigProvider } from "@/context/SiteConfigContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${brand.variable} ${sans.variable}`}>
      <body className="bg-[#070709] text-[#F3F4F6] antialiased">
        <SiteConfigProvider>
          <SiteFrame>{children}</SiteFrame>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
