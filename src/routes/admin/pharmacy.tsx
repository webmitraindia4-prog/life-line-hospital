import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Pill,
  PillBottle,
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  dispenseMedicine,
  getLowStockMedicines,
} from "@/services/pharmacyService";
import { getAuthToken } from "@/services/authService";

const initialForm = {
  medicine_name: "",
  category: "",
  manufacturer: "",
  stock: "",
  price: "",
  expiry_date: "",
};

const initialDispenseForm = {
  patient_id: "",
  prescription_id: "",
  medicine_id: "",
  quantity: "",
};

export const Route = createFileRoute("/admin/pharmacy")({
  component: PharmacyPage,
});

function PharmacyPage() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [lowStockMedicines, setLowStockMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);
  const [dispenseForm, setDispenseForm] = useState(initialDispenseForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"inventory" | "lowStock" | "dispense">("inventory");
  const [dispensing, setDispensing] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate({ to: "/auth/login" });
      return;
    }

    loadMedicines();
    loadLowStockMedicines();
  }, []);

  async function loadMedicines() {
    try {
      const res = await getMedicines();

      if (res.success) {
        setMedicines(res.medicines);
      } else {
        setError(res.message || "Failed to load medicines.");
      }
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || error.message || "Failed to load medicines.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLowStockMedicines() {
    try {
      const res = await getLowStockMedicines();

      if (res.success) {
        setLowStockMedicines(res.medicines);
      } else {
        setError(res.message || "Failed to load low stock medicines.");
      }
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || error.message || "Failed to load low stock medicines.");
    }
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function resetDispenseForm() {
    setDispenseForm(initialDispenseForm);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleDispenseChange(event) {
    const { name, value } = event.target;
    setDispenseForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      ...form,
      stock: Number(form.stock),
      price: Number(form.price),
    };

    try {
      let res;

      if (editingId) {
        res = await updateMedicine(editingId, payload);
      } else {
        res = await createMedicine(payload);
      }

      if (res.success) {
        alert(res.message || "Saved successfully.");
        resetForm();
        loadMedicines();
        loadLowStockMedicines();
      } else {
        alert(res.message || "Unable to save medicine.");
      }
    } catch (error) {
      console.error(error);
      alert("Save failed.");
    }
  }

  async function handleDispenseSubmit(event) {
    event.preventDefault();

    if (!dispenseForm.patient_id || !dispenseForm.medicine_id || !dispenseForm.quantity) {
      alert("Please complete all required dispense fields.");
      return;
    }

    const payload = {
      patient_id: Number(dispenseForm.patient_id),
      prescription_id: dispenseForm.prescription_id
        ? Number(dispenseForm.prescription_id)
        : undefined,
      medicine_id: Number(dispenseForm.medicine_id),
      quantity: Number(dispenseForm.quantity),
    };

    setDispensing(true);

    try {
      const res = await dispenseMedicine(payload);

      if (res.success) {
        alert(res.message || "Medicine dispensed successfully.");
        resetDispenseForm();
        loadMedicines();
        loadLowStockMedicines();
      } else {
        alert(res.message || "Unable to dispense medicine.");
      }
    } catch (error) {
      console.error(error);
      alert("Dispense failed.");
    } finally {
      setDispensing(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this medicine?")) return;

    try {
      const res = await deleteMedicine(id);

      if (res.success) {
        alert(res.message || "Medicine deleted.");
        loadMedicines();
        loadLowStockMedicines();
      } else {
        alert(res.message || "Unable to delete medicine.");
      }
    } catch (error) {
      console.error(error);
      alert("Delete failed.");
    }
  }

  function handleEdit(medicine) {
    setEditingId(medicine.id);
    setForm({
      medicine_name: medicine.medicine_name,
      category: medicine.category,
      manufacturer: medicine.manufacturer,
      stock: String(medicine.stock),
      price: String(medicine.price),
      expiry_date: medicine.expiry_date?.slice(0, 10) || "",
    });
    setActiveTab("inventory");
  }

  const selectedMedicine = medicines.find(
    (medicine) => String(medicine.id) === dispenseForm.medicine_id
  );

  const totalStock = medicines.reduce(
    (sum, medicine) => sum + Number(medicine.stock || 0),
    0
  );

  const totalInventoryValue = medicines.reduce(
    (sum, medicine) => sum + Number(medicine.stock || 0) * Number(medicine.price || 0),
    0
  );

  const stockTabs = [
    { id: "inventory", label: "Inventory" },
    { id: "lowStock", label: "Low Stock" },
    { id: "dispense", label: "Dispense" },
  ] as const;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Pharmacy</h1>
            <p className="text-gray-500">Manage medicines, stock, and inventory.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {stockTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center gap-3 text-slate-700">
              <Pill size={20} />
              <h2 className="text-xl font-semibold">Inventory</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total medicines</p>
                <p className="text-3xl font-bold text-slate-900">{medicines.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Total stock units</p>
                <p className="text-3xl font-bold text-slate-900">{totalStock}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Low-stock medicines</p>
                <p className="text-3xl font-bold text-slate-900">{lowStockMedicines.length}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Inventory value</p>
                <p className="text-3xl font-bold text-slate-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalInventoryValue)}
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 rounded-3xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center gap-3 text-slate-700">
              <PillBottle size={20} />
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <p className="text-sm text-slate-500">
              Use the tabs above to switch between inventory, low-stock alerts, and medicine dispensing.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setActiveTab("inventory")}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Open Inventory
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("lowStock")}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                View Low Stock
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("dispense")}
                className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              >
                Dispense Medicine
              </button>
            </div>
            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-700">Current tab</p>
              <div className="mt-4 rounded-3xl bg-slate-50 p-4">
                {activeTab === "inventory" && (
                  <>
                    <p className="text-lg font-semibold text-slate-900">Inventory</p>
                    <p className="mt-2 text-sm text-slate-600">Showing all medicines in stock. Scroll down for the full inventory table.</p>
                    <p className="mt-3 text-sm text-slate-500">Total medicines: {medicines.length}</p>
                  </>
                )}
                {activeTab === "lowStock" && (
                  <>
                    <p className="text-lg font-semibold text-slate-900">Low Stock</p>
                    <p className="mt-2 text-sm text-slate-600">Showing medicines at or below the low-stock threshold.</p>
                    <p className="mt-3 text-sm text-slate-500">Low-stock medicines: {lowStockMedicines.length}</p>
                  </>
                )}
                {activeTab === "dispense" && (
                  <>
                    <p className="text-lg font-semibold text-slate-900">Dispense</p>
                    <p className="mt-2 text-sm text-slate-600">Use this tab to select a medicine and dispense it to a patient.</p>
                    <p className="mt-3 text-sm text-slate-500">Selected medicine: {selectedMedicine?.medicine_name ?? "None"}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {activeTab === "inventory" && (
          <div className="overflow-hidden rounded-2xl border bg-white shadow">
            {loading ? (
              <div className="p-10 text-center">Loading medicines...</div>
            ) : error ? (
              <div className="p-10 text-center text-red-600">{error}</div>
            ) : (
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Manufacturer</th>
                    <th className="p-4 text-left">Stock</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Expiry</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {medicines.length > 0 ? (
                    medicines.map((medicine) => (
                      <tr key={medicine.id} className="border-t hover:bg-slate-50">
                        <td className="p-4 font-semibold">{medicine.medicine_name}</td>
                        <td className="p-4">{medicine.category}</td>
                        <td className="p-4">{medicine.manufacturer}</td>
                        <td className="p-4">{medicine.stock}</td>
                        <td className="p-4">{medicine.price}</td>
                        <td className="p-4">{new Date(medicine.expiry_date).toLocaleDateString()}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(medicine)}
                              className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-200"
                            >
                              <Pencil size={16} />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(medicine.id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-red-100 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-gray-500">
                        No medicines found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "lowStock" && (
          <div className="overflow-hidden rounded-2xl border bg-white shadow">
            {error ? (
              <div className="p-10 text-center text-red-600">{error}</div>
            ) : (
              <>
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-800">Low Stock Alerts</h2>
                  <p className="text-sm text-slate-500">
                    These medicines are at or below the low-stock threshold.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Category</th>
                        <th className="p-4 text-left">Stock</th>
                        <th className="p-4 text-left">Price</th>
                        <th className="p-4 text-left">Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockMedicines.length > 0 ? (
                        lowStockMedicines.map((medicine) => (
                          <tr key={medicine.id} className="border-t hover:bg-slate-50">
                            <td className="p-4 font-semibold">{medicine.medicine_name}</td>
                            <td className="p-4">{medicine.category}</td>
                            <td className="p-4">{medicine.stock}</td>
                            <td className="p-4">{medicine.price}</td>
                            <td className="p-4">{new Date(medicine.expiry_date).toLocaleDateString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-10 text-center text-gray-500">
                            No low-stock medicines found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "dispense" && (
          <div className="rounded-3xl bg-white p-6 shadow">
            {error ? (
              <div className="p-10 text-center text-red-600">{error}</div>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-3 text-slate-700">
                  <PillBottle size={20} />
                  <h2 className="text-xl font-semibold">Dispense Medicine</h2>
                </div>
                <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleDispenseSubmit}>
                  <div className="grid gap-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Patient ID
                      <input
                        name="patient_id"
                        value={dispenseForm.patient_id}
                        onChange={handleDispenseChange}
                        type="number"
                        placeholder="Enter patient ID"
                        className="mt-2 w-full rounded-xl border bg-white p-3 outline-none focus:border-blue-600"
                        required
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Prescription ID
                      <input
                        name="prescription_id"
                        value={dispenseForm.prescription_id}
                        onChange={handleDispenseChange}
                        type="number"
                        placeholder="Optional prescription ID"
                        className="mt-2 w-full rounded-xl border bg-white p-3 outline-none focus:border-blue-600"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4">
                    <label className="block text-sm font-medium text-slate-700">
                      Medicine
                      <select
                        name="medicine_id"
                        value={dispenseForm.medicine_id}
                        onChange={handleDispenseChange}
                        className="mt-2 w-full rounded-xl border bg-white p-3 outline-none focus:border-blue-600"
                        required
                      >
                        <option value="">Select medicine</option>
                        {medicines.map((medicine) => (
                          <option key={medicine.id} value={medicine.id}>
                            {medicine.medicine_name} ({medicine.stock} in stock)
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Quantity
                      <input
                        name="quantity"
                        value={dispenseForm.quantity}
                        onChange={handleDispenseChange}
                        type="number"
                        min="1"
                        placeholder="Number of units"
                        className="mt-2 w-full rounded-xl border bg-white p-3 outline-none focus:border-blue-600"
                        required
                      />
                    </label>
                  </div>

                  <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-600">Selected medicine</p>
                    {selectedMedicine ? (
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{selectedMedicine.medicine_name}</p>
                          <p className="text-sm text-slate-600">Stock available: {selectedMedicine.stock}</p>
                        </div>
                        <p className="text-right text-sm text-slate-500">
                          Price per unit: {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(Number(selectedMedicine.price || 0))}
                        </p>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-slate-500">Pick a medicine to see available stock and unit pricing.</p>
                    )}
                  </div>

                  <div className="lg:col-span-2 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={dispensing}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Plus size={16} />
                      Dispense
                    </button>
                    <button
                      type="button"
                      onClick={resetDispenseForm}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}

        <div className="rounded-3xl bg-white p-6 shadow">
          <div className="mb-4 flex items-center gap-3 text-slate-700">
            <Pill size={20} />
            <h2 className="text-xl font-semibold">{editingId ? "Edit Medicine" : "Add Medicine"}</h2>
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <input
              name="medicine_name"
              value={form.medicine_name}
              onChange={handleChange}
              placeholder="Medicine name"
              className="rounded-xl border bg-white p-3 outline-none focus:border-blue-600"
              required
            />
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="rounded-xl border bg-white p-3 outline-none focus:border-blue-600"
              required
            />
            <input
              name="manufacturer"
              value={form.manufacturer}
              onChange={handleChange}
              placeholder="Manufacturer"
              className="rounded-xl border bg-white p-3 outline-none focus:border-blue-600"
            />
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="rounded-xl border bg-white p-3 outline-none focus:border-blue-600"
              required
            />
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="rounded-xl border bg-white p-3 outline-none focus:border-blue-600"
              required
            />
            <input
              name="expiry_date"
              type="date"
              value={form.expiry_date}
              onChange={handleChange}
              className="rounded-xl border bg-white p-3 outline-none focus:border-blue-600"
            />
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
