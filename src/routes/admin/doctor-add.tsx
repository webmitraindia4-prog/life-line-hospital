import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DoctorForm from "@/components/dashboard/DoctorForm";
import { createDoctor } from "@/services/adminDoctorService";

export const Route = createFileRoute("/admin/doctor-add")({
  component: AddDoctor,
});

function AddDoctor() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (doctor) => {
    try {
      setLoading(true);

      const response = await createDoctor(doctor);

      if (response.success) {
        alert("Doctor added successfully.");

        navigate({
          to: "/admin/doctors",
        });
      } else {
        alert(response.message || "Failed to add doctor.");
      }
    } catch (error) {
      console.error(
        "Add Doctor Error:",
        error.response?.data || error.message || error
      );
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Add Doctor
            </h1>

            <p className="mt-2 text-gray-500">
              Create a new doctor account.
            </p>
          </div>

          <button
            onClick={() =>
              navigate({
                to: "/admin/doctors",
              })
            }
            className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100"
          >
            Back
          </button>
        </div>

        <DoctorForm
          initialData={{}}
          loading={loading}
          submitText="Add Doctor"
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}

export default AddDoctor;