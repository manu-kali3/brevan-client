"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteImages } from "@/components/SiteImagesProvider";

export default function Header() {
  const pathname = usePathname();
  const images = useSiteImages();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleHashClick = (href: string) => (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
    }
  };

  const servicesHref = isHome ? "#services" : "/our-services";
  const aboutHref = isHome ? "#about" : "/about-us";
  const testimonialsHref = isHome ? "#testimonials" : "/";

  const navLinkClass = (active: boolean) => (active ? "active" : "");

  return (
    <header
      className={`header-area header-sticky ${scrolled ? "background-header" : ""}`}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <nav className="main-nav">
              <Link href="/" className="logo" onClick={closeMenu}>
                <img src={images.logo} alt="Brevan Softwares" />
                <span className="logo-text">Brevan Softwares</span>
              </Link>

              <ul className="nav" style={{ display: menuOpen ? "block" : "none" }}>
                <li className="scroll-to-section">
                  <Link
                    href="/"
                    className={navLinkClass(pathname === "/")}
                    onClick={closeMenu}
                  >
                    Home
                  </Link>
                </li>
                <li className="scroll-to-section">
                  <Link
                    href={servicesHref}
                    className={navLinkClass(false)}
                    onClick={handleHashClick(servicesHref)}
                  >
                    Services
                  </Link>
                </li>
                <li className="scroll-to-section">
                  <Link
                    href={aboutHref}
                    className={navLinkClass(false)}
                    onClick={handleHashClick(aboutHref)}
                  >
                    About
                  </Link>
                </li>
                <li className="has-sub">
                  <button type="button" className="pages-btn">Pages</button>
                  <ul className="sub-menu">
                    <li>
                      <Link href="/about-us" onClick={closeMenu}>
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/our-services" onClick={closeMenu}>
                        Our Services
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact-us" onClick={closeMenu}>
                        Contact Us
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="scroll-to-section">
                  <Link
                    href={testimonialsHref}
                    className={navLinkClass(false)}
                    onClick={handleHashClick(testimonialsHref)}
                  >
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className={navLinkClass(pathname === "/events")}
                    onClick={closeMenu}
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className={navLinkClass(pathname === "/projects")}
                    onClick={closeMenu}
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" onClick={closeMenu}>
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/bookings" className={navLinkClass(pathname === "/bookings")} onClick={closeMenu}>Dashboard</Link>
                </li>
                <li>
                  <Link href="/login" className={navLinkClass(pathname === "/login")} onClick={closeMenu}>Sign in</Link>
                </li>
              </ul>

              <a
                className={`menu-trigger ${menuOpen ? "active" : ""}`}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span>Menu</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
