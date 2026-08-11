import { useState } from "react";

export default function DoctorForm({
  initialData = {},
  onSubmit,
  loading = false,
  submitText = "Save Doctor",
}) {
  const [form, setForm] = useState({
    full_name: initialData.full_name || "",
    email: initialData.email || "",
    password: "",
    phone: initialData.phone || "",
    specialization: initialData.specialization || "",
    qualification: initialData.qualification || "",
    experience: initialData.experience || "",
    status: initialData.status || "Active",
    profile_image: initialData.profile_image || "",
  });

  const [preview, setPreview] = useState(
    initialData.profile_image || null
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Preview only
    setPreview(URL.createObjectURL(file));

    // Backend currently doesn't support uploads
    // Remove this if you later add multer
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.full_name.trim())
      return alert("Doctor name is required");

    if (!form.email.trim())
      return alert("Email is required");

    if (!initialData.id && !form.password.trim())
      return alert("Password is required");

    if (!form.phone.trim())
      return alert("Phone is required");

    if (!form.specialization.trim())
      return alert("Specialization is required");

    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl bg-white p-8 shadow"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block font-medium">
            Full Name
          </label>

          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={
              initialData.id
                ? "Leave blank to keep current password"
                : "Enter Password"
            }
            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Phone
          </label>

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Specialization
          </label>

          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Qualification
          </label>

          <input
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Experience (Years)
          </label>

          <input
            type="number"
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Status
          </label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">
            Profile Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full rounded-lg border p-2"
          />

          {preview && (
            <img
              src={preview}
              alt="Doctor"
              className="mt-4 h-36 w-36 rounded-xl border object-cover"
            />
          )}
        </div>

      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}