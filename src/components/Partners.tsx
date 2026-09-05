"use client";

import { useSiteImages } from "@/components/SiteImagesProvider";

const LOGOS = Array.from({ length: 6 }, (_, i) => i + 1);

export default function Partners() {
  const images = useSiteImages();

  return (
    <section className="partners">
      <div className="container">
        <div className="row">
          {LOGOS.map((n) => (
            <div className="col-lg-2 col-sm-4 col-6" key={n}>
              <div className="item">
                <img src={images.partner_logo} alt="Partner" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
