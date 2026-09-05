"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useSiteImages } from "@/components/SiteImagesProvider";
import "swiper/css";
import "swiper/css/navigation";

interface Slide {
  background: string;
  title: string;
  text: string;
}

const INTERLEAVE_OFFSET = 0.5;

export default function HeroSlider() {
  const images = useSiteImages();

  const slides: Slide[] = [
    {
      background: images.hero_1,
      title:
        "Build <em>smart</em> websites for your business<br/>&amp; automate <em>every process</em>",
      text: "Brevan Softwares is a Kenyan technology initiative delivering AI automation, website design and digital tools that help local businesses, schools and communities grow.",
    },
    {
      background: images.hero_2,
      title:
        "<em>AI Automation</em> &amp; future-ready skills<br/>for schools &amp; <em>local enterprises</em>",
      text: "We bring practical AI solutions and modern technical skills to TVET students and micro-enterprises, equipping our communities with the tools of tomorrow.",
    },
    {
      background: images.hero_3,
      title:
        "Bridging the <em>digital divide</em> between<br/>rural &amp; urban <em>Kenya</em>",
      text: "From digitalizing micro-enterprises to driving digital transformation in rural and educational communities, we are committed to inclusive growth.",
    },
  ];

  return (
    <div className="swiper-container" id="top">
      <Swiper
        modules={[Navigation, Mousewheel, Keyboard]}
        className="swiper-container"
        loop
        speed={1000}
        grabCursor
        watchSlidesProgress
        keyboard={{ enabled: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        onProgress={(swiper: SwiperType) => {
          swiper.slides.forEach((slide) => {
            const inner = slide.querySelector<HTMLElement>(".slide-inner");
            if (!inner) return;
            const innerOffset = swiper.width * INTERLEAVE_OFFSET;
            const innerTranslate = (slide.progress ?? 0) * innerOffset;
            inner.style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
          });
        }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="slide-inner"
              style={{ backgroundImage: `url(${slide.background})` }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="header-text">
                      <h2 dangerouslySetInnerHTML={{ __html: slide.title }} />
                      <div className="div-dec"></div>
                      <p>{slide.text}</p>
                      <div className="buttons">
                        <div className="green-button">
                          <Link href="/our-services">Discover More</Link>
                        </div>
                        <div className="orange-button">
                          <Link href="/contact-us">Contact Us</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-button-next swiper-button-white"></div>
      <div className="swiper-button-prev swiper-button-white"></div>
    </div>
  );
}
