"use client";

import { createContext, useContext, useEffect } from "react";
import type { SiteImages } from "@/lib/site-settings";

const SiteImagesContext = createContext<SiteImages>({} as SiteImages);

export function useSiteImages() {
  return useContext(SiteImagesContext);
}

export default function SiteImagesProvider({
  images,
  children,
}: {
  images: SiteImages;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(images)) {
      root.style.setProperty(`--img-${key}`, value);
    }
  }, [images]);

  return (
    <SiteImagesContext.Provider value={images}>
      {children}
    </SiteImagesContext.Provider>
  );
}
