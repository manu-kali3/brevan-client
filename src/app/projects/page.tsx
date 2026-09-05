import type { Metadata } from "next";
import PageHeading from "@/components/PageHeading";
import CtaSection from "@/components/CtaSection";
import { listProjects } from "@/lib/supabase";
import { listSiteImages } from "@/lib/site-settings";
import { safeUrl } from "@/lib/validation";

export const dynamic = "force-static";
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects and case studies delivered by Brevan Softwares in Kenya. Web development, AI automation, digital tools and community solutions.",
};

export default async function ProjectsPage() {
  const projects = await listProjects();
  const images = await listSiteImages();

  return (
    <>
      <PageHeading
        title="Our Projects"
        kicker="Portfolio"
        subtitle="Websites, e-commerce stores, real estate platforms and AI tools we have built for businesses, schools and communities across Kenya."
        image={images.hero_projects}
      />
      <section className="projects-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="section-heading">
                <h6>Our Work</h6>
                <h4>Projects We&apos;ve Built</h4>
              </div>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="row">
              <div className="col-lg-12">
                <div className="projects-empty">
                  <p>Our project portfolio is being updated. Check back soon!</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => {
                const imageUrl = safeUrl(project.image_url);
                const projectUrl = safeUrl(project.project_url);
                return (
                <article className="project-card" key={project.id}>
                  <div className="project-thumb">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={project.title} />
                    ) : (
                      <div className="project-thumb-fallback">
                        <i className="fas fa-laptop-code"></i>
                      </div>
                    )}
                  </div>
                  <div className="project-body">
                    {project.category && (
                      <span className="project-category">{project.category}</span>
                    )}
                    <h4>{project.title}</h4>
                    {project.description && (
                      <p className="project-desc">{project.description}</p>
                    )}
                    {projectUrl && (
                      <a
                        className="project-link"
                        href={projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project <i className="fas fa-arrow-right"></i>
                      </a>
                    )}
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
