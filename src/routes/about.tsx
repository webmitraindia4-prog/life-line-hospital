import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site-chrome";
import bannerAbout from "@/assets/banner-about.jpg";
import { Target, Eye, Heart, ShieldCheck, Award, Users, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Lifeline Super Speciality Hospital" },
      { name: "description", content: "Learn about Lifeline Super Speciality Hospital's mission, vision and commitment to compassionate world-class healthcare in Raichur." },
      { property: "og:title", content: "About Lifeline Super Speciality Hospital" },
      { property: "og:description", content: "Our mission: expert care, advanced treatment, healthier tomorrow." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHero
        eyebrow="ABOUT LIFELINE"
        title="Compassion Meets Expertise"
        subtitle="A multi-specialty hospital in Raichur built around advanced technology, expert clinicians and patient-first care."
        image={bannerAbout}
        variant="slide"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 grid gap-12 lg:grid-cols-2 items-center">
        <div className="animate-fade-up max-w-prose">
          <div className="text-xs font-bold tracking-[0.3em] text-brand">— OUR STORY —</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-navy leading-tight">Redefining Healthcare in Raichur</h2>
          <p className="mt-4 text-muted-foreground leading-[1.75]">
            Lifeline Super Speciality Hospital was founded with a single promise: to bring world-class healthcare closer to the community. From routine consultations to complex surgeries, our multidisciplinary team combines deep clinical expertise with the latest medical technology.
          </p>
          <p className="mt-3 text-muted-foreground leading-[1.75]">
            Every patient who walks through our doors is met with warmth, dignity and a treatment plan tailored to them — because better care truly means a better tomorrow.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { n: "25+", l: "Doctors" },
              { n: "100+", l: "Beds" },
              { n: "10K+", l: "Patients" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-secondary/70 p-4 text-center card-lift border border-border">
                <div className="text-2xl font-extrabold text-brand">{s.n}</div>
                <div className="text-xs text-muted-foreground font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-scale-in">
          <div className="absolute inset-0 rounded-[2rem] bg-brand-gradient blur-2xl opacity-20 animate-float-slow" />
          <div className="relative grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-navy-gradient text-white p-6 h-56 flex flex-col justify-between">
              <Target className="h-8 w-8 text-brand" />
              <div>
                <div className="text-lg font-bold">Our Mission</div>
                <div className="text-xs text-white/70 mt-1">Deliver accessible, advanced and compassionate healthcare to every patient.</div>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-border p-6 h-56 flex flex-col justify-between shadow-card card-lift">
              <Eye className="h-8 w-8 text-emerald" />
              <div>
                <div className="text-lg font-bold text-navy">Our Vision</div>
                <div className="text-xs text-muted-foreground mt-1">To be the most trusted super-speciality hospital in North Karnataka.</div>
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-border p-6 h-56 flex flex-col justify-between shadow-card card-lift">
              <Heart className="h-8 w-8 text-brand" />
              <div>
                <div className="text-lg font-bold text-navy">Our Values</div>
                <div className="text-xs text-muted-foreground mt-1">Empathy, integrity, excellence and continuous learning.</div>
              </div>
            </div>
            <div className="rounded-2xl bg-brand-gradient text-white p-6 h-56 flex flex-col justify-between shadow-glow">
              <ShieldCheck className="h-8 w-8" />
              <div>
                <div className="text-lg font-bold">Safety First</div>
                <div className="text-xs text-white/85 mt-1">NABH-aligned protocols and 24/7 emergency readiness.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <div className="text-xs font-bold tracking-[0.3em] text-brand">— WHY CHOOSE US —</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-navy leading-tight">Care You Can Count On</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-[1.75]">
              For years, families across Raichur and neighbouring districts have trusted Lifeline for
              specialist consultations, planned surgeries and life-saving emergency care. Our commitment
              to clinical excellence, ethical practice and compassionate service is what sets us apart.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: Award, t: "Expert Team", d: "Board-certified specialists across 8+ super-specialities." },
              { icon: ShieldCheck, t: "Advanced Technology", d: "Modern diagnostic and surgical infrastructure." },
              { icon: Users, t: "Patient First", d: "Personalized treatment plans built around your needs." },
            ].map(({ icon: Icon, t, d }, i) => (
              <div key={t} className="bg-white rounded-2xl p-8 card-lift border border-border animate-fade-up" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="h-14 w-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-navy">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white shadow-glow hover:translate-y-[-2px] transition-transform">
              Talk to us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHAT WE DO ===== */}
     <section className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
  <div className="grid lg:grid-cols-2 gap-10 items-center">

    {/* Left Content */}
    <div>
      <div className="inline-flex items-center gap-2">
        {/* <span className="h-[2px] w-10 bg-emerald-500"></span> */}
        <span className="text-xs font-bold tracking-[0.35em] uppercase text-emerald-600">
-- What We Do --

        </span>
      </div>

      <h2 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight text-navy">
        Complete Healthcare,
        <br />
        Under One Roof
      </h2>

      <p className="mt-5 text-base leading-8 text-slate-600">
        Lifeline Super Speciality Hospital brings together specialists,
        advanced diagnostics and surgical expertise so patients no longer
        need to travel far for quality treatment. Whether it is a
        paediatric consultation, planned orthopaedic surgery, cardiology
        evaluation or emergency neurological care, our teams are ready
        around the clock.
      </p>

      <p className="mt-4 text-base leading-8 text-slate-600">
        Our departments work together to deliver coordinated care,
        ensuring faster diagnosis, safer treatment and better outcomes
        for every patient.
      </p>
    </div>

    {/* Right Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

      {[
        {
          title: "24/7 Emergency",
          desc: "Round-the-clock casualty and trauma services with rapid response.",
        },
        {
          title: "Advanced Diagnostics",
          desc: "In-house laboratory, imaging and pathology for accurate reports.",
        },
        {
          title: "Modular Operation Theatres",
          desc: "State-of-the-art operation theatres for advanced surgeries.",
        },
        {
          title: "Critical Care ICUs",
          desc: "Dedicated ICU, NICU & PICU units with continuous monitoring.",
        },
      ].map((item) => (
        <div
          key={item.title}
          className="flex h-full flex-col justify-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl"
        >
          <h3 className="text-xl font-bold text-navy">
            {item.title}
          </h3>

          <p className="mt-3 text-[15px] leading-7 text-slate-600">
            {item.desc}
          </p>
        </div>
      ))}
    </div>

  </div>
</section>

      {/* ===== PATIENT EXPERIENCE ===== */}
      <section className="bg-navy-gradient text-white py-16">
        <div className="mx-auto max-w-7xl px-4 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-1 max-w-prose">
            <div className="text-xs font-bold tracking-[0.3em] text-emerald">— PATIENT EXPERIENCE —</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight">Comfort, Dignity & Trust</h2>
            <p className="mt-4 text-white/75 leading-[1.75]">
              Healing is not only about medicine — it is about how a patient feels through the journey.
              We invest in warm hospitality, clean spaces and clear communication so every visit feels calm
              and confident.
            </p>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
            {[
              { t: "Transparent Communication", d: "Clear explanation of diagnosis, treatment options and expected outcomes." },
              { t: "Ethical Practice", d: "No unnecessary tests or procedures — every recommendation is medically justified." },
              { t: "Insurance & Cashless", d: "Empanelled with leading insurance providers and TPAs for hassle-free claims." },
              { t: "Family-Friendly Care", d: "Comfortable waiting areas, attendant support and easy visiting facilities." },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur">
                <div className="font-bold text-white">{c.t}</div>
                <p className="mt-1.5 text-sm text-white/75">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
