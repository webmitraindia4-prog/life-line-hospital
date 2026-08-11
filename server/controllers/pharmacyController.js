const db = require("../config/db");

// Add Medicine
exports.addMedicine = async (req, res) => {
    try {
        const {
            medicine_name,
            category,
            manufacturer,
            stock,
            price,
            expiry_date
        } = req.body;

        await db.query(
            `INSERT INTO medicines
            (medicine_name, category, manufacturer, stock, price, expiry_date)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                medicine_name,
                category,
                manufacturer,
                stock,
                price,
                expiry_date
            ]
        );

        res.status(201).json({
            success: true,
            message: "Medicine added successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Medicines
exports.getAllMedicines = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM medicines ORDER BY medicine_name ASC"
        );

        res.json({
            success: true,
            medicines: rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Medicine
exports.updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            medicine_name,
            category,
            manufacturer,
            stock,
            price,
            expiry_date
        } = req.body;

        await db.query(
            `UPDATE medicines
             SET medicine_name=?,
                 category=?,
                 manufacturer=?,
                 stock=?,
                 price=?,
                 expiry_date=?
             WHERE id=?`,
            [
                medicine_name,
                category,
                manufacturer,
                stock,
                price,
                expiry_date,
                id
            ]
        );

        res.json({
            success: true,
            message: "Medicine updated successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Medicine
exports.deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query(
            "DELETE FROM medicines WHERE id=?",
            [id]
        );

        res.json({
            success: true,
            message: "Medicine deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.dispenseMedicine = async (req, res) => {
    try {

        const {
            patient_id,
            prescription_id,
            medicine_id,
            quantity
        } = req.body;

        // Check medicine
        const [medicine] = await db.query(
            "SELECT * FROM medicines WHERE id=?",
            [medicine_id]
        );

        if (medicine.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Medicine not found."
            });
        }

        if (medicine[0].stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock."
            });
        }

        const total_price =
            quantity * medicine[0].price;

        // Save sale
        await db.query(
            `INSERT INTO medicine_sales
            (
                patient_id,
                prescription_id,
                medicine_id,
                quantity,
                total_price
            )
            VALUES (?,?,?,?,?)`,
            [
                patient_id,
                prescription_id,
                medicine_id,
                quantity,
                total_price
            ]
        );

        // Reduce stock
        await db.query(
            `UPDATE medicines
             SET stock = stock - ?
             WHERE id=?`,
            [
                quantity,
                medicine_id
            ]
        );

        res.json({
            success: true,
            message: "Medicine dispensed successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
exports.getMedicineStock = async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT
                id,
                medicine_name,
                category,
                manufacturer,
                stock,
                price,
                expiry_date
            FROM medicines
            ORDER BY medicine_name ASC
        `);

        res.json({
            success: true,
            medicines: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
exports.getLowStockMedicines = async (req, res) => {
    try {

        const [rows] = await db.query(`
            SELECT *
            FROM medicines
            WHERE stock <= 10
            ORDER BY stock ASC
        `);

        res.json({
            success: true,
            medicines: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
exports.getPatientMedicineHistory = async (req, res) => {

    try {

        const { patientId } = req.params;

        const [rows] = await db.query(`
            SELECT
                ms.id,
                m.medicine_name,
                ms.quantity,
                ms.total_price,
                ms.sold_at
            FROM medicine_sales ms
            JOIN medicines m
                ON ms.medicine_id = m.id
            WHERE ms.patient_id = ?
            ORDER BY ms.sold_at DESC
        `, [patientId]);

        res.json({
            success: true,
            history: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};