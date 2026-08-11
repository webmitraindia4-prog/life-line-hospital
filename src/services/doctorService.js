import API from "./api";

import doctor1 from "@/assets/dr-photo-1.jpeg";
import doctor2 from "@/assets/dr-photo-2.jpeg";
import doctor3 from "@/assets/dr-photo-3.jpeg";
import doctor4 from "@/assets/dr-photo-4.jpeg";
import doctor5 from "@/assets/dr-photo-5.jpeg";
import doctor6 from "@/assets/dr-photo-6.jpeg";
import doctor7 from "@/assets/dr-photo-7.jpeg";
import doctor8 from "@/assets/dr-photo-8.jpeg";
import doctor9 from "@/assets/dr-photo-9.jpeg";
import doctor10 from "@/assets/dr-photo-10.jpeg";
import doctor11 from "@/assets/dr-photo-11.jpeg";
import doctor12 from "@/assets/dr-photo-12.jpeg";

const fallbackImages = [
  doctor1,
  doctor2,
  doctor3,
  doctor4,
  doctor5,
  doctor6,
  doctor7,
  doctor8,
  doctor9,
  doctor10,
  doctor11,
  doctor12
];

const DOCTOR_DISPLAY_ORDER = [
  "Dr. M.A Huq Nadeeem",
  "Dr. Vijay Rathod",
  "Dr. Arif Mulla",
  "Dr. Khayyum Pasha",
  "Dr. Anil Garildinni",
  "Dr. Hari Prasad",
  "Dr. Dikka Roa.M",
  "Dr. C.H Ramesh",
  "Dr. Shahdab Ahmed",
  "Dr. Ayesha Zeba",
  "Dr. Bande Nawaz",
  "Dr. Sukh Sagar",
];

const IMAGE_BY_NAME = {
  "Dr. M.A Huq Nadeeem": doctor1,
  "Dr. Vijay Rathod": doctor2,
  "Dr. Arif Mulla": doctor3,
  "Dr. Khayyum Pasha": doctor4,
  "Dr. Anil Garildinni": doctor4,
  "Dr. Hari Prasad": doctor5,
  "Dr. Dikka Roa.M": doctor6,
  "Dr. C.H Ramesh": doctor7,
  "Dr. Shahdab Ahmed": doctor8,
  "Dr. Ayesha Zeba": doctor9,
  "Dr. Bande Nawaz": doctor10,
  "Dr. Sukh Sagar": doctor11,
};

const canonicalName = (name) =>
  String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 ]/g, "");

const CANONICAL_IMAGE_BY_NAME = Object.fromEntries(
  Object.entries(IMAGE_BY_NAME).map(([name, image]) => [
    canonicalName(name),
    image,
  ])
);

const ORDER_INDEX_BY_CANONICAL = Object.fromEntries(
  DOCTOR_DISPLAY_ORDER.map((name, index) => [
    canonicalName(name),
    index,
  ])
);

const getDoctorImage = (doctor, index) => {
  const candidate = doctor.profile_image || doctor.image;

  if (
    typeof candidate === "string" &&
    candidate.trim() !== ""
  ) {
    return candidate;
  }

  const nameKey = canonicalName(
    doctor.full_name || doctor.name || ""
  );

  if (CANONICAL_IMAGE_BY_NAME[nameKey]) {
    return CANONICAL_IMAGE_BY_NAME[nameKey];
  }

  return fallbackImages[index % fallbackImages.length];
};

const normalizeDoctorEntry = (doctor, index) => {
  return {
    ...doctor,

    image: getDoctorImage(doctor, index),

    canonicalName: canonicalName(
      doctor.full_name || doctor.name || ""
    ),
  };
};

const sortDoctors = (doctors) => {
  return [...doctors].sort((a, b) => {
    const indexA =
      ORDER_INDEX_BY_CANONICAL[a.canonicalName];

    const indexB =
      ORDER_INDEX_BY_CANONICAL[b.canonicalName];

    const knownA = indexA !== undefined;
    const knownB = indexB !== undefined;

    if (knownA && knownB) {
      return indexA - indexB;
    }

    if (knownA) return -1;

    if (knownB) return 1;

    return (
      a.full_name || a.name || ""
    ).localeCompare(
      b.full_name || b.name || ""
    );
  });
};


/*
|--------------------------------------------------------------------------
| FALLBACK DATA
|--------------------------------------------------------------------------
*/

