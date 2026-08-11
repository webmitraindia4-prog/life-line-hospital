import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DoctorForm from "@/components/dashboard/DoctorForm";
import {
  getDoctorById,
  updateDoctor,
} from "@/services/adminDoctorService";

export const Route = createFileRoute("/admin/doctor-edit/$id")({
  component: EditDoctor,
});

function EditDoctor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDoctor();
  }, []);

  async function loadDoctor() {
    try {
      const res = await getDoctorById(id);

      if (res.success) {
        setDoctor(res.doctor);
      } else {
        alert("Doctor not found.");
        navigate({ to: "/admin/doctors" });
      }
    } catch (error) {
      console.error(error);
      alert("Unable to load doctor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data) {
    try {
      setSaving(true);

      const res = await updateDoctor(id, data);

      if (res.success) {
        alert("Doctor updated successfully.");
        navigate({ to: "/admin/doctors" });
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
      alert("Update failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-lg font-semibold">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold">
          Edit Doctor
        </h1>

        <DoctorForm
          initialData={doctor}
          submitText="Update Doctor"
          loading={saving}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}