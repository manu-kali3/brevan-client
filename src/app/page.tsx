import HeroSlider from "@/components/HeroSlider";
import ServicesCards from "@/components/ServicesCards";
import CtaSection from "@/components/CtaSection";
import AboutSection from "@/components/AboutSection";
import CalculatorSection from "@/components/CalculatorSection";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <ServicesCards />
      <CtaSection />
      <AboutSection />
      <CalculatorSection />
      <Testimonials />
    </>
  );
}
