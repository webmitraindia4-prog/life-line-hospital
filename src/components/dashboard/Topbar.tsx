import {
  Bell,
  Search,
  Settings,
  UserCircle2,
} from "lucide-react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { getCurrentUserRole } from "@/services/authService";

export default function Topbar() {
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const role = getCurrentUserRole();
  const roleLabel =
    role === "admin"
      ? "Administrator"
      : role === "doctor"
      ? "Doctor"
      : role === "patient"
      ? "Patient"
      : "User";

  const roleSubtitle =
    role === "admin"
      ? "Super Admin"
      : role === "doctor"
      ? "Doctor Portal"
      : role === "patient"
      ? "Patient Portal"
      : "Guest";

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = searchTerm.trim();
    if (!trimmed) {
      return;
    }

    const search = encodeURIComponent(trimmed);

    if (pathname.startsWith("/admin/patients")) {
      navigate({ to: `/admin/patients?search=${search}` });
      return;
    }

    if (pathname.startsWith("/admin/doctors")) {
      navigate({ to: `/admin/doctors?search=${search}` });
      return;
    }

    if (pathname.startsWith("/admin/appointments")) {
      navigate({ to: `/admin/appointments?search=${search}` });
      return;
    }

    navigate({ to: `/admin/doctors?search=${search}` });
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b bg-white px-6 shadow-sm">

      <div className="flex h-full items-center justify-between">

        {/* Left */}

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="text-xs text-gray-500">
            Lifeline Super Speciality Hospital
          </p>
        </div>

        {/* Search */}

        <form onSubmit={handleSearch} className="hidden lg:block w-[380px] relative">

          <Search
            size={18}
            className="absolute left-4 top-3 text-gray-400"
          />

          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg border bg-gray-50 py-2.5 pl-11 pr-4 outline-none focus:border-blue-600"
          />

        </form>

        {/* Right */}

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate({ to: "/admin/appointments" })}
            className="relative rounded-lg p-2 hover:bg-gray-100"
          >

            <Bell size={20} />

            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>

          </button>

          <button
            type="button"
            onClick={() => navigate({ to: "/admin/settings" })}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <Settings size={20} />
          </button>

          <div className="flex items-center gap-2 border-l pl-4">

            <UserCircle2
              size={38}
              className="text-blue-700"
            />

            <div className="hidden md:block">

              <h3 className="text-sm font-semibold">
                {roleLabel}
              </h3>

              <p className="text-xs text-gray-500">
                {roleSubtitle}
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}