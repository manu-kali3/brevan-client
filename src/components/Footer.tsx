import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import type { SiteImages } from "@/lib/site-settings";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/our-services" },
  { label: "About Us", href: "/about-us" },
  { label: "Events", href: "/events" },
  { label: "Projects", href: "/projects" },
  { label: "Contact Us", href: "/contact-us" },
];

const services = [
  "Website Design",
  "WordPress & Joomla",
  "E-Commerce Solutions",
  "Real Estate Platforms",
  "Graphic Design & Branding",
  "AI Automation",
];

const socials = [
  { label: "Facebook", icon: "fab fa-facebook-f" },
  { label: "X (Twitter)", icon: "fab fa-x-twitter" },
  { label: "Instagram", icon: "fab fa-instagram" },
  { label: "LinkedIn", icon: "fab fa-linkedin-in" },
  { label: "WhatsApp", icon: "fab fa-whatsapp" },
];

export default function Footer({ images }: { images: SiteImages }) {
  return (
    <footer className="site-footer">
      <div className="footer-accent" aria-hidden="true" />

      <div className="footer-main">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-12 footer-col">
              <div className="footer-brand">
                <Link href="/" className="footer-logo">
                  <img
                    src={images.logo}
                    alt="Brevan Softwares"
                  />
                  <span className="footer-logo-text">Brevan Softwares</span>
                </Link>
                <p className="footer-about">
                  A Kenyan technology initiative by Emmanuel Kiplangat, bridging
                  the digital divide with AI automation, web design and digital
                  skills for businesses, schools and communities.
                </p>
                <div className="footer-socials" aria-label="Social media">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href="#"
                      className="footer-social"
                      aria-label={social.label}
                      title={social.label}
                    >
                      <i className={social.icon}></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-6 col-6 footer-col">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 col-6 footer-col">
              <h4 className="footer-title">Our Services</h4>
              <ul className="footer-links">
                {services.map((service) => (
                  <li key={service}>
                    <Link href="/our-services">{service}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 col-12 footer-col">
              <h4 className="footer-title">Get In Touch</h4>
              <ul className="footer-contact">
                <li>
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                  <a href="mailto:brevansoftwares@gmail.com">
                    brevansoftwares@gmail.com
                  </a>
                </li>
                <li>
                  <i className="fa fa-phone" aria-hidden="true"></i>
                  <a href="tel:+254117004147">+254 117 004 147</a>
                </li>
                <li>
                  <i className="fa fa-map-marked-alt" aria-hidden="true"></i>
                  <span>Narok, Kenya</span>
                </li>
              </ul>

              <div className="footer-newsletter">
                <label className="footer-newsletter-label" htmlFor="newsletter-email">
                  Stay updated
                </label>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-12">
              <p>
                Copyright © 2026 Brevan Softwares. All Rights Reserved.
              </p>
            </div>
            <div className="col-lg-6 col-12">
              <ul className="footer-legal">
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms</Link>
                </li>
                <li>
                  <Link href="/about-us">About</Link>
                </li>
                <li>
                  <Link href="/contact-us">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
