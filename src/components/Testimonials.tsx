"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useSiteImages } from "@/components/SiteImagesProvider";
import "swiper/css";
import "swiper/css/pagination";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Brevan Softwares built our business website and automated our customer replies. Our clients now get instant answers and we have more time to run the shop.",
    name: "John Kiprop",
    role: "Business Owner, Narok",
  },
  {
    quote:
      "The team trained our students in digital skills and AI tools. Our learners are now confident and ready for the digital economy. Highly recommended.",
    name: "Grace Wanjiru",
    role: "School Administrator",
  },
  {
    quote:
      "My online store went live in record time with secure payments. Sales have grown and customers love how easy it is to order. Great service!",
    name: "Brian Otieno",
    role: "E-Commerce Store Owner",
  },
];

export default function Testimonials() {
  const images = useSiteImages();

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="section-heading">
              <h6>Testimonials</h6>
              <h4>What They Say</h4>
            </div>
          </div>
          <div className="col-lg-10 offset-lg-1">
            <Swiper
              className="owl-testimonials owl-carousel"
              modules={[Autoplay, Pagination]}
              loop
              spaceBetween={15}
              slidesPerView={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              style={{ position: "relative", zIndex: 5 }}
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={i}>
                  <div className="item">
                    <i className="fa fa-quote-left"></i>
                    <p>{t.quote}</p>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                    <div className="right-image">
                      <img src={images.testimonial_avatar} alt={t.name} />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
