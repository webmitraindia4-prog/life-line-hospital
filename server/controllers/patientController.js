const db = require("../config/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const generatePassword = () => {
    return crypto.randomBytes(6).toString("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 10);
};

// Register Patient
exports.registerPatient = async (req, res) => {
    try {

        const {
            full_name,
            gender,
            age,
            phone,
            email,
            address,
            password
        } = req.body;

        if (
            !full_name ||
            !phone ||
            !gender ||
            !age
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing."
            });
        }

        const rawPassword = password || generatePassword();
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const [result] = await db.query(
            `INSERT INTO patients
            (full_name, gender, age, phone, email, address, password)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                full_name,
                gender,
                age,
                phone,
                email || null,
                address || null,
                hashedPassword
            ]
        );

        res.status(201).json({
            success: true,
            message: "Patient registered successfully.",
            patient_id: result.insertId
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const jwt = require("jsonwebtoken");

// ==========================================
// Patient Login
// POST /api/patient/login
// ==========================================

exports.patientLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required."

            });

        }

        const [patient] = await db.query(

            "SELECT * FROM patients WHERE email=?",

            [email]

        );

        if (patient.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Patient not found."

            });

        }

        const isMatch = await bcrypt.compare(

            password,

            patient[0].password

        );

        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid password."

            });

        }

        const token = jwt.sign(

            {

                id: patient[0].id,

                role: "patient"

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        res.json({

            success: true,

            token,

            patient: {

                id: patient[0].id,

                full_name: patient[0].full_name,

                email: patient[0].email

            }

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.getPatientProfile = async (req, res) => {
    try {

        const patientId = req.patient.id;

        const [patient] = await db.query(
            `SELECT
                id,
                full_name,
                gender,
                age,
                phone,
                email,
                address,
                created_at
            FROM patients
            WHERE id = ?`,
            [patientId]
        );

        if (patient.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            patient: patient[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// ========================================
// Patient Dashboard
// GET /api/patient/dashboard
// ========================================

exports.getPatientDashboard = async (req, res) => {

    try {

        const patientId = req.patient.id;

        const [[appointments]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE patient_id=?`,
            [patientId]
        );

        const [[upcoming]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE patient_id=?
             AND appointment_date>=CURDATE()
             AND status IN ('Pending', 'Confirmed')`,
            [patientId]
        );

        const [[completed]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE patient_id=?
             AND status='Completed'`,
            [patientId]
        );

        const [[prescriptions]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM prescriptions
             WHERE patient_id=?`,
            [patientId]
        );

        res.json({
            success: true,
            dashboard: {
                totalAppointments: appointments.total,
                upcomingAppointments: upcoming.total,
                completedAppointments: completed.total,
                prescriptions: prescriptions.total
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ===========================================
// Get Patient Appointment History
// GET /api/patient/appointments
// ===========================================

exports.getMyAppointments = async (req, res) => {

    try {

        const patientId = req.patient.id;

        const [appointments] = await db.query(

            `SELECT

                a.id,
                a.appointment_date,
                a.appointment_time,
                a.status,

                d.full_name AS doctor_name,
                d.specialization

            FROM appointments a

            JOIN doctors d
            ON a.doctor_id = d.id

            WHERE a.patient_id = ?

            ORDER BY
                a.appointment_date DESC,
                a.appointment_time DESC`,

            [patientId]

        );

        res.json({

            success: true,

            appointments

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ===========================================
// Cancel Appointment
// PUT /api/patient/appointments/:id/cancel
// ===========================================

exports.cancelAppointment = async (req, res) => {

    try {

        const patientId = req.patient.id;
        const appointmentId = req.params.id;

        const [appointment] = await db.query(

            `SELECT *
             FROM appointments
             WHERE id=?
             AND patient_id=?`,

            [appointmentId, patientId]

        );

        if (appointment.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Appointment not found."

            });

        }

        if (appointment[0].status === "Cancelled") {

            return res.status(400).json({

                success: false,
                message: "Appointment already cancelled."

            });

        }

        await db.query(

            `UPDATE appointments
             SET status='Cancelled'
             WHERE id=?`,

            [appointmentId]

        );

        res.json({

            success: true,
            message: "Appointment cancelled successfully."

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
// ===========================================
// Get Patient Prescription History
// GET /api/patient/prescriptions
// ===========================================

// ===========================================
// Get Patient Prescription History
// GET /api/patient/prescriptions
// ===========================================

exports.getMyPrescriptions = async (req, res) => {

    try {

        const patientId = req.patient.id;

        const [prescriptions] = await db.query(

            `SELECT

                p.id,
                p.diagnosis,
                p.appointment_id,

                d.full_name AS doctor_name,
                d.specialization

            FROM prescriptions p

            JOIN doctors d
            ON p.doctor_id = d.id

            WHERE p.patient_id = ?

            ORDER BY p.id DESC`,

            [patientId]

        );

        res.json({
            success: true,
            prescriptions
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};