const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

// Load environment variables FIRST
dotenv.config();

// Database connection
const db = require("./config/db");

// Routes
const availabilityRoutes = require("./routes/availabilityRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const chartRoutes = require("./routes/chartRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const authRoutes = require("./routes/authRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/charts", chartRoutes);

// Static uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ==========================================
// TEMPORARY MYSQL CONNECTION TEST
// ==========================================
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS connected");

    res.json({
      success: true,
      message: "MySQL connected successfully",
      result: rows,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "MySQL connection failed",
      error: error.message,
    });
  }
});

// ==========================================
// API HEALTH CHECK
// ==========================================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Hospital Management API Running",
  });
});

// Port
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});