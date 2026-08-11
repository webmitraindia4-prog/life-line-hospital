import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { FileBarChart2, Pill, AlertTriangle, Layers } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getMedicines, getLowStockMedicines } from "@/services/pharmacyService";
import { getSummaryReport } from "@/services/reportService";

export const Route = createFileRoute("/admin/reports")({
  component: AdminReportsPage,
});

function AdminReportsPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [lowStockMedicines, setLowStockMedicines] = useState<any[]>([]);
  const [summaryReport, setSummaryReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    setLoading(true);

    try {
      const [medicineRes, lowStockRes, summaryRes] = await Promise.all([
        getMedicines(),
        getLowStockMedicines(),
        getSummaryReport(),
      ]);

      if (medicineRes.success) {
        setMedicines(medicineRes.medicines);
      }

      if (lowStockRes.success) {
        setLowStockMedicines(lowStockRes.medicines);
      }

      if (summaryRes.success) {
        setSummaryReport(summaryRes.report);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to load report data.");
    } finally {
      setLoading(false);
    }
  }

  const totalStock = useMemo(
    () => medicines.reduce((sum, medicine) => sum + Number(medicine.stock || 0), 0),
    [medicines]
  );

  const totalValue = useMemo(
    () =>
      medicines.reduce(
        (sum, medicine) => sum + Number(medicine.stock || 0) * Number(medicine.price || 0),
        0
      ),
    [medicines]
  );

  const topLowStock = useMemo(
    () =>
      [...lowStockMedicines]
        .sort((a, b) => Number(a.stock) - Number(b.stock))
        .slice(0, 5),
    [lowStockMedicines]
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Reports</h1>
            <p className="text-gray-500">
              Pharmacy and hospital performance summary for administrators.
            </p>
          </div>
          <button
            type="button"
            onClick={loadReports}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Refresh data
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center gap-3 text-slate-700">
              <FileBarChart2 size={20} />
              <h2 className="text-lg font-semibold">Hospital Summary</h2>
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Patients</p>
                <p>{summaryReport?.patients ?? "—"}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Doctors</p>
                <p>{summaryReport?.doctors ?? "—"}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Appointments</p>
                <p>{summaryReport?.appointments ?? "—"}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Prescriptions</p>
                <p>{summaryReport?.prescriptions ?? "—"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center gap-3 text-slate-700">
              <Pill size={20} />
              <h2 className="text-lg font-semibold">Pharmacy Inventory</h2>
            </div>
            <div className="grid gap-4 text-sm text-slate-600">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Total medicines</p>
                <p>{medicines.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Total units in stock</p>
                <p>{totalStock}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Low-stock items</p>
                <p>{lowStockMedicines.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Inventory value</p>
                <p>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalValue)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow lg:col-span-2">
            <div className="mb-4 flex items-center gap-3 text-slate-700">
              <Layers size={20} />
              <h2 className="text-lg font-semibold">Inventory Health</h2>
            </div>
            <div className="grid gap-4 text-sm text-slate-600">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Low stock threshold</p>
                <p>10 units or less</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Understocked medicines</p>
                <p>{lowStockMedicines.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Last refresh</p>
                <p>{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border bg-white shadow">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">Top Low-Stock Medicines</h2>
              <p className="text-sm text-slate-500">
                Medicines that need restocking first.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
              <AlertTriangle size={16} /> Low stock
            </span>
          </div>
          {loading ? (
            <div className="p-10 text-center">Loading reports...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4 text-left">Medicine</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Stock</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {topLowStock.length > 0 ? (
                    topLowStock.map((medicine) => (
                      <tr key={medicine.id} className="border-t hover:bg-slate-50">
                        <td className="p-4 font-semibold">{medicine.medicine_name}</td>
                        <td className="p-4">{medicine.category}</td>
                        <td className="p-4 text-amber-700">{medicine.stock}</td>
                        <td className="p-4">{medicine.price}</td>
                        <td className="p-4">{new Date(medicine.expiry_date).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-gray-500">
                        No low-stock medicines available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
