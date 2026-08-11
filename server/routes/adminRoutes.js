const express = require("express");
const router = express.Router();

const {
    verifyAdmin
} = require("../middleware/authMiddleware");
const {
    getDashboard,
    getDashboardTrends,
    getAllDoctors,
    getDoctorById,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    getAllPatients,
    getPatientDetails,
    deletePatient,
    getAllAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    getReport,
    getAllLeaves,
    updateLeaveStatus,
    getSettings,
    updateSettings
} = require("../controllers/adminController");

router.get(
    "/dashboard",
    verifyAdmin,
    getDashboard
);

router.get(
    "/dashboard/trends",
    verifyAdmin,
    getDashboardTrends
);

router.get(
    "/doctors",
    verifyAdmin,
    getAllDoctors
);

router.post(
    "/doctors",
    verifyAdmin,
    addDoctor
);

router.put(
    "/doctors/:id",
    verifyAdmin,
    updateDoctor
);
router.delete(
    "/doctors/:id",
    verifyAdmin,
    deleteDoctor
);
router.get(
    "/patients",
    verifyAdmin,
    getAllPatients
);

router.get(
    "/patients/:id",
    verifyAdmin,
    getPatientDetails
);
router.delete(
    "/patients/:id",
    verifyAdmin,
    deletePatient
);
router.get(
    "/appointments",
    verifyAdmin,
    getAllAppointments
);
router.get(
    "/reports",
    verifyAdmin,
    getReport
);

router.get(
    "/settings",
    verifyAdmin,
    getSettings
);

router.put(
    "/settings",
    verifyAdmin,
    updateSettings
);
// All Leave Requests
router.get(
    "/leaves",
    verifyAdmin,
    getAllLeaves
);

// Approve / Reject Leave
router.put(
    "/leaves/:id",
    verifyAdmin,
    updateLeaveStatus
);

router.get(
    "/doctors/:id",
    verifyAdmin,
    getDoctorById
);

router.put(
    "/appointments/:id",
    verifyAdmin,
    updateAppointmentStatus
);

router.delete(
    "/appointments/:id",
    verifyAdmin,
    deleteAppointment
);
module.exports = router;