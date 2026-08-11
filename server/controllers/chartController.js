const db = require("../config/db");
// =====================================
// Monthly Appointment Chart
// GET /api/charts/monthly-appointments
// =====================================

exports.getMonthlyAppointments = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                MONTHNAME(appointment_date) AS month,
                COUNT(*) AS total
            FROM appointments
            GROUP BY MONTH(appointment_date), MONTHNAME(appointment_date)
            ORDER BY MONTH(appointment_date)
        `);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// =====================================
// Appointment Status Chart
// =====================================

exports.getAppointmentStatus = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                status,
                COUNT(*) AS total
            FROM appointments
            GROUP BY status
        `);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
exports.getDoctorAppointmentsChart = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                d.full_name,
                COUNT(a.id) AS total
            FROM doctors d
            LEFT JOIN appointments a
                ON d.id = a.doctor_id
            GROUP BY d.id
            ORDER BY total DESC
        `);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
exports.getPatientRegistrations = async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                MONTHNAME(created_at) AS month,
                COUNT(*) AS total
            FROM patients
            GROUP BY MONTH(created_at), MONTHNAME(created_at)
            ORDER BY MONTH(created_at)
        `);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};