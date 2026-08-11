require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./config/db");

const DEFAULT_ADMIN_EMAIL = "admin@lifelinehospital.in";
const DEFAULT_ADMIN_FULL_NAME = "Administrator";
const DEFAULT_ADMIN_PASSWORD = "Lifeline@2026";

async function seedAdmin() {
  try {
    const [existingAdmins] = await db.query(
      "SELECT id, email FROM admins WHERE email = ?",
      [DEFAULT_ADMIN_EMAIL]
    );

    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

    if (existingAdmins.length > 0) {
      const adminId = existingAdmins[0].id;
      await db.query(
        "UPDATE admins SET full_name = ?, password = ? WHERE id = ?",
        [DEFAULT_ADMIN_FULL_NAME, hashedPassword, adminId]
      );
      console.log(`Updated existing admin account: ${DEFAULT_ADMIN_EMAIL}`);
    } else {
      await db.query(
        "INSERT INTO admins (full_name, email, password) VALUES (?, ?, ?)",
        [DEFAULT_ADMIN_FULL_NAME, DEFAULT_ADMIN_EMAIL, hashedPassword]
      );
      console.log(`Created default admin account: ${DEFAULT_ADMIN_EMAIL}`);
    }

    console.log("Use these credentials to log in:");
    console.log(`  Email: ${DEFAULT_ADMIN_EMAIL}`);
    console.log(`  Password: ${DEFAULT_ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin account:", error.message || error);
    process.exit(1);
  }
}

seedAdmin();
