import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Loader2, ShieldCheck, Stethoscope } from "lucide-react";
import { createDoctor } from "@/services/doctorService";
import { isAdminAuthenticated } from "@/services/authService";

export const Route = createFileRoute("/doctor/register")({
  beforeLoad: () => {
    if (!isAdminAuthenticated()) {
      throw redirect({ to: "/auth/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Doctor Registration — Lifeline Super Speciality Hospital" },
      { name: "description", content: "Admin-only doctor registration flow for creating doctor accounts in the hospital system." },
    ],
  }),
  component: DoctorRegisterPage,
});

function DoctorRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const result = await createDoctor({
        ...form,
        experience: Number(form.experience) || 0,
      });

      if (result?.success) {
        setMessage(result.message || "Doctor created successfully.");
        navigate({ to: "/admin/doctors" });
        return;
      }

      setMessage(result?.message || "Doctor registration failed.");
    } catch (error: any) {
      console.error("Doctor register error:", error);
      setMessage(error?.response?.data?.message || error.message || "Unable to register doctor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-white p-8 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.3em] text-brand">ADMIN CONTROL</p>
            <h1 className="text-2xl font-extrabold text-navy">Register Doctor</h1>
          </div>
        </div>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-secondary/70 px-3 py-2 text-xs font-semibold text-navy">
          <ShieldCheck className="h-4 w-4" />
          Restricted to admin account holders only
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input name="full_name" value={form.full_name} onChange={handleChange} placeholder="Full Name" className="w-full rounded-xl border border-border p-3" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full rounded-xl border border-border p-3" required />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full rounded-xl border border-border p-3" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full rounded-xl border border-border p-3" required />
          <input name="specialization" value={form.specialization} onChange={handleChange} placeholder="Specialization" className="w-full rounded-xl border border-border p-3" required />
          <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualification" className="w-full rounded-xl border border-border p-3" />
          <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} placeholder="Experience (years)" className="w-full rounded-xl border border-border p-3" />

          <button type="submit" disabled={loading} className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:translate-y-[-1px] disabled:opacity-70">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            {loading ? "Creating Account..." : "Register & Continue"}
          </button>
        </form>

        {message ? (
          <div className="mt-4 rounded-2xl bg-secondary/70 p-4 text-sm text-navy">{message}</div>
        ) : null}
      </div>
    </div>
  );
}
