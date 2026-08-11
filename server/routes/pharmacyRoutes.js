const express = require("express");
const router = express.Router();

const {
    addMedicine,
    getAllMedicines,
    updateMedicine,
    deleteMedicine,
    dispenseMedicine,
    getMedicineStock,
    getLowStockMedicines,
    getPatientMedicineHistory
} = require("../controllers/pharmacyController");

const {
    verifyAdmin
} = require("../middleware/authMiddleware");

router.post(
    "/medicine",
    verifyAdmin,
    addMedicine
);

router.get(
    "/medicine",
    verifyAdmin,
    getAllMedicines
);

router.put(
    "/medicine/:id",
    verifyAdmin,
    updateMedicine
);

router.delete(
    "/medicine/:id",
    verifyAdmin,
    deleteMedicine
);
router.post(
    "/dispense",
    verifyAdmin,
    dispenseMedicine
);
router.get(
    "/stock",
    verifyAdmin,
    getMedicineStock
);
router.get(
    "/low-stock",
    verifyAdmin,
    getLowStockMedicines
);
router.get(
    "/history/:patientId",
    verifyAdmin,
    getPatientMedicineHistory
);
module.exports = router;