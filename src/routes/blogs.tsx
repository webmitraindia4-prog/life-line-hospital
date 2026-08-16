
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site-chrome";
import bannerServices from "@/assets/banner-services.jpg";
import { ArrowRight, PenSquare } from "lucide-react";
import { getPublishedBlogs, hydrateBlogs } from "@/lib/blogs";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/blogs")({
  head: () => ({
    meta: [
      { title: "Blogs — Lifeline Hospital" },
      { name: "description", content: "Read health articles, patient guides and wellness insights from Lifeline Hospital." },
    ],
  }),
  component: BlogsPage,
});

function BlogsPage() {
  const [blogs, setBlogs] = useState(() => getPublishedBlogs());

  useEffect(() => {
    hydrateBlogs();
    setBlogs(getPublishedBlogs());
  }, []);

  return (
    <>
      <PageHero
        eyebrow="BLOGS"
        title="Health Insights & Hospital Updates"
        subtitle="Explore practical articles on wellness, specialist consultations and patient care tips."
        image={bannerServices}
        variant="shimmer"
      />

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-brand">LATEST ARTICLES</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy leading-tight">Browse our latest blog posts</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-[1.75]">
              Discover tailored advice for patients and families looking for helpful information before their next visit.
            </p>
          </div>
          <Link
  to="/admin/blog"
  className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow hover:translate-y-[-2px] transition-transform"
>
  <PenSquare className="h-4 w-4" />
  Add Blog
</Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((blog, index) => (
            <article
              key={blog.id}
              className="overflow-hidden rounded-3xl border border-border bg-white shadow-soft animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {blog.featuredImage && (
                <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-3xl">
                  <img src={blog.featuredImage} alt={blog.title} className="h-56 w-full object-cover" />
                </div>
              )
              }
              <div className="p-6">
                <div className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-brand">
                  {blog.category}
                </div>
                <h3 className="mt-4 text-xl font-bold text-navy">{blog.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{blog.shortDescription}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: blog.slug }}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-emerald transition-colors hover:text-brand"
                >
                  Read More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
