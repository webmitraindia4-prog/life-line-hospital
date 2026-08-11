import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Phone, MapPin, Facebook, Instagram, MessageCircle, Mail, Calendar, Activity } from "lucide-react";
import logoUrl from "@/assets/lifeline-logo.jpeg";

const NAV = [
  { to: "/", label: "HOME" },
  { to: "/about", label: "ABOUT US" },
  { to: "/services", label: "SERVICES" },
  { to: "/doctors", label: "DOCTORS" },
  { to: "/blogs", label: "BLOGS" },
  { to: "/media", label: "MEDIA" },
  { to: "/contact", label: "CONTACT US" },
] as const;

export function TopBar() {
  // return (
    // <div className="bg-navy-gradient text-white/90 text-xs">
    //   <div className="mx-auto max-w-7xl px-4 h-10 flex items-center justify-between gap-4">
    //     <div className="flex items-center gap-2 truncate">
    //       <MapPin className="h-3.5 w-3.5 text-brand shrink-0" />
    //       <span className="truncate">Near Railway Station Circle, NH-167, IB Road, Raichur</span>
    //     </div>
    //     <div className="hidden md:flex items-center gap-5">
    //       <a href="tel:8951380222" className="flex items-center gap-1.5 hover:text-white transition-colors">
    //         <Phone className="h-3.5 w-3.5 text-brand" /> 8951380222, 7411620595
    //       </a>
    //       <div className="flex items-center gap-3">
    //         <a href="#" aria-label="Facebook" className="hover:text-brand transition-colors"><Facebook className="h-3.5 w-3.5" /></a>
    //         <a href="#" aria-label="Instagram" className="hover:text-brand transition-colors"><Instagram className="h-3.5 w-3.5" /></a>
    //         <a href="#" aria-label="WhatsApp" className="hover:text-brand transition-colors"><MessageCircle className="h-3.5 w-3.5" /></a>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  // );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <TopBar />
      <header
        className={`sticky top-0 z-40 backdrop-blur-md transition-all ${
          scrolled ? "bg-white/90 shadow-card" : "bg-white/70"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 h-20 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center group" aria-label="Lifeline Super Speciality Hospital">
            <img
              src={logoUrl}
              alt="Lifeline Super Speciality Hospital"
              className="h-16 sm:h-20 w-auto object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-navy">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="link-underline transition-colors hover:text-brand"
                activeProps={{ className: "text-brand" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:translate-y-[-2px] transition-transform"
            >
              <Calendar className="h-4 w-4" /> Book Appointment
            </Link>
            <button
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-navy"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-white animate-fade-in">
            <nav className="px-4 py-4 flex flex-col gap-1 text-sm font-semibold text-navy">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors"
                  activeProps={{ className: "bg-secondary text-brand" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy-gradient text-white/85">
      {/* Background ECG */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 800 200" className="h-full w-full">
          <path
            d="M0 100 L120 100 L140 60 L160 140 L180 40 L200 100 L800 100"
            stroke="white"
            strokeWidth="2"
            fill="none"
            className="animate-ecg"
          />
        </svg>
      </div>

     <div className="relative mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1.2fr] gap-x-2 gap-y-6 px-4 py-7">

        {/* Logo */}
        <div>

          {/* Heart ECG */}
          <div className="mb-3 flex items-center">
            <span className="text-red-500 text-xl animate-pulse">❤️</span>

            <svg
              width="120"
              height="20"
              viewBox="0 0 120 20"
              fill="none"
              className="ml-2"
            >
              <path
                d="M0 10 H25 L35 10 L42 3 L50 17 L58 10 H120"
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                className="animate-ecg"
              />
            </svg>
          </div>

          <div className="mb-3 inline-flex rounded-xl bg-white p-2 shadow-glow">
            <img
              src={logoUrl}
              alt="Lifeline Super Speciality Hospital"
              className="h-12 w-auto object-contain"
            />
          </div>

          <p className="text-sm leading-6 text-white/80">
            Compassionate care today for a healthier tomorrow.
            Healthcare at your fingertips.
          </p>

          <div className="mt-4 flex gap-2">
            {[Facebook, Instagram, MessageCircle, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:bg-brand hover:scale-110"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-2 text-sm font-bold tracking-widest text-white">
            QUICK LINKS
          </h4>

          <ul className="space-y-1.5 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="transition-all duration-300 hover:text-brand hover:translate-x-1 inline-block"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Specialities */}
        <div>
          <h4 className="mb-2 text-sm font-bold tracking-widest text-white">
            SPECIALITIES
          </h4>

          <ul className="space-y-1.5 text-sm">
            {[
              "Pediatrics",
              "Ophthalmology",
              "Surgery",
              "Cardiology",
              "General Physician",
              "Neurology",
              "Orthopaedic",
            ].map((s) => (
              <li key={s}>
                <Link
                  to="/services"
                  className="transition-all duration-300 hover:text-brand hover:translate-x-1 inline-block"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-2 text-sm font-bold tracking-widest text-white">
            CONTACT INFO
          </h4>

          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand" />
              <span>
                Near Railway Station Circle,
                NH-167, IB Road,
                Raichur.
              </span>
            </li>

            <li className="flex gap-2">
              <Phone className="mt-1 h-4 w-4 shrink-0 text-brand" />
              <span>8951380222, 7411620595</span>
            </li>

            <li className="flex gap-2">
              <Mail className="mt-1 h-4 w-4 shrink-0 text-brand" />
              <span>info@lifelinehospital.in</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-3 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Lifeline Super Speciality Hospital. All rights reserved.
      </div>
    </footer>
  );
}
export type PageHeroVariant = "kenburns" | "parallax" | "shimmer" | "scanlines" | "spotlight" | "slide";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  variant = "kenburns",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  image?: string;
  variant?: PageHeroVariant;
}) {
  // Image motion per variant
  const imageAnim: Record<PageHeroVariant, string> = {
    kenburns: "banner-ken-burns",
    parallax: "banner-parallax",
    shimmer: "banner-tilt",
    scanlines: "banner-pan",
    spotlight: "banner-ken-burns",
    slide: "banner-slide",
  };

  // Tinted gradient per variant so each banner reads differently
  const gradient: Record<PageHeroVariant, string> = {
    kenburns: "bg-gradient-to-br from-navy/90 via-navy/70 to-navy/50",
    parallax: "bg-gradient-to-b from-navy/85 via-navy/55 to-navy/85",
    shimmer: "bg-gradient-to-tr from-navy/90 via-navy/60 to-brand/40",
    scanlines: "bg-gradient-to-br from-navy/95 via-navy/70 to-emerald/40",
    spotlight: "bg-gradient-to-b from-navy/70 via-navy/50 to-navy/95",
    slide: "bg-gradient-to-r from-navy/90 via-navy/60 to-navy/30",
  };

  return (
    <section className="relative text-white overflow-hidden bg-navy min-h-[40vh] md:min-h-[55vh]">
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover object-center ${imageAnim[variant]}`}
        />
      )}
      <div className={`absolute inset-0 ${gradient[variant]}`} aria-hidden="true" />

      {/* Effect overlays */}
      {variant === "shimmer" && <div className="overlay-shimmer" aria-hidden="true" />}
      {variant === "scanlines" && <div className="overlay-scanlines" aria-hidden="true" />}
      {variant === "spotlight" && <div className="overlay-spotlight" aria-hidden="true" />}
      {variant === "parallax" && (
        <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-screen" aria-hidden="true">
          <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-brand blur-3xl animate-float-slow" />
          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-emerald blur-3xl animate-float" />
        </div>
      )}
      {variant === "kenburns" && (
        <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-screen" aria-hidden="true">
          <div className="absolute top-1/3 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand blur-3xl animate-float-slow" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs font-semibold tracking-widest animate-fade-in">
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" /> {eyebrow}
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight animate-fade-up drop-shadow-lg">{title}</h1>
        <p className="mt-3 max-w-2xl mx-auto text-white/85 animate-fade-up drop-shadow" style={{ animationDelay: "0.15s" }}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}
