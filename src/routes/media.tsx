import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site-chrome";
import bannerMedia from "@/assets/banner-media.jpg";
import { Newspaper, Play, Camera, Award, Calendar, ArrowRight } from "lucide-react";
import mediaHospital from "@/assets/media-hospital.jpg";
import mediaTeam from "@/assets/media-team.jpg";
import mediaIcu from "@/assets/media-icu.jpg";
import mediaSurgery from "@/assets/media-surgery.jpg";
import mediaCamp from "@/assets/media-camp.jpg";
import mediaAward from "@/assets/media-award.jpg";
import mediaPediatric from "@/assets/media-pediatric.jpg";
import mediaCardio from "@/assets/media-cardio.jpg";
import mediaLobby from "@/assets/media-lobby.jpg";
import mediaEye from "@/assets/media-eye.jpg";
import mediaAmbulance from "@/assets/media-ambulance.jpg";
import mediaCelebration from "@/assets/media-celebration.jpg";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media & News — Lifeline Super Speciality Hospital" },
      { name: "description", content: "News, media coverage, events and gallery from Lifeline Super Speciality Hospital, Raichur." },
      { property: "og:title", content: "Media & News — Lifeline Hospital" },
      { property: "og:description", content: "Latest news, events and gallery from Lifeline Hospital." },
    ],
  }),
  component: Media,
});

const NEWS = [
  { icon: Award, tag: "AWARD", date: "Mar 12, 2026", title: "Lifeline recognized for excellence in patient safety", image: mediaAward },
  { icon: Newspaper, tag: "PRESS", date: "Feb 04, 2026", title: "New cardiology wing inaugurated in Raichur", image: mediaCardio },
  { icon: Calendar, tag: "EVENT", date: "Jan 20, 2026", title: "Free health camp serves 500+ patients", image: mediaCamp },
  { icon: Play, tag: "VIDEO", date: "Jan 08, 2026", title: "Inside our advanced ICU: A patient's story", image: mediaIcu },
  { icon: Camera, tag: "GALLERY", date: "Dec 22, 2025", title: "Behind the scenes: our surgical excellence team", image: mediaSurgery },
  { icon: Award, tag: "RECOGNITION", date: "Dec 01, 2025", title: "10,000+ happy patients milestone achieved", image: mediaCelebration },
];

const GALLERY = [
  { src: mediaHospital, label: "Our Campus" },
  { src: mediaLobby, label: "Reception" },
  { src: mediaTeam, label: "Nursing Team" },
  { src: mediaPediatric, label: "Pediatrics" },
  { src: mediaEye, label: "Eye Care" },
  { src: mediaCardio, label: "Cardiology" },
  { src: mediaAmbulance, label: "24/7 Emergency" },
  { src: mediaSurgery, label: "Operation Theatre" },
];

function Media() {
  return (
    <>
      <PageHero
        eyebrow="MEDIA & NEWS"
        title="What's Happening at Lifeline"
        subtitle="News, events, awards and stories from the Lifeline community."
        image={bannerMedia}
        variant="scanlines"
      />

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <div className="text-xs font-bold tracking-[0.3em] text-brand">— LATEST UPDATES —</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-navy leading-tight">News, Events & Milestones</h2>
          <p className="mt-4 text-muted-foreground leading-[1.75]">
            New department launches, community health camps, awareness drives, patient stories and
            recognitions — the latest happenings at Lifeline.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {NEWS.map((n, i) => {
            const Icon = n.icon;
            return (
              <article
                key={n.title}
                className="group rounded-3xl overflow-hidden bg-white border border-border card-lift animate-fade-up"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={n.image}
                    alt={n.title}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-white/95 text-navy text-[10px] font-extrabold tracking-widest px-3 py-1 shadow-card">
                    {n.tag}
                  </span>
                  <span className="absolute top-4 right-4 h-10 w-10 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-glow">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="p-6">
                  <div className="text-xs text-muted-foreground">{n.date}</div>
                  <h3 className="mt-1.5 text-lg font-bold text-navy leading-snug group-hover:text-brand transition-colors">
                    {n.title}
                  </h3>
                  {/* <a href="#" className="mt-4 inline-flex items-center gap-1 text-xs font-bold tracking-widest text-emerald link-underline">
                    READ MORE <ArrowRight className="h-3.5 w-3.5" />
                  </a> */}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-[0.3em] text-brand">— GALLERY —</div>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-navy leading-tight">Life at Lifeline</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto leading-[1.75]">
              A glimpse into our people, spaces and the care that happens here every day.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {GALLERY.map((g, i) => (
              <div
                key={g.label}
                className="group aspect-square rounded-2xl overflow-hidden relative card-lift animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <img
                  src={g.src}
                  alt={g.label}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 flex items-center justify-between">
                  <span className="text-white text-xs md:text-sm font-bold tracking-wide">{g.label}</span>
                  <span className="h-7 w-7 rounded-full bg-white/20 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-3.5 w-3.5 text-white" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
