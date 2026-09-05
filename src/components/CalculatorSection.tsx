"use client";

import QuoteForm from "@/components/QuoteForm";
import { useSiteImages } from "@/components/SiteImagesProvider";

export default function CalculatorSection() {
  const images = useSiteImages();

  return (
    <section className="calculator">
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="left-image">
              <img src={images.calculator_image} alt="Brevan Softwares solutions" />
            </div>
          </div>
          <div className="col-lg-5">
            <div className="section-heading">
              <h6>Start Your Project</h6>
              <h4>Request a Free Quote</h4>
            </div>
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
