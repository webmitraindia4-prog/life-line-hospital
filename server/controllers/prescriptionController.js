const db = require("../config/db");

// Create Prescription
exports.createPrescription = async (req, res) => {
    try {

        const doctorId = req.doctor.id;

        const {
            appointment_id,
            patient_id,
            diagnosis,
            medicines,
            notes
        } = req.body;

        await db.query(
            `INSERT INTO prescriptions
            (
                appointment_id,
                doctor_id,
                patient_id,
                diagnosis,
                medicines,
                notes
            )
            VALUES (?,?,?,?,?,?)`,
            [
                appointment_id,
                doctorId,
                patient_id,
                diagnosis,
                medicines,
                notes
            ]
        );

        res.status(201).json({
            success: true,
            message: "Prescription created successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
exports.getPatientPrescriptions = async (req, res) => {

    try {

        const patientId = req.params.patientId;

        const [rows] = await db.query(

            `SELECT
                p.*,
                d.full_name AS doctor_name
            FROM prescriptions p
            JOIN doctors d
                ON p.doctor_id=d.id
            WHERE patient_id=?
            ORDER BY created_at DESC`,

            [patientId]

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
// ======================================
// Get Prescription By ID
// GET /api/prescriptions/:id
// ======================================

exports.getPrescriptionById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `SELECT
                p.*,
                d.full_name AS doctor_name,
                pt.full_name AS patient_name
            FROM prescriptions p
            JOIN doctors d
                ON p.doctor_id = d.id
            JOIN patients pt
                ON p.patient_id = pt.id
            WHERE p.id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found."
            });
        }

        res.json({
            success: true,
            prescription: rows[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ======================================
// Update Prescription
// PUT /api/prescriptions/:id
// ======================================

exports.updatePrescription = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            diagnosis,
            medicines,
            notes
        } = req.body;

        const [result] = await db.query(
            `UPDATE prescriptions
             SET
                diagnosis = ?,
                medicines = ?,
                notes = ?
             WHERE id = ?`,
            [
                diagnosis,
                medicines,
                notes,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found."
            });
        }

        res.json({
            success: true,
            message: "Prescription updated successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// ======================================
// Delete Prescription
// DELETE /api/prescriptions/:id
// ======================================

exports.deletePrescription = async (req, res) => {

    try {

        const { id } = req.params;

        const [result] = await db.query(
            "DELETE FROM prescriptions WHERE id=?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Prescription not found."
            });
        }

        res.json({
            success: true,
            message: "Prescription deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};