const express = require("express");
const router = express.Router();

const {
    createNotification,
    getNotifications,
    markAsRead,
    deleteNotification
} = require("../controllers/notificationController");

const {
    verifyAdmin
} = require("../middleware/authMiddleware");

router.post("/", verifyAdmin, createNotification);

router.get("/", verifyAdmin, getNotifications);

router.patch("/:id/read", verifyAdmin, markAsRead);

router.delete("/:id", verifyAdmin, deleteNotification);

module.exports = router;