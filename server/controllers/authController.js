const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendMail } = require("../services/emailService");

exports.registerDoctor = async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
            phone,
            specialization,
            qualification,
            experience
        } = req.body;

        if (!full_name || !email || !password || !phone || !specialization) {
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

        const [result] = await db.query(
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
                qualification || null,
                experience || 0
            ]
        );

        const token = jwt.sign(
            {
                id: result.insertId,
                role: "doctor"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            success: true,
            token,
            message: "Doctor registered successfully.",
            doctor: {
                id: result.insertId,
                full_name,
                email,
                specialization,
            }
        });

    } catch (error) {
        console.error("Doctor Register Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
            error: error
        });
    }
};

// Doctor Login
exports.doctorLogin = async (req, res) => {
    try {
       if (!req.body) {
    return res.status(400).json({
        success: false,
        message: "Request body is missing"
    });
}

const { email, password } = req.body;

if (!email || !password) {
    return res.status(400).json({
        success: false,
        message: "Email and Password are required"
    });
}

        const [doctor] = await db.query(
            "SELECT * FROM doctors WHERE email = ?",
            [email]
        );

        if (doctor.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            doctor[0].password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: doctor[0].id,
                role: "doctor"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            token,
            doctor: {
                id: doctor[0].id,
                name: doctor[0].full_name,
                email: doctor[0].email,
                specialization: doctor[0].specialization
            }
        });

    } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
        success: false,
        message: error.message,
        error: error
    });
}
};
// ===============================
// Admin Login
// ===============================

exports.adminLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const [admin] = await db.query(
            "SELECT * FROM admins WHERE email = ?",
            [email]
        );

        if (admin.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            admin[0].password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password."
            });
        }

        const token = jwt.sign(
            {
                id: admin[0].id,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            token,
            admin: {
                id: admin[0].id,
                username: admin[0].username
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
// ===============================
// Patient Login
// ===============================

exports.patientLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const [patient] = await db.query(
            "SELECT * FROM patients WHERE email = ?",
            [email]
        );

        if (patient.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            patient[0].password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password."
            });
        }

        const token = jwt.sign(
            {
                id: patient[0].id,
                role: "patient"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            token,
            patient: {
                id: patient[0].id,
                full_name: patient[0].full_name,
                email: patient[0].email
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

// ========================================
// Forgot Password
// POST /api/auth/forgot-password
// ========================================

exports.forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required."
            });
        }

        let user = null;
        let table = "";

        // Check Admin
        let [rows] = await db.query(
            "SELECT id,email FROM admins WHERE email=?",
            [email]
        );

        if (rows.length > 0) {
            user = rows[0];
            table = "admins";
        }

        // Check Doctor
        if (!user) {
            [rows] = await db.query(
                "SELECT id,email FROM doctors WHERE email=?",
                [email]
            );

            if (rows.length > 0) {
                user = rows[0];
                table = "doctors";
            }
        }

        // Check Patient
        if (!user) {
            [rows] = await db.query(
                "SELECT id,email FROM patients WHERE email=?",
                [email]
            );

            if (rows.length > 0) {
                user = rows[0];
                table = "patients";
            }
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Email not found."
            });
        }

        const token = crypto.randomBytes(32).toString("hex");

        const expires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await db.query(
            `INSERT INTO password_resets
            (email, token, expires_at)
            VALUES (?, ?, ?)`,
            [
                email,
                token,
                expires
            ]
        );

        const link =
`http://localhost:5173/reset-password?token=${token}`;

        await sendMail(
            email,
            "Reset Password",
            `
            <h2>Lifeline Hospital</h2>

            <p>Click below link to reset password.</p>

            <a href="${link}">
                Reset Password
            </a>
            `
        );

        res.json({
            success: true,
            message: "Reset link sent successfully."
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
// Reset Password
// POST /api/auth/reset-password
// ========================================

exports.resetPassword = async (req, res) => {

    try {

        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: "Token and password are required."
            });
        }

        const [reset] = await db.query(
            `SELECT *
             FROM password_resets
             WHERE token=?`,
            [token]
        );

        if (reset.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid reset token."
            });
        }

        if (new Date() > new Date(reset[0].expires_at)) {

            await db.query(
                "DELETE FROM password_resets WHERE token=?",
                [token]
            );

            return res.status(400).json({
                success: false,
                message: "Reset token expired."
            });
        }

        const email = reset[0].email;

        const hashedPassword = await bcrypt.hash(password, 10);

        let result;

        result = await db.query(
            "UPDATE admins SET password=? WHERE email=?",
            [hashedPassword, email]
        );

        if (result[0].affectedRows === 0) {

            result = await db.query(
                "UPDATE doctors SET password=? WHERE email=?",
                [hashedPassword, email]
            );
        }

        if (result[0].affectedRows === 0) {

            result = await db.query(
                "UPDATE patients SET password=? WHERE email=?",
                [hashedPassword, email]
            );
        }

        await db.query(
            "DELETE FROM password_resets WHERE token=?",
            [token]
        );

        res.json({
            success: true,
            message: "Password reset successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};