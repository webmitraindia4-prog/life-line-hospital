import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Baby, Eye, Scissors, HeartPulse, Stethoscope, Brain, Bone, Droplet,
  ShieldCheck, Sparkles, Clock, Phone, ArrowRight, CalendarCheck,
  Video, FileText, PackageCheck, Siren, Award,
} from "lucide-react";
import homeBanner from "@/assets/home-banner.jpg";
import bannerChildcare from "@/assets/banner-childcare.jpg";
import bannerEyecare from "@/assets/banner-eyecare.jpg";
import bannerSurgery from "@/assets/banner-surgery.jpg";
import bannerHeartcare from "@/assets/banner-heartcare.jpg";
import heartImg from "@/assets/heart.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lifeline Super Speciality Hospital — Expert Care in Raichur" },
      { name: "description", content: "World-class healthcare in Raichur with expert doctors, advanced technology, compassionate care and 24/7 emergency services across 8+ specialties." },
      { property: "og:title", content: "Lifeline Super Speciality Hospital — Expert Care in Raichur" },
      { property: "og:description", content: "Expert care. Advanced treatment. Healthier tomorrow." },
    ],
  }),
  component: Home,
});

const SPECIALTIES = [
  { icon: Baby, name: "Pediatrics", desc: "Complete healthcare for newborns, children and adolescents." },
  { icon: Eye, name: "Ophthalmology", desc: "Advanced eye care solutions for clear and healthy vision." },
  { icon: Scissors, name: "Surgery", desc: "Safe and advanced surgical procedures with expert care." },
  { icon: HeartPulse, name: "Cardiology", desc: "Comprehensive care for heart conditions and prevention." },
  { icon: Stethoscope, name: "General Physician", desc: "Expert consultation for general health and wellness." },
  { icon: Brain, name: "Neurology", desc: "Diagnosis and treatment for brain, spine and nerve disorders." },
  { icon: Bone, name: "Orthopaedic", desc: "Advanced care for bones, joints and musculoskeletal issues." },
  { icon: Droplet, name: "Nephrology", desc: "Specialized care for kidney health and renal disorders." },
];

function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          setValue(Math.floor(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [target, duration]);
  return { ref, value };
}