export const fallbackDoctors = [
  {
    id: 101,
    full_name: "Dr. M.A Huq Nadeeem",
    specialization: "Ophthalmology",
    qualification: "MBBS, DOMS",
    experience: 17,
    status: "Active",
    description: "Renowned ophthalmologist offering expert cataract and retinal care with a patient-centered approach.",
    profile_image: doctor1,
  },

  {
    id: 102,
    full_name: "Dr. Vijay Rathod",
    specialization: "Neuro Surgeon",
    qualification: "MBBS, M.Ch",
    experience: 10,
    status: "Active",
    description: "Neurosurgeon specializing in advanced brain and spine procedures with compassionate surgical care.",
    profile_image: doctor2,
  },

  {
    id: 103,
    full_name: "Dr. Arif Mulla",
    specialization: "Retina Specialist",
    qualification: "MBBS, DNB",
    experience: 18,
    status: "Active",
    description: "Retina specialist focused on precision diagnostics and modern treatment for complex eye conditions.",
    profile_image: doctor3,
  },

  {
    id: 104,
    full_name: "Dr. Khayyum Pasha",
    specialization:
      "Physician, Diabetologist & Cardiologist",
    qualification: "MBBS, MD",
    experience: 3,
    status: "Active",
    description: "Expert physician in diabetes and heart care, blending preventive medicine with individualized treatment plans.",
    profile_image: doctor4,
  },

  {
    id: 105,
    full_name: "Dr. Anil Garildinni",
    specialization: "Gastroenterology",
    qualification: "MBBS, MD",
    experience: 8,
    status: "Active",
    description: "Gastroenterologist delivering compassionate care for digestive health and advanced endoscopic therapies.",
    profile_image: doctor5,
  },

  {
    id: 106,
    full_name: "Dr. Hari Prasad",
    specialization:
      "Physician, Diabetologist & Cardiologist",
    qualification: "MBBS, DCH",
    experience: 10,
    status: "Active",
    description: "Comprehensive care specialist for diabetes, cardiology, and general medicine with strong patient education.",
    profile_image: doctor6,
  },

  {
    id: 107,
    full_name: "Dr. Dikka Roa.M",
    specialization: "Pediatrician",
    qualification: "MBBS, DM",
    experience: 17,
    status: "Active",
    description: "Pediatrician dedicated to healthy childhood development and family-focused pediatric care.",
    profile_image: doctor7,
  },

  {
    id: 108,
    full_name: "Dr. C.H Ramesh",
    specialization: "Oncologist",
    qualification: "MBBS, MS",
    experience: 18,
    status: "Active",
    description: "Oncologist with extensive experience in cancer care, offering compassionate support throughout treatment.",
    profile_image: doctor8,
  },

  {
    id: 109,
    full_name: "Dr. Shahdab Ahmed",
    specialization: "Orthopaedician",
    qualification: "MBBS, MS",
    experience: 17,
    status: "Active",
    description: "Orthopaedician focused on joint health and advanced musculoskeletal treatments for active lifestyles.",
    profile_image: doctor9,
  },

  {
    id: 110,
    full_name: "Dr. Ayesha Zeba",
    specialization: "Pediatrician",
    qualification: "MBBS, MD",
    experience: 8,
    status: "Active",
    description: "Dedicated pediatrician who supports families with gentle and holistic child healthcare.",
    profile_image: doctor10,
  },

  {
    id: 111,
    full_name: "Dr. Bande Nawaz",
    specialization: "Medico Legal Consultant",
    qualification: "MBBS",
    experience: 15,
    status: "Active",
    description: "Medico-legal expert providing dependable legal and medical guidance in clinical cases.",
    profile_image: doctor11,
  },

  {
    id: 112,
    full_name: "Dr. Sukh Sagar",
    specialization:
      "Orthopaedian & Joint Replacement",
    qualification: "MBBS, MS",
    experience: 7,
    status: "Active",
    description: "Specialist in joint replacement and orthopaedic care, helping patients restore mobility and comfort.",
    profile_image: doctor12,
  },

 
];

export const getDoctorTrends = async () => {
  const res = await API.get("/doctor/dashboard/trends");
  return res.data;
};


/*
|--------------------------------------------------------------------------
| GET DOCTORS
|--------------------------------------------------------------------------
*/

export const getDoctors = async () => {
  try {
    const response = await API.get("/doctor/all");

    const doctors =
      response.data?.doctors || [];

    if (doctors.length >= fallbackDoctors.length) {
      const normalized =
        doctors.map(normalizeDoctorEntry);

      return {
        success: true,
        doctors: sortDoctors(normalized),
      };
    }

    return {
      success: true,
      doctors: sortDoctors(
        fallbackDoctors.map(
          normalizeDoctorEntry
        )
      ),
    };

  } catch (error) {

    console.error(
      "Doctor API Error:",
      error
    );

    return {
      success: true,
      doctors: sortDoctors(
        fallbackDoctors.map(
          normalizeDoctorEntry
        )
      ),
    };
  }
};

