interface Service {
  icon: string;
  title: string;
  text: string;
}

const services: Service[] = [
  {
    icon: "fas fa-laptop-code",
    title: "Website Design",
    text: "Custom, modern websites designed and developed to grow your business and serve your customers online.",
  },
  {
    icon: "fab fa-wordpress",
    title: "WordPress",
    text: "Professional WordPress websites, themes and plugins with easy content management and full maintenance support.",
  },
  {
    icon: "fab fa-joomla",
    title: "Joomla",
    text: "Robust Joomla CMS development for content-rich websites, portals and community platforms.",
  },
  {
    icon: "fas fa-shopping-cart",
    title: "E-Commerce",
    text: "Secure online stores and payment integrations so you can sell your products to customers across Kenya.",
  },
  {
    icon: "fas fa-building",
    title: "Real Estate",
    text: "Property listing platforms and websites for real estate agents, landlords and property developers.",
  },
  {
    icon: "fas fa-palette",
    title: "Graphic Design",
    text: "Logos, brand identity and marketing materials that help your business look professional and stand out.",
  },
  {
    icon: "fas fa-robot",
    title: "AI Automation",
    text: "Chatbots, workflow automation and AI tools that save you time, reduce costs and boost productivity.",
  },
  {
    icon: "fas fa-graduation-cap",
    title: "Digital Training",
    text: "Hands-on tech and AI skills for learners, TVET students and business teams ready for the digital economy.",
  },
];

export default function ServicesCards() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="row">
          {services.map((service) => (
            <div className="col-lg-6" key={service.title}>
              <div className="service-item">
                <i className={service.icon}></i>
                <h4>{service.title}</h4>
                <p>{service.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
