import type { Metadata } from "next";
import type { ReactNode } from "react";
import ClientHeader from "@/components/ClientHeader";
import ClientFooter from "@/components/ClientFooter";
import SiteImagesProvider from "@/components/SiteImagesProvider";
import { listSiteImages } from "@/lib/site-settings";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://client.brevansoftwares.co.ke";

export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Brevan Softwares - Software Company in Kenya | Web Developers Narok Bomet Kericho Nakuru",
    template: "%s | Brevan Softwares",
  },
  description:
    "Brevan Softwares — software company in Kenya and software designer in Narok, Bomet, Kericho, Nakuru. Web developers offering AI automation, website design, WordPress, Joomla, e-commerce, real estate platforms and graphic design by Emmanuel Kiplangat.",
  keywords: [
    "software company in Kenya",
    "software company Kenya",
    "Brevan",
    "Brevan Softwares",
    "software designer Narok",
    "software designer Bomet",
    "software designer Kericho",
    "software designer Nakuru",
    "web developers Narok",
    "web developers Bomet",
    "web developers Kericho",
    "web developers Nakuru",
    "web developers Kenya",
    "AI automation Kenya",
    "website design Kenya",
    "WordPress developer Kenya",
    "Joomla development",
    "e-commerce Kenya",
    "graphic design Narok",
    "digital training Kenya",
  ],
  applicationName: "Brevan Softwares",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: "Brevan Softwares",
    title: "Brevan Softwares - Software Company in Kenya | Web Developers Narok Bomet Kericho Nakuru",
    description:
      "Software company in Kenya — Brevan software designer in Narok, Bomet, Kericho, Nakuru. Web developers for AI automation and website design.",
  },
  twitter: {
    card: "summary",
    title: "Brevan Softwares - Software Company in Kenya | Web Developers Narok Bomet Kericho Nakuru",
    description:
      "Software company in Kenya — Brevan software designer in Narok, Bomet, Kericho, Nakuru. Web developers for AI automation and website design.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const images = await listSiteImages();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/vendor/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/fontawesome.css" />
        <link rel="stylesheet" href="/assets/css/templatemo-574-mexant.css" />
        <link rel="stylesheet" href="/assets/css/brevan.css" />
        <link rel="stylesheet" href="/assets/css/owl.css" />
        <link rel="stylesheet" href="/assets/css/animate.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Brevan Softwares",
              alternateName: "Brevan",
              url: SITE_URL,
              email: "brevansoftwares@gmail.com",
              telephone: "+254117004147",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Narok",
                addressRegion: "Narok",
                addressCountry: "KE",
              },
              areaServed: [
                { "@type": "City", name: "Narok" },
                { "@type": "City", name: "Bomet" },
                { "@type": "City", name: "Kericho" },
                { "@type": "City", name: "Nakuru" },
                { "@type": "Country", name: "Kenya" },
              ],
              founder: {
                "@type": "Person",
                name: "Emmanuel Kiplangat",
              },
              description:
                "Software company in Kenya — Brevan software designer in Narok, Bomet, Kericho, Nakuru. Web developers offering AI automation, website design, WordPress, Joomla, e-commerce and graphic design.",
              keywords:
                "software company in Kenya, software designer Narok, software designer Bomet, software designer Kericho, software designer Nakuru, web developers Kenya",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Brevan Softwares",
              image: `${SITE_URL}/assets/images/brevan-logo.jpg`,
              url: SITE_URL,
              telephone: "+254117004147",
              email: "brevansoftwares@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Narok Town",
                addressLocality: "Narok",
                addressRegion: "Rift Valley",
                postalCode: "20500",
                addressCountry: "KE",
              },
              areaServed: ["Narok", "Bomet", "Kericho", "Nakuru", "Kenya"],
              priceRange: "$$",
            }),
          }}
        />
      </head>
      <body>
        <SiteImagesProvider images={images}>
          <ClientHeader />
          {children}
          <ClientFooter />
        </SiteImagesProvider>
      </body>
    </html>
  );
}
