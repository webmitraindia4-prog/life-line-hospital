import {
  LayoutDashboard,
  Users,
  UserRound,
  CalendarDays,
  Pill,
  FileBarChart2,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { clearAuthToken } from "@/services/authService";
import { getCurrentUserRole } from "@/services/authService";

const menus = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    to: "/admin/dashboard",
  },
  {
    title: "Doctors",
    icon: UserRound,
    to: "/admin/doctors",
  },
  {
    title: "Patients",
    icon: Users,
    to: "/admin/patients",
  },
  {
    title: "Appointments",
    icon: CalendarDays,
    to: "/admin/appointments",
  },
  {
    title: "Pharmacy",
    icon: Pill,
    to: "/admin/pharmacy",
  },
  {
    title: "Reports",
    icon: FileBarChart2,
    to: "/admin/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    to: "/admin/settings",
  },
];

export default function Sidebar() {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    clearAuthToken();
    navigate({ to: "/auth/login" });
  };

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-72"
      } transition-all duration-300 bg-gradient-to-b from-blue-900 to-blue-700 text-white shadow-xl min-h-screen flex flex-col`}
    >
      {/* Header */}

      <div className="flex items-center justify-between p-5 border-b border-blue-500">

        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-white text-lg font-semibold shadow-card">
              {/* initials placeholder */}
              <span>DR</span>
            </div>

            <div>
              <h2 className="text-2xl font-bold">Dr. Stranger</h2>
              <p className="text-xs text-blue-200">{getCurrentUserRole() || "Administrator"}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 hover:bg-blue-600"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Menu */}

      <div className="flex-1 py-5">

        {menus.map((menu) => {
          const Icon = menu.icon;

          const active = pathname === menu.to;

          return (
            <Link
              key={menu.to}
              to={menu.to}
              className={`mx-3 mb-2 flex items-center rounded-xl px-4 py-3 transition-all duration-200
              ${
                active
                  ? "bg-white text-blue-700 shadow-lg"
                  : "hover:bg-blue-600"
              }`}
            >
              <Icon size={22} />

              {!collapsed && (
                <span className="ml-4 font-medium">
                  {menu.title}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer */}

      <div className="border-t border-blue-500 p-4">

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center rounded-xl px-4 py-3 hover:bg-red-600 transition"
        >
          <LogOut size={22} />

          {!collapsed && (
            <span className="ml-4 font-medium">
              Logout
            </span>
          )}
        </button>

      </div>
    </aside>
  );
}