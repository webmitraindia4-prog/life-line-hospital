import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Plus, Pencil, Trash2, Eye, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHero } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { createBlog, deleteBlog, getBlogs, getBlogById, slugify, updateBlog, authenticateAdmin, getAdminSession, logoutAdmin, type Blog, type BlogStatus } from "@/lib/blogs";

export const Route = createFileRoute("/admin/blog")({
  component: BlogAdminPage,
});

const emptyForm = {
  title: "",
  featuredImage: "",
  shortDescription: "",
  content: "",
  category: "",
  tags: "",
  seoMetaTitle: "",
  seoMetaDescription: "",
  seoKeywords: "",
  slug: "",
  publishDate: new Date().toISOString().slice(0, 10),
  status: "draft" as BlogStatus,
};

function BlogAdminPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(getAdminSession());
  const [blogs, setBlogs] = useState<Blog[]>(() => getBlogs());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categoryRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!session) {
      return;
    }
    setBlogs(getBlogs());
  }, [session]);

  // Auto-logout on page refresh or navigation away from blog admin page
  useEffect(() => {
    const handleBeforeUnload = () => {
      logoutAdmin();
    };

    const handleRouteChange = () => {
      logoutAdmin();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    // Also clear session when component unmounts (user navigates away)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      logoutAdmin(); // Clear session when leaving the page
    };
  }, []);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    setIsAuthenticating(true);
    const result = authenticateAdmin(email, password);
    setTimeout(() => {
      if (result) {
        setSession(result);
        setBlogs(getBlogs());
        toast.success("Welcome back. Your admin panel is ready.");
      } else {
        toast.error("Invalid credentials. Please use the demo admin login.");
      }
      setIsAuthenticating(false);
    }, 350);
  };

  const handleLogout = () => {
    logoutAdmin();
    setSession(null);
    toast.success("Signed out.");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const title = form.title.trim();
    if (!title) {
      toast.error("Title is required before creating or updating an article.");
      setIsSubmitting(false);
      return;
    }

    const proposedSlug = form.slug.trim() || slugify(title);
    if (!proposedSlug) {
      toast.error("Please provide a valid slug or title for the article.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      title,
      featuredImage: form.featuredImage || "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
      shortDescription: form.shortDescription,
      content: form.content || "<p>Write your article content here.</p>",
      category: form.category,
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      seoMetaTitle: form.seoMetaTitle || title,
      seoMetaDescription: form.seoMetaDescription || form.shortDescription,
      seoKeywords: form.seoKeywords.split(",").map((key) => key.trim()).filter(Boolean),
      slug: proposedSlug,
      publishDate: form.publishDate,
      status: form.status,
    };

    if (editingId) {
      updateBlog(editingId, payload);
      toast.success("Blog updated successfully.");
    } else {
      createBlog(payload);
      toast.success("Blog created successfully.");
    }

    setForm(emptyForm);
    setEditingId(null);
    // Focus the category input so user can immediately type next category
    setTimeout(() => categoryRef.current?.focus(), 50);
    setBlogs(getBlogs());
    setIsSubmitting(false);
  };

  const startEdit = (id: string) => {
    const blog = getBlogById(id);
    if (!blog) return;
    setEditingId(id);
    setForm({
      title: blog.title,
      featuredImage: blog.featuredImage,
      shortDescription: blog.shortDescription,
      content: blog.content,
      category: blog.category,
      tags: blog.tags.join(", "),
      seoMetaTitle: blog.seoMetaTitle,
      seoMetaDescription: blog.seoMetaDescription,
      seoKeywords: blog.seoKeywords.join(", "),
      slug: blog.slug,
      publishDate: blog.publishDate,
      status: blog.status,
    });
  };

  const removeBlog = (id: string) => {
    deleteBlog(id);
    setBlogs(getBlogs());
    toast.success("Blog deleted.");
  };

  const stats = useMemo(() => {
    const published = blogs.filter((blog) => blog.status === "published").length;
    const drafts = blogs.filter((blog) => blog.status === "draft").length;
    return { published, drafts };
  }, [blogs]);

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <PageHero eyebrow="ADMIN ACCESS" title="Secure Blog Management" subtitle="Sign in to add, edit or remove hospital articles and wellness updates." image="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80" variant="shimmer" />
        <section className="mx-auto max-w-5xl px-4 py-16">
          <Card className="mx-auto max-w-xl border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-navy">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={isAuthenticating}>
                  {isAuthenticating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                  Sign in
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHero eyebrow="BLOG ADMIN" title="Blog Dashboard" subtitle="Manage articles, publish updates and keep your content library current." image="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80" variant="shimmer" />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald">CONTROL CENTER</p>
            <h2 className="text-3xl font-bold text-navy">Create and manage content</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" asChild>
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Back to home</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/blogs"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>Sign out</Button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Published articles</p>
              <p className="mt-2 text-3xl font-bold text-navy">{stats.published}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Drafts</p>
              <p className="mt-2 text-3xl font-bold text-navy">{stats.drafts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Admin</p>
              <p className="mt-2 text-lg font-semibold text-navy">{session.name}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-navy">{editingId ? "Edit article" : "New article"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="shortDescription">Short description</Label>
                    <Textarea id="shortDescription" value={form.shortDescription} onChange={(event) => setForm((prev) => ({ ...prev, shortDescription: event.target.value }))} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" rows={8} value={form.content} onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">Featured image</Label>
                    <Input id="featuredImage" value={form.featuredImage} onChange={(event) => setForm((prev) => ({ ...prev, featuredImage: event.target.value }))} placeholder="Image URL or leave blank to upload" />
                    <div className="flex items-center gap-2">
                      <input
                        id="featuredImageFile"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (!file.type.startsWith("image/")) {
                            toast.error("Please upload a valid image file.");
                            return;
                          }
                          const maxSize = 2 * 1024 * 1024; // 2MB
                          if (file.size > maxSize) {
                            toast.error("Image too large. Maximum size is 2MB.");
                            return;
                          }

                          const reader = new FileReader();
                          reader.onload = () => {
                            const dataUrl = reader.result as string;
                            const img = new Image();
                            img.src = dataUrl;
                            img.onload = () => {
                              const maxWidth = 1200;
                              const maxHeight = 800;
                              let { width, height } = img;
                              const ratio = Math.min(1, maxWidth / width, maxHeight / height);
                              const canvas = document.createElement("canvas");
                              canvas.width = Math.round(width * ratio);
                              canvas.height = Math.round(height * ratio);
                              const ctx = canvas.getContext("2d");
                              if (!ctx) {
                                setForm((prev) => ({ ...prev, featuredImage: dataUrl }));
                                return;
                              }
                              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                              const compressed = canvas.toDataURL("image/jpeg", 0.8);
                              setForm((prev) => ({ ...prev, featuredImage: compressed }));
                            };
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="text-sm"
                      />
                      <Button type="button" variant="outline" onClick={() => setForm((prev) => ({ ...prev, featuredImage: "" }))}>
                        Clear
                      </Button>
                    </div>
                    {form.featuredImage && (
                      <img src={form.featuredImage} alt="Preview" className="mt-2 max-h-40 w-auto rounded-md object-cover" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" ref={categoryRef} value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input id="tags" value={form.tags} onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))} placeholder="care, wellness, tips" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} placeholder="article-slug" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoMetaTitle">SEO title</Label>
                    <Input id="seoMetaTitle" value={form.seoMetaTitle} onChange={(event) => setForm((prev) => ({ ...prev, seoMetaTitle: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoMetaDescription">SEO description</Label>
                    <Input id="seoMetaDescription" value={form.seoMetaDescription} onChange={(event) => setForm((prev) => ({ ...prev, seoMetaDescription: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoKeywords">SEO keywords</Label>
                    <Input id="seoKeywords" value={form.seoKeywords} onChange={(event) => setForm((prev) => ({ ...prev, seoKeywords: event.target.value }))} placeholder="health, specialist" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="publishDate">Publish date</Label>
                    <Input id="publishDate" type="date" value={form.publishDate} onChange={(event) => setForm((prev) => ({ ...prev, publishDate: event.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={form.status} onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as BlogStatus }))}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="submit" disabled={isSubmitting || !form.title.trim()}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    {editingId ? "Save changes" : "Create article"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-navy">Article library</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {blogs.map((blog) => (
                <div key={blog.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-4 flex-1">
                      {blog.featuredImage && (
                        <img src={blog.featuredImage} alt={blog.title} className="h-24 w-32 rounded-xl object-cover" />
                      )}
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">{blog.category}</p>
                        <h3 className="mt-1 font-semibold text-navy">{blog.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{blog.shortDescription}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${blog.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-brand"}`}>
                      {blog.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => startEdit(blog.id)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { void navigate({ to: "/blog/$slug", params: { slug: blog.slug } }); }}>
                      <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => removeBlog(blog.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
      <Toaster />
    </div>
  );
}
