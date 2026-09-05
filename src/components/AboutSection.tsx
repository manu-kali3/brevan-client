import Link from "next/link";
import Tabs from "@/components/Tabs";

const tabContent = [
  {
    label: "AI & Automation",
    content: (
      <p>
        From customer support chatbots and workflow automation to AI content
        assistants and data reporting dashboards, we build intelligent tools
        that save you time, cut costs and keep your business running around the
        clock.
      </p>
    ),
  },
  {
    label: "Web & Design",
    content: (
      <p>
        Custom business websites, e-commerce stores, WordPress and Joomla
        platforms, and complete brand identities designed to make your business
        look professional and serve your customers online.
      </p>
    ),
  },
  {
    label: "Community & Education",
    content: (
      <p>
        Digital literacy workshops, school websites and AI skills bootcamps that
        equip TVET students, youth groups and local traders with the tools of
        the digital economy.
      </p>
    ),
  },
];

export default function AboutSection() {
  return (
    <section className="about-us" id="about">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="section-heading">
              <h6>About Us</h6>
              <h4>Know Us Better</h4>
            </div>
          </div>
          <div className="col-lg-8">
            <Tabs items={tabContent} />
          </div>
          <div className="col-lg-4">
            <div className="right-content">
              <h4>Please tell us about your idea and how you want it to be</h4>
              <p>
                Brevan Softwares was founded by Emmanuel Kiplangat, an AI
                automation engineer and computer science student, to upscale
                artificial intelligence and digitize local small businesses
                across Kenya.
                <br />
                <br />
                From websites and online stores to AI tools and digital skills,
                we turn your ideas into working solutions. Tell us about your
                project today.
              </p>
              <div className="green-button">
                <Link href="/about-us">Discover More</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
