const express = require("express");
const router = express.Router();

const {
    addAvailability,
    getAvailability,
    updateAvailability,
    deleteAvailability,
    getAvailableSlots,
    getAvailableDates
} = require("../controllers/availabilityController");

const {
    verifyDoctor
} = require("../middleware/authMiddleware");


// =======================================
// Doctor Availability (Protected)
// =======================================

// Add Availability
router.post(
    "/doctor/availability",
    verifyDoctor,
    addAvailability
);

// Get My Availability
router.get(
    "/doctor/availability",
    verifyDoctor,
    getAvailability
);

// Update Availability
router.put(
    "/doctor/availability/:id",
    verifyDoctor,
    updateAvailability
);

// Delete Availability
router.delete(
    "/doctor/availability/:id",
    verifyDoctor,
    deleteAvailability
);


// =======================================
// Patient/Public Slot API
// =======================================

router.get(
    "/slots/:doctorId/:date",
    getAvailableSlots
);

router.get(
    "/dates/:doctorId",
    getAvailableDates
);

module.exports = router;