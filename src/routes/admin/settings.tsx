import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getSettings, updateSettings } from "@/services/adminService";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [hospitalName, setHospitalName] = useState("Lifeline Super Speciality Hospital");
  const [hospitalEmail, setHospitalEmail] = useState("info@lifelinehospital.in");
  const [hospitalPhone, setHospitalPhone] = useState("+91 98765 43210");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("18:00");
  const [notificationEmail, setNotificationEmail] = useState(true);
  const [allowPatientRegistration, setAllowPatientRegistration] = useState(true);
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    setError(null);

    try {
      const result = await getSettings();

      if (result?.success) {
        const settings = result.settings || {};
        setHospitalName(settings.hospital_name || settings.hospitalName || "Lifeline Super Speciality Hospital");
        setHospitalEmail(settings.email || "info@lifelinehospital.in");
        setHospitalPhone(settings.phone || "+91 98765 43210");
        setHospitalAddress(settings.address || "");
        setOpeningTime(settings.opening_time || "09:00");
        setClosingTime(settings.closing_time || "18:00");
      } else {
        setError(result?.message || "Unable to load settings.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Unable to load settings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await updateSettings({
        hospital_name: hospitalName,
        email: hospitalEmail,
        phone: hospitalPhone,
        address: hospitalAddress,
        opening_time: openingTime,
        closing_time: closingTime,
      });

      if (result?.success) {
        setSuccessMessage(result.message || "Settings saved successfully.");
      } else {
        setError(result?.message || "Unable to save settings.");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="mt-2 text-gray-500">
            Configure hospital profile and admin preferences.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">Hospital Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Update the public hospital name and contact details.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Hospital Name</span>
                  <input
                    value={hospitalName}
                    onChange={(event) => setHospitalName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:bg-white"
                    placeholder="Hospital name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Hospital Email</span>
                  <input
                    type="email"
                    value={hospitalEmail}
                    onChange={(event) => setHospitalEmail(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:bg-white"
                    placeholder="contact@hospital.com"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Phone</span>
                  <input
                    type="tel"
                    value={hospitalPhone}
                    onChange={(event) => setHospitalPhone(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:bg-white"
                    placeholder="+91 12345 67890"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Timezone</span>
                  <select
                    value={timezone}
                    onChange={(event) => setTimezone(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                  </select>
                </label>
              </div>

              <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm font-semibold text-slate-800">Application Preferences</p>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notificationEmail}
                    onChange={(event) => setNotificationEmail(event.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">Send notification emails to staff</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={allowPatientRegistration}
                    onChange={(event) => setAllowPatientRegistration(event.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">Allow patient self-registration</span>
                </label>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Save Settings
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900">Security</h3>
              <p className="mt-2 text-sm text-slate-500">
                Manage admin access and security options for the hospital portal.
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">Password Policy</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Require all users to use a strong password with at least 10 characters.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">Account Lockout</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Automatically block access after five failed login attempts.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-slate-900">Support</h3>
              <p className="mt-2 text-sm text-slate-500">
                Assistance and support contact details for your hospital administration.
              </p>

              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Email:</span> support@lifelinehospital.in
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Phone:</span> +91 98765 43210
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
