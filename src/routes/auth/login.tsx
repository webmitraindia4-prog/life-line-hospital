import { createFileRoute, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  adminLogin,
  clearAuthToken,
  doctorLogin,
  patientLogin,
} from "@/services/authService";
import { Route as PatientDashboardRoute } from "@/routes/patient/dashboard";
import { Route as DoctorDashboardRoute } from "@/routes/doctor/dashboard";

export const Route = createFileRoute("/auth/login")({
  validateSearch: (search: any) => ({
    redirect: (search.redirect as string) || undefined,
    role:
      search.role === "admin" || search.role === "doctor" || search.role === "patient"
        ? search.role
        : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const redirect = params.get("redirect") || undefined;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(() => {
    const searchRole = params.get("role");
    if (searchRole === "admin" || searchRole === "doctor" || searchRole === "patient") {
      return searchRole;
    }

    if (redirect) {
      try {
        const url = new URL(redirect, window.location.origin);
        const path = url.pathname.toLowerCase();
        if (path.startsWith("/doctor")) return "doctor";
        if (path.startsWith("/patient")) return "patient";
        if (path.startsWith("/admin")) return "admin";
      } catch (error) {
        const path = redirect.toLowerCase();
        if (path.startsWith("/doctor")) return "doctor";
        if (path.startsWith("/patient")) return "patient";
        if (path.startsWith("/admin")) return "admin";
      }
    }

    return "doctor";
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const isRedirectAllowed = (role: string, redirectPath?: string) => {
    if (!redirectPath || !redirectPath.startsWith("/")) return false;
    if (role === "doctor" && redirectPath.startsWith("/doctor")) return true;
    if (role === "patient" && redirectPath.startsWith("/patient")) return true;
    if (role === "admin" && redirectPath.startsWith("/admin")) return true;
    return false;
  };

  const getDefaultRouteForRole = (role: string) => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "patient") return PatientDashboardRoute.to;
    return DoctorDashboardRoute.to;
  };

  // Debug logging
  useEffect(() => {
    console.log("Login page - location:", location);
    console.log("Login page - search params:", params.toString());
    console.log("Login page - redirect URL:", redirect);
    console.log("Login page - selected role:", role);
  }, [location, params, redirect, role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      clearAuthToken();

      let result;
      if (role === "doctor") {
        result = await doctorLogin({ email, password });
      } else if (role === "patient") {
        result = await patientLogin({ email, password });
      } else {
        result = await adminLogin({ email, password });
      }

      if (result?.success) {
        // Use redirect only when it matches the selected role, otherwise fallback to role default.
        let redirectUrl = redirect;
        console.log("Redirect URL from search:", redirectUrl);

        if (redirectUrl) {
          try {
            const url = new URL(redirectUrl, window.location.origin);
            const pathAndSearch = url.pathname + url.search;
            console.log("Parsed redirect path:", pathAndSearch);
            if (isRedirectAllowed(role, url.pathname)) {
              navigate({ to: pathAndSearch as any });
              return;
            }
          } catch (e) {
            console.log("Using redirect URL as-is:", redirectUrl);
            if (isRedirectAllowed(role, redirectUrl)) {
              navigate({ to: redirectUrl as any });
              return;
            }
          }
        }

        navigate({ to: getDefaultRouteForRole(role) as any });
      } else {
        alert(result?.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-700">
          Lifeline Hospital
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Hospital Management System
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {loginError ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {loginError}
          </div>
        ) : null}

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Admin-only doctor registration is available from the admin doctor management area.
        </div>
      </div>
    </div>
  );
}
