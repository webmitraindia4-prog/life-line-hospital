import API from "./api";

export const bookAppointment = (data) => {
    return API.post("/appointments/book", data);
};

export const getAvailableSlots = (doctorId, date) => {
    return API.get(`/appointments/slots/${doctorId}/${date}`);
};

export const getAppointments = () => {
    return API.get("/appointments");
};

// ======================================
// Admin - Get All Appointments
// ======================================

export const getAdminAppointments = async () => {
  try {
    const response = await API.get("/admin/appointments");

    return {
      success: true,
      appointments: response.data.appointments || [],
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      appointments: [],
    };
  }
};

// ======================================
// Admin - Update Appointment Status
// ======================================

export const updateAppointmentStatus = async (id, status) => {
  try {
    const response = await API.put(`/admin/appointments/${id}`, {
      status,
    });

    return response.data;
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to update appointment.",
    };
  }
};

// ======================================
// Admin - Delete Appointment
// ======================================

export const deleteAppointment = async (id) => {
  try {
    const response = await API.delete(`/admin/appointments/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Unable to delete appointment.",
    };
  }
};