import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import CtaSection from "@/components/CtaSection";
import { listEvents } from "@/lib/supabase";
import { listSiteImages } from "@/lib/site-settings";
import { safeUrl } from "@/lib/validation";

export const dynamic = "force-static";
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming events, workshops and trainings hosted by Brevan Softwares in Kenya. Digital skills, AI bootcamps and community tech meetups. Book tickets on the Brevan Events portal.",
  alternates: { canonical: "/events" },
};

const PORTAL_URL = "https://events.brevansoftwares.co.ke";

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPrice(event: { is_paid: boolean; ticket_price_kes: number | null }) {
  if (!event.is_paid) return "Free";
  const n = Number(event.ticket_price_kes ?? 0);
  return `KES ${n.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;
}

export default async function EventsPage() {
  const events = await listEvents();
  const images = await listSiteImages();

  return (
    <>
      <PageHeading
        title="Events &amp; Workshops"
        kicker="What's Happening"
        subtitle="Workshops, trainings and community meetups where we teach practical digital skills, AI automation and modern web technologies."
        image={images.hero_events}
      />
      <section className="events-section">
        <div className="container">
          <div className="portal-cta">
            <div>
              <h5>Book tickets on the events portal</h5>
              <p>
                Create an account, reserve your seat and pay securely with M-Pesa,
                then watch online events live.
              </p>
            </div>
            <div className="green-button">
              <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer">
                Open events portal
              </a>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h6>Upcoming</h6>
                <h4>Events &amp; Workshops</h4>
              </div>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="row">
              <div className="col-lg-12">
                <div className="events-empty">
                  <p>No events scheduled right now. Check back soon!</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => {
                const imageUrl = safeUrl(event.image_url);
                return (
                <article className="event-card" key={event.id}>
                  <div className="event-thumb">
                    {imageUrl ? (
                      <img src={imageUrl} alt={event.title} loading="lazy" />
                    ) : (
                      <div className="event-thumb-fallback">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                    )}
                    <span className="event-price-badge">{formatPrice(event)}</span>
                  </div>
                  <div className="event-body">
                    <div className="event-date">
                      <i className="fas fa-calendar-alt"></i> {formatDate(event.event_date)}
                      {event.event_time ? ` at ${event.event_time}` : ""}
                    </div>
                    <h4>
                      <a
                        className="event-title-link"
                        href={`${PORTAL_URL}/events/${event.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {event.title}
                      </a>
                    </h4>
                    {event.venue && (
                      <p className="event-venue">
                        <i className="fas fa-map-marker-alt"></i> {event.venue}
                      </p>
                    )}
                    {event.description && (
                      <p className="event-desc">{event.description}</p>
                    )}
                    <div className="event-actions">
                      <span className="event-format">
                        {event.is_online ? (
                          <>
                            <i className="fas fa-video"></i> Online
                          </>
                        ) : (
                          <>
                            <i className="fas fa-map-marker-alt"></i> In person
                          </>
                        )}
                      </span>
                      <a
                        className="green-button event-book-btn"
                        href={`${PORTAL_URL}/events/${event.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get tickets
                      </a>
                    </div>
                  </div>
                </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <CtaSection />
    </>
  );
}
