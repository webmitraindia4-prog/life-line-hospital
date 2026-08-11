import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/site-chrome";
import bannerContact from "@/assets/banner-contact.jpg";
import { getPatientDashboard } from "@/services/patientService";

export const Route = createFileRoute("/patient/dashboard")({
  head: () => ({
    meta: [
      { title: "Patient Dashboard — Lifeline Super Speciality Hospital" },
      { name: "description", content: "View your appointment summary, upcoming visits, and prescription count in the patient portal." },
      { property: "og:title", content: "Patient Dashboard" },
      { property: "og:description", content: "Access your Lifeline patient dashboard to review appointments and prescriptions." },
    ],
  }),
  component: PatientDashboard,
});

function PatientDashboard() {
  const [dashboard, setDashboard] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    prescriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await getPatientDashboard();
      if (res.success) {
        setDashboard(res.dashboard);
      }
    } catch (error) {
      console.error("Patient dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero
        eyebrow="PATIENT PORTAL"
        title="Your Patient Dashboard"
        subtitle="See your upcoming appointments and prescription summary in one place."
        image={bannerContact}
        variant="spotlight"
      />

      <section className="mx-auto max-w-7xl px-4 py-14">
        {loading ? (
          <div className="rounded-3xl border border-border bg-white p-10 text-center text-lg font-semibold text-muted-foreground">
            Loading your patient dashboard...
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-4">
            <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Total Appointments</p>
              <p className="mt-4 text-4xl font-bold text-slate-900">{dashboard.totalAppointments}</p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Upcoming Appointments</p>
              <p className="mt-4 text-4xl font-bold text-blue-600">{dashboard.upcomingAppointments}</p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Completed Appointments</p>
              <p className="mt-4 text-4xl font-bold text-emerald-600">{dashboard.completedAppointments}</p>
            </div>
            <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold text-gray-500">Prescriptions</p>
              <p className="mt-4 text-4xl font-bold text-fuchsia-600">{dashboard.prescriptions}</p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
