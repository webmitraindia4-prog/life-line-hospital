const db = require("../config/db");

exports.getDashboard = async (req, res) => {
    try {

        const [[doctors]] = await db.query(
            "SELECT COUNT(*) AS total FROM doctors WHERE status='Active'"
        );

        const [[patients]] = await db.query(
            "SELECT COUNT(*) AS total FROM patients"
        );

        const [[today]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE appointment_date = CURDATE()`
        );

        const [[upcoming]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE appointment_date > CURDATE()`
        );

        const [[completed]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE status='Completed'`
        );

        const [[cancelled]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE status='Cancelled'`
        );

        const [recentAppointments] = await db.query(`
            SELECT
                a.id,
                p.full_name AS patient_name,
                d.full_name AS doctor_name,
                a.appointment_date,
                a.appointment_time,
                a.status
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN doctors d ON a.doctor_id = d.id
            ORDER BY a.created_at DESC
            LIMIT 10
        `);

        res.json({
            success: true,
            dashboard: {
                totalDoctors: doctors.total,
                totalPatients: patients.total,
                todayAppointments: today.total,
                upcomingAppointments: upcoming.total,
                completedAppointments: completed.total,
                cancelledAppointments: cancelled.total,
                recentAppointments
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

exports.getAllDoctors = async (req, res) => {
    try {

        const [doctors] = await db.query(`
            SELECT
                id,
                full_name,
                email,
                phone,
                specialization,
                qualification,
                experience,
                status,
                profile_image,
                created_at
            FROM doctors
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            doctors
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.addDoctor = async (req, res) => {
    try {

        const bcrypt = require("bcryptjs");

        const {
            full_name,
            email,
            password,
            phone,
            specialization,
            qualification,
            experience
        } = req.body;

        if (
            !full_name ||
            !email ||
            !password ||
            !phone ||
            !specialization
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const [existingDoctor] = await db.query(
            "SELECT id FROM doctors WHERE email = ?",
            [email]
        );

        if (existingDoctor.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Doctor already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO doctors
            (
                full_name,
                email,
                password,
                phone,
                specialization,
                qualification,
                experience,
                status
            )
            VALUES (?,?,?,?,?,?,?,'Active')`,
            [
                full_name,
                email,
                hashedPassword,
                phone,
                specialization,
                qualification,
                experience
            ]
        );

        res.status(201).json({
            success: true,
            message: "Doctor added successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
exports.updateDoctor = async (req, res) => {
    try {

        const doctorId = req.params.id;

        const {
            full_name,
            email,
            phone,
            specialization,
            qualification,
            experience,
            status
        } = req.body;

        const [result] = await db.query(
            `UPDATE doctors
             SET
                full_name = ?,
                email = ?,
                phone = ?,
                specialization = ?,
                qualification = ?,
                experience = ?,
                status = ?
             WHERE id = ?`,
            [
                full_name,
                email,
                phone,
                specialization,
                qualification,
                experience,
                status || "Active",
                doctorId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        res.json({
            success: true,
            message: "Doctor updated successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
exports.deleteDoctor = async (req, res) => {
    try {

        const doctorId = req.params.id;

        // Check if doctor exists
        const [doctor] = await db.query(
            "SELECT id FROM doctors WHERE id = ?",
            [doctorId]
        );

        if (doctor.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        // Check for appointments
        const [[appointments]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE doctor_id = ?`,
            [doctorId]
        );

        if (appointments.total > 0) {
            return res.status(400).json({
                success: false,
                message: "Doctor has appointment history and cannot be deleted."
            });
        }

        // Safe delete
        await db.query(
            "DELETE FROM doctors WHERE id = ?",
            [doctorId]
        );

        res.json({
            success: true,
            message: "Doctor deleted successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getAllPatients = async (req, res) => {
    try {

        const [patients] = await db.query(`
            SELECT
                id,
                full_name,
                gender,
                age,
                phone,
                email,
                created_at
            FROM patients
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            patients
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
exports.getPatientDetails = async (req, res) => {
    try {

        const patientId = req.params.id;

        const [patient] = await db.query(
            `SELECT
                id,
                full_name,
                gender,
                age,
                phone,
                email,
                created_at
            FROM patients
            WHERE id=?`,
            [patientId]
        );

        if (patient.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found."
            });
        }

        const [appointments] = await db.query(
            `SELECT
                a.id,
                d.full_name AS doctor_name,
                d.specialization,
                a.appointment_date,
                a.appointment_time,
                a.status
            FROM appointments a
            JOIN doctors d
                ON d.id=a.doctor_id
            WHERE a.patient_id=?
            ORDER BY a.appointment_date DESC`,
            [patientId]
        );

        res.json({
            success: true,
            patient: patient[0],
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

exports.deletePatient = async (req, res) => {
    try {
        const patientId = req.params.id;

        const [result] = await db.query(
            `DELETE FROM patients WHERE id = ?`,
            [patientId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found."
            });
        }

        res.json({
            success: true,
            message: "Patient deleted successfully."
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {

        const [appointments] = await db.query(`
            SELECT
                a.id,
                p.full_name AS patient_name,
                d.full_name AS doctor_name,
                d.specialization,
                a.appointment_date,
                a.appointment_time,
                a.status,
                a.created_at
            FROM appointments a
            JOIN patients p ON p.id = a.patient_id
            JOIN doctors d ON d.id = a.doctor_id
            ORDER BY a.appointment_date DESC,
                     a.appointment_time DESC
        `);

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

exports.getReport = async (req, res) => {
    try {
        const [[report]] = await db.query(`
            SELECT
                COUNT(*) AS totalAppointments,
                SUM(status='Completed') AS completed,
                SUM(status='Cancelled') AS cancelled,
                SUM(status='Pending') AS pending
            FROM appointments
        `);

        res.json({
            success: true,
            report
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================
// Get All Appointments (Admin)
// GET /api/admin/appointments
// ======================================

exports.getAllAppointments = async (req, res) => {

    try {

        const [appointments] = await db.query(

            `SELECT

                a.id,
                a.appointment_date,
                a.appointment_time,
                a.status,

                p.full_name AS patient_name,
                p.phone,

                d.full_name AS doctor_name,
                d.specialization

            FROM appointments a

            JOIN patients p
            ON a.patient_id = p.id

            JOIN doctors d
            ON a.doctor_id = d.id

            ORDER BY
                a.appointment_date DESC,
                a.appointment_time DESC`

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
// ========================================
// Get Hospital Settings
// GET /api/admin/settings
// ========================================

exports.getSettings = async (req, res) => {
    try {

        const [settings] = await db.query(
            "SELECT * FROM hospital_settings LIMIT 1"
        );

        res.json({
            success: true,
            settings: settings.length ? settings[0] : {}
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// ========================================
// Update Hospital Settings
// PUT /api/admin/settings
// ========================================

exports.updateSettings = async (req, res) => {

    try {

        const {
            hospital_name,
            email,
            phone,
            address
        } = req.body;

        await db.query(
            `UPDATE hospital_settings
             SET
                hospital_name=?,
                email=?,
                phone=?,
                address=?
             WHERE id=1`,
            [
                hospital_name,
                email,
                phone,
                address
            ]
        );

        res.json({
            success: true,
            message: "Settings updated successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
exports.getAllLeaves = async (req, res) => {
    try {

        const [leaves] = await db.query(`
            SELECT
                dl.id,
                d.full_name,
                d.specialization,
                dl.leave_date,
                dl.reason,
                dl.status,
                dl.created_at
            FROM doctor_leave dl
            JOIN doctors d
                ON dl.doctor_id = d.id
            ORDER BY dl.leave_date DESC
        `);

        res.json({
            success: true,
            leaves
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
exports.updateLeaveStatus = async (req, res) => {

    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {

            return res.status(400).json({
                success: false,
                message: "Invalid status."
            });

        }

        const [result] = await db.query(
            `UPDATE doctor_leave
             SET status=?
             WHERE id=?`,
            [status, id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                success: false,
                message: "Leave request not found."
            });

        }

        res.json({
            success: true,
            message: `Leave ${status} successfully.`
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.getSettings = async (req, res) => {
    try {

        const [settings] = await db.query(
            "SELECT * FROM settings LIMIT 1"
        );

        res.json({
            success: true,
            settings: settings[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.updateSettings = async (req, res) => {

    try {

        const {
            hospital_name,
            email,
            phone,
            address,
            opening_time,
            closing_time
        } = req.body;

        await db.query(
            `UPDATE settings
             SET
                hospital_name=?,
                email=?,
                phone=?,
                address=?,
                opening_time=?,
                closing_time=?`,
            [
                hospital_name,
                email,
                phone,
                address,
                opening_time,
                closing_time
            ]
        );

        res.json({
            success: true,
            message: "Settings updated successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.getDoctorById = async (req, res) => {
    try {

        const { id } = req.params;

        const [doctor] = await db.query(
            `SELECT
                id,
                full_name,
                email,
                phone,
                specialization,
                qualification,
                experience,
                status,
                profile_image
             FROM doctors
             WHERE id=?`,
            [id]
        );

        if (!doctor.length) {
            return res.status(404).json({
                success:false,
                message:"Doctor not found"
            });
        }

        res.json({
            success:true,
            doctor:doctor[0]
        });

    } catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const [result] = await db.query(
            "UPDATE appointments SET status=? WHERE id=?",
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            });
        }

        res.json({
            success: true,
            message: "Appointment updated successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.deleteAppointment = async (req, res) => {
    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM appointments WHERE id=?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found."
            });
        }

        res.json({
            success: true,
            message: "Appointment deleted successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// GET /api/admin/dashboard/trends
exports.getDashboardTrends = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT DATE(appointment_date) AS day, COUNT(*) AS total
             FROM appointments
             WHERE appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
             GROUP BY DATE(appointment_date)
             ORDER BY DATE(appointment_date)`
        );

        // Build full 7-day array
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const iso = d.toISOString().slice(0, 10);
            const found = rows.find(r => r.day.toISOString().slice(0,10) === iso);
            result.push({ date: iso, count: found ? found.total : 0 });
        }

        res.json({ success: true, trends: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};