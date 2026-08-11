const express = require("express");
const router = express.Router();

const {

    getSummaryReport,
    getTodayReport,
    getMonthlyReport,
    getDoctorReport,
    getPatientReport

} = require("../controllers/reportController");

const {

    verifyAdmin

} = require("../middleware/authMiddleware");

router.get("/summary", verifyAdmin, getSummaryReport);

router.get("/today", verifyAdmin, getTodayReport);

router.get("/monthly", verifyAdmin, getMonthlyReport);

router.get("/doctor", verifyAdmin, getDoctorReport);

router.get("/patients", verifyAdmin, getPatientReport);

module.exports = router;