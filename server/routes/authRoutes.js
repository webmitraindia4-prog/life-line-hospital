const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

console.log("AUTH CONTROLLER");
console.log(Object.keys(authController));

if (!authController.doctorLogin) {
    throw new Error("doctorLogin is undefined");
}

if (!authController.adminLogin) {
    throw new Error("adminLogin is undefined");
}

router.post("/doctor/login", authController.doctorLogin);
router.post("/doctor/register", authController.registerDoctor);
router.post("/admin/login", authController.adminLogin);
router.post("/patient/login", authController.patientLogin);

// Forgot Password
router.post("/forgot-password", authController.forgotPassword);
router.post(
    "/reset-password",
    authController.resetPassword
);
module.exports = router;

