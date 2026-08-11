const express = require("express");
const router = express.Router();

const {
    sendNotification,
    getNotifications,
    markAsRead,
    deleteNotification
} = require("../controllers/notificationController");

const {
    verifyAdmin,
    verifyDoctor,
    verifyPatient
} = require("../middleware/authMiddleware");

// Admin
router.post(
    "/send",
    verifyAdmin,
    sendNotification
);

// Doctor
router.get(
    "/doctor",
    verifyDoctor,
    getNotifications
);

// Patient
router.get(
    "/patient",
    verifyPatient,
    getNotifications
);

// Mark Read
router.put(
    "/:id/read",
    markAsRead
);

// Delete
router.delete(
    "/:id",
    deleteNotification
);
const db = require("../config/db");

// ======================================
// Send Notification
// POST /api/notifications/send
// ======================================

exports.sendNotification = async (req, res) => {
    try {

        const {
            user_type,
            user_id,
            title,
            message,
            sent_via
        } = req.body;

        if (!user_type || !user_id || !title || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        await db.query(
            `INSERT INTO notifications
            (
                user_type,
                user_id,
                title,
                message,
                sent_via
            )
            VALUES (?,?,?,?,?)`,
            [
                user_type,
                user_id,
                title,
                message,
                sent_via || "System"
            ]
        );

        res.status(201).json({
            success: true,
            message: "Notification sent successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ======================================
// Get Notifications
// ======================================

exports.getNotifications = async (req, res) => {

    try {

        let userType = "";
        let userId = "";

        if (req.doctor) {
            userType = "Doctor";
            userId = req.doctor.id;
        }

        if (req.patient) {
            userType = "Patient";
            userId = req.patient.id;
        }

        const [rows] = await db.query(
            `SELECT *
             FROM notifications
             WHERE user_type=?
             AND user_id=?
             ORDER BY created_at DESC`,
            [
                userType,
                userId
            ]
        );

        res.json({
            success: true,
            notifications: rows
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ======================================
// Mark Notification as Read
// ======================================

exports.markAsRead = async (req, res) => {

    try {

        const { id } = req.params;

        await db.query(
            `UPDATE notifications
             SET is_read=1
             WHERE id=?`,
            [id]
        );

        res.json({
            success: true,
            message: "Notification marked as read."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ======================================
// Delete Notification
// ======================================

exports.deleteNotification = async (req, res) => {

    try {

        const { id } = req.params;

        await db.query(
            "DELETE FROM notifications WHERE id=?",
            [id]
        );

        res.json({
            success: true,
            message: "Notification deleted successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
module.exports = router;