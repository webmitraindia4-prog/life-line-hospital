import { createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Eye, UserRound } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getPatients, deletePatient } from "@/services/patientService";

export const Route = createFileRoute("/admin/patients")({
  component: PatientsPage,
});

function PatientsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(
    ((location as any).search?.search as string) || ""
  );

  const routeSearch = ((location as any).search?.search as string) || "";

  useEffect(() => {
    setSearch(routeSearch);
  }, [routeSearch]);

  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    try {
      const res = await getPatients();

      if (res.success) {
        setPatients(res.patients);
      } else {
        alert(res.message || "Unable to load patients.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePatient(id) {
    if (!confirm("Delete this patient?")) return;

    try {
      const res = await deletePatient(id);

      if (res.success) {
        alert(res.message || "Patient deleted.");
        loadPatients();
      } else {
        alert(res.message || "Unable to delete patient.");
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  }

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const keyword = search.toLowerCase();

      return (
        patient.full_name?.toLowerCase().includes(keyword) ||
        patient.phone?.toLowerCase().includes(keyword) ||
        patient.email?.toLowerCase().includes(keyword)
      );
    });
  }, [patients, search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Patients
          </h1>

          <p className="text-gray-500">
            Manage all registered patients
          </p>
        </div>

        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-3 text-gray-400"
          />

          <input
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border bg-white py-3 pl-12 pr-4 outline-none focus:border-blue-600"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow">
          {loading ? (
            <div className="p-10 text-center">
              Loading patients...
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4 text-left">Patient</th>
                  <th className="p-4 text-left">Gender</th>
                  <th className="p-4 text-left">Age</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-t hover:bg-slate-50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <UserRound />
                          </div>

                          <div>
                            <p className="font-semibold">
                              {patient.full_name}
                            </p>

                            <p className="text-sm text-gray-500">
                              {patient.email}
                            </p>
                          </div>

                        </div>
                      </td>

                      <td className="p-4">
                        {patient.gender}
                      </td>

                      <td className="p-4">
                        {patient.age}
                      </td>

                      <td className="p-4">
                        {patient.phone}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate({
                                to: "/admin/patient-view/$id",
                                params: {
                                  id: String(patient.id),
                                },
                              })
                            }
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-100"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => handleDeletePatient(patient.id)}
                            className="rounded-lg p-2 text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-10 text-center text-gray-500"
                    >
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}