export const createDoctor = async (data) => {
  try {
    const response = await API.post("/doctor/register", data);
    return response.data;
  } catch (error) {
    console.error("Create Doctor API Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to create doctor.",
    };
  }
};

const normalizeAppointment = (appointment) => ({
  ...appointment,
  appointment_date: String(appointment.appointment_date),
});

const loadDoctorAppointments = async () => {
  try {
    const response = await API.get("/appointments/doctor");
    return response.data?.appointments?.map(normalizeAppointment) || [];
  } catch (error) {
    console.error("Doctor appointments API Error:", error);
    return [];
  }
};

export const getDoctorDashboard = async () => {
  const appointments = await loadDoctorAppointments();
  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments.filter(
    (appt) => appt.appointment_date === today
  );
  const upcomingAppointments = appointments.filter(
    (appt) =>
      appt.appointment_date > today &&
      appt.status !== "Completed" &&
      appt.status !== "Cancelled"
  );
  const completedAppointments = appointments.filter(
    (appt) => appt.status === "Completed"
  );
  const cancelledAppointments = appointments.filter(
    (appt) => appt.status === "Cancelled"
  );
  const totalPatients = new Set(
    appointments.map((appt) => `${appt.full_name}-${appt.phone}`)
  ).size;

  return {
    success: true,
    dashboard: {
      todayAppointments: todayAppointments.length,
      upcomingAppointments: upcomingAppointments.length,
      completedAppointments: completedAppointments.length,
      cancelledAppointments: cancelledAppointments.length,
      totalPatients,
    },
  };
};

export const getDoctorTodayAppointments = async () => {
  const appointments = await loadDoctorAppointments();
  return {
    success: true,
    appointments: appointments.filter(
      (appt) => appt.appointment_date === new Date().toISOString().slice(0, 10)
    ),
  };
};

export const getDoctorUpcomingAppointments = async () => {
  const appointments = await loadDoctorAppointments();
  const today = new Date().toISOString().slice(0, 10);
  return {
    success: true,
    appointments: appointments.filter(
      (appt) =>
        appt.appointment_date > today &&
        appt.status !== "Completed" &&
        appt.status !== "Cancelled"
    ),
  };
};

export const getDoctorCompletedAppointments = async () => {
  const appointments = await loadDoctorAppointments();
  return {
    success: true,
    appointments: appointments.filter(
      (appt) => appt.status === "Completed"
    ),
  };
};

export const getDoctorCancelledAppointments = async () => {
  const appointments = await loadDoctorAppointments();
  return {
    success: true,
    appointments: appointments.filter(
      (appt) => appt.status === "Cancelled"
    ),
  };
};

export const applyDoctorLeave = async (leaveData) => {
  try {
    const response = await API.post("/doctor/leaves", leaveData);
    return response.data;
  } catch (error) {
    console.error("Apply Doctor Leave API Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unable to apply for leave.",
    };
  }
};

export const getDoctorProfile = async () => {
  try {
    const response = await API.get("/doctor/profile");
    return response.data;
  } catch (error) {
    console.error("Get Doctor Profile API Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unable to load doctor profile.",
    };
  }
};

export const getDoctorAvailability = async () => {
  try {
    const response = await API.get("/doctor/availability");
    return response.data;
  } catch (error) {
    console.error("Get Doctor Availability API Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unable to load doctor availability.",
    };
  }
};

export const getDoctorLeaves = async () => {
  try {
    const response = await API.get("/doctor/leaves");
    return response.data;
  } catch (error) {
    console.error("Get Doctor Leaves API Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unable to load doctor leaves.",
    };
  }
};

export const setDoctorAvailability = async (availabilityData) => {
  try {
    const response = await API.post("/doctor/availability", availabilityData);
    return response.data;
  } catch (error) {
    console.error("Set Doctor Availability API Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unable to save availability.",
    };
  }
};

export const updateDoctorProfile = async (profileData) => {
  try {
    const response = await API.put("/doctor/profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Update Doctor Profile API Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unable to update doctor profile.",
    };
  }
};

export const changeDoctorPassword = async (passwordData) => {
  try {
    const response = await API.put("/doctor/change-password", passwordData);
    return response.data;
  } catch (error) {
    console.error("Change Doctor Password API Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error.message ||
        "Unable to change password.",
    };
  }
};

export const updateDoctorAppointmentStatus = async (appointmentId, status) => {
  try {
    const response = await API.put(
      `/appointments/${appointmentId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error("Update Doctor Appointment Status API Error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Unable to update appointment status.",
    };
  }
};