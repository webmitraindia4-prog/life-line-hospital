import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getDashboard } from "@/services/adminService";
import StatCard from "@/components/dashboard/StatCard";
import SmallAreaChart from "@/components/dashboard/SmallAreaChart";
import { getDashboardTrends } from "@/services/adminService";
import { Users, LayoutDashboard, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    recentAppointments: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await getDashboard();

      if (res.success) {
        setDashboard(res.dashboard);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome to Lifeline Hospital Management System
          </p>
        </div>

        {loading ? (
          <div className="text-lg font-semibold">Loading Dashboard...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
              <StatCard title="Doctors" value={dashboard.totalDoctors} tone="tone-indigo" />
              <StatCard title="Patients" value={dashboard.totalPatients} tone="tone-emerald" />
              <StatCard title="Today" value={dashboard.todayAppointments} tone="tone-amber" />
              <StatCard title="Upcoming" value={dashboard.upcomingAppointments} tone="tone-indigo" />
              <StatCard title="Completed" value={dashboard.completedAppointments} tone="tone-emerald" />
              <StatCard title="Cancelled" value={dashboard.cancelledAppointments} tone="tone-rose" />
            </div>

            {/* Compact chart */}
            <div className="mt-6 rounded-2xl bg-white p-4 shadow-soft">
              <AdminTrendsChart dashboard={dashboard} />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-soft">
              <h2 className="mb-4 text-xl font-bold">
                Recent Appointments
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full compact-table">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Patient</th>
                      <th className="p-2 text-left">Doctor</th>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Time</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {dashboard.recentAppointments.length > 0 ? (
                      dashboard.recentAppointments.map((item: any) => (
                        <tr key={item.id}>
                          <td className="p-2">{item.patient_name}</td>
                          <td className="p-2">{item.doctor_name}</td>
                          <td className="p-2">{new Date(item.appointment_date).toLocaleDateString()}</td>
                          <td className="p-2">{item.appointment_time}</td>
                          <td className="p-2">
                            <span className={`rounded px-2 py-0.5 text-white text-xs ${item.status === "Completed" ? "bg-green-600" : item.status === "Cancelled" ? "bg-red-600" : "bg-blue-600"}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-3 text-center text-gray-500">No recent appointments found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function AdminTrendsChart({ dashboard }: any) {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getDashboardTrends();
        if (!mounted) return;

        if (res.success) {
          const mapped = res.trends.map((t: any) => {
            const d = new Date(t.date);
            const name = d.toLocaleDateString(undefined, { weekday: "short" });
            return { name, value: t.count };
          });

          setData(mapped);
        }
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return <SmallAreaChart title="Appointments (7 days)" color="#6366F1" data={data} height={130} />;
}