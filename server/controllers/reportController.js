const db = require("../config/db");
exports.getSummaryReport = async (req, res) => {

    try {

        const [[patients]] = await db.query(
            "SELECT COUNT(*) total FROM patients"
        );

        const [[doctors]] = await db.query(
            "SELECT COUNT(*) total FROM doctors"
        );

        const [[appointments]] = await db.query(
            "SELECT COUNT(*) total FROM appointments"
        );

        const [[prescriptions]] = await db.query(
            "SELECT COUNT(*) total FROM prescriptions"
        );

        res.json({
            success: true,
            report: {
                patients: patients.total,
                doctors: doctors.total,
                appointments: appointments.total,
                prescriptions: prescriptions.total
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
exports.getTodayReport = async (req, res) => {

    try {

        const [rows] = await db.query(

            `SELECT

                a.id,

                p.full_name patient,

                d.full_name doctor,

                a.appointment_time,

                a.status

            FROM appointments a

            JOIN patients p
            ON a.patient_id=p.id

            JOIN doctors d
            ON a.doctor_id=d.id

            WHERE appointment_date=CURDATE()`

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
exports.getMonthlyReport = async (req, res) => {

    try {

        const [rows] = await db.query(

            `SELECT

                MONTH(appointment_date) month,

                COUNT(*) total

            FROM appointments

            GROUP BY MONTH(appointment_date)

            ORDER BY month`

        );

        res.json({

            success: true,

            report: rows

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
exports.getDoctorReport = async (req, res) => {

    try {

        const [rows] = await db.query(

            `SELECT

                d.full_name,

                COUNT(a.id) totalAppointments

            FROM doctors d

            LEFT JOIN appointments a

            ON d.id=a.doctor_id

            GROUP BY d.id`

        );

        res.json({

            success: true,

            report: rows

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
exports.getPatientReport = async (req, res) => {

    try {

        const [rows] = await db.query(

            `SELECT

                full_name,

                phone,

                created_at

            FROM patients

            ORDER BY created_at DESC`

        );

        res.json({

            success: true,

            report: rows

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};