import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site-chrome";
import bannerServices from "@/assets/banner-services.jpg";
import { ArrowRight, PenSquare } from "lucide-react";
import { getPublishedBlogs } from "@/lib/blogs";
import imgPediatrics from "@/assets/service-pediatrics.jpg";
import imgOphthalmology from "@/assets/service-ophthalmology.jpg";
import imgSurgery from "@/assets/service-surgery.jpg";
import imgCardiology from "@/assets/service-cardiology.jpg";
import imgPhysician from "@/assets/service-physician.jpg";
import imgNeurology from "@/assets/service-neurology.jpg";
import imgOrthopaedic from "@/assets/service-orthopaedic.jpg";
import imgNephrology from "@/assets/service-nephrology.png";
import imgObgyn from "@/assets/service-obgyn.jpg";
import imgEnt from "@/assets/service-ent.jpg";
import imgPsychiatry from "@/assets/service-psychiatry.jpg";
import imgAnesthesiology from "@/assets/service-anesthesiology.jpg";
import imgDermatology from "@/assets/service-dermatology.jpg";
import imgDental from "@/assets/service-dental.jpg";
import imgNeurosurgery from "@/assets/service-neurosurgery.jpg";
import imgOncology from "@/assets/service-oncology.jpg";
import imgGastro from "@/assets/service-gastro.jpg";
import imgRetina from "@/assets/service-retina.jpg";
import imgGlaucoma from "@/assets/service-glaucoma.jpg";
import imgVascular from "@/assets/service-vascular.png";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Lifeline Super Speciality Hospital" },
      { name: "description", content: "20+ specialty and super-specialty departments: Cardiology, Neurology, Neurosurgery, Oncology, Ophthalmology, Orthopedics, Pediatrics, ENT, Dental and more." },
      { property: "og:title", content: "Our Services — Lifeline Super Speciality Hospital" },
      { property: "og:description", content: "Comprehensive specialty and super-specialty care under one roof." },
    ],
  }),
  component: Services,
});

const SPECIALTY = [
  { image: imgOphthalmology, name: "Ophthalmology", desc: "Advanced eye care including cataract, refractive surgery and modern diagnostics." },
  { image: imgPediatrics, name: "Pediatrics", desc: "Complete healthcare for newborns, children and adolescents." },
  { image: imgObgyn, name: "Obstetrics & Gynecology", desc: "Comprehensive women's health, pregnancy, delivery and gynecological care." },
  { image: imgPhysician, name: "General Medicine", desc: "Expert consultation for general health, chronic conditions and wellness." },
  { image: imgSurgery, name: "General Surgery", desc: "Laparoscopic and open surgical procedures across general domains." },
  { image: imgOrthopaedic, name: "Orthopedics", desc: "Care for bones, joints, spine, sports injuries and joint replacements." },
  { image: imgEnt, name: "ENT", desc: "Ear, nose and throat care including hearing, sinus and voice disorders." },
  { image: imgPsychiatry, name: "Psychiatry", desc: "Mental health assessment, counselling and treatment in a compassionate setting." },
  { image: imgAnesthesiology, name: "Anesthesiology & Critical Care", desc: "Safe anesthesia and 24×7 intensive care for critically ill patients." },
  { image: imgDermatology, name: "Dermatology", desc: "Skin, hair and nail treatment with medical and cosmetic dermatology." },
  { image: imgDental, name: "Dental", desc: "Complete dental care from routine cleaning to advanced restorative work." },
];

const SUPER_SPECIALTY = [
  { image: imgNeurology, name: "Neurology", desc: "Diagnosis and treatment for stroke, epilepsy, headache and neurological disorders." },
  { image: imgNeurosurgery, name: "Neurosurgery", desc: "Advanced brain and spine surgery with modern microsurgical techniques." },
  { image: imgOncology, name: "Surgical Oncology", desc: "Multidisciplinary cancer surgery and comprehensive tumour care." },
  { image: imgNephrology, name: "Nephrology", desc: "Kidney care, dialysis and management of chronic kidney disease." },
  { image: imgGastro, name: "Gastroenterology", desc: "Digestive health, endoscopy and liver disease diagnosis and treatment." },
  { image: imgCardiology, name: "Cardiology", desc: "ECG, echo, stress tests and comprehensive preventive heart care." },
  { image: imgRetina, name: "Medical Retina", desc: "Advanced diagnosis and treatment of retinal and macular conditions." },
  { image: imgGlaucoma, name: "Glaucoma", desc: "Early detection, monitoring and management of glaucoma to protect vision." },
  { image: imgVascular, name: "Vascular Surgery", desc: "Care for arteries and veins including minimally invasive vascular procedures." },
];

type Service = { image: string; name: string; desc: string };

function ServiceGrid({ items }: { items: Service[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ image, name, desc }, i) => (
        <div
          key={name}
          className="group relative rounded-3xl overflow-hidden bg-white border border-border card-lift animate-fade-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={image}
              alt={name}
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <h3 className="absolute bottom-3 left-5 right-5 text-xl font-bold text-white drop-shadow">
              {name}
            </h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground">{desc}</p>
            <Link
              to="/contact"
              className="mt-4 inline-flex items-center gap-1 text-xs font-bold tracking-widest text-emerald hover:gap-2 transition-all"
            >
              BOOK CONSULT <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function Services() {
  const blogs = getPublishedBlogs();

  return (
    <>
      <PageHero
        eyebrow="OUR SPECIALTIES"
        title="Comprehensive Care For Every Need"
        subtitle="Advanced medical care across a wide range of super-specialities — under one roof."
        image={bannerServices}
        variant="shimmer"
      />

      <section className="mx-auto max-w-7xl px-4 pt-14 pb-10">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-emerald">DEPARTMENTS</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy leading-tight">Specialty Services</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-[1.75]">
            Our specialty departments cover the everyday health needs of families — from newborn check-ups
            and women's health to skin, dental, mental wellness and general surgery — led by experienced
            consultants and evidence-based clinical teams.
          </p>
        </div>
        <ServiceGrid items={SPECIALTY} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-6 pb-16">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold tracking-[0.2em] text-emerald">ADVANCED CARE</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy leading-tight">Super Specialty Services</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto leading-[1.75]">
            For complex conditions, our super-specialty departments combine advanced technology with highly
            trained specialists — delivering complete care from precise diagnosis to structured recovery.
          </p>
        </div>
        <ServiceGrid items={SUPER_SPECIALTY} />
      </section>

      <section className="bg-navy-gradient text-white py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Not sure which specialist you need?</h2>
          <p className="mt-4 text-white/75 leading-[1.75]">
            Share your symptoms with our care coordinators — we'll guide you to the right department, book
            your consultation and help arrange diagnostic tests so your first visit is smooth and productive.
          </p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 font-semibold text-white shadow-glow hover:translate-y-[-2px] transition-transform">
            Get Help <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
