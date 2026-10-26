import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { SiteFrame } from "@/components/site/SiteFrame";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import { getSiteConfig } from "@/lib/config-storage";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
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

// The layout reads the editable site config from disk, so it has to render per
// request — otherwise dashboard edits would be frozen into the build output.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // Read the saved config on the server so the first paint already reflects the
  // client's edits, instead of flashing defaults until the browser fetch lands.
  const config = await getSiteConfig();

  return (
    <html lang="en" className={`${brand.variable} ${sans.variable}`}>
      <body className="bg-[#070709] text-[#F3F4F6] antialiased">
        <SiteConfigProvider initialConfig={config}>
          <SiteFrame>{children}</SiteFrame>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
