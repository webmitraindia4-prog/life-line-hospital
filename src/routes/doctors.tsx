import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PageHero } from "@/components/site-chrome";
import bannerDoctors from "@/assets/banner-doctors.jpg";
import { Stethoscope, Award, Calendar, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getDoctors, fallbackDoctors } from "@/services/doctorService";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Our Doctors — Lifeline Super Speciality Hospital" },
      { name: "description", content: "Meet the expert doctors and specialists at Lifeline Super Speciality Hospital, Raichur." },
      { property: "og:title", content: "Meet Our Doctors" },
      { property: "og:description", content: "Board-certified specialists across 8+ super-specialities." },
    ],
  }),
  component: Doctors,
});

const GRADIENTS = [
  "from-brand to-rose-500",
  "from-emerald to-teal-500",
  "from-indigo-500 to-violet-500",
  "from-amber-500 to-orange-500",
  "from-cyan-500 to-blue-500",
  "from-pink-500 to-fuchsia-500",
  "from-sky-500 to-blue-600",
  "from-purple-500 to-brand",
];

type Doctor = {
  id: number;
  name: string;
  role: string;
  qualification: string;
  experience: string;
  description: string;
  image: string | null;
  initials: string;
};

const normalizeDoctor = (doctor: Record<string, any>, index: number): Doctor => {
  const name = doctor.full_name || doctor.name || `Doctor ${index + 1}`;
  const computedInitials = (name as string)
    .split(" ")
    .filter(Boolean)
    .map((part: string) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const role = doctor.specialization || doctor.role || doctor.department || "Specialist";
  const qualification = doctor.qualification ?? "";
  const experience = doctor.experience != null ? String(doctor.experience) : "Experienced";
  const description = doctor.description ?? doctor.bio ?? doctor.about ?? doctor.profile_description ?? "Experienced specialist committed to compassionate, patient-focused care.";
  const imageValue = doctor.image ?? doctor.profile_image ?? null;
  const image = typeof imageValue === "string" ? imageValue : imageValue ?? null;

  return {
    id: doctor.id ?? index + 1,
    name: String(name),
    role: String(role),
    qualification: String(qualification),
    experience,
    description: String(description),
    image,
    initials: doctor.initials ?? (computedInitials || "DR"),
  };
};

const buildDoctorImageUrl = (image: string | null) => {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return `http://localhost:5002${image}`;
  }

  if (image.startsWith("/")) {
    return image;
  }

  return `/${image}`;
};

