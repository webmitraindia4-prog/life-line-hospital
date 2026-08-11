import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site-chrome";
import bannerContact from "@/assets/banner-contact.jpg";
import { User, Phone, Mail, MapPin, Building2, Calendar, Clock, Send, MessageCircle } from "lucide-react";
import { getDoctors } from "@/services/doctorService";
import { getAvailableDates, getAvailableSlots } from "@/services/availabilityService";
import { bookAppointment } from "@/services/appointmentService";
import { registerPatient } from "@/services/patientService";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Lifeline Super Speciality Hospital" },
      { name: "description", content: "Book an appointment or reach Lifeline Super Speciality Hospital in Raichur. Call 8951380222 or send us a message." },
      { property: "og:title", content: "Contact & Book — Lifeline Hospital" },
      { property: "og:description", content: "Book your appointment with our specialists." },
    ],
  }),
  component: Contact,
});

const DEPARTMENTS = [
  "Ophthalmology",
  "Neuro Surgeon",
  "Retina Specialist",
  "Physician, Diabetologist & Cardiologist",
  "Gastroenterology",
  "Pediatrician",
  "Oncologist",
  "Orthopaedic",
  "Orthopaedic & Joint Replacement",
  "Medico Legal Consultant",
];

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Array<{ id: number; full_name: string; specialization: string }>>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [datesLoading, setDatesLoading] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    gender: "",
    age: "",
    address: "",
    department: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    symptoms: "",
  });

  useEffect(() => {
    let active = true;
    setDoctorsLoading(true);

    const loadDoctors = async () => {
      try {
        const data = await getDoctors();
        const doctorsPayload = Array.isArray(data)
          ? data
          : Array.isArray(data?.doctors)
            ? data.doctors
            : [];

        if (!active) return;

        const uniqueDoctors = new Map<string, { id: number; full_name: string; specialization: string }>();

        doctorsPayload.forEach((doctor) => {
          const full_name = (doctor.full_name || doctor.name || "Unknown").trim();
          const specialization = doctor.specialization || "General";
          const key = full_name.toLowerCase();

          if (!uniqueDoctors.has(key)) {
            uniqueDoctors.set(key, {
              id: doctor.id,
              full_name,
              specialization,
            });
          }
        });

        setDoctors(Array.from(uniqueDoctors.values()));
      } catch (error) {
        console.error("Unable to load doctors:", error);
      } finally {
        if (active) setDoctorsLoading(false);
      }
    };

    loadDoctors();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const doctorId = Number(form.doctor_id);
    if (!doctorId || !form.appointment_date) {
      setSlots([]);
      return;
    }

    let active = true;
    setSlotsLoading(true);

    const loadSlots = async () => {
      try {
        const requestedDate = String(form.appointment_date).slice(0, 10);
        const response = await getAvailableSlots(doctorId, requestedDate);
        if (!active) return;

        const availableSlots = response.data?.slots;
        setSlots(Array.isArray(availableSlots) ? availableSlots : []);
      } catch (error) {
        console.error("Unable to load available slots:", error);
        if (active) setSlots([]);
      } finally {
        if (active) setSlotsLoading(false);
      }
    };

    loadSlots();

    return () => {
      active = false;
    };
  }, [form.doctor_id, form.appointment_date]);

  useEffect(() => {
    const doctorId = Number(form.doctor_id);
    if (!doctorId) {
      setAvailableDates([]);
      return;
    }

    let active = true;
    setDatesLoading(true);

    const loadDates = async () => {
      try {
        const response = await getAvailableDates(doctorId);
        if (!active) return;

        const dates = response.data?.dates;
        setAvailableDates(
          Array.isArray(dates)
            ? dates.map((date) => (typeof date === "string" ? date : String(date)))
            : []
        );
      } catch (error) {
        console.error("Unable to load available dates:", error);
        if (active) setAvailableDates([]);
      } finally {
        if (active) setDatesLoading(false);
      }
    };

    loadDates();

    return () => {
      active = false;
    };
  }, [form.doctor_id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => {
      if (name === "doctor_id") {
        return { ...prev, doctor_id: value, appointment_date: "", appointment_time: "" };
      }
      if (name === "appointment_date") {
        return { ...prev, appointment_date: value, appointment_time: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    if (
      !form.full_name ||
      !form.phone ||
      !form.gender ||
      !form.age ||
      !form.doctor_id ||
      !form.appointment_date ||
      !form.appointment_time
    ) {
      setErrorMessage("Please fill in all required fields before booking.");
      return;
    }

    try {
      const patientResponse = await registerPatient({
        full_name: form.full_name,
        gender: form.gender,
        age: Number(form.age),
        phone: form.phone,
        email: form.email || null,
        address: form.address || null,
      });

      const patientId = patientResponse.data?.patient_id;
      if (!patientId) {
        throw new Error(patientResponse.data?.message || "Unable to register patient.");
      }

      const bookingResponse = await bookAppointment({
        patient_id: patientId,
        doctor_id: Number(form.doctor_id),
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
      });

      if (bookingResponse.data?.success) {
        setSubmitted(true);
        setStatusMessage("Appointment booked successfully! We will contact you soon.");
        setForm({
          full_name: "",
          phone: "",
          email: "",
          gender: "",
          age: "",
          address: "",
          department: "",
          doctor_id: "",
          appointment_date: "",
          appointment_time: "",
          symptoms: "",
        });
        setSlots([]);
        return;
      }

      throw new Error(bookingResponse.data?.message || "Unable to complete booking.");
    } catch (error: any) {
      console.error("Booking error:", error);
      setErrorMessage(error?.response?.data?.message || error.message || "Unable to book appointment.");
    }
  };

  return (
    <>
      <PageHero
        eyebrow="GET IN TOUCH"
        title="Book an Appointment"
        subtitle="We're here for you 24/7. Reach out, book online, or drop by our hospital in Raichur."
        image={bannerContact}
        variant="spotlight"
      />

      <section className="mx-auto max-w-7xl px-4 py-14 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        {/* Left: info */}
        <div className="space-y-4 animate-fade-up">
          <div className="max-w-prose">
            <div className="text-xs font-bold tracking-[0.3em] text-brand">— WE'RE HERE FOR YOU —</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-navy leading-tight">Reach Lifeline Anytime</h2>
            <p className="mt-3 text-muted-foreground leading-[1.75]">
              Questions about a symptom, help booking a consultation, or directions? Our patient support team
              is available daily. Casualty and ambulance support run 24/7.
            </p>
          </div>
          {[
            { icon: Phone, title: "Call Us", value: "8951380222, 7411620595", tint: "bg-brand" },
            { icon: Mail, title: "Email Us", value: "info@lifelinehospital.in", tint: "bg-emerald" },
            { icon: MapPin, title: "Visit Us", value: "Near Railway Station Circle, NH-167, IB Road, Raichur", tint: "bg-navy" },
            { icon: Clock, title: "Emergency", value: "Open 24/7 — Always here for you", tint: "bg-brand" },
          ].map(({ icon: Icon, title, value, tint }) => (
            <div key={title} className="flex gap-4 items-start p-5 rounded-2xl bg-white border border-border card-lift">
              <div className={`h-12 w-12 rounded-xl ${tint} text-white flex items-center justify-center shrink-0 shadow-glow`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-widest text-muted-foreground">{title.toUpperCase()}</div>
                <div className="mt-1 font-semibold text-navy">{value}</div>
              </div>
            </div>
          ))}

          <a href="https://wa.me/917411620595" className="flex items-center justify-center gap-2 mt-2 rounded-2xl bg-emerald text-white p-4 font-semibold shadow-glow hover:brightness-110 transition">
            <MessageCircle className="h-5 w-5" /> Chat on WhatsApp
          </a>
        </div>

        {/* Right: form */}
        <div className="relative animate-scale-in">
          <div className="absolute inset-0 rounded-[2rem] bg-brand-gradient blur-2xl opacity-15" />
          <form onSubmit={handleSubmit} className="relative rounded-[2rem] bg-white p-8 md:p-10 border border-border shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-navy">Book an Appointment</h2>
              <div className="h-12 w-12 rounded-xl bg-brand-gradient flex items-center justify-center shadow-glow">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <Field
                icon={User}
                placeholder="Full Name"
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
              <Field
                icon={Phone}
                placeholder="Mobile Number"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="relative block">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-border bg-secondary/50 pl-11 pr-4 py-3.5 text-sm text-navy outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <Field
                  icon={User}
                  placeholder="Age"
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>
              <Field
                icon={Mail}
                placeholder="Email (optional)"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              <Field
                icon={Building2}
                placeholder="Address (optional)"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
              <label className="relative block">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  name="doctor_id"
                  value={form.doctor_id}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-border bg-secondary/50 pl-11 pr-4 py-3.5 text-sm text-navy outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                  required
                >
                  <option value="" disabled>{doctorsLoading ? "Loading doctors..." : "Select Doctor"}</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.full_name} — {doctor.specialization}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-4 rounded-2xl border border-border bg-secondary/50 p-4">
                <div className="mb-2 text-sm font-semibold text-navy">Available Dates</div>
                {datesLoading ? (
                  <div className="text-sm text-muted-foreground">Loading doctor availability...</div>
                ) : !form.doctor_id ? (
                  <div className="text-sm text-muted-foreground">Select a doctor to see available dates.</div>
                ) : availableDates.length === 0 ? (
                  <div className="text-sm text-red-700">This doctor has no available dates yet. Please choose another doctor or try again later.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, appointment_date: date, appointment_time: "" }))}
                        className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${form.appointment_date === date ? "border-brand bg-brand text-white" : "border-border bg-white text-navy hover:border-brand/80"}`}
                      >
                        {new Date(date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Field
                icon={Building2}
                placeholder="Department (Optional)"
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
              />

              <div className="grid grid-cols-2 gap-4">
                <Field
                  icon={Calendar}
                  placeholder="Preferred Date"
                  type="date"
                  name="appointment_date"
                  value={form.appointment_date}
                  onChange={handleChange}
                  required
                />
                <input
                  type="hidden"
                  name="appointment_time"
                  value={form.appointment_time}
                />
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-secondary/50 p-4">
                <div className="mb-2 text-sm font-semibold text-navy">Available Slots</div>
                {slotsLoading ? (
                  <div className="text-sm text-muted-foreground">Loading available slots...</div>
                ) : !form.doctor_id || !form.appointment_date ? (
                  <div className="text-sm text-muted-foreground">Select a doctor and a date to view available slots.</div>
                ) : slots.length === 0 ? (
                  <div className="text-sm text-red-700">No available slots for the selected doctor on this date. Please choose another date or doctor.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, appointment_time: slot }))}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition shadow-sm ${form.appointment_time === slot ? "bg-brand text-white shadow-brand" : "bg-white text-navy hover:bg-brand/10"}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {form.doctor_id && form.appointment_date && !slotsLoading && slots.length > 0 && form.appointment_time ? (
                <div className="mt-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  Selected slot: <span className="font-semibold text-navy">{form.appointment_time}</span>
                </div>
              ) : null}

              {form.doctor_id && form.appointment_date && !slotsLoading && slots.length > 0 && !form.appointment_time ? (
                <div className="mt-2 rounded-2xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
                  Choose an available slot from the list above to continue.
                </div>
              ) : null}

              <label className="relative block">
                <textarea
                  name="symptoms"
                  placeholder="Patient Symptoms"
                  rows={4}
                  value={form.symptoms}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3.5 text-sm text-navy placeholder:text-muted-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition resize-none"
                />
              </label>

              {errorMessage ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}
              {statusMessage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {statusMessage}
                </div>
              ) : null}

              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-4 font-semibold text-white shadow-glow hover:translate-y-[-2px] transition-transform"
              >
                {submitted ? "✓ Appointment Received!" : (<><Send className="h-4 w-4" /> BOOK APPOINTMENT</>)}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="text-center mb-10">
          <div className="text-xs font-bold tracking-[0.3em] text-emerald">— FIND US —</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-navy leading-tight">Visit Our Hospital</h2>
          <p className="mt-3 max-w-xl mx-auto text-muted-foreground leading-[1.75]">
            Centrally located near Raichur Railway Station on IB Road (NH-167). Ample on-site parking.
          </p>
        </div>
        <div className="rounded-3xl overflow-hidden border border-border shadow-card h-80 bg-secondary relative">
          <iframe
            title="Lifeline Hospital Location"
            src="https://www.google.com/maps?q=Raichur+Railway+Station&output=embed"
            className="w-full h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

function Field({ icon: Icon, ...props }: { icon: React.ComponentType<{ className?: string }> } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="relative block">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        {...props}
        className="w-full rounded-xl border border-border bg-secondary/50 pl-11 pr-4 py-3.5 text-sm text-navy placeholder:text-muted-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
      />
    </label>
  );
}

function SelectField({ icon: Icon, placeholder, children }: { icon: React.ComponentType<{ className?: string }>; placeholder: string; children: React.ReactNode }) {
  return (
    <label className="relative block">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <select
        defaultValue=""
        className="w-full appearance-none rounded-xl border border-border bg-secondary/50 pl-11 pr-4 py-3.5 text-sm text-navy outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
    </label>
  );
}
