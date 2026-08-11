import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8">
      <div className="flex min-h-[80vh] rounded-2xl shadow-soft overflow-hidden">
        <Sidebar />

        <div className="flex flex-1 flex-col bg-transparent">
          <Topbar />

          <main className="flex-1 p-8">
            <div className="rounded-2xl bg-white shadow-card p-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}