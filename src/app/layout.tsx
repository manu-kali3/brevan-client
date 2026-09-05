import type { Metadata } from "next";
import type { ReactNode } from "react";
import ClientHeader from "@/components/ClientHeader";
import ClientFooter from "@/components/ClientFooter";
import SiteImagesProvider from "@/components/SiteImagesProvider";
import { listSiteImages } from "@/lib/site-settings";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://brevansoftwares.co.ke";

export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Brevan Softwares - AI Automation & Web Design in Kenya",
    template: "%s | Brevan Softwares",
  },
  description:
    "Brevan Softwares is a Kenyan technology initiative by Emmanuel Kiplangat offering AI automation, website design, WordPress, Joomla, e-commerce, real estate platforms and graphic design for local businesses, schools and communities.",
  keywords: [
    "AI automation Kenya",
    "website design Kenya",
    "WordPress developer",
    "Joomla development",
    "e-commerce Kenya",
    "graphic design Narok",
    "digital training Kenya",
    "Brevan Softwares",
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
    title: "Brevan Softwares - AI Automation & Web Design in Kenya",
    description:
      "AI automation, website design and digital tools that help local businesses, schools and communities across Kenya grow.",
  },
  twitter: {
    card: "summary",
    title: "Brevan Softwares - AI Automation & Web Design in Kenya",
    description:
      "AI automation, website design and digital tools that help local businesses, schools and communities across Kenya grow.",
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
              url: SITE_URL,
              email: "brevansoftwares@gmail.com",
              telephone: "+254117004147",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Narok",
                addressCountry: "KE",
              },
              founder: {
                "@type": "Person",
                name: "Emmanuel Kiplangat",
              },
              description:
                "AI automation, website design and digital tools for local businesses, schools and communities across Kenya.",
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
