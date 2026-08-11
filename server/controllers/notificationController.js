const db = require("../config/db");

// =========================================
// Create Notification
// =========================================
exports.createNotification = async (req, res) => {

    try {

        const {
            user_type,
            user_id,
            title,
            message
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO notifications
            (
                user_type,
                user_id,
                title,
                message
            )
            VALUES (?, ?, ?, ?)`,
            [
                user_type,
                user_id,
                title,
                message
            ]
        );

        res.status(201).json({
            success: true,
            message: "Notification created successfully.",
            notification_id: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// =========================================
// Get Notifications
// =========================================

exports.getNotifications = async (req, res) => {

    try {

        const { user_type, user_id } = req.query;

        const [rows] = await db.query(
            `SELECT *
             FROM notifications
             WHERE user_type=?
             AND user_id=?
             ORDER BY created_at DESC`,
            [
                user_type,
                user_id
            ]
        );

        res.json({
            success: true,
            notifications: rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// =========================================
// Mark Notification Read
// =========================================

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

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
// =========================================
// Delete Notification
// =========================================

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

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};