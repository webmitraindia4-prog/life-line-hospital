import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getPatientById } from "@/services/patientService";

export const Route = createFileRoute("/admin/patient-view/$id")({
  component: PatientDetailsPage,
});

function PatientDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, []);

  async function loadPatient() {
    try {
      const res = await getPatientById(id);

      if (res.success) {
        setPatient(res.patient);
        setAppointments(res.appointments || []);
      } else {
        alert(res.message || "Patient not found");
        navigate({ to: "/admin/patients" });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load patient details.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-lg font-semibold">
          Loading patient...
        </div>
      </DashboardLayout>
    );
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
          Patient not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Patient Details
            </h1>

            <p className="text-gray-500">
              Complete patient information
            </p>
          </div>

          <button
            onClick={() => navigate({ to: "/admin/patients" })}
            className="rounded-lg border px-5 py-2 hover:bg-gray-100"
          >
            Back
          </button>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-semibold">
            Patient Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <p className="text-gray-500">Full Name</p>
              <p className="font-semibold">{patient.full_name}</p>
            </div>

            <div>
              <p className="text-gray-500">Gender</p>
              <p className="font-semibold">{patient.gender}</p>
            </div>

            <div>
              <p className="text-gray-500">Age</p>
              <p className="font-semibold">{patient.age}</p>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-semibold">{patient.phone}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-semibold">
                {patient.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Registered On</p>
              <p className="font-semibold">
                {new Date(patient.created_at).toLocaleDateString()}
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-semibold">
            Appointment History
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Doctor</th>
                  <th className="p-3 text-left">Specialization</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>

                {appointments.length > 0 ? (
                  appointments.map((item) => (
                    <tr key={item.id} className="border-t">

                      <td className="p-3">
                        {item.doctor_name}
                      </td>

                      <td className="p-3">
                        {item.specialization}
                      </td>

                      <td className="p-3">
                        {new Date(
                          item.appointment_date
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-3">
                        {item.appointment_time}
                      </td>

                      <td className="p-3">
                        <span
                          className={`rounded-full px-3 py-1 text-sm text-white ${
                            item.status === "Completed"
                              ? "bg-green-600"
                              : item.status === "Cancelled"
                              ? "bg-red-600"
                              : "bg-blue-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-5 text-center text-gray-500"
                    >
                      No appointments found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}