function Stat({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold text-navy animate-count-glow">
        {value.toLocaleString()}<span className="text-brand">{suffix}</span>
      </div>
      <div className="mt-1 text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.15 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(1.75rem)",
        transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Home() {
  return (
    <>
      {/* ===== HERO BANNER ===== */}
      <section className="relative w-full bg-secondary overflow-hidden">
        <img
          src={homeBanner}
          alt="Lifeline Super Speciality Hospital - Comprehensive care for every stage of life"
          width={1920}
          height={1080}
          className="block w-full max-w-none h-auto object-contain object-center"
        />
      </section>

      {/* ===== WELCOME INTRO ===== */}
      <section className="mx-auto max-w-7xl px-8 pt-8 ">
        <Reveal>
          <div className="text-xs font-bold tracking-[0.3em] text-brand">— WELCOME TO LIFELINE —</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-navy leading-tight">
            Expert Care. Advanced Treatment. Healthier Tomorrow.
          </h2>
          <p className="mt-5 text-[15px] md:text-base text-muted-foreground leading-[1.75]">
            Lifeline Super Speciality Hospital is a trusted multi-specialty healthcare destination in Raichur,
            proudly serving families across North Karnataka. From routine consultations to complex super-specialty
            procedures, our experienced doctors, skilled nurses and modern infrastructure work together to deliver
            world-class treatment close to home — guided by one simple principle: the patient always comes first.
          </p>
          <p className="mt-4 text-[15px] md:text-base text-muted-foreground leading-[1.75]">
            With 20+ specialty and super-specialty departments, a 24/7 emergency unit, advanced ICUs, modular OTs and
            a dedicated diagnostic wing, Lifeline brings advanced healthcare within easy reach — combining clinical
            excellence with warmth, dignity and personalised attention.
          </p>
        </Reveal>
      </section>

      {/* ===== SPECIALTIES ===== */}
      <section className="mx-auto max-w-7xl px-4 pt-10 pb-16">
        <Reveal>
          <div className="text-center">
            <div className="text-xs font-bold tracking-[0.3em] text-brand">— OUR SPECIALTIES —</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-navy">Comprehensive Care For Every Need</h2>
            <p className="mt-3 text-muted-foreground">Advanced medical care across a wide range of specialties.</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIALTIES.map(({ icon: Icon, name, desc }, i) => (
            <Reveal key={name} delay={i * 60}>
              <div className="group card-lift h-full bg-white rounded-2xl p-6 border border-border text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-navy flex items-center justify-center icon-pop mb-4">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-navy">{name}</h3>
                <p className="mt-2 text-sm text-muted-foreground min-h-[3.5rem]">{desc}</p>
                <Link to="/services" className="mt-4 inline-flex items-center gap-1 text-xs font-bold tracking-widest text-emerald hover:gap-2 transition-all">
                  KNOW MORE <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== SPECIALIZED SERVICES ===== */}
      <section className="relative bg-navy-gradient text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-brand blur-3xl animate-float" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 grid gap-10 lg:grid-cols-[1fr_2fr] items-center">
          <Reveal>
            <div className="text-xs font-bold tracking-[0.3em] text-emerald">SPECIALIZED CARE. BETTER OUTCOMES.</div>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">Specialized Services<br />For Better Living</h2>
            <p className="mt-4 text-white/75 max-w-md">Our specialized services are designed to provide accurate diagnosis, advanced treatment and long-term care for a healthier tomorrow.</p>
            <Link to="/services" className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition">
              LEARN MORE <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Child Care", sub: "Gentle care for healthy children", image: bannerChildcare },
              { title: "Advanced Eye Care", sub: "Precision care for better vision", image: bannerEyecare },
              { title: "Advanced Surgery", sub: "Expert surgeons, better recovery", image: bannerSurgery },
              { title: "Heart & Vascular", sub: "Advanced care for a healthy heart", image: bannerHeartcare },
            ].map(({ title, sub, image }, i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="group relative rounded-2xl overflow-hidden bg-white text-navy card-lift h-full">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={image}
                      alt={title}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <div className="font-bold text-sm">{title}</div>
                    <div className="text-xs text-muted-foreground mt-1">{sub}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal>
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-[0.3em] text-brand">— WHY CHOOSE US —</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-navy">Trusted Care. Advanced Treatment.</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat target={25} suffix="+" label="Expert Doctors" />
          <Stat target={100} suffix="+" label="Hospital Beds" />
          <Stat target={10000} suffix="+" label="Happy Patients" />
          <Stat target={24} suffix="/7" label="Emergency Care" />
        </div>
      </section>

      {/* ===== PATIENT PROMISE ===== */}
      <section className="mx-auto max-w-7xl px-4 pt-4 pb-16">
        <Reveal>
          <div className="rounded-3xl bg-white border border-border p-8 md:p-12 shadow-card">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div className="max-w-prose">
                <div className="text-xs font-bold tracking-[0.3em] text-emerald">— OUR PROMISE —</div>
                <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-navy leading-tight">Care That Feels Personal</h2>
                <p className="mt-4 text-muted-foreground leading-[1.75]">
                  At Lifeline, healthcare is more than a service — it is a responsibility we carry with pride.
                  Every patient is unique, and so is every treatment plan we design. Our doctors take the time to
                  listen, explain and involve you in every decision so you always feel informed, safe and cared for.
                </p>
                <p className="mt-3 text-muted-foreground leading-[1.75]">
                  From your very first visit to complete recovery, our multidisciplinary team of consultants,
                  nurses, physiotherapists and support staff work as one to make your healing journey smooth,
                  transparent and reassuring.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  { t: "Patient-First Approach", d: "Treatment plans tailored to your condition, comfort and lifestyle." },
                  { t: "Experienced Specialists", d: "Board-certified consultants across 20+ specialities under one roof." },
                  { t: "Modern Infrastructure", d: "Advanced ICUs, modular OTs and precision diagnostic technology." },
                  { t: "Affordable & Transparent", d: "Clear pricing, insurance support and cashless facilities." },
                ].map((f) => (
                  <li key={f.t} className="flex gap-4 items-start p-4 rounded-2xl bg-secondary/60 border border-border">
                    <div className="h-10 w-10 rounded-xl bg-brand-gradient text-white flex items-center justify-center shrink-0 shadow-glow">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-navy">{f.t}</div>
                      <div className="text-sm text-muted-foreground mt-0.5">{f.d}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== FINGERTIPS ===== */}
      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <Reveal>
            <div className="text-center">
              <div className="text-xs font-bold tracking-[0.3em] text-emerald">STAY CONNECTED. STAY HEALTHY.</div>
              <h2 className="mt-3 text-3xl md:text-5xl font-extrabold text-navy">Healthcare At Your Fingertips</h2>
              <p className="mt-3 text-muted-foreground">Access our services online and get connected with our experts anytime, anywhere.</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[
              { icon: CalendarCheck, title: "Book Appointment", sub: "Schedule your visit with our doctors" },
              { icon: Video, title: "Online Consultation", sub: "Talk to our experts from anywhere" },
              { icon: FileText, title: "Test Reports", sub: "View your lab reports online" },
              { icon: PackageCheck, title: "Health Packages", sub: "Explore health checkup packages" },
              { icon: Siren, title: "Emergency Support", sub: "24/7 emergency assistance" },
            ].map(({ icon: Icon, title, sub }, i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="group bg-white rounded-2xl p-6 text-center card-lift h-full border border-border">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-brand-gradient flex items-center justify-center icon-pop shadow-glow">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="mt-4 font-bold text-navy">{title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden bg-[#0b2563]">
  {/* ECG Background */}
  <div className="absolute inset-0 opacity-60">
    <svg
      viewBox="0 0 1200 180"
      className="w-full h-full"
      preserveAspectRatio="none"
    >
     <path
  d="M0 90 H120 L140 90 L160 40 L180 140 L200 20 L220 90 H1200"
  stroke="#ff3b3b"
  strokeWidth="3"
  fill="none"
  className="animate-ecg drop-shadow-[0_0_8px_rgba(255,59,59,0.8)]"
/>
    </svg>
  </div>

  <div className="relative mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between">

    {/* Left */}
    <div className="flex items-center gap-5">

      {/* Heart Image */}
    <img
  src={heartImg}
  alt="Heart"
  className="w-30 h-30 object-contain"
/>

      {/* Text */}
      <div className="relative mx-auto max-w-7xl  py-6 flex flex-col md:flex-row items-center justify-between gap-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          Your Health Is Our Commitment
        </h2>

        <p className="mt-2 text-white/80 text-lg">
          We are dedicated to providing exceptional healthcare
          services with compassion and excellence.
        </p>
      </div>
    </div>

    {/* Button */}
    <Link
      to="/contact"
    className="mt-6 md:mt-0 md:ml-20 inline-flex min-w-[240px] items-center justify-center gap-3 whitespace-nowrap rounded-md bg-green-700 px-8 py-4 font-semibold text-white transition-all duration-300 hover:bg-green-600"
    >
      CONTACT US TODAY
      <ArrowRight className="h-5 w-5" />
    </Link>

  </div>
</section>
    </>
  );
}
