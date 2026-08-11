const express = require("express");
const router = express.Router();

const {
    bookAppointment,
    getAvailableSlots,
    getDoctorAppointments,
    updateAppointmentStatus
} = require("../controllers/appointmentController");

const {
    verifyDoctor
} = require("../middleware/authMiddleware");

router.post("/book", bookAppointment);

router.get("/slots/:doctorId/:date", getAvailableSlots);

router.get("/", verifyDoctor, getDoctorAppointments);

// Doctor Dashboard
router.get("/doctor", verifyDoctor, getDoctorAppointments);

router.put(
    "/:id/status",
    verifyDoctor,
    updateAppointmentStatus
);

module.exports = router;