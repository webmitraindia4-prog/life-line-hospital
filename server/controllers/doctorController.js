const db = require("../config/db");

exports.getDashboard = async (req, res) => {
    try {

        const doctorId = req.doctor.id;

        console.log("Logged Doctor ID:", doctorId);

        const [[today]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE doctor_id = ?
             AND appointment_date = CURDATE()`,
            [doctorId]
        );

        const [[upcoming]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE doctor_id = ?
             AND appointment_date > CURDATE()`,
            [doctorId]
        );

        const [[completed]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE doctor_id = ?
             AND status='Completed'`,
            [doctorId]
        );

        const [[cancelled]] = await db.query(
            `SELECT COUNT(*) AS total
             FROM appointments
             WHERE doctor_id = ?
             AND status='Cancelled'`,
            [doctorId]
        );

        const [[patients]] = await db.query(
            `SELECT COUNT(DISTINCT patient_id) AS total
             FROM appointments
             WHERE doctor_id=?`,
            [doctorId]
        );


        res.json({
            success:true,
            dashboard:{
                todayAppointments: today.total,
                upcomingAppointments: upcoming.total,
                completedAppointments: completed.total,
                cancelledAppointments: cancelled.total,
                totalPatients: patients.total
            }
        });


    } catch(error){

        console.log(error);

        res.status(500).json({
            success:false,
            message:error.message
        });

    }
};
exports.getProfile = async (req, res) => {
    try {
        const doctorId = req.doctor.id;

        const [doctor] = await db.query(
            "SELECT id, full_name, email, specialization, qualification, experience, phone, profile_image FROM doctors WHERE id = ?",
            [doctorId]
        );

        if (doctor.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        res.json({
            success: true,
            doctor: doctor[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Get All Active Doctors
exports.getAllDoctors = async (req, res) => {
    try {

        const [doctors] = await db.query(`
            SELECT
                id,
                full_name,
                specialization,
                qualification,
                experience,
                profile_image
            FROM doctors
            WHERE status='Active'
            ORDER BY full_name ASC
        `);

        res.json({
            success: true,
            doctors
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getTodayAppointments = async (req, res) => {
    try {
console.log(req.doctor);
        const doctorId = req.doctor.id;

        const [appointments] = await db.query(`
            SELECT
                a.id AS appointment_id,
                p.full_name AS patient_name,
                p.phone,
                a.appointment_date,
                a.appointment_time,
                a.reason,
                a.status
            FROM appointments a
            INNER JOIN patients p
                ON a.patient_id = p.id
            WHERE
                a.doctor_id = ?
                AND a.appointment_date = CURDATE()
            ORDER BY a.appointment_time ASC
        `, [doctorId]);

        res.status(200).json({
            success: true,
            appointments
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
exports.getUpcomingAppointments = async (req, res) => {
    try {

        const doctorId = req.doctor.id;

        const [appointments] = await db.query(`
            SELECT
                a.id AS appointment_id,
                p.full_name AS patient_name,
                p.phone,
                a.appointment_date,
                a.appointment_time,
                a.reason,
                a.status
            FROM appointments a
            INNER JOIN patients p
                ON a.patient_id = p.id
            WHERE
                a.doctor_id = ?
                AND a.appointment_date > CURDATE()
            ORDER BY
                a.appointment_date ASC,
                a.appointment_time ASC
        `, [doctorId]);

        res.json({
            success: true,
            appointments
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getCompletedAppointments = async (req, res) => {
    try {

        const doctorId = req.doctor.id;

        const [appointments] = await db.query(`
            SELECT
                a.id AS appointment_id,
                p.full_name AS patient_name,
                p.phone,
                a.appointment_date,
                a.appointment_time,
                a.reason,
                a.status
            FROM appointments a
            INNER JOIN patients p
                ON a.patient_id = p.id
            WHERE
                a.doctor_id = ?
                AND a.status = 'Completed'
            ORDER BY
                a.appointment_date DESC,
                a.appointment_time DESC
        `, [doctorId]);

        res.json({
            success: true,
            appointments
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.getCancelledAppointments = async (req, res) => {
    try {

        const doctorId = req.doctor.id;

        const [appointments] = await db.query(`
            SELECT
                a.id AS appointment_id,
                p.full_name AS patient_name,
                p.phone,
                a.appointment_date,
                a.appointment_time,
                a.reason,
                a.status
            FROM appointments a
            INNER JOIN patients p
                ON a.patient_id = p.id
            WHERE
                a.doctor_id = ?
                AND a.status = 'Cancelled'
            ORDER BY
                a.appointment_date DESC,
                a.appointment_time DESC
        `, [doctorId]);

        res.json({
            success: true,
            appointments
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {

        const doctorId = req.doctor.id;
        const { appointmentId } = req.params;
        const { status } = req.body;

        if (!["Completed", "Cancelled"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const [result] = await db.query(
            `UPDATE appointments
             SET status = ?
             WHERE id = ? AND doctor_id = ?`,
            [status, appointmentId, doctorId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.json({
            success: true,
            message: `Appointment marked as ${status}`
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ========================================
// Change Doctor Password
// PUT /api/doctor/change-password
// ========================================

const bcrypt = require("bcryptjs");

exports.changePassword = async (req, res) => {

    try {

        const doctorId = req.doctor.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required."
            });
        }

        const [doctor] = await db.query(
            "SELECT password FROM doctors WHERE id = ?",
            [doctorId]
        );

        if (doctor.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            doctor[0].password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query(
            "UPDATE doctors SET password=? WHERE id=?",
            [hashedPassword, doctorId]
        );

        res.json({
            success: true,
            message: "Password changed successfully."
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
// Update Doctor Profile
// PUT /api/doctor/profile
// ========================================

exports.updateProfile = async (req, res) => {

    try {

        const doctorId = req.doctor.id;

        const {
            full_name,
            phone,
            qualification,
            experience
        } = req.body;

        await db.query(
            `UPDATE doctors
             SET
                full_name=?,
                phone=?,
                qualification=?,
                experience=?
             WHERE id=?`,
            [
                full_name,
                phone,
                qualification,
                experience,
                doctorId
            ]
        );

        res.json({
            success: true,
            message: "Profile updated successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
exports.setAvailability = async (req, res) => {
    try {
        const doctorId = req.doctor.id;

        const {
            available_date,
            start_time,
            end_time,
            slot_duration
        } = req.body;

        if (!available_date || !start_time || !end_time) {
            return res.status(400).json({
                success: false,
                message: "Available date, start time, and end time are required."
            });
        }

        const durationMinutes = Number(slot_duration) || 30;
        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            return res.status(400).json({
                success: false,
                message: "Slot duration must be a positive number."
            });
        }

        console.log("Saving doctor availability:", {
            doctorId,
            available_date,
            start_time,
            end_time,
            slot_duration: durationMinutes
        });

        const [result] = await db.query(
            `INSERT INTO doctor_availability
            (doctor_id, available_date, start_time, end_time, slot_duration)
            VALUES (?, ?, ?, ?, ?)`,
            [
                doctorId,
                available_date,
                start_time,
                end_time,
                durationMinutes
            ]
        );

        res.status(201).json({
            success: true,
            message: "Availability added successfully.",
            availability_id: result.insertId
        });

    } catch (error) {
        console.error("Set availability error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getAvailability = async (req, res) => {
    try {

        const doctorId = req.doctor.id;

        const [availability] = await db.query(
            `SELECT *
             FROM doctor_availability
             WHERE doctor_id = ?
             AND available_date >= CURDATE()
             ORDER BY available_date`,
            [doctorId]
        );

        res.json({
            success: true,
            availability
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===============================
// Apply Leave
// POST /api/doctor/leaves
// ===============================

exports.applyLeave = async (req, res) => {
    try {

        const doctorId = req.doctor.id;
        const { leave_date, reason } = req.body;

        if (!leave_date) {
            return res.status(400).json({
                success: false,
                message: "Leave date is required."
            });
        }

        await db.query(
            `INSERT INTO doctor_leaves
            (doctor_id, leave_date, reason)
            VALUES (?, ?, ?)`,
            [doctorId, leave_date, reason || null]
        );

        res.json({
            success: true,
            message: "Leave applied successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ===============================
// Get My Leaves
// GET /api/doctor/leaves
// ===============================

exports.getLeaves = async (req, res) => {

    try {

        const doctorId = req.doctor.id;

        const [leaves] = await db.query(
            `SELECT *
             FROM doctor_leaves
             WHERE doctor_id=?
             ORDER BY leave_date DESC`,
            [doctorId]
        );

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
exports.uploadDoctorProfile = async (req, res) => {

    try {

        const doctorId = req.doctor.id;

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No image uploaded."
            });

        }

        const image = req.file.filename;

        await db.query(

            `UPDATE doctors
             SET profile_image=?
             WHERE id=?`,

            [image, doctorId]

        );

        res.json({

            success: true,

            image

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ========================================
// Search Doctors
// GET /api/doctors/search?q=...
// ========================================

exports.searchDoctors = async (req, res) => {

    try {

        const search = `%${req.query.q || ""}%`;

        const [rows] = await db.query(

            `SELECT
                id,
                full_name,
                specialization,
                phone,
                email
            FROM doctors
            WHERE
                full_name LIKE ?
                OR specialization LIKE ?
                OR phone LIKE ?
            ORDER BY full_name`,

            [search, search, search]

        );

        res.json({
            success: true,
            doctors: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
exports.searchPatients = async (req, res) => {

    try {

        const search = `%${req.query.q || ""}%`;

        const [rows] = await db.query(

            `SELECT
                id,
                full_name,
                phone,
                email
            FROM patients
            WHERE
                full_name LIKE ?
                OR phone LIKE ?
                OR email LIKE ?
            ORDER BY full_name`,

            [search, search, search]

        );

        res.json({

            success: true,

            patients: rows

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

exports.searchAppointments = async (req, res) => {

    try {

        const search = `%${req.query.q || ""}%`;

        const [rows] = await db.query(

            `SELECT

                a.id,
                a.appointment_date,
                a.appointment_time,
                a.status,

                p.full_name patient,

                d.full_name doctor

            FROM appointments a

            JOIN patients p
                ON a.patient_id=p.id

            JOIN doctors d
                ON a.doctor_id=d.id

            WHERE

                p.full_name LIKE ?

                OR d.full_name LIKE ?

                OR a.status LIKE ?

            ORDER BY a.appointment_date DESC`,

            [search, search, search]

        );

        res.json({

            success: true,

            appointments: rows

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
exports.searchPrescriptions = async (req, res) => {

    try {

        const search = `%${req.query.q || ""}%`;

        const [rows] = await db.query(

            `SELECT

                p.*,

                pt.full_name patient,

                d.full_name doctor

            FROM prescriptions p

            JOIN patients pt
                ON p.patient_id=pt.id

            JOIN doctors d
                ON p.doctor_id=d.id

            WHERE

                diagnosis LIKE ?

                OR medicines LIKE ?

                OR pt.full_name LIKE ?

            ORDER BY created_at DESC`,

            [search, search, search]

        );

        res.json({

            success: true,

            prescriptions: rows

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// GET /api/doctor/dashboard/trends
exports.getDashboardTrends = async (req, res) => {
    try {
        const doctorId = req.doctor.id;

        // appointments per day
        const [appointments] = await db.query(
            `SELECT DATE(appointment_date) AS day, COUNT(*) AS total
             FROM appointments
             WHERE doctor_id = ? AND appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
             GROUP BY DATE(appointment_date)
             ORDER BY DATE(appointment_date)`,
            [doctorId]
        );

        // completed per day
        const [completed] = await db.query(
            `SELECT DATE(appointment_date) AS day, COUNT(*) AS total
             FROM appointments
             WHERE doctor_id = ? AND status='Completed' AND appointment_date >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
             GROUP BY DATE(appointment_date)
             ORDER BY DATE(appointment_date)`,
            [doctorId]
        );

        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const iso = d.toISOString().slice(0, 10);
            const ap = appointments.find(r => r.day.toISOString().slice(0,10) === iso);
            const co = completed.find(r => r.day.toISOString().slice(0,10) === iso);
            result.push({ date: iso, appointments: ap ? ap.total : 0, completed: co ? co.total : 0 });
        }

        res.json({ success: true, trends: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};