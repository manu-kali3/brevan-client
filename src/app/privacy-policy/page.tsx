import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import { listSiteImages } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default async function PrivacyPolicyPage() {
  const images = await listSiteImages();

  return (
    <>
      <PageHeading
        title="Privacy Policy"
        kicker="Legal"
        subtitle="How Brevan Softwares collects, uses and protects your personal information."
        image={images.hero_privacy}
      />
      <section className="privacy-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="privacy-content">
                <p>
                  Brevan Softwares (&quot;we&quot;, &quot;us&quot;) is committed to
                  protecting your privacy. This policy explains what personal
                  information we collect through this website and how we use it.
                </p>

                <h4>Information We Collect</h4>
                <p>
                  When you use our contact or quote forms, we collect the details
                  you provide: your name, email address, phone number, subject and
                  your message. We do not collect payment information through this
                  website.
                </p>

                <h4>How We Use Your Information</h4>
                <p>
                  We use the information you provide to respond to your enquiries,
                  prepare quotes, deliver the services you request and keep you
                  informed about your project. We do not sell, rent or share your
                  personal information with third parties for marketing purposes.
                </p>

                <h4>How We Store Your Information</h4>
                <p>
                  Form submissions are stored securely in our database (hosted by
                  Supabase) and delivered to our team by email (via Resend). We
                  keep enquiry records only for as long as needed to serve you.
                </p>

                <h4>Cookies and Tracking</h4>
                <p>
                  This website does not use advertising or tracking cookies.
                  Third-party services we rely on to run the site (such as hosting
                  and web fonts) may set basic, functional cookies required for
                  their operation.
                </p>

                <h4>Third-Party Services</h4>
                <p>
                  We use the following service providers to operate this website:
                  Vercel (hosting), Resend (email delivery), Supabase (database)
                  and Google Fonts (typography). Each provider processes data
                  under its own privacy policy.
                </p>

                <h4>Your Rights</h4>
                <p>
                  You may request access to, correction of, or deletion of the
                  personal information we hold about you at any time by contacting
                  us using the details below.
                </p>

                <h4>Contact Us</h4>
                <p>
                  If you have any questions about this privacy policy, contact us
                  at{" "}
                  <a href="mailto:brevansoftwares@gmail.com">
                    brevansoftwares@gmail.com
                  </a>{" "}
                  or call{" "}
                  <a href="tel:+254117004147">+254 117 004 147</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
