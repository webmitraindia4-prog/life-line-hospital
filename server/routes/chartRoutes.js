const express = require("express");
const router = express.Router();

const {
    getMonthlyAppointments,
    getAppointmentStatus,
    getDoctorAppointmentsChart,
    getPatientRegistrations
} = require("../controllers/chartController");

const { verifyAdmin } = require("../middleware/authMiddleware");

router.get(
    "/monthly-appointments",
    verifyAdmin,
    getMonthlyAppointments
);

router.get(
    "/appointment-status",
    verifyAdmin,
    getAppointmentStatus
);

router.get(
    "/doctor-appointments",
    verifyAdmin,
    getDoctorAppointmentsChart
);

router.get(
    "/patient-registrations",
    verifyAdmin,
    getPatientRegistrations
);

module.exports = router;