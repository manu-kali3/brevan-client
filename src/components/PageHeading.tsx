export default function PageHeading({
  title,
  kicker,
  subtitle,
  image,
  crumb,
}: {
  title: string;
  kicker?: string;
  subtitle?: string;
  image: string;
  crumb?: string;
}) {
  return (
    <section
      className="page-hero"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="page-hero-overlay"></div>
      <div className="container">
        <div className="row">
          <div className="col-lg-10 offset-lg-1">
            <div className="page-hero-content">
              {kicker && <span className="page-hero-kicker">{kicker}</span>}
              <h1>{title}</h1>
              <div className="page-hero-line"></div>
              {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
              <nav className="page-hero-breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a>
                <span className="page-hero-crumb-sep">/</span>
                <span className="page-hero-current">{crumb ?? title}</span>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
