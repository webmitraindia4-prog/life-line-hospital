import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarCheck2, CalendarClock, ClipboardList, HeartPulse, Loader2, LogOut, UserCircle2, CheckCircle2, XCircle } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SmallAreaChart from "@/components/dashboard/SmallAreaChart";
import { getDoctorTrends } from "@/services/doctorService";
import { PageHero } from "@/components/site-chrome";
import bannerContact from "@/assets/banner-contact.jpg";
import {
  getDoctorDashboard,
  getDoctorTodayAppointments,
  getDoctorUpcomingAppointments,
  getDoctorCompletedAppointments,
  getDoctorCancelledAppointments,
  updateDoctorAppointmentStatus,
} from "@/services/doctorService";
import { clearAuthToken, isDoctorAuthenticated } from "@/services/authService";

export const Route = createFileRoute("/doctor/dashboard")({
  beforeLoad: () => {
    if (!isDoctorAuthenticated()) {
      throw redirect({ to: "/auth/login?redirect=/doctor/dashboard&role=doctor" });
    }
  },
  head: () => ({
    meta: [
      { title: "Doctor Dashboard — Lifeline Super Speciality Hospital" },
      { name: "description", content: "Manage today's appointments, upcoming visits, and doctor performance at a glance." },
      { property: "og:title", content: "Doctor Dashboard" },
      { property: "og:description", content: "Doctor portal with appointment overview and schedule insights." },
    ],
  }),
  component: DoctorDashboard,
});

