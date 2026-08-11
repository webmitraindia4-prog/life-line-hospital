const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const auth = require("../middleware/authMiddleware");
const {
    registerPatient,
    patientLogin,
    getPatientProfile,
    getPatientDashboard,
     getMyAppointments,
      cancelAppointment,
     getMyPrescriptions
} = require("../controllers/patientController");
// Register Patient
router.post("/register", registerPatient);

// Patient Login
router.post("/login", patientLogin);

// Patient Dashboard
router.get(
    "/dashboard",
    auth.verifyPatient,
    getPatientDashboard
);

router.get(
    "/profile",
    auth.verifyPatient,
    getPatientProfile
);
router.get(
    "/appointments",
    auth.verifyPatient,
    getMyAppointments
);
router.put(
    "/appointments/:id/cancel",
    auth.verifyPatient,
    cancelAppointment
);
router.get(
    "/prescriptions",
    auth.verifyPatient,
    getMyPrescriptions
);
module.exports = router;