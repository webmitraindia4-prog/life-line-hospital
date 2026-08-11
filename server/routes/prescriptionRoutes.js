const express = require("express");

const router = express.Router();

const {
    createPrescription,
    getPatientPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription
} = require("../controllers/prescriptionController");

const {
    verifyDoctor,
    verifyAdmin,
    verifyPatient
} = require("../middleware/authMiddleware");


router.post("/", verifyDoctor, createPrescription);

// Doctor/Admin
router.get("/:id", verifyDoctor, getPrescriptionById);

// Patient/Admin
router.get("/patient/:patientId", verifyPatient, getPatientPrescriptions);

// Doctor
router.put("/:id", verifyDoctor, updatePrescription);

// Admin
router.delete("/:id", verifyAdmin, deletePrescription);

module.exports = router;