import api from "./api";

export const getDoctors = async () => {
  const res = await api.get("/admin/doctors");
  return res.data;
};

export const getDoctor = async (id) => {
  const res = await api.get(`/admin/doctors/${id}`);
  return res.data;
};

export const getDoctorById = getDoctor;

export const createDoctor = async (data) => {
  const res = await api.post("/admin/doctors", data);
  return res.data;
};

export const updateDoctor = async (id, data) => {
  const res = await api.put(`/admin/doctors/${id}`, data);
  return res.data;
};

export const deleteDoctor = async (id) => {
  const res = await api.delete(`/admin/doctors/${id}`);
  return res.data;
};