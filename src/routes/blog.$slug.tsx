import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/site-chrome";
import { getBlogBySlug, hydrateBlogs } from "@/lib/blogs";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const blog = getBlogBySlug(params.slug);
    return {
      meta: [
        { title: blog ? `${blog.title} — Lifeline Hospital` : "Blog — Lifeline Hospital" },
        { name: "description", content: blog?.shortDescription ?? "Read latest insights from Lifeline Hospital." },
      ],
    };
  },
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { slug } = Route.useParams();
  const [blog, setBlog] = useState(() => getBlogBySlug(slug));

  useEffect(() => {
    hydrateBlogs();
    setBlog(getBlogBySlug(slug));
  }, [slug]);

  if (!blog) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-navy">Article not found</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          The article you are looking for is not available right now. Please browse our latest updates instead.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/blogs" className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-sm font-semibold text-navy shadow-sm transition hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 font-semibold text-white">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="BLOG"
        title={blog.title}
        subtitle={blog.shortDescription}
        image={blog.featuredImage}
        variant="shimmer"
      />

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 flex flex-col gap-3">
          <Link to="/blogs" className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-sm font-semibold text-navy shadow-sm transition hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {blog.category}
            </span>
            <span className="text-sm text-muted-foreground">Published on {blog.publishDate}</span>
          </div>
        </div>

        <div className="prose prose-slate max-w-none rounded-3xl border border-border bg-white p-8 shadow-soft">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {blog.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
