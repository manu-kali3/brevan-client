import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import CtaSection from "@/components/CtaSection";
import Tabs from "@/components/Tabs";
import { listSiteImages, type ImageKey } from "@/lib/site-settings";

type MissionImageKey = "service_details_1" | "service_details_2" | "service_details_3";

export const metadata: Metadata = {
  title: "Our Services",
};

export const dynamic = "force-static";
export const revalidate = 300;

const missionTabs: { label: string; imageKey: MissionImageKey }[] = [
  {
    label: "AI & Tech Integration",
    imageKey: "service_details_1",
  },
  {
    label: "Community Digitalization",
    imageKey: "service_details_2",
  },
  {
    label: "Education & Innovation",
    imageKey: "service_details_3",
  },
];

const missionContent: Record<MissionImageKey, { heading: string; body: string; points: string[] }> = {
  service_details_1: {
    heading: "Practical AI automation for schools and enterprises",
    body: "We bring practical AI automation solutions and future-ready skills to schools and local enterprises, helping them work smarter with technology.",
    points: [
      "AI chatbots for customer support",
      "Business process automation",
      "AI tools and skills for your team",
    ],
  },
  service_details_2: {
    heading: "Digital tools for micro-enterprises",
    body: "We promote digital tools for micro-enterprises and bridge the technology gap between rural and urban sectors so every business can compete.",
    points: [
      "Websites for local businesses",
      "Online stores and payments",
      "Real estate listing platforms",
    ],
  },
  service_details_3: {
    heading: "Equipping learners and TVET students",
    body: "We equip learners and TVET students with technical proficiencies through practical training in web design, programming and AI.",
    points: [
      "Digital skills workshops",
      "School and college projects",
      "AI skills bootcamps for youth",
    ],
  },
};

const services: { icon: string; title: string; text: string; imageKey: ImageKey; side: string }[] = [
  {
    icon: "fas fa-laptop-code",
    title: "Website Design",
    text: "We design and develop custom, modern websites that look great and work perfectly on mobile, tablet and desktop. From simple business sites to content-rich platforms, we build websites that help your business grow and reach more customers online.",
    imageKey: "service_1",
    side: "right",
  },
  {
    icon: "fab fa-wordpress",
    title: "WordPress & Joomla",
    text: "We build professional websites on WordPress and Joomla so you can easily manage your own content. We handle themes, plugins, setup, security and maintenance, giving you a powerful and flexible website without the technical stress.",
    imageKey: "service_2",
    side: "left",
  },
  {
    icon: "fas fa-shopping-cart",
    title: "E-Commerce Solutions",
    text: "Launch a secure online store with easy product management, mobile money and card payments, and order tracking. We help Kenyan businesses sell their products online to customers everywhere.",
    imageKey: "service_3",
    side: "right",
  },
  {
    icon: "fas fa-building",
    title: "Real Estate Platforms",
    text: "We build property listing websites and platforms for real estate agents, landlords and developers. Showcase properties, manage listings and connect with serious buyers and tenants online.",
    imageKey: "service_1",
    side: "left",
  },
  {
    icon: "fas fa-palette",
    title: "Graphic Design & Branding",
    text: "Logos, brand identities, posters, flyers, banners and marketing materials that make your business look professional and memorable. A strong brand builds trust and sets you apart from competitors.",
    imageKey: "service_2",
    side: "right",
  },
  {
    icon: "fas fa-robot",
    title: "AI Automation",
    text: "Bring artificial intelligence into your daily operations with chatbots, automated workflows, smart content and data dashboards. We help schools and local enterprises save time, cut costs and stay ahead of the digital curve.",
    imageKey: "service_3",
    side: "left",
  },
];

export default async function OurServicesPage() {
  const images = await listSiteImages();

  return (
    <>
      <PageHeading
        title="Our Services"
        kicker="What We Do"
        subtitle="Web design, WordPress and Joomla, e-commerce, real estate platforms, graphic design and AI automation — all crafted to help your business grow."
        image={images.hero_services}
      />
      <section className="main-services">
        <div className="container">
          <div className="row">
            {services.map((service, i) => (
              <div className="col-lg-12" key={service.title}>
                <div className={`service-item ${i === services.length - 1 ? "last-service" : ""}`}>
                  <div className="row">
                    {service.side === "right" ? (
                      <>
                        <div className="col-lg-6">
                          <div className="left-image">
                            <img src={images[service.imageKey]} alt={service.title} />
                          </div>
                        </div>
                        <div className="col-lg-6 align-self-center">
                          <div className="right-text-content">
                            <i className={service.icon}></i>
                            <h4>{service.title}</h4>
                            <p>{service.text}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-lg-6 align-self-center">
                          <div className="left-text-content">
                            <i className={service.icon}></i>
                            <h4>{service.title}</h4>
                            <p>{service.text}</p>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="right-image">
                            <img src={images[service.imageKey]} alt={service.title} />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
      <section className="service-details">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h6>What Drives Us</h6>
                <h4>Our Mission &amp; Focus</h4>
              </div>
            </div>
            <div className="col-lg-10 offset-lg-1">
              <Tabs
                items={missionTabs.map((tab) => ({
                  label: tab.label,
                  content: (
                    <div>
                      <div className="left-image">
                        <img src={images[tab.imageKey]} alt={tab.label} />
                      </div>
                      <div className="right-content">
                        <h4>{missionContent[tab.imageKey].heading}</h4>
                        <p>{missionContent[tab.imageKey].body}</p>
                        {missionContent[tab.imageKey].points.map((point, idx) => (
                          <span
                            key={point}
                            className={idx === missionContent[tab.imageKey].points.length - 1 ? "last-span" : ""}
                          >
                            - {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  ),
                }))}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
