import api from "./api";

export const getDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

export const getDashboardTrends = async () => {
  const res = await api.get("/admin/dashboard/trends");
  return res.data;
};

export const getSettings = async () => {
  const res = await api.get("/admin/settings");
  return res.data;
};

export const updateSettings = async (settings) => {
  const res = await api.put("/admin/settings", settings);
  return res.data;
};