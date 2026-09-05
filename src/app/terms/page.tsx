import type { Metadata } from "next";
import Link from "next/link";
import PageHeading from "@/components/PageHeading";
import { listSiteImages } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of using Brevan Softwares — services, bookings, payments, refunds and your responsibilities.",
};

export default async function TermsPage() {
  const images = await listSiteImages();
  return (
    <>
      <PageHeading title="Terms of Service" kicker="Legal" subtitle="The rules that apply when you use our website and services." image={images.hero_privacy} />
      <section className="privacy-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="privacy-content">
                <p style={{ color: "#7a7a7a", fontSize: 13 }}>Last updated: {new Date().toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}</p>
                <h4>1. Using this website</h4>
                <p>By accessing Brevan Softwares you agree to these terms. You must create an account to request services and track bookings. You are responsible for keeping your login details secure and for everything that happens on your account.</p>
                <h4>2. Service bookings</h4>
                <p>A service booking reserves our time for the service you select (web design, AI automation, etc). Bookings start as pending and move through in-progress, review and completed. You can request cancellation while pending; once work has started refunds are at our discretion.</p>
                <h4>3. Payments</h4>
                <ul>
                  <li>Prices are quoted in Kenyan Shillings unless stated otherwise.</li>
                  <li>Where a deposit is required, work begins after the deposit is confirmed.</li>
                  <li>Keep your M-PESA confirmation code and payment reference for any payment queries.</li>
                  <li>A booking is only confirmed as paid once we receive confirmation from the payment provider.</li>
                </ul>
                <h4>4. Refunds &amp; cancellations</h4>
                <p>You can cancel a pending booking at any time. Paid work already started is non-refundable except where required by law or explicitly agreed. If we cancel a service we will contact you about refunds.</p>
                <h4>5. Your responsibilities</h4>
                <p>Provide accurate requirements, content and access needed to deliver the service. Delays caused by missing content or approvals may affect timelines.</p>
                <h4>6. Comments &amp; communication</h4>
                <p>The comments thread on each booking is the primary place to discuss the service. Keep communication respectful. We may remove abusive content.</p>
                <h4>7. Our responsibility</h4>
                <p>We provide services with reasonable care. To the fullest extent permitted by law we are not liable for indirect losses or for issues caused by third-party services, internet connectivity or M-PESA.</p>
                <h4>8. Changes</h4>
                <p>We may update these terms. The version on this page applies to new bookings. Significant changes will be announced here.</p>
                <h4>9. Contact</h4>
                <p>Questions about these terms: <a href="mailto:brevansoftwares@gmail.com">brevansoftwares@gmail.com</a>. Governed by the laws of Kenya.</p>
                <p style={{ marginTop: 28 }}><Link href="/">← Back to home</Link> · <Link href="/privacy-policy">Privacy Policy</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
