import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import ContactForm from "@/components/ContactForm";
import { listSiteImages } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Contact Us",
};

const infoItems = [
  {
    icon: "fa fa-envelope",
    title: "Email Address",
    href: "mailto:brevansoftwares@gmail.com",
    label: "brevansoftwares@gmail.com",
  },
  {
    icon: "fa fa-phone",
    title: "Phone Number",
    href: "tel:+254117004147",
    label: "+254 117 004 147",
  },
  {
    icon: "fa fa-map-marked-alt",
    title: "Location",
    href: "#",
    label: "Narok, Kenya",
  },
];

export default async function ContactUsPage() {
  const images = await listSiteImages();

  return (
    <>
      <PageHeading
        title="Contact Us"
        kicker="Get In Touch"
        subtitle="Tell us about your project — websites, stores, platforms, design or AI automation. We will get back to you with a plan and a quote."
        image={images.hero_contact}
      />
      <section className="map">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div id="map">
                <iframe
                  src="https://maps.google.com/maps?q=Narok%2C%20Kenya&z=10&output=embed"
                  width="100%"
                  height="450px"
                  style={{ border: 0, borderRadius: "5px", position: "relative", zIndex: 2 }}
                  allowFullScreen
                  loading="lazy"
                  title="Brevan Softwares location in Narok, Kenya"
                ></iframe>
              </div>
            </div>
            <div className="col-lg-10 offset-lg-1">
              <div className="row">
                {infoItems.map((item) => (
                  <div className="col-lg-4" key={item.title}>
                    <div className="info-item">
                      <i className={item.icon}></i>
                      <h4>{item.title}</h4>
                      <a href={item.href}>{item.label}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="contact-us-form">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h6>Contact Us</h6>
                <h4>Feel free to message us</h4>
              </div>
            </div>
            <div className="col-lg-10 offset-lg-1">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
