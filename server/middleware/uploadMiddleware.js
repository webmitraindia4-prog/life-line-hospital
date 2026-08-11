const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (file.fieldname === "doctor") {
            cb(null, "uploads/doctors");
        }
        else if (file.fieldname === "patient") {
            cb(null, "uploads/patients");
        }
        else if (file.fieldname === "logo") {
            cb(null, "uploads/hospital");
        }
        else {
            cb(null, "uploads/prescriptions");
        }

    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );

    }

});

const upload = multer({
    storage
});

module.exports = upload;