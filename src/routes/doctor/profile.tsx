import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogOut, Save, UserCircle2, CalendarPlus2, CalendarRange } from "lucide-react";
import { PageHero } from "@/components/site-chrome";
import bannerContact from "@/assets/banner-contact.jpg";
import {
  changeDoctorPassword,
  getDoctorAvailability,
  getDoctorLeaves,
  getDoctorProfile,
  applyDoctorLeave,
  setDoctorAvailability,
  updateDoctorProfile,
} from "@/services/doctorService";
import { clearAuthToken, isDoctorAuthenticated } from "@/services/authService";

export const Route = createFileRoute("/doctor/profile")({
  beforeLoad: () => {
    if (!isDoctorAuthenticated()) {
      throw redirect({ to: "/auth/login?redirect=/doctor/profile&role=doctor" });
    }
  },
  head: () => ({
    meta: [
      { title: "Doctor Profile — Lifeline Super Speciality Hospital" },
      { name: "description", content: "View and update your doctor profile in the protected doctor portal." },
    ],
  }),
  component: DoctorProfilePage,
});

function DoctorProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    id: 0,
    full_name: "",
    email: "",
    specialization: "",
    qualification: "",
    experience: 0,
    phone: "",
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [availabilityForm, setAvailabilityForm] = useState({ available_date: "", start_time: "", end_time: "", slot_duration: 30 });
  const [leaveForm, setLeaveForm] = useState({ leave_date: "", reason: "" });
  const [availability, setAvailability] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isDoctorAuthenticated()) {
      navigate({ to: "/auth/login" });
      return;
    }

    const loadProfile = async () => {
      try {
        const profileRes = await getDoctorProfile();
        const availabilityRes = await getDoctorAvailability();
        const leavesRes = await getDoctorLeaves();

        if (profileRes?.success && profileRes.doctor) {
          setProfile(profileRes.doctor);
        }

        if (availabilityRes?.success) {
          setAvailability(availabilityRes.availability || []);
        }

        if (leavesRes?.success) {
          setLeaves(leavesRes.leaves || []);
        }
      } catch (error) {
        console.error("Doctor profile load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const result = await updateDoctorProfile({
        full_name: profile.full_name,
        phone: profile.phone,
        qualification: profile.qualification,
        experience: Number(profile.experience || 0),
      });

      setMessage(result?.message || "Profile updated successfully.");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || error.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    try {
      const result = await changeDoctorPassword(passwordForm);
      setMessage(result?.message || "Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error: any) {
      setMessage(error?.response?.data?.message || error.message || "Unable to change password.");
    }
  };

  const handleAvailabilitySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    const result = await setDoctorAvailability(availabilityForm);
    setMessage(result?.message || "Availability saved successfully.");

    if (result?.success) {
      const availabilityRes = await getDoctorAvailability();
      setAvailability(availabilityRes?.availability || []);
      setAvailabilityForm({ available_date: "", start_time: "", end_time: "", slot_duration: 30 });
    }
  };

  const handleLeaveSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    const result = await applyDoctorLeave(leaveForm);
    setMessage(result?.message || "Leave request submitted successfully.");

    if (result?.success) {
      const leavesRes = await getDoctorLeaves();
      setLeaves(leavesRes?.leaves || []);
      setLeaveForm({ leave_date: "", reason: "" });
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate({ to: "/auth/login" });
  };

  return (
    <>
      <PageHero
        eyebrow="DOCTOR PROFILE"
        title="My Profile"
        subtitle="Update your details, manage your password, and keep your professional profile current."
        image={bannerContact}
        variant="spotlight"
      />

      <section className="mx-auto max-w-7xl px-4 py-14">
        {loading ? (
          <div className="rounded-3xl border border-border bg-white p-10 text-center text-lg font-semibold text-muted-foreground">
            <Loader2 className="mx-auto mb-3 h-5 w-5 animate-spin" />
            Loading profile...
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <form onSubmit={handleProfileSubmit} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <UserCircle2 className="h-6 w-6 text-brand" />
                <h2 className="text-xl font-bold text-navy">Doctor Details</h2>
              </div>

              <div className="grid gap-4">
                <input name="full_name" value={profile.full_name} onChange={handleProfileChange} className="rounded-xl border border-border p-3" placeholder="Full Name" required />
                <input name="email" value={profile.email} readOnly className="rounded-xl border border-border bg-secondary/40 p-3" placeholder="Email" />
                <input name="specialization" value={profile.specialization} readOnly className="rounded-xl border border-border bg-secondary/40 p-3" placeholder="Specialization" />
                <input name="phone" value={profile.phone} onChange={handleProfileChange} className="rounded-xl border border-border p-3" placeholder="Phone" required />
                <input name="qualification" value={profile.qualification || ""} onChange={handleProfileChange} className="rounded-xl border border-border p-3" placeholder="Qualification" />
                <input name="experience" type="number" min="0" value={profile.experience || 0} onChange={handleProfileChange} className="rounded-xl border border-border p-3" placeholder="Experience" />
              </div>

              <button type="submit" disabled={saving} className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>

            <form onSubmit={handlePasswordSubmit} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <LogOut className="h-6 w-6 text-brand" />
                <h2 className="text-xl font-bold text-navy">Password Security</h2>
              </div>

              <div className="grid gap-4">
                <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} className="rounded-xl border border-border p-3" placeholder="Current Password" required />
                <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))} className="rounded-xl border border-border p-3" placeholder="New Password" required />
              </div>

              <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-navy">
                Update Password
              </button>
            </form>

            <form onSubmit={handleAvailabilitySubmit} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <CalendarPlus2 className="h-6 w-6 text-brand" />
                <h2 className="text-xl font-bold text-navy">Availability</h2>
              </div>

              <div className="grid gap-4">
                <input type="date" value={availabilityForm.available_date} onChange={(e) => setAvailabilityForm((prev) => ({ ...prev, available_date: e.target.value }))} className="rounded-xl border border-border p-3" required />
                <input type="time" value={availabilityForm.start_time} onChange={(e) => setAvailabilityForm((prev) => ({ ...prev, start_time: e.target.value }))} className="rounded-xl border border-border p-3" required />
                <input type="time" value={availabilityForm.end_time} onChange={(e) => setAvailabilityForm((prev) => ({ ...prev, end_time: e.target.value }))} className="rounded-xl border border-border p-3" required />
                <input type="number" min="15" step="15" value={availabilityForm.slot_duration} onChange={(e) => setAvailabilityForm((prev) => ({ ...prev, slot_duration: Number(e.target.value) }))} className="rounded-xl border border-border p-3" placeholder="Slot duration (minutes)" required />
              </div>

              <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
                Save Availability
              </button>

              <div className="mt-4 space-y-2">
                {availability.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No availability saved yet.</p>
                ) : (
                  availability.map((slot) => (
                    <div key={slot.id} className="rounded-2xl bg-secondary/70 p-3 text-sm text-navy">
                      {slot.available_date} · {slot.start_time} to {slot.end_time}
                    </div>
                  ))
                )}
              </div>
            </form>

            <form onSubmit={handleLeaveSubmit} className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <CalendarRange className="h-6 w-6 text-brand" />
                <h2 className="text-xl font-bold text-navy">Leave Request</h2>
              </div>

              <div className="grid gap-4">
                <input type="date" value={leaveForm.leave_date} onChange={(e) => setLeaveForm((prev) => ({ ...prev, leave_date: e.target.value }))} className="rounded-xl border border-border p-3" required />
                <textarea value={leaveForm.reason} onChange={(e) => setLeaveForm((prev) => ({ ...prev, reason: e.target.value }))} className="rounded-xl border border-border p-3" rows={4} placeholder="Reason for leave" />
              </div>

              <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-navy">
                Apply Leave
              </button>

              <div className="mt-4 space-y-2">
                {leaves.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No leave requests yet.</p>
                ) : (
                  leaves.map((leave) => (
                    <div key={leave.id} className="rounded-2xl bg-secondary/70 p-3 text-sm text-navy">
                      {leave.leave_date} · {leave.reason || "No reason given"}
                    </div>
                  ))
                )}
              </div>
            </form>
          </div>
        )}

        {message ? (
          <div className="mt-6 rounded-2xl bg-secondary/70 p-4 text-sm text-navy">{message}</div>
        ) : null}
      </section>
    </>
  );
}
