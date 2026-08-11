import imgOphthalmology from "@/assets/service-ophthalmology.jpg";
import imgPediatrics from "@/assets/service-pediatrics.jpg";
import imgCardiology from "@/assets/service-cardiology.jpg";

export type BlogStatus = "draft" | "published";

export interface Blog {
  id: string;
  title: string;
  featuredImage: string;
  shortDescription: string;
  content: string;
  category: string;
  tags: string[];
  seoMetaTitle: string;
  seoMetaDescription: string;
  seoKeywords: string[];
  slug: string;
  publishDate: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminSession {
  email: string;
  name: string;
}

const BLOG_STORAGE_KEY = "lifeline-blogs-v1";
const ADMIN_SESSION_KEY = "lifeline-admin-session-v1";
const FALLBACK_ADMIN_EMAIL = "admin@lifelinehospital.in";
const FALLBACK_ADMIN_PASSWORD = "Lifeline@2026";

let blogCache: Blog[] | null = null;

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getSeedBlogs(): Blog[] {
  return [
    {
      id: "seed-1",
      title: "When to book a specialist consultation",
      featuredImage: imgOphthalmology,
      shortDescription: "A practical guide to understanding symptoms that may require early specialist care.",
      content: "<p>Many patients wait too long before seeking a specialist consultation, especially when symptoms are mild at first. Early review can shorten the journey to diagnosis and treatment.</p><p>Keep a record of your symptoms, note how often they occur and share any family history with your clinician.</p>",
      category: "Health Tips",
      tags: ["consultation", "specialist", "care"],
      seoMetaTitle: "When to Book a Specialist Consultation",
      seoMetaDescription: "Learn when early specialist consultation can make a difference for your health.",
      seoKeywords: ["specialist consultation", "health tips"],
      slug: "when-to-book-a-specialist-consultation",
      publishDate: "2026-07-20",
      status: "published",
      createdAt: "2026-07-20T10:00:00.000Z",
      updatedAt: "2026-07-20T10:00:00.000Z",
    },
    {
      id: "seed-2",
      title: "Why preventive health checks matter",
      featuredImage: imgPediatrics,
      shortDescription: "Regular screening and check-ups can help detect health issues before they become serious.",
      content: "<p>Preventive care is one of the most effective ways to protect your health over time.</p><p>Routine tests and check-ups help identify possible issues before symptoms become severe.</p>",
      category: "Wellness",
      tags: ["wellness", "prevention"],
      seoMetaTitle: "Why Preventive Health Checks Matter",
      seoMetaDescription: "Discover the benefits of routine health checks and screenings.",
      seoKeywords: ["preventive healthcare", "regular checkups"],
      slug: "why-preventive-health-checks-matter",
      publishDate: "2026-07-18",
      status: "published",
      createdAt: "2026-07-18T10:00:00.000Z",
      updatedAt: "2026-07-18T10:00:00.000Z",
    },
    {
      id: "seed-3",
      title: "Preparing for your first hospital visit",
      featuredImage: imgCardiology,
      shortDescription: "A simple checklist to help you arrive prepared and confident for your first consultation.",
      content: "<p>Your first visit to a hospital can feel overwhelming, but a little preparation makes a big difference.</p><p>Bring your ID, medical reports, a list of medicines and any questions you have for the consultant.</p>",
      category: "Patient Guide",
      tags: ["hospital visit", "patient guide"],
      seoMetaTitle: "Preparing for Your First Hospital Visit",
      seoMetaDescription: "Make your first hospital visit easier with this practical checklist.",
      seoKeywords: ["first hospital visit", "patient guide"],
      slug: "preparing-for-your-first-hospital-visit",
      publishDate: "2026-07-15",
      status: "published",
      createdAt: "2026-07-15T11:00:00.000Z",
      updatedAt: "2026-07-15T11:00:00.000Z",
    },
  ];
}

export function hydrateBlogs() {
  if (typeof window === "undefined") {
    if (!blogCache) {
      const seeded = getSeedBlogs();
      blogCache = seeded;
    }
    return blogCache;
  }

  const stored = readStorage<Blog[]>(BLOG_STORAGE_KEY, []);
  if (stored.length > 0) {
    // Sanitize stored blogs: ensure each has a non-empty, unique slug
    const seen = new Set<string>();
    const sanitized = stored.map((b, idx) => {
      const base = (b.slug || slugify(b.title) || `post-${Date.now()}-${idx}`).trim();
      let slug = base;
      let counter = 1;
      while (seen.has(slug) || !slug) {
        slug = `${base}-${counter++}`;
      }
      seen.add(slug);
      return { ...b, slug } as Blog;
    });
    blogCache = sanitized;
  } else if (!blogCache) {
    const seeded = getSeedBlogs();
    blogCache = seeded;
    writeStorage(BLOG_STORAGE_KEY, seeded);
  }

  return blogCache;
}

export function getBlogs(): Blog[] {
  if (blogCache) return blogCache;
  return hydrateBlogs();
}

export function saveBlogs(blogs: Blog[]) {
  blogCache = blogs;
  writeStorage(BLOG_STORAGE_KEY, blogs);
}

export function getPublishedBlogs() {
  return getBlogs().filter((blog) => blog.status === "published");
}

export function getBlogBySlug(slug: string) {
  return getPublishedBlogs().find((blog) => blog.slug === slug) ?? null;
}

export function getBlogById(id: string) {
  return getBlogs().find((blog) => blog.id === id) ?? null;
}

export function createBlog(input: Omit<Blog, "id" | "createdAt" | "updatedAt">): Blog {
  const blogs = getBlogs();
  const blog: Blog = {
    ...input,
    id: `blog-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  // Ensure slug is present and unique
  const baseSlug = blog.slug?.trim() || slugify(blog.title) || `post-${Date.now()}`;
  let slug = baseSlug;
  let counter = 1;
  while (blogs.find((b) => b.slug === slug)) {
    slug = `${baseSlug}-${counter++}`;
  }
  blog.slug = slug;
  const next = [blog, ...blogs];
  saveBlogs(next);
  return blog;
}

export function updateBlog(id: string, updates: Partial<Blog>) {
  const blogs = getBlogs();
  const next = blogs.map((blog) => {
    if (blog.id !== id) return blog;
    const merged = { ...blog, ...updates, updatedAt: new Date().toISOString() } as Blog;
    // Ensure slug is present and unique after update
    const baseSlug = merged.slug?.trim() || slugify(merged.title) || `post-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;
    while (blogs.find((b) => b.slug === slug && b.id !== id)) {
      slug = `${baseSlug}-${counter++}`;
    }
    merged.slug = slug;
    return merged;
  });
  saveBlogs(next);
  return next.find((blog) => blog.id === id) ?? null;
}

export function deleteBlog(id: string) {
  const blogs = getBlogs();
  const next = blogs.filter((blog) => blog.id !== id);
  saveBlogs(next);
  return next;
}

export function authenticateAdmin(email: string, password: string) {
  if (email.trim().toLowerCase() === FALLBACK_ADMIN_EMAIL && password === FALLBACK_ADMIN_PASSWORD) {
    const session: AdminSession = { email: FALLBACK_ADMIN_EMAIL, name: "Administrator" };
    writeStorage(ADMIN_SESSION_KEY, session);
    return session;
  }
  return null;
}

export function getAdminSession() {
  return readStorage<AdminSession | null>(ADMIN_SESSION_KEY, null);
}

export function isAdminAuthenticated() {
  return Boolean(getAdminSession());
}

export function logoutAdmin() {
  writeStorage(ADMIN_SESSION_KEY, null);
}
