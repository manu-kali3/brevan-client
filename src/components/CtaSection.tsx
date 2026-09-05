import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="simple-cta">
      <div className="container">
        <div className="row">
          <div className="col-lg-5">
            <h4>
              AI <em>Automation</em> &amp; <strong>Digital</strong>{" "}
              Transformation for Your Business
            </h4>
          </div>
          <div className="col-lg-7">
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
    </section>
  );
}