function DoctorDashboard() {
  const [dashboard, setDashboard] = useState({
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    totalPatients: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [completedAppointments, setCompletedAppointments] = useState<any[]>([]);
  const [cancelledAppointments, setCancelledAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const dashboardRes = await getDoctorDashboard();
        const todayRes = await getDoctorTodayAppointments();
        const upcomingRes = await getDoctorUpcomingAppointments();
        const completedRes = await getDoctorCompletedAppointments();
        const cancelledRes = await getDoctorCancelledAppointments();

        if (!active) return;

        if (dashboardRes?.success) {
          setDashboard(dashboardRes.dashboard);
        }

        if (todayRes?.success) {
          setTodayAppointments(todayRes.appointments || []);
        }

        if (upcomingRes?.success) {
          setUpcomingAppointments(upcomingRes.appointments || []);
        }

        if (completedRes?.success) {
          setCompletedAppointments(completedRes.appointments || []);
        }

        if (cancelledRes?.success) {
          setCancelledAppointments(cancelledRes.appointments || []);
        }
      } catch (err) {
        console.error("Doctor dashboard error:", err);
        if (active) {
          setError("Unable to load your doctor dashboard right now.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    window.location.href = "/auth/login";
  };

  const handleAppointmentStatusChange = async (appointmentId: number, status: "Completed" | "Cancelled") => {
    if (!window.confirm(`Mark this appointment as ${status}?`)) {
      return;
    }

    try {
      const result = await updateDoctorAppointmentStatus(appointmentId, status);
      if (result?.success) {
        window.alert(result.message || `Appointment marked as ${status}.`);
        const dashboardRes = await getDoctorDashboard();
        const todayRes = await getDoctorTodayAppointments();
        const upcomingRes = await getDoctorUpcomingAppointments();
        const completedRes = await getDoctorCompletedAppointments();
        const cancelledRes = await getDoctorCancelledAppointments();

        setDashboard(dashboardRes?.dashboard || dashboard);
        setTodayAppointments(todayRes?.appointments || []);
        setUpcomingAppointments(upcomingRes?.appointments || []);
        setCompletedAppointments(completedRes?.appointments || []);
        setCancelledAppointments(cancelledRes?.appointments || []);
      } else {
        window.alert(result?.message || "Unable to update appointment status.");
      }
    } catch (error) {
      console.error("Doctor appointment status update error:", error);
      window.alert("Unable to update appointment status.");
    }
  };

  const statCards = [
    {
      title: "Today's Appointments",
      value: dashboard.todayAppointments,
      icon: CalendarCheck2,
      tone: "text-brand",
    },
    {
      title: "Upcoming Appointments",
      value: dashboard.upcomingAppointments,
      icon: CalendarClock,
      tone: "text-emerald-600",
    },
    {
      title: "Completed",
      value: dashboard.completedAppointments,
      icon: ClipboardList,
      tone: "text-sky-600",
    },
    {
      title: "Patients Covered",
      value: dashboard.totalPatients,
      icon: HeartPulse,
      tone: "text-fuchsia-600",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="DOCTOR PORTAL"
        title="Doctor Dashboard"
        subtitle="Track your day, manage appointments, and monitor patient flow from one place."
        image={bannerContact}
        variant="spotlight"
      />

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
          <Link to="/doctor/profile" className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-navy shadow-sm">
            <UserCircle2 className="h-4 w-4" />
            My Profile
          </Link>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-border bg-white p-10 text-center text-lg font-semibold text-muted-foreground">
            <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
            Loading your doctor dashboard...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-dashed border-border bg-white p-10 text-center text-muted-foreground">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              {statCards.map(({ title, value, icon: Icon, tone }) => (
                <StatCard key={title} title={title} value={value} tone={tone === "text-brand" ? "tone-indigo" : "tone-emerald"} />
              ))}
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <DoctorTrendsCharts />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-navy">Today’s Appointments</h3>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-navy">
                    {todayAppointments.length}
                  </span>
                </div>

                {todayAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No appointments scheduled for today.</p>
                ) : (
                  <div className="space-y-3">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment.appointment_id} className="rounded-2xl bg-secondary/70 p-4 shadow-card">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-navy">{appointment.patient_name}</p>
                          <span className="text-xs font-semibold text-brand">{appointment.appointment_time}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{appointment.phone}</p>
                        <p className="mt-1 text-sm text-muted-foreground">Status: {appointment.status}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleAppointmentStatusChange(appointment.appointment_id, "Completed")}
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Complete
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAppointmentStatusChange(appointment.appointment_id, "Cancelled")}
                            className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-navy">Upcoming Appointments</h3>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-navy">
                    {upcomingAppointments.length}
                  </span>
                </div>

                {upcomingAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming appointments right now.</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.appointment_id} className="rounded-2xl bg-secondary/70 p-4 shadow-card">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-navy">{appointment.patient_name}</p>
                          <span className="text-xs font-semibold text-brand">{appointment.appointment_date}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{appointment.appointment_time}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{appointment.phone}</p>
                        <p className="mt-1 text-sm text-muted-foreground">Status: {appointment.status}</p>
                        {appointment.status !== "Cancelled" && appointment.status !== "Completed" && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleAppointmentStatusChange(appointment.appointment_id, "Cancelled")}
                              className="inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
function DoctorTrendsCharts() {
  const [appointmentsData, setAppointmentsData] = useState<{ name: string; value: number }[]>([]);
  const [completedData, setCompletedData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await getDoctorTrends();
        if (!mounted) return;

        if (res.success) {
          const ap = res.trends.map((t: any) => ({
            name: new Date(t.date).toLocaleDateString(undefined, { weekday: "short" }),
            value: t.appointments,
          }));

          const co = res.trends.map((t: any) => ({
            name: new Date(t.date).toLocaleDateString(undefined, { weekday: "short" }),
            value: t.completed,
          }));

          setAppointmentsData(ap);
          setCompletedData(co);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <div className="rounded-2xl bg-white p-4 shadow-soft">
        <SmallAreaChart title="Appointments (7 days)" color="#06B6D4" data={appointmentsData} height={120} />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-soft">
        <SmallAreaChart title="Completed (7 days)" color="#10B981" data={completedData} height={120} />
      </div>
    </>
  );
}
