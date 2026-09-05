import Link from "next/link";

export default function NotFound() {
  return (
    <section className="error-page">
      <div className="error-inner">
        <div className="error-code">404</div>
        <h1>Page Not Found</h1>
        <p>
          The page you are looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="error-actions">
          <div className="green-button">
            <Link href="/">Back to Home</Link>
          </div>
          <div className="orange-button">
            <Link href="/contact-us">Contact Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
