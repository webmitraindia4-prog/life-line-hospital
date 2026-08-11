import API from "./api";

// =============================
// Patient Registration (Public)
// =============================

export const registerPatient = (data) => {
  return API.post("/patient/register", data);
};

// =============================
// Patient Dashboard
// =============================

export const getPatientDashboard = async () => {
  try {
    const response = await API.get("/patient/dashboard");

    return {
      success: true,
      dashboard: response.data.dashboard || {
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        prescriptions: 0,
      },
    };
  } catch (error) {
    console.error("Get Patient Dashboard Error:", error);

    return {
      success: false,
      dashboard: {
        totalAppointments: 0,
        upcomingAppointments: 0,
        completedAppointments: 0,
        prescriptions: 0,
      },
    };
  }
};

// =============================
// Admin - Get All Patients
// =============================

export const getPatients = async () => {
  try {
    const response = await API.get("/admin/patients");

    return {
      success: true,
      patients: response.data.patients || [],
    };
  } catch (error) {
    console.error("Get Patients Error:", error);

    return {
      success: false,
      patients: [],
    };
  }
};

// =============================
// Admin - Get Patient Details
// =============================

export const getPatientById = async (id) => {
  try {
    const response = await API.get(`/admin/patients/${id}`);

    return response.data;
  } catch (error) {
    console.error("Get Patient Error:", error);

    return {
      success: false,
      patient: null,
      appointments: [],
    };
  }
};

// =============================
// Admin - Delete Patient
// =============================

export const deletePatient = async (id) => {
  try {
    const response = await API.delete(`/admin/patients/${id}`);

    return response.data;
  } catch (error) {
    console.error("Delete Patient Error:", error);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unable to delete patient.",
    };
  }
};