function Doctors() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>(() =>
    fallbackDoctors.map((doctor, index) =>
      normalizeDoctor(doctor as Record<string, any>, index)
    )
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      try {
        setLoading(true);
        const data = await getDoctors();
        const doctorsPayload = Array.isArray(data)
          ? data
          : Array.isArray(data?.doctors)
            ? data.doctors
            : [];

        const normalizedDoctors = doctorsPayload.map((doctor, index) => normalizeDoctor(doctor as Record<string, any>, index));
        const uniqueDoctors = Array.from(
          new Map(
            normalizedDoctors.map((doctor) => [doctor.name.trim().toLowerCase(), doctor])
          ).values()
        );

        const expectedNames = fallbackDoctors.map((doctor) => doctor.full_name.trim().toLowerCase());
        const apiMatchesFallback =
          uniqueDoctors.length === expectedNames.length &&
          uniqueDoctors.every((doctor, index) => doctor.name.trim().toLowerCase() === expectedNames[index]);

        if (active) {
          setDoctors(apiMatchesFallback ? uniqueDoctors : fallbackDoctors.map((doctor, index) => normalizeDoctor(doctor as Record<string, any>, index)));
          setError(null);
        }
      } catch (err) {
        if (active) {
          setDoctors(fallbackDoctors.map((doctor, index) => normalizeDoctor(doctor as Record<string, any>, index)));
          setError("We couldn’t load our doctors right now. Please try again shortly.");
          console.error(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDoctors();

    return () => {
      active = false;
    };
  }, []);

  const handleBookAppointment = () => {
    router.navigate({ to: "/contact" });
  };

  return (
    <>
      <PageHero
        eyebrow="EXPERT SPECIALISTS"
        title="Meet Our Doctors"
        subtitle="A team of experienced, board-certified specialists dedicated to your health and recovery."
        image={bannerDoctors}
        variant="slide"
      />

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <div className="text-xs font-bold tracking-[0.3em] text-brand">— OUR CONSULTANTS —</div>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-navy leading-tight">Experienced. Trusted. Compassionate.</h2>
          <p className="mt-4 text-muted-foreground leading-[1.75]">
            Years of clinical experience, sub-speciality training and a shared commitment to patient-centred
            care — specialists who listen carefully, explain clearly and treat with the highest ethical standards.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-3xl border border-border bg-white p-8 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading specialists...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
            {error}
          </div>
        ) : doctors.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-white p-8 text-center text-sm text-muted-foreground">
            No doctors are available right now. Please check back later.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {doctors.map((doctor, i) => {
              const doctorImage = buildDoctorImageUrl(doctor.image);
              const experienceLabel = doctor.experience?.includes("yr") || doctor.experience?.includes("yrs")
                ? doctor.experience
                : `${doctor.experience} yrs`;

              return (
                <div
                  key={doctor.id}
                  className="group relative doctor-card rounded-3xl overflow-hidden bg-white border border-border card-lift animate-fade-up flex flex-col h-full"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`card-image relative h-40 w-full ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center cursor-pointer hover:scale-[1.01] transition-transform`}
                  >
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, white 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                    <div className="avatar relative h-20 w-20 rounded-full bg-white/95 flex items-center justify-center overflow-hidden ring-4 ring-white/70 shadow-glow icon-pop">
                      {doctorImage ? (
                        <img src={doctorImage} alt={doctor.name} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <span className="text-lg font-extrabold text-navy">{doctor.initials}</span>
                      )}
                    </div>
                  </button>
                  <div className="doctor-meta p-3 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-navy doctor-name">{doctor.name}</h3>
                      <div className="text-[10px] text-brand font-semibold flex items-center justify-center gap-1.5 mt-1.5">
                        <Stethoscope className="h-3 w-3" />
                        <span>{doctor.role}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground flex items-center justify-center gap-1.5 mt-2">
                        <Award className="h-3 w-3" />
                        <span className="doctor-experience">{experienceLabel} experience</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleBookAppointment}
                      className="book-btn mt-3 w-full inline-flex items-center justify-center gap-2 rounded-full bg-secondary text-navy px-3 py-2 text-[10px] font-semibold hover:bg-brand hover:text-white transition-colors"
                    >
                      <Calendar className="h-3 w-3" /> Book
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
          {selectedDoctor ? (
            <DialogContent className="sm:max-w-md">
              <DialogHeader className="text-left">
                <DialogTitle className="text-2xl font-bold text-navy">{selectedDoctor.name}</DialogTitle>
                <DialogDescription className="mt-2 text-sm leading-6">
                  {selectedDoctor.role} with {selectedDoctor.experience} experience.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="flex justify-center">
                  <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-brand/20 bg-white shadow-lg">
                    {buildDoctorImageUrl(selectedDoctor.image) ? (
                      <img src={buildDoctorImageUrl(selectedDoctor.image)!} alt={selectedDoctor.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary text-2xl font-bold text-navy">
                        {selectedDoctor.initials}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-secondary/70 p-4 text-sm text-muted-foreground">
                  <p className="font-semibold text-navy">Specialist profile</p>
                  <p className="mt-2">
                    {selectedDoctor.description || selectedDoctor.qualification || "Experienced specialist committed to compassionate, patient-focused care."}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleBookAppointment}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
                  >
                    <Calendar className="h-4 w-4" /> Book Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(null)}
                    className="flex-1 inline-flex items-center justify-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </DialogContent>
          ) : null}
        </Dialog>

        <div className="mt-14 rounded-3xl bg-secondary/60 border border-border p-8 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-navy leading-tight">Book a consultation with our specialists</h3>
          <p className="mt-3 max-w-xl mx-auto text-muted-foreground leading-[1.75]">
            Book online, by phone or WhatsApp. Walk-ins welcome during OPD hours. 24/7 casualty for emergencies.
          </p>
        </div>
      </section>
    </>
  );
}
