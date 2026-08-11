import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle2, XCircle, Trash2 } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  getAdminAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from "@/services/appointmentService";

export const Route = createFileRoute("/admin/appointments")({
  component: AdminAppointmentsPage,
});

function AdminAppointmentsPage() {
  const location = useLocation();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(
    ((location as any).search?.search as string) || ""
  );

  const routeSearch = ((location as any).search?.search as string) || "";

  useEffect(() => {
    setSearch(routeSearch);
  }, [routeSearch]);

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const res = await getAdminAppointments();

      if (res.success) {
        setAppointments(res.appointments);
      }
    } catch (error) {
      console.error("Appointments Error:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredAppointments = useMemo(() => {
    const keyword = search.toLowerCase();

    return appointments.filter((appointment) => {
      return (
        appointment.patient_name?.toLowerCase().includes(keyword) ||
        appointment.doctor_name?.toLowerCase().includes(keyword) ||
        appointment.specialization?.toLowerCase().includes(keyword) ||
        appointment.status?.toLowerCase().includes(keyword) ||
        appointment.phone?.toLowerCase().includes(keyword)
      );
    });
  }, [appointments, search]);

  async function handleStatusChange(id: number, status: string) {
    if (!confirm(`Mark this appointment as ${status}?`)) {
      return;
    }

    try {
      const res = await updateAppointmentStatus(id, status);

      if (res.success) {
        alert("Appointment status updated.");
        loadAppointments();
      } else {
        alert(res.message || "Unable to update appointment status.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update appointment status.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this appointment?")) {
      return;
    }

    try {
      const res = await deleteAppointment(id);

      if (res.success) {
        alert("Appointment deleted.");
        loadAppointments();
      } else {
        alert(res.message || "Unable to delete appointment.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete appointment.");
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Appointments
            </h1>
            <p className="text-gray-500">
              Manage all appointments and update their status.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={20}
              className="absolute left-4 top-3 text-gray-400"
            />
            <input
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border bg-white py-3 pl-12 pr-4 outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow">
          {loading ? (
            <div className="p-10 text-center">Loading appointments...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="border p-4 text-left">Patient</th>
                    <th className="border p-4 text-left">Doctor</th>
                    <th className="border p-4 text-left">Specialization</th>
                    <th className="border p-4 text-left">Date</th>
                    <th className="border p-4 text-left">Time</th>
                    <th className="border p-4 text-left">Status</th>
                    <th className="border p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-t hover:bg-slate-50"
                      >
                        <td className="p-4">
                          <div className="font-semibold">
                            {appointment.patient_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.phone}
                          </div>
                        </td>
                        <td className="p-4">{appointment.doctor_name}</td>
                        <td className="p-4">{appointment.specialization}</td>
                        <td className="p-4">
                          {new Date(
                            appointment.appointment_date
                          ).toLocaleDateString()}
                        </td>
                        <td className="p-4">{appointment.appointment_time}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold text-white ${
                              appointment.status === "Completed"
                                ? "bg-emerald-600"
                                : appointment.status === "Cancelled"
                                ? "bg-red-600"
                                : "bg-blue-600"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {appointment.status !== "Completed" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(
                                    appointment.id,
                                    "Completed"
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                              >
                                <CheckCircle2 size={16} />
                                Complete
                              </button>
                            )}

                            {appointment.status !== "Cancelled" && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(
                                    appointment.id,
                                    "Cancelled"
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                              >
                                <XCircle size={16} />
                                Cancel
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDelete(appointment.id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-10 text-center text-gray-500"
                      >
                        No appointments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
