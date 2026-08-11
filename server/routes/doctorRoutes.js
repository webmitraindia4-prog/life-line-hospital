const express = require("express");
const router = express.Router();

const doctorController = require("../controllers/doctorController");
const upload = require("../middleware/uploadMiddleware");
console.log(doctorController);

const {
    getProfile,
    getAllDoctors,
    getDashboard,
    getDashboardTrends,
    getTodayAppointments,
    getUpcomingAppointments,
    getCompletedAppointments,
    getCancelledAppointments,
    updateAppointmentStatus,
    changePassword,
    updateProfile,
    setAvailability,
    getAvailability,
    applyLeave,
    getLeaves,
    uploadDoctorProfile
} = require("../controllers/doctorController");

const {
    verifyDoctor
} = require("../middleware/authMiddleware");


// =======================
// Public Routes
// =======================

router.get("/all", getAllDoctors);


// =======================
// Protected Routes
// =======================

router.get("/profile", verifyDoctor, getProfile);

router.get(
    "/dashboard",
    verifyDoctor,
    getDashboard
);

router.get(
    "/dashboard/trends",
    verifyDoctor,
    getDashboardTrends
);
router.get(
    "/appointments/today",
    verifyDoctor,
    getTodayAppointments
);

router.get(
    "/appointments/upcoming",
    verifyDoctor,
    getUpcomingAppointments
);

router.get(
    "/appointments/completed",
    verifyDoctor,
    getCompletedAppointments
);

router.get(
    "/appointments/cancelled",
    verifyDoctor,
    getCancelledAppointments
);

router.put(
    "/appointments/:appointmentId/status",
    verifyDoctor,
    updateAppointmentStatus
);

router.put(
    "/change-password",
    verifyDoctor,
    changePassword
);

router.put(
    "/profile",
    verifyDoctor,
    updateProfile
);
router.post(
    "/availability",
    verifyDoctor,
    setAvailability
);

router.get(
    "/availability",
    verifyDoctor,
    getAvailability
);

router.post(
    "/leaves",
    verifyDoctor,
    applyLeave
);

router.get(
    "/leaves",
    verifyDoctor,
    getLeaves
);
router.post(
    "/upload-profile",
    verifyDoctor,
    upload.single("doctor"),
    uploadDoctorProfile
);

// router.get(
//     "/search",
//     verifyAdmin,
//     searchDoctors
// );
// router.get(
//     "/patients/search",
//     verifyAdmin,
//     searchPatients
// );
module.exports = router;